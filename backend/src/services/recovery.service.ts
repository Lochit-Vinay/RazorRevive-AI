import { prisma } from '../db';
import { aiDecisionEngine } from './ai.service';
import { guardrailEngine } from './guardrail.service';
import { simulationService } from './simulation.service';
import { v4 as uuidv4 } from 'uuid';

export class RecoveryEngine {
  
  /**
   * Executes the pipeline for a single recovery case.
   * If autoExecute is false, it stops after guardrail evaluation.
   */
  async processRecoveryCase(caseId: string, autoExecute: boolean = true) {
    const recoveryCase = await prisma.recoveryCase.findUnique({
      where: { id: caseId },
      include: {
        aiDecisions: true,
        guardrailEvaluations: true
      }
    });

    if (!recoveryCase) throw new Error('Recovery case not found');

    if (recoveryCase.status === 'RECOVERED' || recoveryCase.status === 'ESCALATED') {
      return; // Nothing to do
    }

    // Prevent duplicate analysis
    let aiDecision;
    if (recoveryCase.aiDecisions && recoveryCase.aiDecisions.length > 0) {
      aiDecision = recoveryCase.aiDecisions[0];
    } else {
      // 1. Diagnose (AI)
      aiDecision = await aiDecisionEngine.analyzePayment(recoveryCase.paymentId);
      
      // Save decision
      aiDecision = await prisma.aiDecision.create({
        data: {
          recoveryCaseId: caseId,
          ...aiDecision
        }
      });

      await prisma.auditLog.create({
        data: {
          recoveryCaseId: caseId,
          eventType: 'AI_ANALYSIS_COMPLETED',
          actor: 'AI',
          metadata: JSON.stringify(aiDecision)
        }
      });
    }

    // 2. Guardrail
    let guardrailResult;
    if (recoveryCase.guardrailEvaluations && recoveryCase.guardrailEvaluations.length > 0) {
      guardrailResult = recoveryCase.guardrailEvaluations[0];
    } else {
      guardrailResult = await guardrailEngine.evaluateAction(caseId, aiDecision);
      
      guardrailResult = await prisma.guardrailEvaluation.create({
        data: {
          recoveryCaseId: caseId,
          actionType: aiDecision.recommendedAction,
          status: guardrailResult.status,
          reason: guardrailResult.reason,
          rulesChecked: JSON.stringify(guardrailResult.rulesChecked)
        }
      });
    }

    if (guardrailResult.status === 'BLOCKED') {
      // Always escalate if blocked to require human approval
      await prisma.recoveryCase.update({
        where: { id: caseId },
        data: { status: 'ESCALATED' }
      });

      await prisma.auditLog.create({
        data: {
          recoveryCaseId: caseId,
          eventType: 'ACTION_BLOCKED',
          actor: 'SYSTEM',
          metadata: JSON.stringify({ reason: guardrailResult.reason, next: 'ESCALATED' })
        }
      });
      return;
    }

    if (!autoExecute) {
      // Stop here for manual execution flow
      return;
    }

    // 3. Execute allowed action
    if (aiDecision.recommendedAction === 'NO_ACTION') {
      await prisma.recoveryCase.update({
        where: { id: caseId },
        data: { status: 'FAILED' }
      });
      return;
    }

    if (aiDecision.recommendedAction === 'ESCALATE') {
      await prisma.recoveryCase.update({
        where: { id: caseId },
        data: { status: 'ESCALATED' }
      });
      return;
    }

    // Execute active recovery
    const idempotencyKey = uuidv4();
    const action = await prisma.recoveryAction.create({
      data: {
        recoveryCaseId: caseId,
        actionType: aiDecision.recommendedAction,
        status: 'PENDING',
        idempotencyKey
      }
    });

    await prisma.auditLog.create({
      data: {
        recoveryCaseId: caseId,
        eventType: 'ACTION_EXECUTED',
        actor: 'SYSTEM',
        metadata: JSON.stringify({ actionType: aiDecision.recommendedAction, idempotencyKey })
      }
    });

    // 4. Simulate Outcome
    const outcome = await simulationService.simulateRecoveryOutcome(aiDecision.recommendedAction, aiDecision.rootCause);
    await simulationService.applyOutcome(caseId, action.id, outcome);
  }

  /**
   * Manually executes a recovery action for a case that has been analyzed and allowed.
   */
  async executeRecoveryCase(caseId: string) {
    const recoveryCase = await prisma.recoveryCase.findUnique({
      where: { id: caseId },
      include: {
        aiDecisions: { orderBy: { createdAt: 'desc' }, take: 1 },
        guardrailEvaluations: { orderBy: { createdAt: 'desc' }, take: 1 },
        recoveryActions: true
      }
    });

    if (!recoveryCase) throw new Error('Recovery case not found');
    if (recoveryCase.status !== 'PENDING') throw new Error('Case is not pending');

    // Idempotency: prevent duplicate execution if an action is already present
    if (recoveryCase.recoveryActions.length > 0) {
      throw new Error('Recovery action already executed for this case');
    }

    const aiDecision = recoveryCase.aiDecisions[0];
    if (!aiDecision) throw new Error('Case must be analyzed first');

    // Re-run deterministic guardrails just before executing
    const reevaluatedGuardrail = await guardrailEngine.evaluateAction(caseId, aiDecision as any);
    const latestDbGuardrail = recoveryCase.guardrailEvaluations[0];
    const isHumanApprovedOverride = latestDbGuardrail && latestDbGuardrail.status === 'ALLOWED' && reevaluatedGuardrail.status === 'BLOCKED';

    if (reevaluatedGuardrail.status !== 'ALLOWED' && !isHumanApprovedOverride) {
      throw new Error(`Action blocked by guardrails during execution: ${reevaluatedGuardrail.reason}`);
    }

    if (aiDecision.recommendedAction === 'NO_ACTION') {
      await prisma.recoveryCase.update({
        where: { id: caseId },
        data: { status: 'FAILED' } // NO_ACTION means we give up or it's already done
      });
      return;
    }
    
    if (aiDecision.recommendedAction === 'ESCALATE') {
      await prisma.recoveryCase.update({
        where: { id: caseId },
        data: { status: 'ESCALATED' }
      });
      await prisma.auditLog.create({
        data: {
          recoveryCaseId: caseId,
          eventType: 'ACTION_EXECUTED',
          actor: 'SYSTEM',
          metadata: JSON.stringify({ actionType: 'ESCALATE' })
        }
      });
      return;
    }

    const idempotencyKey = uuidv4();
    const action = await prisma.recoveryAction.create({
      data: {
        recoveryCaseId: caseId,
        actionType: aiDecision.recommendedAction,
        status: 'PENDING',
        idempotencyKey
      }
    });

    await prisma.auditLog.create({
      data: {
        recoveryCaseId: caseId,
        eventType: 'RECOVERY_ACTION_EXECUTED',
        actor: 'SYSTEM',
        metadata: JSON.stringify({ actionType: aiDecision.recommendedAction, idempotencyKey, amount: recoveryCase.revenueAtRisk })
      }
    });

    const outcome = await simulationService.simulateRecoveryOutcome(aiDecision.recommendedAction, aiDecision.rootCause);
    await simulationService.applyOutcome(caseId, action.id, outcome);
  }

}

export const recoveryEngine = new RecoveryEngine();
