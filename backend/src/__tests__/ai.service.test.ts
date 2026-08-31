import { aiDecisionEngine } from '../services/ai.service';
import { prisma } from '../db';

jest.mock('../db', () => ({
  prisma: {
    payment: {
      findUnique: jest.fn()
    }
  }
}));

const mockPrisma = prisma as unknown as {
  payment: { findUnique: jest.Mock };
};

describe('AiDecisionEngine Fallback Rules Unit Tests', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    delete process.env.GEMINI_API_KEY; // Force fallback rule engine
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('returns NO_ACTION for SUCCESS payments', async () => {
    mockPrisma.payment.findUnique.mockResolvedValue({
      id: 'pay-1',
      amount: 500,
      status: 'SUCCESS',
      customer: { successCount: 1, failureCount: 0 },
      failures: []
    });

    const result = await aiDecisionEngine.analyzePayment('pay-1');
    expect(result.recommendedAction).toBe('NO_ACTION');
    expect(result.rootCause).toBe('already_recovered');
  });

  it('returns RETRY for timeout', async () => {
    mockPrisma.payment.findUnique.mockResolvedValue({
      id: 'pay-2',
      amount: 500,
      status: 'FAILED',
      customer: { successCount: 1, failureCount: 0 },
      failures: [{ reason: 'timeout' }]
    });

    const result = await aiDecisionEngine.analyzePayment('pay-2');
    expect(result.recommendedAction).toBe('RETRY');
  });

  it('returns PAYMENT_LINK for expired_card', async () => {
    mockPrisma.payment.findUnique.mockResolvedValue({
      id: 'pay-3',
      amount: 500,
      status: 'FAILED',
      customer: { successCount: 1, failureCount: 0 },
      failures: [{ reason: 'expired_card' }]
    });

    const result = await aiDecisionEngine.analyzePayment('pay-3');
    expect(result.recommendedAction).toBe('PAYMENT_LINK');
  });

  it('returns ESCALATE for bank_decline > 25000', async () => {
    mockPrisma.payment.findUnique.mockResolvedValue({
      id: 'pay-4',
      amount: 30000,
      status: 'FAILED',
      customer: { successCount: 1, failureCount: 0 },
      failures: [{ reason: 'bank_decline' }]
    });

    const result = await aiDecisionEngine.analyzePayment('pay-4');
    expect(result.recommendedAction).toBe('ESCALATE');
  });

  it('returns REMINDER for generic failure', async () => {
    mockPrisma.payment.findUnique.mockResolvedValue({
      id: 'pay-5',
      amount: 500,
      status: 'FAILED',
      customer: { successCount: 1, failureCount: 0 },
      failures: [{ reason: 'generic_error' }]
    });

    const result = await aiDecisionEngine.analyzePayment('pay-5');
    expect(result.recommendedAction).toBe('REMINDER');
  });
});
