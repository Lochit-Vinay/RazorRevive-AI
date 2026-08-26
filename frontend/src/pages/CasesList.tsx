import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { ChevronRight, Search, Filter } from 'lucide-react';
import clsx from 'clsx';

export default function CasesList() {
  const [cases, setCases] = useState<any[]>([]);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    api.get('/recovery/cases').then(res => setCases(res.data)).catch(console.error);
  }, []);

  const filteredCases = cases.filter(c => filter === 'ALL' || c.status === filter);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Recovery Cases</h2>
          <p className="text-gray-500 mt-1">Manage failed payments and AI recovery operations.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select 
              value={filter} 
              onChange={e => setFilter(e.target.value)}
              className="bg-transparent text-sm font-medium text-gray-700 outline-none"
            >
              <option value="ALL">All Cases</option>
              <option value="PENDING">Pending Action</option>
              <option value="RECOVERED">Recovered</option>
              <option value="ESCALATED">Escalated (Human Review)</option>
            </select>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search payment ID..." 
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-razorpay-primary focus:ring-1 focus:ring-razorpay-primary"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                <th className="p-4 font-semibold">Payment ID</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold">Failure Reason</th>
                <th className="p-4 font-semibold">AI Recommendation</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCases.map(c => {
                const ai = c.aiDecisions?.[0];
                return (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {c.paymentId.split('-')[0]}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-medium text-gray-900">{c.payment?.customer?.name}</td>
                    <td className="p-4 text-sm font-semibold text-gray-900">₹{c.payment?.amount.toLocaleString('en-IN')}</td>
                    <td className="p-4 text-sm text-gray-600">
                      {c.payment?.failures?.[0]?.reason?.replace(/_/g, ' ') || 'Unknown'}
                    </td>
                    <td className="p-4">
                      {ai ? (
                        <span className={clsx(
                          "text-xs font-semibold px-2.5 py-1 rounded-full",
                          ai.recommendedAction === 'RETRY' && "bg-blue-100 text-blue-700",
                          ai.recommendedAction === 'PAYMENT_LINK' && "bg-purple-100 text-purple-700",
                          ai.recommendedAction === 'ESCALATE' && "bg-orange-100 text-orange-700",
                          ai.recommendedAction === 'REMINDER' && "bg-gray-100 text-gray-700"
                        )}>
                          {ai.recommendedAction}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">Pending Analysis</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={clsx(
                        "text-xs font-bold px-2 py-1 rounded",
                        c.status === 'PENDING' && "text-yellow-700 bg-yellow-50 border border-yellow-200",
                        c.status === 'RECOVERED' && "text-green-700 bg-green-50 border border-green-200",
                        c.status === 'ESCALATED' && "text-red-700 bg-red-50 border border-red-200"
                      )}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link to={`/cases/${c.id}`} className="inline-flex items-center text-sm font-medium text-razorpay-primary hover:text-blue-700">
                        View <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredCases.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              No cases found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
