import { BarChart3, TrendingUp, TrendingDown, Activity, PieChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, AreaChart, Area } from 'recharts';

const paymentData = [
  { name: 'Credit Card', recovered: 45000, failed: 12000 },
  { name: 'UPI', recovered: 32000, failed: 8000 },
  { name: 'Net Banking', recovered: 18000, failed: 5000 },
  { name: 'Wallets', recovered: 9500, failed: 3200 },
];

const cohortData = [
  { month: 'Jan', 'Cohort A': 4000, 'Cohort B': 2400, 'Cohort C': 2400 },
  { month: 'Feb', 'Cohort A': 3000, 'Cohort B': 1398, 'Cohort C': 2210 },
  { month: 'Mar', 'Cohort A': 2000, 'Cohort B': 9800, 'Cohort C': 2290 },
  { month: 'Apr', 'Cohort A': 2780, 'Cohort B': 3908, 'Cohort C': 2000 },
  { month: 'May', 'Cohort A': 1890, 'Cohort B': 4800, 'Cohort C': 2181 },
  { month: 'Jun', 'Cohort A': 2390, 'Cohort B': 3800, 'Cohort C': 2500 },
];

export default function Performance() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Performance Analytics</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Advanced recovery metrics and cohort analysis.</p>
        </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        
        {/* Payment Method Chart */}
        <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-md border border-white/40 dark:border-gray-700/50 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <PieChart className="w-5 h-5 text-blue-500" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recovery by Payment Method</h2>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paymentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '0.5rem', color: '#F3F4F6' }}
                  itemStyle={{ color: '#F3F4F6' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="recovered" name="Recovered" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={30} />
                <Bar dataKey="failed" name="Failed (Lost)" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cohort Analysis Chart */}
        <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-md border border-white/40 dark:border-gray-700/50 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Activity className="w-5 h-5 text-purple-500" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Cohort Recovery Trajectory</h2>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cohortData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorB" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '0.5rem', color: '#F3F4F6' }}
                  itemStyle={{ color: '#F3F4F6' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="Cohort A" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorA)" />
                <Area type="monotone" dataKey="Cohort B" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorB)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
