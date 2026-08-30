
import type { FailureReason } from '../../types/dashboard';

interface Props {
  reasons: FailureReason[];
}

export default function FailureReasons({ reasons }: Props) {
  const formatCurrency = (val: number) => `₹${val.toLocaleString('en-IN')}`;
  const totalAmount = reasons.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Top Failure Reasons</h3>
      
      {reasons.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 py-4">No failure data for this period.</p>
      ) : (
        <div className="space-y-5">
          {reasons.slice(0, 5).map((r) => {
            const percent = totalAmount > 0 ? (r.amount / totalAmount) * 100 : 0;
            return (
              <div key={r.reason} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{r.reason.replace(/_/g, ' ')}</span>
                  <span className="font-bold text-gray-900 dark:text-gray-100">{formatCurrency(r.amount)} <span className="text-gray-400 font-normal text-xs">({r.count} cases)</span></span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                  <div 
                    className="bg-razorpay-primary h-1.5 rounded-full" 
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
