import { prisma } from '../db';
import { v4 as uuidv4 } from 'uuid';

export class SimulationService {
  /**
   * Simulates the outcome of a recovery action deterministically for demo/testing.
   */
  async simulateRecoveryOutcome(actionType: string, rootCause: string): Promise<'SUCCESS' | 'FAILED' | 'PENDING'> {
    if (rootCause === 'demo_execution_fail') {
      return 'FAILED';
    }

    if (actionType === 'RETRY') {
      if (rootCause === 'temporary_network_failure' || rootCause === 'timeout') {
        return 'SUCCESS';
      }
      return 'FAILED';
    }

    if (actionType === 'PAYMENT_LINK') {
      if (rootCause === 'expired_card' || rootCause === 'invalid_payment_method') {
        return 'PENDING';
      }
      return 'SUCCESS';
    }

    if (actionType === 'REMINDER') {
      return 'PENDING';
    }

    if (actionType === 'ESCALATE') {
      return 'PENDING';
    }

    return 'FAILED';
  }

  /**
   * Utility to update the payment and recovery case with transaction atomicity
   */
  async applyOutcome(recoveryCaseId: string, actionId: string, outcome: 'SUCCESS' | 'FAILED' | 'PENDING') {
    const caseData = await prisma.recoveryCase.findUnique({
      where: { id: recoveryCaseId },
      include: { payment: true }
    });

    if (!caseData) return;

    if (outcome === 'SUCCESS') {
      await prisma.$transaction([
        prisma.recoveryAction.update({
          where: { id: actionId },
          data: { status: outcome }
        }),
        prisma.recoveryCase.update({
          where: { id: recoveryCaseId },
          data: { status: 'RECOVERED' }
        }),
        prisma.payment.update({
          where: { id: caseData.paymentId },
          data: { status: 'SUCCESS' }
        }),
        prisma.customer.update({
          where: { id: caseData.payment.customerId },
          data: {
            successCount: { increment: 1 },
            failureCount: { decrement: 1 },
            lifetimeValue: { increment: caseData.payment.amount }
          }
        }),
        prisma.auditLog.create({
          data: {
            recoveryCaseId,
            eventType: 'PAYMENT_RECOVERED',
            actor: 'SYSTEM',
            metadata: JSON.stringify({ actionId, outcome, amount: caseData.payment.amount })
          }
        })
      ]);
    } else if (outcome === 'FAILED') {
      await prisma.$transaction([
        prisma.recoveryAction.update({
          where: { id: actionId },
          data: { status: outcome }
        }),
        prisma.recoveryCase.update({
          where: { id: recoveryCaseId },
          data: { status: 'FAILED' }
        }),
        prisma.auditLog.create({
          data: {
            recoveryCaseId,
            eventType: 'PAYMENT_RECOVERY_FAILED',
            actor: 'SYSTEM',
            metadata: JSON.stringify({ actionId, outcome })
          }
        })
      ]);
    } else {
      await prisma.recoveryAction.update({
        where: { id: actionId },
        data: { status: outcome }
      });
    }
  }
}

export const simulationService = new SimulationService();
