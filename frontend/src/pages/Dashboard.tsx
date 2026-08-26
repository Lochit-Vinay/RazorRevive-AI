import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import { IndianRupee, Activity, ShieldCheck, AlertCircle, PlayCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [simulating, setSimulating] = useState(false);

  const fetchMetrics = async () => {
    try {
      const res = await api.get('/dashboard/metrics');
      setMetrics(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  const runSimulation = async () => {
    setSimulating(true);
    try {
      await api.post('/recovery/simulation/run');
      await fetchMetrics();
    } catch (e) {
      console.error(e);
    } finally {
      setSimulating(false);
    }
  };

  if (!metrics) return <div className="p-8 flex justify-center"><div className="animate-pulse w-8 h-8 rounded-full bg-razorpay-primary"></div></div>;

  const formatCurrency = (val: number) => `₹${val.toLocaleString('en-IN')}`;

  const chartData = [
    { name: 'Revenue at Risk', value: metrics.revenueAtRisk },
    { name: 'Revenue Recovered', value: metrics.revenueRecovered }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Overview</h2>
          <p className="text-gray-500 mt-1">Monitor revenue at risk and recovery outcomes.</p>
        </div>
        <button
          onClick={runSimulation}
          disabled={simulating}
          className="flex items-center space-x-2 bg-razorpay-primary hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow-sm font-medium transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <PlayCircle className="w-5 h-5" />
          <span>{simulating ? 'Running Batch Simulation...' : 'Run Recovery Simulation'}</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start space-x-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-lg"><IndianRupee className="w-6 h-6" /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Revenue at Risk</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(metrics.revenueAtRisk)}</h3>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start space-x-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg"><IndianRupee className="w-6 h-6" /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Revenue Recovered</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(metrics.revenueRecovered)}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Activity className="w-6 h-6" /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Recovery Rate</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{metrics.recoveryRate.toFixed(1)}%</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start space-x-4">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-lg"><AlertCircle className="w-6 h-6" /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Human Escalations</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{metrics.escalations}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue Impact</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 13 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 13 }} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip cursor={{ fill: '#f9fafb' }} formatter={(val: number) => [formatCurrency(val), 'Amount']} />
                <Bar dataKey="value" fill="var(--color-razorpay-primary)" radius={[4, 4, 0, 0]} barSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stats List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
          <h3 className="text-lg font-bold text-gray-900">System Activity</h3>
          
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-gray-600 font-medium">Recovery Attempts</span>
            </div>
            <span className="font-bold text-gray-900">{metrics.recoveryAttempts}</span>
          </div>
          
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-gray-600 font-medium">Successful Recoveries</span>
            </div>
            <span className="font-bold text-gray-900">{metrics.successfulRecoveries}</span>
          </div>

          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span className="text-gray-600 font-medium">Guardrail Blocks</span>
            </div>
            <span className="font-bold text-gray-900">{metrics.guardrailBlocks}</span>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg flex items-start space-x-3 border border-gray-100">
            <ShieldCheck className="w-5 h-5 text-gray-400 shrink-0" />
            <p className="text-xs text-gray-500">All actions are bound by deterministic guardrails. AI only recommends.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
