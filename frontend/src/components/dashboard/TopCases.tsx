import React from 'react';
import type { TopCase } from '../../types/dashboard';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  cases: TopCase[];
}

export default function TopCases({ cases }: Props) {
  const formatCurrency = (val: number) => `₹${val.toLocaleString('en-IN')}`;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h3 className="text-lg font-bold text-gray-900">Highest-Value Recovery Opportunities</h3>
        <Link to="/cases" className="text-sm font-medium text-razorpay-primary hover:text-blue-700">View All</Link>
      </div>
      
      {cases.length === 0 ? (
        <div className="p-8 text-center text-sm text-gray-500">
          No pending cases at risk in this period.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Amount Risk</th>
                <th className="p-4 font-semibold">Failure</th>
                <th className="p-4 font-semibold">AI Rec</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cases.map(c => {
                const ai = c.aiDecisions?.[0];
                return (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm font-medium text-gray-900">{c.payment?.customer?.name}</td>
                    <td className="p-4 text-sm font-bold text-red-600">{formatCurrency(c.revenueAtRisk)}</td>
                    <td className="p-4 text-xs text-gray-600">
                      {c.payment?.failures?.[0]?.reason?.replace(/_/g, ' ') || 'Unknown'}
                    </td>
                    <td className="p-4">
                      {ai ? (
                        <span className={clsx(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                          ai.recommendedAction === 'RETRY' && "bg-blue-100 text-blue-700",
                          ai.recommendedAction === 'PAYMENT_LINK' && "bg-purple-100 text-purple-700",
                          ai.recommendedAction === 'ESCALATE' && "bg-orange-100 text-orange-700",
                          ai.recommendedAction === 'REMINDER' && "bg-gray-100 text-gray-700"
                        )}>
                          {ai.recommendedAction}
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-400">PENDING</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <Link to={`/cases/${c.id}`} className="inline-flex items-center justify-center p-1.5 rounded-md hover:bg-gray-200 text-gray-500 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
