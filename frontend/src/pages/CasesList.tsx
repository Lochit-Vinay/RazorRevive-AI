import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { ChevronRight, Search, Filter } from 'lucide-react';
import clsx from 'clsx';

export default function CasesList() {
  const [cases, setCases] = useState<any[]>([]);
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    api.get('/recovery/cases').then(res => setCases(res.data)).catch(console.error);
  }, []);

  const filteredCases = cases.filter(c => {
    const matchesFilter = filter === 'ALL' || c.status === filter;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      c.paymentId.toLowerCase().includes(searchLower) || 
      (c.payment?.customer?.name || '').toLowerCase().includes(searchLower);
    
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Recovery Cases</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage failed payments and AI recovery operations.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select 
              value={filter} 
              onChange={e => setFilter(e.target.value)}
              className="bg-transparent text-sm font-medium text-gray-700 dark:text-gray-300 outline-none"
            >
              <option className="dark:bg-gray-800 dark:text-gray-100" value="ALL">All Cases</option>
              <option className="dark:bg-gray-800 dark:text-gray-100" value="PENDING">Pending Action</option>
              <option className="dark:bg-gray-800 dark:text-gray-100" value="RECOVERED">Recovered</option>
              <option className="dark:bg-gray-800 dark:text-gray-100" value="ESCALATED">Escalated (Human Review)</option>
            </select>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search payment ID or customer..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none focus:border-razorpay-primary focus:ring-1 focus:ring-razorpay-primary transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                <th className="p-4 font-semibold">Payment ID</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold">Failure Reason</th>
                <th className="p-4 font-semibold">AI Recommendation</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredCases.map((c, i) => {
                const ai = c.aiDecisions?.[0];
                return (
                  <tr 
                    key={c.id} 
                    className="hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-colors group animate-in fade-in slide-in-from-bottom-2"
                    style={{ animationDelay: `${i * 30}ms`, animationFillMode: 'both' }}
                  >
                    <td className="p-4">
                      <span className="font-mono text-xs text-gray-600 dark:text-gray-400 bg-gray-100/80 dark:bg-gray-700 px-2 py-1 rounded border border-gray-200/50 dark:border-gray-600 shadow-sm">
                        {c.paymentId.split('-')[0]}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-medium text-gray-900 dark:text-white">{c.payment?.customer?.name}</td>
                    <td className="p-4 text-sm font-semibold text-gray-900 dark:text-white">₹{c.payment?.amount.toLocaleString('en-IN')}</td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                      {c.payment?.failures?.[0]?.reason?.replace(/_/g, ' ') || 'Unknown'}
                    </td>
                    <td className="p-4">
                      {ai ? (
                        <span className={clsx(
                          "text-xs font-semibold px-2.5 py-1 rounded-full",
                          ai.recommendedAction === 'RETRY' && "bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300",
                          ai.recommendedAction === 'PAYMENT_LINK' && "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300",
                          ai.recommendedAction === 'ESCALATE' && "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300",
                          ai.recommendedAction === 'REMINDER' && "bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300"
                        )}>
                          {ai.recommendedAction}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400 dark:text-gray-500">Pending Analysis</span>
                      )}
                    </td>
                    <td className="p-4">
                      {(() => {
                        let displayStatus = c.status;
                        let colorClasses = "text-gray-700 bg-gray-50 border border-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600";

                        if (c.status === 'PENDING') {
                          if (c.recoveryActions && c.recoveryActions.length > 0) {
                            displayStatus = "EXECUTING";
                            colorClasses = "text-blue-700 bg-blue-50 border border-blue-200";
                          } else if (c.guardrailEvaluations && c.guardrailEvaluations[0]?.status === 'BLOCKED') {
                            displayStatus = "BLOCKED";
                            colorClasses = "text-red-700 bg-red-50 border border-red-200";
                          } else if (ai && c.guardrailEvaluations && c.guardrailEvaluations[0]?.status === 'ALLOWED') {
                            displayStatus = "READY TO EXECUTE";
                            colorClasses = "text-orange-700 bg-orange-50 border border-orange-200";
                          } else if (ai) {
                            displayStatus = "ANALYZED";
                            colorClasses = "text-indigo-700 bg-indigo-50 border border-indigo-200";
                          } else {
                            displayStatus = "PENDING ANALYSIS";
                            colorClasses = "text-yellow-700 bg-yellow-50 border border-yellow-200";
                          }
                        } else if (c.status === 'RECOVERED') {
                          colorClasses = "text-green-700 bg-green-50 border border-green-200";
                        } else if (c.status === 'FAILED') {
                          colorClasses = "text-red-700 bg-red-50 border border-red-200";
                        } else if (c.status === 'ESCALATED') {
                          displayStatus = "NEEDS APPROVAL";
                          colorClasses = "text-red-700 bg-red-50 border border-red-200";
                        }

                        return (
                          <span className={clsx("text-xs font-bold px-2 py-1 rounded", colorClasses)}>
                            {displayStatus}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="p-4 text-right">
                      <Link to={`/cases/${c.id}`} className="inline-flex items-center text-sm font-medium text-razorpay-primary dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 px-3 py-1.5 rounded-lg group-hover:opacity-100 focus:opacity-100">
                        View <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredCases.length === 0 && (
            <div className="p-16 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No cases found</h3>
              <p className="text-sm mt-1 text-center max-w-sm">We couldn't find any recovery cases matching your current search or filter criteria.</p>
              {(filter !== 'ALL' || searchQuery) && (
                <button 
                  onClick={() => { setFilter('ALL'); setSearchQuery(''); }}
                  className="mt-4 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-lg transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
