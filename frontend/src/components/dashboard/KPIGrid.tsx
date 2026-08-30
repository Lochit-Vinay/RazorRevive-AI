
import { IndianRupee, Activity, AlertCircle, RefreshCcw, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { KPI } from '../../types/dashboard';

interface Props {
  current: KPI;
  previous: KPI | null;
}

const formatCurrency = (val: number) => `₹${val.toLocaleString('en-IN')}`;
const formatNumber = (val: number) => val.toLocaleString('en-IN');

function TrendBadge({ current, previous, inverse = false }: { current: number, previous: number | null, inverse?: boolean }) {
  if (previous === null || previous === 0) {
    return <span className="text-xs text-gray-400 font-medium ml-2">vs previous</span>;
  }

  const change = ((current - previous) / previous) * 100;
  const isPositive = change > 0;
  const isZero = change === 0;

  let isGood = isPositive;
  if (inverse) isGood = !isPositive; // For things like "Revenue at Risk" or "Escalations" where UP is BAD

  if (isZero) {
    return (
      <span className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 ml-2">
        <Minus className="w-3 h-3 mr-0.5" /> 0%
      </span>
    );
  }

  return (
    <span className={`flex items-center text-xs font-medium ml-2 ${isGood ? 'text-green-600' : 'text-red-600'}`}>
      {isPositive ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
      {Math.abs(change).toFixed(1)}%
    </span>
  );
}

export default function KPIGrid({ current, previous }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {/* Revenue at Risk */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Revenue at Risk</p>
          <div className="p-2 bg-red-50 text-red-600 rounded-lg"><IndianRupee className="w-5 h-5" /></div>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(current.revenueAtRisk)}</h3>
          <div className="flex items-center mt-1">
            <TrendBadge current={current.revenueAtRisk} previous={previous?.revenueAtRisk ?? null} inverse={true} />
          </div>
        </div>
      </div>

      {/* Revenue Recovered */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Revenue Recovered</p>
          <div className="p-2 bg-green-50 text-green-600 rounded-lg"><IndianRupee className="w-5 h-5" /></div>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(current.revenueRecovered)}</h3>
          <div className="flex items-center mt-1">
            <TrendBadge current={current.revenueRecovered} previous={previous?.revenueRecovered ?? null} />
          </div>
        </div>
      </div>

      {/* Recovery Rate */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Recovery Rate</p>
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Activity className="w-5 h-5" /></div>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{current.recoveryRate.toFixed(1)}%</h3>
          <div className="flex items-center mt-1">
            <TrendBadge current={current.recoveryRate} previous={previous?.recoveryRate ?? null} />
          </div>
        </div>
      </div>

      {/* Recovery Attempts */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400" title="Total automated actions executed by the system">Recovery Attempts</p>
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><RefreshCcw className="w-5 h-5" /></div>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(current.recoveryAttempts)}</h3>
          <div className="flex items-center mt-1">
             <TrendBadge current={current.recoveryAttempts} previous={previous?.recoveryAttempts ?? null} />
          </div>
        </div>
      </div>

      {/* Human Escalations */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400" title="Cases blocked by Guardrails requiring human review">Escalations</p>
          <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><AlertCircle className="w-5 h-5" /></div>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(current.escalations)}</h3>
          <div className="flex items-center mt-1">
            <TrendBadge current={current.escalations} previous={previous?.escalations ?? null} inverse={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
