import React from 'react';
import type { RecentActivity as RecentActivityType } from '../../types/dashboard';

interface Props {
  activities: RecentActivityType[];
}

export default function RecentActivity({ activities }: Props) {
  const formatTime = (isoString: string) => {
    const d = new Date(isoString);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h3>
      
      {activities.length === 0 ? (
        <p className="text-sm text-gray-500 py-4 text-center">No recent activity.</p>
      ) : (
        <div className="space-y-5 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
          {activities.map((act) => (
            <div key={act.id} className="relative flex items-start group">
              <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white bg-gray-200 shadow-sm shrink-0 z-10 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 group-hover:bg-razorpay-primary transition-colors"></div>
              </div>
              <div className="ml-4 flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">
                      {act.eventType.replace(/_/g, ' ')}
                    </h4>
                    {act.recoveryCase && (
                      <p className="text-xs font-mono text-gray-500 mt-0.5">
                        {act.recoveryCase.paymentId.split('-')[0]} • ₹{act.recoveryCase.payment.amount.toLocaleString('en-IN')}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{formatTime(act.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
