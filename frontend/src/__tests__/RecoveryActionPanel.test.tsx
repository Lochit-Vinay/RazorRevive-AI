import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RecoveryActionPanel from '../components/case/RecoveryActionPanel';
import api from '../lib/api';

// Mock the API and ToastContext
vi.mock('../lib/api', () => ({
  default: {
    post: vi.fn(),
  },
}));

vi.mock('../components/ui/ToastContext', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
  }),
}));

describe('RecoveryActionPanel', () => {
  const mockOnRefresh = vi.fn();
  
  const defaultProps = {
    caseId: 'case-123',
    caseStatus: 'PENDING',
    aiDecision: { recommendedAction: 'RETRY' },
    guardrail: { status: 'ALLOWED' },
    recoveryAction: null,
    payment: {
      amount: 500,
      customer: { name: 'Test Customer', email: 'test@example.com' },
      id: 'pay-123',
      paymentMethod: 'CARD'
    },
    onRefresh: mockOnRefresh,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders READY TO EXECUTE badge when allowed', () => {
    render(<RecoveryActionPanel {...defaultProps} />);
    expect(screen.getByText('READY TO EXECUTE')).toBeInTheDocument();
    expect(screen.getByText('RETRY')).toBeInTheDocument();
    const executeBtn = screen.getByRole('button', { name: /Execute Recovery/i });
    expect(executeBtn).not.toBeDisabled();
  });

  it('renders BLOCKED badge and disables execute button when guardrail is BLOCKED', () => {
    render(
      <RecoveryActionPanel
        {...defaultProps}
        guardrail={{ status: 'BLOCKED' }}
      />
    );
    expect(screen.getByText('BLOCKED')).toBeInTheDocument();
    const executeBtn = screen.getByRole('button', { name: /Execute Recovery/i });
    expect(executeBtn).toBeDisabled();
    expect(screen.getByText(/Recovery action blocked by deterministic guardrails/i)).toBeInTheDocument();
  });

  it('renders EXECUTED badge and disables execute button when recovery action exists', () => {
    render(
      <RecoveryActionPanel
        {...defaultProps}
        recoveryAction={{ id: 'action-123' }}
      />
    );
    expect(screen.getByText('EXECUTED')).toBeInTheDocument();
    const executeBtn = screen.getByRole('button', { name: /Execute Recovery/i });
    expect(executeBtn).toBeDisabled();
  });

  it('calls API and onRefresh when execute is confirmed', async () => {
    (api.post as any).mockResolvedValueOnce({ data: { success: true } });
    
    render(<RecoveryActionPanel {...defaultProps} />);
    
    // Open modal
    fireEvent.click(screen.getByRole('button', { name: /Execute Recovery/i }));
    
    // Check modal appears
    expect(screen.getByText('Execute Recovery?')).toBeInTheDocument();
    
    // Click confirm
    fireEvent.click(screen.getByRole('button', { name: /Confirm & Execute/i }));
    
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/recovery/execute/case-123', {
        idempotencyKey: expect.any(String),
      });
      expect(mockOnRefresh).toHaveBeenCalled();
    });
  });
});
