import React, { useState } from 'react';
import { PlayCircle, Eye, CheckCircle2, ShieldAlert, Zap, X } from 'lucide-react';
import api from '../../lib/api';

interface Props {
  caseId: string;
  aiDecision: any;
  guardrail: any;
  recoveryAction: any;
  payment: any;
  onRefresh: () => void;
}

export default function RecoveryActionPanel({ caseId, aiDecision, guardrail, recoveryAction, payment, onRefresh }: Props) {
  const [showPreview, setShowPreview] = useState(false);
  const [showExecute, setShowExecute] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!aiDecision) return null;

  const isBlocked = guardrail?.status === 'BLOCKED';
  const isExecuted = !!recoveryAction;
  const canExecute = !isBlocked && !isExecuted && guardrail?.status === 'ALLOWED';

  const handleExecute = async () => {
    setExecuting(true);
    setError(null);
    try {
      await api.post(`/recovery/execute/${caseId}`);
      setShowExecute(false);
      onRefresh();
    } catch (e: any) {
      console.error(e);
      setError(e.response?.data?.error || 'Failed to execute recovery action.');
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">
        <div className="bg-blue-50 border-b border-blue-100 p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Zap className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="font-bold text-blue-900">Recovery Action Execution</h3>
          </div>
          {isExecuted && (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-800 flex items-center">
              <CheckCircle2 className="w-3 h-3 mr-1" /> EXECUTED
            </span>
          )}
          {isBlocked && !isExecuted && (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-100 text-red-800 flex items-center">
              <ShieldAlert className="w-3 h-3 mr-1" /> BLOCKED
            </span>
          )}
          {canExecute && (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-100 text-orange-800">
              READY TO EXECUTE
            </span>
          )}
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Recommended Action</p>
            <p className="text-xl font-bold text-gray-900">{aiDecision.recommendedAction}</p>
            <p className="text-sm text-gray-600 mt-2">{getExplanation(aiDecision.recommendedAction)}</p>
          </div>

          {isBlocked && (
             <div className="p-4 bg-red-50 text-red-700 text-sm rounded-lg mb-6 border border-red-100">
               Recovery action blocked by deterministic guardrails. Cannot execute.
             </div>
          )}
          
          {error && (
             <div className="p-4 bg-red-50 text-red-700 text-sm rounded-lg mb-6 border border-red-100 flex justify-between items-center">
               <span>{error}</span>
               <button onClick={() => setError(null)} className="text-red-700 font-bold underline">Dismiss</button>
             </div>
          )}

          <div className="flex space-x-4">
            <button
              onClick={() => setShowPreview(true)}
              disabled={isExecuted || isBlocked}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-900 flex items-center"><Eye className="w-5 h-5 mr-2 text-gray-500" /> Action Preview</h3>
              <button onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-gray-700"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 font-medium text-xs uppercase">Customer</p>
                  <p className="font-semibold text-gray-900">{payment.customer.name}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium text-xs uppercase">Estimated Recovery</p>
                  <p className="font-bold text-green-600">₹{payment.amount.toLocaleString('en-IN')}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <p className="text-gray-500 font-medium text-xs uppercase mb-2">Simulated {aiDecision.recommendedAction} Payload</p>
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
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button onClick={() => setShowPreview(false)} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors">Close Preview</button>
            </div>
          </div>
        </div>
      )}

      {/* Execute Modal */}
      {showExecute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
                <PlayCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Execute Recovery?</h3>
              <p className="text-sm text-gray-500 mb-6">
                You are about to execute the <strong>{aiDecision.recommendedAction}</strong> action to recover <strong>₹{payment.amount.toLocaleString('en-IN')}</strong> from <strong>{payment.customer.name}</strong>.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowExecute(false)}
                  disabled={executing}
                  className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors"
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
