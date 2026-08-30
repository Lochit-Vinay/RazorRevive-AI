
import type { FunnelData } from '../../types/dashboard';
import { ArrowDown, AlertTriangle, Cpu, ShieldCheck, Play, CheckCircle2 } from 'lucide-react';

interface Props {
  data: FunnelData;
}

export default function RecoveryFunnel({ data }: Props) {
  const max = Math.max(data.failedPayments, 1); // prevent div by zero
  
  const funnelSteps = [
    { label: 'Failed Payments', value: data.failedPayments, color: 'bg-red-500', icon: AlertTriangle },
    { label: 'Eligible for Recovery', value: data.eligibleCases, color: 'bg-orange-500', icon: Cpu },
    { label: 'AI Recommendations', value: data.aiRecommendations, color: 'bg-yellow-500', icon: Cpu },
    { label: 'Guardrail Approved', value: data.guardrailApproved, color: 'bg-blue-500', icon: ShieldCheck },
    { label: 'Recovery Attempted', value: data.recoveryAttempted, color: 'bg-indigo-500', icon: Play },
    { label: 'Successfully Recovered', value: data.recovered, color: 'bg-green-500', icon: CheckCircle2 }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col h-full">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recovery Funnel</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Pipeline progression from failure to recovery.</p>
      </div>

      <div className="flex-1 flex flex-col justify-between py-2 relative">
        {funnelSteps.map((step, idx) => {
          const Icon = step.icon;
          const widthPercent = Math.max((step.value / max) * 100, 2); // Minimum 2% to show a sliver

          return (
            <div key={step.label} className="relative group">
              <div className="flex items-center justify-between text-sm mb-1 z-10 relative">
                <span className="font-medium text-gray-700 dark:text-gray-300 flex items-center">
                  <Icon className="w-4 h-4 mr-1.5 text-gray-400 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors" />
                  {step.label}
                </span>
                <span className="font-bold text-gray-900 dark:text-white">{step.value.toLocaleString('en-IN')}</span>
              </div>
              
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 mb-4 relative overflow-hidden">
                <div 
                  className={`h-full rounded-full ${step.color} transition-all duration-1000 ease-out`}
                  style={{ width: `${widthPercent}%` }}
                />
              </div>

              {idx < funnelSteps.length - 1 && (
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-gray-300">
                  <ArrowDown className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
