import { BarChart3, TrendingUp, TrendingDown, Activity, PieChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, AreaChart, Area } from 'recharts';
import { useState, useEffect } from 'react';
import api from '../lib/api';

export default function Performance() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const response = await api.get('/dashboard/performance');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch performance metrics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPerformance();
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="flex flex-col items-center text-gray-500 dark:text-gray-400">
          <Activity className="w-8 h-8 animate-pulse mb-4" />
          <p>Loading performance analytics...</p>
        </div>
      </div>
    );
  }

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
          { title: 'Win-Back Rate', value: data.kpis.winBackRate, trend: data.kpis.winBackTrend, up: true, icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-500/10' },
          { title: 'Avg Time to Recover', value: data.kpis.avgTime, trend: data.kpis.avgTimeTrend, up: true, icon: Activity, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { title: 'Churn Risk', value: data.kpis.churnRisk, trend: data.kpis.churnRiskTrend, up: false, icon: TrendingDown, color: 'text-purple-500', bg: 'bg-purple-500/10' },
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
              <BarChart data={data.paymentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
              <AreaChart data={data.cohortData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorB" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorC" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
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
                <Area type="monotone" dataKey="High Confidence" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorA)" />
                <Area type="monotone" dataKey="Medium Confidence" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorB)" />
                <Area type="monotone" dataKey="Low Confidence" stroke="#F59E0B" strokeWidth={3} fillOpacity={1} fill="url(#colorC)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
