import { useState } from 'react';
import { PlayCircle, Eye, CheckCircle2, ShieldAlert, Zap, X } from 'lucide-react';
import api from '../../lib/api';
import { useToast } from '../ui/ToastContext';

interface Props {
  caseId: string;
  caseStatus: string;
  aiDecision: any;
  guardrail: any;
  recoveryAction: any;
  payment: any;
  onRefresh: () => void;
}

export default function RecoveryActionPanel({ caseId, caseStatus, aiDecision, guardrail, recoveryAction, payment, onRefresh }: Props) {
  const [showPreview, setShowPreview] = useState(false);
  const [showExecute, setShowExecute] = useState(false);
  const [executing, setExecuting] = useState(false);
  const { success, error: showError } = useToast();

  if (!aiDecision) return null;

  const isBlocked = guardrail?.status === 'BLOCKED';
  const isExecuted = !!recoveryAction || (caseStatus !== 'PENDING' && caseStatus !== 'ESCALATED');
  const canExecute = caseStatus === 'PENDING' && !isBlocked && guardrail?.status === 'ALLOWED' && !recoveryAction;

  const handleExecute = async () => {
    setExecuting(true);
    try {
      await api.post(`/recovery/execute/${caseId}`);
      setShowExecute(false);
      success('Execution Successful', 'The recovery action has been processed.');
      onRefresh();
    } catch (e: any) {
      console.error(e);
      setShowExecute(false);
      showError('Execution Failed', e.response?.data?.error || 'Failed to execute recovery action.');
    } finally {
      setExecuting(false);
    }
  };

  const getExplanation = (action: string) => {
    switch(action) {
      case 'PAYMENT_LINK': return 'Send the customer a new payment link to recover the failed payment.';
      case 'RETRY': return 'Automatically retry the payment using the saved instrument.';
      case 'REMINDER': return 'Send a gentle reminder to the customer regarding the pending payment.';
      case 'ESCALATE': return 'Escalate the case to human operations for manual review.';
      case 'NO_ACTION': return 'No recovery action is recommended for this case.';
      default: return 'Execute the recommended recovery workflow.';
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mt-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-900/30 p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
            <h3 className="font-bold text-blue-900 dark:text-blue-200">Recovery Action Execution</h3>
          </div>
          {isExecuted && (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 flex items-center border border-green-200 dark:border-green-800/50">
              <CheckCircle2 className="w-3 h-3 mr-1" /> EXECUTED
            </span>
          )}
          {isBlocked && !isExecuted && (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 flex items-center border border-red-200 dark:border-red-800/50">
              <ShieldAlert className="w-3 h-3 mr-1" /> BLOCKED
            </span>
          )}
          {canExecute && (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800/50">
              READY TO EXECUTE
            </span>
          )}
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">Recommended Action</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{aiDecision.recommendedAction}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{getExplanation(aiDecision.recommendedAction)}</p>
          </div>

          {isBlocked && (
             <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm rounded-lg mb-6 border border-red-100 dark:border-red-900/30">
               Recovery action blocked by deterministic guardrails. Cannot execute.
             </div>
          )}

          <div className="flex space-x-4">
            <button
              onClick={() => setShowPreview(true)}
              disabled={isExecuted || isBlocked}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Eye className="w-4 h-4 mr-2" /> Preview Action
            </button>
            <button
              onClick={() => setShowExecute(true)}
              disabled={!canExecute}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlayCircle className="w-4 h-4 mr-2" /> Execute Recovery
            </button>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center"><Eye className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" /> Action Preview</h3>
              <button onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-gray-700"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium text-xs uppercase">Customer</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{payment.customer.name}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium text-xs uppercase">Estimated Recovery</p>
                  <p className="font-bold text-green-600">₹{payment.amount.toLocaleString('en-IN')}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400 font-medium text-xs uppercase mb-2">Simulated {aiDecision.recommendedAction} Payload</p>
                <div className="bg-gray-900 rounded-lg p-4 text-gray-300 font-mono text-[10px] sm:text-xs overflow-x-auto">
                  {aiDecision.recommendedAction === 'PAYMENT_LINK' && (
                    <span>
                      POST /v1/payment_links<br/>
                      {`{
  "amount": ${payment.amount * 100},
  "currency": "INR",
  "customer": {
    "name": "${payment.customer.name}",
    "email": "${payment.customer.email}"
  },
  "description": "Retry payment for failed transaction",
  "notify": { "sms": true, "email": true }
}`}
                    </span>
                  )}
                  {aiDecision.recommendedAction === 'RETRY' && (
                    <span>
                      POST /v1/payments/{payment.id}/retry<br/>
                      {`{
  "method": "${payment.paymentMethod}",
  "reason": "Automated retry based on AI confidence"
}`}
                    </span>
                  )}
                  {aiDecision.recommendedAction !== 'PAYMENT_LINK' && aiDecision.recommendedAction !== 'RETRY' && (
                    <span>
                      No preview available for {aiDecision.recommendedAction}.
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-end">
              <button onClick={() => setShowPreview(false)} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-medium transition-colors">Close Preview</button>
            </div>
          </div>
        </div>
      )}

      {/* Execute Modal */}
      {showExecute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
                <PlayCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Execute Recovery?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                You are about to execute the <strong>{aiDecision.recommendedAction}</strong> action to recover <strong>₹{payment.amount.toLocaleString('en-IN')}</strong> from <strong>{payment.customer.name}</strong>.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowExecute(false)}
                  disabled={executing}
                  className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExecute}
                  disabled={executing}
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
                >
                  {executing ? <span className="animate-pulse">Executing...</span> : 'Confirm & Execute'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
