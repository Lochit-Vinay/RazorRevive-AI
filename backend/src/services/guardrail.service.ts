import { prisma } from '../db';
import { AiDecisionResult } from './ai.service';

export interface GuardrailResult {
  status: 'ALLOWED' | 'BLOCKED';
  reason?: string;
  rulesChecked: Record<string, 'PASS' | 'FAIL' | 'NOT_APPLICABLE'>;
}

export class GuardrailEngine {
  private readonly MAX_RETRIES = 2;
  private readonly AMOUNT_THRESHOLD = 50000;

  async evaluateAction(recoveryCaseId: string, aiDecision: AiDecisionResult): Promise<GuardrailResult> {
    const recoveryCase = await prisma.recoveryCase.findUnique({
      where: { id: recoveryCaseId },
      include: {
        payment: true,
        recoveryActions: true
      }
    });

    if (!recoveryCase) throw new Error('Recovery case not found');

    const rulesChecked: Record<string, 'PASS' | 'FAIL' | 'NOT_APPLICABLE'> = {
      'PAYMENT_STATUS': 'PASS',
      'RETRY_LIMIT': 'PASS',
      'AMOUNT_THRESHOLD': 'PASS',
      'DUPLICATE_CHECK': 'PASS'
    };

    // Rule 1: Payment Status - cannot recover already successful payment
    if (recoveryCase.payment.status === 'SUCCESS') {
      rulesChecked['PAYMENT_STATUS'] = 'FAIL';
      return {
        status: 'BLOCKED',
        reason: 'Payment is already successful.',
        rulesChecked
      };
    }

    // If the AI recommended NO_ACTION or ESCALATE, we always ALLOW it (it's safe)
    if (aiDecision.recommendedAction === 'NO_ACTION' || aiDecision.recommendedAction === 'ESCALATE') {
      return { status: 'ALLOWED', rulesChecked };
    }

    // Rule 2: Amount Threshold - automatic recovery blocked for huge amounts
    if (recoveryCase.payment.amount > this.AMOUNT_THRESHOLD) {
      rulesChecked['AMOUNT_THRESHOLD'] = 'FAIL';
      return {
        status: 'BLOCKED',
        reason: `Amount exceeds automatic recovery threshold of ₹${this.AMOUNT_THRESHOLD}.`,
        rulesChecked
      };
    }

    // Rule 3: Retry Limit & Duplicate Check
    const pastActions = recoveryCase.recoveryActions;
    
    if (aiDecision.recommendedAction === 'RETRY') {
      const retryAttempts = pastActions.filter(a => a.actionType === 'RETRY').length;
      if (retryAttempts >= this.MAX_RETRIES) {
        rulesChecked['RETRY_LIMIT'] = 'FAIL';
        return {
          status: 'BLOCKED',
          reason: `Maximum retry count (${this.MAX_RETRIES}) exceeded.`,
          rulesChecked
        };
      }
    } else {
      rulesChecked['RETRY_LIMIT'] = 'NOT_APPLICABLE';
    }

    // Duplicate Check: Don't send multiple payment links or reminders if one is already pending
    const duplicatePending = pastActions.find(a => a.actionType === aiDecision.recommendedAction && a.status === 'PENDING');
    if (duplicatePending) {
      rulesChecked['DUPLICATE_CHECK'] = 'FAIL';
      return {
        status: 'BLOCKED',
        reason: `A ${aiDecision.recommendedAction} action is already pending.`,
        rulesChecked
      };
    }

    return { status: 'ALLOWED', rulesChecked };
  }
}

export const guardrailEngine = new GuardrailEngine();
