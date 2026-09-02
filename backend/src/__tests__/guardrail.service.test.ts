import { guardrailEngine } from '../services/guardrail.service';
import { prisma } from '../db';
import { AiDecisionResult } from '../services/ai.service';

jest.mock('../db', () => ({
  prisma: {
    recoveryCase: {
      findUnique: jest.fn()
    }
  }
}));

const mockPrisma = prisma as unknown as {
  recoveryCase: { findUnique: jest.Mock };
};

describe('GuardrailEngine Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('blocks actions for payments that are already SUCCESS', async () => {
    mockPrisma.recoveryCase.findUnique.mockResolvedValue({
      id: 'case-1',
      payment: { status: 'SUCCESS', amount: 500 },
      recoveryActions: []
    });

    const decision: AiDecisionResult = {
      recommendedAction: 'RETRY',
      rootCause: 'test',
      recoverability: 'HIGH',
      confidence: 1,
      reason: ''
    };

    const result = await guardrailEngine.evaluateAction('case-1', decision);
    expect(result.status).toBe('BLOCKED');
    expect(result.rulesChecked['PAYMENT_STATUS']).toBe('FAIL');
  });

  it('allows NO_ACTION always', async () => {
    mockPrisma.recoveryCase.findUnique.mockResolvedValue({
      id: 'case-1',
      payment: { status: 'FAILED', amount: 999999 }, // huge amount, would normally block
      recoveryActions: []
    });

    const decision: AiDecisionResult = {
      recommendedAction: 'NO_ACTION',
      rootCause: 'test',
      recoverability: 'LOW',
      confidence: 1,
      reason: ''
    };

    const result = await guardrailEngine.evaluateAction('case-1', decision);
    expect(result.status).toBe('ALLOWED');
  });

  it('blocks actions exceeding amount threshold', async () => {
    mockPrisma.recoveryCase.findUnique.mockResolvedValue({
      id: 'case-1',
      payment: { status: 'FAILED', amount: 50001 },
      recoveryActions: []
    });

    const decision: AiDecisionResult = {
      recommendedAction: 'RETRY',
      rootCause: 'test',
      recoverability: 'HIGH',
      confidence: 1,
      reason: ''
    };

    const result = await guardrailEngine.evaluateAction('case-1', decision);
    expect(result.status).toBe('BLOCKED');
    expect(result.rulesChecked['AMOUNT_THRESHOLD']).toBe('FAIL');
  });

  it('blocks RETRY exceeding max retries', async () => {
    mockPrisma.recoveryCase.findUnique.mockResolvedValue({
      id: 'case-1',
      payment: { status: 'FAILED', amount: 500 },
      recoveryActions: [
        { actionType: 'RETRY', status: 'COMPLETED', executedAt: new Date(Date.now() - 40 * 60 * 1000) },
        { actionType: 'RETRY', status: 'FAILED', executedAt: new Date(Date.now() - 35 * 60 * 1000) }
      ]
    });

    const decision: AiDecisionResult = {
      recommendedAction: 'RETRY',
      rootCause: 'test',
      recoverability: 'HIGH',
      confidence: 1,
      reason: ''
    };

    const result = await guardrailEngine.evaluateAction('case-1', decision);
    expect(result.status).toBe('BLOCKED');
    expect(result.rulesChecked['RETRY_LIMIT']).toBe('FAIL');
    expect(result.reason).toContain('Human review/escalation is required');
  });

  it('allows valid RETRY', async () => {
    mockPrisma.recoveryCase.findUnique.mockResolvedValue({
      id: 'case-1',
      payment: { status: 'FAILED', amount: 500 },
      recoveryActions: [
        { actionType: 'RETRY', status: 'COMPLETED', executedAt: new Date(Date.now() - 40 * 60 * 1000) }
      ]
    });

    const decision: AiDecisionResult = {
      recommendedAction: 'RETRY',
      rootCause: 'test',
      recoverability: 'HIGH',
      confidence: 1,
      reason: ''
    };

    const result = await guardrailEngine.evaluateAction('case-1', decision);
    expect(result.status).toBe('ALLOWED');
    expect(result.rulesChecked['RETRY_LIMIT']).toBe('PASS');
    expect(result.rulesChecked['DUPLICATE_CHECK']).toBe('PASS');
  });

  it('blocks actions during cooldown period', async () => {
    mockPrisma.recoveryCase.findUnique.mockResolvedValue({
      id: 'case-1',
      payment: { status: 'FAILED', amount: 500 },
      recoveryActions: [
        { actionType: 'RETRY', status: 'COMPLETED', executedAt: new Date(Date.now() - 10 * 60 * 1000) }
      ]
    });

    const decision: AiDecisionResult = {
      recommendedAction: 'RETRY',
      rootCause: 'test',
      recoverability: 'HIGH',
      confidence: 1,
      reason: ''
    };

    const result = await guardrailEngine.evaluateAction('case-1', decision);
    expect(result.status).toBe('BLOCKED');
    expect(result.rulesChecked['COOLDOWN_CHECK']).toBe('FAIL');
  });

  it('maximum failures result in human-review escalation', async () => {
    mockPrisma.recoveryCase.findUnique.mockResolvedValue({
      id: 'case-1',
      payment: { status: 'FAILED', amount: 500 },
      recoveryActions: [
        { actionType: 'PAYMENT_LINK', status: 'FAILED', executedAt: new Date(Date.now() - 60 * 60 * 1000) },
        { actionType: 'RETRY', status: 'FAILED', executedAt: new Date(Date.now() - 50 * 60 * 1000) },
        { actionType: 'REMINDER', status: 'FAILED', executedAt: new Date(Date.now() - 40 * 60 * 1000) }
      ]
    });

    const decision: AiDecisionResult = {
      recommendedAction: 'RETRY',
      rootCause: 'test',
      recoverability: 'HIGH',
      confidence: 1,
      reason: ''
    };

    const result = await guardrailEngine.evaluateAction('case-1', decision);
    expect(result.status).toBe('BLOCKED');
    expect(result.rulesChecked['FAILURE_LIMIT']).toBe('FAIL');
    expect(result.reason).toContain('Human review/escalation is required');
  });
});
