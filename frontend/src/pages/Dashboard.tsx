import { useEffect, useState, useCallback } from 'react';
import api from '../lib/api';
import type { DashboardMetrics } from '../types/dashboard';

import DashboardHeader from '../components/dashboard/DashboardHeader';
import KPIGrid from '../components/dashboard/KPIGrid';
import RecoveryFunnel from '../components/dashboard/RecoveryFunnel';
import OutcomeChart from '../components/dashboard/OutcomeChart';
import FailureReasons from '../components/dashboard/FailureReasons';
import TopCases from '../components/dashboard/TopCases';
import RecentActivity from '../components/dashboard/RecentActivity';
import QuickActions from '../components/dashboard/QuickActions';

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [timeRange, setTimeRange] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchMetrics = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    setError(null);
    try {
      const res = await api.get(`/dashboard/metrics?range=${timeRange}`);
      setMetrics(res.data);
      setLastUpdated(new Date());
    } catch (e: any) {
      console.error(e);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [timeRange]);

  useEffect(() => {
    setLoading(true);
    fetchMetrics();
    const interval = setInterval(() => fetchMetrics(false), 15000); // Poll every 15s
    return () => clearInterval(interval);
  }, [fetchMetrics]);

  const [simMessage, setSimMessage] = useState<string | null>(null);

  const runSimulation = async () => {
    setSimulating(true);
    setSimMessage(null);
    try {
      const resp = await api.post('/recovery/simulation/run');
      await fetchMetrics(true);
      if (resp.data.message) {
        setSimMessage(resp.data.message);
        setTimeout(() => setSimMessage(null), 5000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSimulating(false);
    }
  };

  if (loading && !metrics) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-8 animate-pulse">
        <div className="h-20 bg-gray-200 rounded-xl w-full"></div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[1,2,3,4,5].map(i => <div key={i} className="h-32 bg-gray-200 rounded-xl w-full"></div>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-gray-200 rounded-xl w-full"></div>
          <div className="h-80 bg-gray-200 rounded-xl w-full"></div>
        </div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[50vh]">
        <p className="text-red-500 font-medium mb-4">{error}</p>
        <button onClick={() => fetchMetrics(true)} className="px-4 py-2 bg-gray-900 text-white rounded-lg">Retry</button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      
      {simMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg shadow-sm flex items-center mb-6">
          <span className="font-medium">{simMessage}</span>
        </div>
      )}

      <DashboardHeader 
        timeRange={timeRange} 
        setTimeRange={setTimeRange} 
        onRefresh={() => fetchMetrics(true)}
        onSimulate={runSimulation}
        lastUpdated={lastUpdated}
        simulating={simulating}
        refreshing={refreshing}
      />

      <KPIGrid current={metrics.current} previous={metrics.previous} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OutcomeChart current={metrics.current} />
        <RecoveryFunnel data={metrics.funnel} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TopCases cases={metrics.topCases} />
          <FailureReasons reasons={metrics.failureReasons} />
        </div>
        
        <div className="space-y-6">
          <QuickActions 
            onRefresh={() => fetchMetrics(true)} 
            onSimulate={runSimulation} 
            simulating={simulating} 
            refreshing={refreshing} 
          />
          <RecentActivity activities={metrics.recentActivity} />
        </div>
      </div>

    </div>
  );
}
