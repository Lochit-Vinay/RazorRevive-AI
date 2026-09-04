import { BarChart3, TrendingUp, TrendingDown, Activity } from 'lucide-react';

export default function Performance() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Performance Analytics</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Advanced recovery metrics and cohort analysis.</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-500 text-xs font-bold border border-blue-500/20">PRO FEATURE</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {[
          { title: 'Win-Back Rate', value: '42.8%', trend: '+2.4%', up: true, icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-500/10' },
          { title: 'Avg Time to Recover', value: '1.2 days', trend: '-0.3 days', up: true, icon: Activity, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { title: 'Churn Risk', value: '8.4%', trend: '-1.2%', up: true, icon: TrendingDown, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-md border border-white/40 dark:border-gray-700/50 p-6 flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</h3>
              <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className={`text-sm mt-2 font-medium ${stat.up ? 'text-green-500' : 'text-red-500'}`}>{stat.trend} vs last month</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-md border border-white/40 dark:border-gray-700/50 p-12 flex flex-col items-center justify-center text-center">
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
          <BarChart3 className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Detailed Reporting Coming Soon</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">We are building an advanced cohort analysis engine to help you slice and dice your recovery data by payment method, geography, and more.</p>
      </div>
    </div>
  );
}
