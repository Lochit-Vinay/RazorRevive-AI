import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/api';
import { ArrowLeft, User, CreditCard, ShieldAlert, Cpu, CheckCircle2, XCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import clsx from 'clsx';
import RecoveryActionPanel from '../components/case/RecoveryActionPanel';

export default function CaseDetails() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [processing, setProcessing] = useState(false);

  const fetchDetails = async () => {
    try {
      const res = await api.get(`/recovery/cases/${id}`);
      setData(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleAnalyze = async () => {
    setProcessing(true);
    try {
      await api.post(`/recovery/analyze/${id}`);
      await fetchDetails();
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  const handleApproveEscalation = async () => {
    setProcessing(true);
    try {
      await api.post(`/recovery/cases/${id}/approve`);
      await fetchDetails();
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  if (!data) return <div className="p-8 flex justify-center"><div className="animate-pulse w-8 h-8 rounded-full bg-razorpay-primary"></div></div>;

  const ai = data.aiDecisions?.[0];
  const guardrail = data.guardrailEvaluations?.[0];
  const rules = guardrail ? JSON.parse(guardrail.rulesChecked) : {};
  const logs = data.auditLogs || [];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <Link to="/cases" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-white mb-2">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Cases
      </Link>
      
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Case Overview</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1 font-mono text-sm">Payment ID: {data.paymentId}</p>
        </div>
        
        <div className="flex space-x-3">
          {data.status === 'PENDING' && !guardrail && (
            <button
              onClick={handleAnalyze}
              disabled={processing || !!ai}
              className="bg-razorpay-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow-sm font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {processing ? 'Processing...' : (ai ? 'Analyzed' : 'Analyze Case')}
            </button>
          )}
          {data.status === 'PENDING' && guardrail?.status === 'BLOCKED' && (
            <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-5 py-2.5 rounded-lg font-bold flex items-center border border-red-200 dark:border-red-900/50">
              <ShieldAlert className="w-5 h-5 mr-2" />
              Blocked by Guardrails
            </div>
          )}
          {data.status === 'ESCALATED' && (
            <button
              onClick={handleApproveEscalation}
              disabled={processing}
              className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-lg shadow-sm font-medium transition-colors disabled:opacity-70 flex items-center"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              {processing ? 'Approving...' : 'Needs Human Approval - Approve'}
            </button>
          )}
          {data.status === 'RECOVERED' && (
            <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-5 py-2.5 rounded-lg font-bold flex items-center border border-green-200 dark:border-green-900/50">
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Successfully Recovered
            </div>
          )}
          {data.status === 'FAILED' && (
            <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-5 py-2.5 rounded-lg font-bold flex items-center border border-red-200 dark:border-red-900/50">
              <XCircle className="w-5 h-5 mr-2" />
              Recovery Failed
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* AI Diagnosis */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 border-b border-indigo-100 dark:border-indigo-900/30 p-4 flex items-center">
              <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2" />
              <h3 className="font-bold text-indigo-900 dark:text-indigo-200">AI Diagnosis & Recommendation</h3>
            </div>
            <div className="p-6">
              {ai ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Root Cause</p>
                      <p className="text-gray-900 dark:text-white font-medium mt-1">{ai.rootCause.replace(/_/g, ' ')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Confidence</p>
                      <p className="text-gray-900 dark:text-white font-medium mt-1">{(ai.confidence * 100).toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Recommended Action</p>
                      <span className="inline-block mt-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 text-sm font-bold px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
                        {ai.recommendedAction}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Recoverability</p>
                      <p className="text-gray-900 dark:text-white font-medium mt-1">{ai.recoverability}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">AI Reasoning</p>
                    <p className="text-gray-700 dark:text-gray-300 italic">"{ai.reason}"</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">Click "Analyze & Recover" to generate AI diagnosis.</p>
              )}
            </div>
          </div>

          {/* Guardrail Evaluation */}
          {ai && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <ShieldCheck className="w-5 h-5 text-gray-600 dark:text-gray-300 mr-2" />
                  <h3 className="font-bold text-gray-900 dark:text-white">Deterministic Guardrails</h3>
                </div>
                {guardrail && (
                  <span className={clsx(
                    "text-xs font-bold px-3 py-1 rounded-full",
                    guardrail.status === 'ALLOWED' ? "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300" : "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300"
                  )}>
                    {guardrail.status}
                  </span>
                )}
              </div>
              <div className="p-0">
                {guardrail ? (
                  <ul className="divide-y divide-gray-100">
                    {Object.entries(rules).map(([rule, status]) => (
                      <li key={rule} className="flex justify-between p-4 items-center hover:bg-gray-50 dark:bg-gray-800/50">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{rule.replace(/_/g, ' ')}</span>
                        {status === 'PASS' && <span className="flex items-center text-green-600 text-sm font-bold"><CheckCircle2 className="w-4 h-4 mr-1"/> PASS</span>}
                        {status === 'FAIL' && <span className="flex items-center text-red-600 text-sm font-bold"><XCircle className="w-4 h-4 mr-1"/> BLOCKED</span>}
                        {status === 'NOT_APPLICABLE' && <span className="text-gray-400 text-sm font-medium">N/A</span>}
                      </li>
                    ))}
                    {guardrail.reason && (
                      <li className="p-4 bg-red-50 text-red-700 text-sm flex items-start border-t border-red-100">
                        <AlertTriangle className="w-5 h-5 mr-2 shrink-0 mt-0.5" />
                        <span><strong>Blocked Reason:</strong> {guardrail.reason}</span>
                      </li>
                    )}
                  </ul>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-6">Pending guardrail check.</p>
                )}
              </div>
            </div>
          )}

          {/* Recovery Action Panel */}
          {ai && (
            <RecoveryActionPanel 
              caseId={data.id}
              caseStatus={data.status}
              aiDecision={ai}
              guardrail={guardrail}
              recoveryAction={data.recoveryActions?.[0]}
              auditLogs={logs}
              payment={data.payment}
              onRefresh={fetchDetails}
            />
          )}

          {/* Audit Trail */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <ShieldAlert className="w-5 h-5 text-gray-400 mr-2" />
              Audit Trail
            </h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
              {logs.map((log: any) => (
                <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full border border-white bg-gray-200 text-gray-500 dark:text-gray-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    <div className="w-2 h-2 rounded-full bg-gray-50 dark:bg-gray-800/500"></div>
                  </div>
                  <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-lg border border-gray-100 shadow-sm bg-white dark:bg-gray-800">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white">{log.eventType.replace(/_/g, ' ')}</h4>
                      <span className="text-xs text-gray-400">{new Date(log.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 mb-2">Actor: {log.actor}</span>
                    <pre className="text-[10px] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-2 rounded border border-gray-100 dark:border-gray-700 overflow-x-auto">
                      {JSON.stringify(JSON.parse(log.metadata || '{}'), null, 2)}
                    </pre>
                  </div>
                </div>
              ))}
              {logs.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400 ml-8">No audit logs available yet.</p>}
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <User className="w-5 h-5 text-gray-400 mr-2" />
              Customer Context
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Name</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{data.payment?.customer?.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Email</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{data.payment?.customer?.email}</p>
              </div>
              <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500 dark:text-gray-400">Lifetime Value</span>
                  <span className="font-semibold text-gray-900 dark:text-white">₹{data.payment?.customer?.lifetimeValue.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Success/Fail Ratio</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{data.payment?.customer?.successCount} / {data.payment?.customer?.failureCount}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <CreditCard className="w-5 h-5 text-gray-400 mr-2" />
              Payment Details
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Amount</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">₹{data.payment?.amount.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Method</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{data.payment?.paymentMethod}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Failure Reason</p>
                <p className="text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded mt-1 border border-red-100 dark:border-red-900/30">
                  {data.payment?.failures?.[0]?.reason}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
