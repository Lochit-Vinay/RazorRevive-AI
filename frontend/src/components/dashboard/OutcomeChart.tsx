
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { KPI } from '../../types/dashboard';

interface Props {
  current: KPI;
}

export default function OutcomeChart({ current }: Props) {
  const formatCurrency = (val: number) => `₹${val.toLocaleString('en-IN')}`;

  const remainingAtRisk = Math.max(0, current.revenueAtRisk - current.revenueRecovered);

  const data = [
    {
      name: 'Revenue Flow',
      'Revenue Recovered': current.revenueRecovered,
      'Remaining at Risk': remainingAtRisk
    }
  ];

  return (
    <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-md border border-white/40 dark:border-gray-700/50 p-6 flex flex-col h-full hover:shadow-lg transition-all duration-300 group">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recovery Outcome</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Distribution of initially at-risk revenue.</p>
      </div>

      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
            <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 13 }} tickFormatter={(val) => `₹${val/1000}k`} />
            <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} hide />
            <Tooltip 
              cursor={{ fill: 'transparent' }} 
              formatter={(val: any) => [formatCurrency(val as number), 'Amount']}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Bar dataKey="Revenue Recovered" stackId="a" fill="#22c55e" radius={[0, 0, 0, 0]} barSize={60} />
            <Bar dataKey="Remaining at Risk" stackId="a" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={60} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-sm text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700">
        <p>Total Revenue at Risk evaluated: <strong>{formatCurrency(current.revenueAtRisk)}</strong></p>
      </div>
    </div>
  );
}
