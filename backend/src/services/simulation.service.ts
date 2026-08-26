import { prisma } from '../db';
import { v4 as uuidv4 } from 'uuid';

export class SimulationService {
  /**
   * Simulates the outcome of a recovery action probabilistically.
   * Do NOT hardcode deterministic outcomes to make the demo realistic.
   */
  async simulateRecoveryOutcome(actionType: string, rootCause: string): Promise<'SUCCESS' | 'FAILED' | 'PENDING'> {
    const rand = Math.random();
    
    if (actionType === 'RETRY') {
      if (rootCause === 'temporary_network_failure' || rootCause === 'timeout') {
        return rand < 0.70 ? 'SUCCESS' : 'FAILED';
      }
      if (rootCause === 'insufficient_funds') {
        return rand < 0.15 ? 'SUCCESS' : 'FAILED';
      }
      return rand < 0.10 ? 'SUCCESS' : 'FAILED';
    }

    if (actionType === 'PAYMENT_LINK') {
      if (rootCause === 'expired_card' || rootCause === 'invalid_payment_method') {
        return rand < 0.55 ? 'SUCCESS' : 'PENDING';
      }
      return rand < 0.35 ? 'SUCCESS' : 'PENDING';
    }

    if (actionType === 'REMINDER') {
      return rand < 0.30 ? 'SUCCESS' : 'PENDING';
    }

    if (actionType === 'ESCALATE') {
      return 'PENDING';
    }

    return 'FAILED';
  }

  /**
   * Utility to update the payment and recovery case if the simulation results in SUCCESS
   */
  async applyOutcome(recoveryCaseId: string, actionId: string, outcome: 'SUCCESS' | 'FAILED' | 'PENDING') {
    await prisma.recoveryAction.update({
      where: { id: actionId },
      data: { status: outcome }
    });

    if (outcome === 'SUCCESS') {
      const caseData = await prisma.recoveryCase.findUnique({
        where: { id: recoveryCaseId },
        include: { payment: true }
      });

      if (caseData) {
        // Update case
        await prisma.recoveryCase.update({
          where: { id: recoveryCaseId },
          data: { status: 'RECOVERED' }
        });

        // Update original payment
        await prisma.payment.update({
          where: { id: caseData.paymentId },
          data: { status: 'SUCCESS' }
        });

        // Audit log
        await prisma.auditLog.create({
          data: {
            recoveryCaseId,
            eventType: 'PAYMENT_RECOVERED',
            actor: 'SYSTEM',
            metadata: JSON.stringify({ actionId, outcome, amount: caseData.payment.amount })
          }
        });
      }
    } else if (outcome === 'FAILED') {
       await prisma.auditLog.create({
          data: {
            recoveryCaseId,
            eventType: 'PAYMENT_RECOVERY_FAILED',
            actor: 'SYSTEM',
            metadata: JSON.stringify({ actionId, outcome })
          }
        });
    }
  }
}

export const simulationService = new SimulationService();
