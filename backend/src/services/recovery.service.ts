import { prisma } from '../db';
import { aiDecisionEngine } from './ai.service';
import { guardrailEngine } from './guardrail.service';
import { simulationService } from './simulation.service';
import { v4 as uuidv4 } from 'uuid';

export class RecoveryEngine {
  
  /**
   * Executes the full pipeline for a single recovery case.
   */
  async processRecoveryCase(caseId: string) {
    const recoveryCase = await prisma.recoveryCase.findUnique({
      where: { id: caseId }
    });

    if (!recoveryCase) throw new Error('Recovery case not found');

    if (recoveryCase.status === 'RECOVERED' || recoveryCase.status === 'ESCALATED') {
      return; // Nothing to do
    }

    // 1. Diagnose (AI)
    const aiDecision = await aiDecisionEngine.analyzePayment(recoveryCase.paymentId);
    
    // Save decision
    await prisma.aiDecision.create({
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

    // 2. Guardrail
    const guardrailResult = await guardrailEngine.evaluateAction(caseId, aiDecision);
    
    await prisma.guardrailEvaluation.create({
      data: {
        recoveryCaseId: caseId,
        actionType: aiDecision.recommendedAction,
        status: guardrailResult.status,
        reason: guardrailResult.reason,
        rulesChecked: JSON.stringify(guardrailResult.rulesChecked)
      }
    });

    if (guardrailResult.status === 'BLOCKED') {
      // If blocked, escalate
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

    // 3. Execute allowed action
    if (aiDecision.recommendedAction === 'NO_ACTION') {
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

}

export const recoveryEngine = new RecoveryEngine();
