import { useEffect, useState, useCallback } from 'react';
import api from '../lib/api';
import type { DashboardMetrics } from '../types/dashboard';
import { useToast } from '../components/ui/ToastContext';

import DashboardHeader from '../components/dashboard/DashboardHeader';
import KPIGrid from '../components/dashboard/KPIGrid';
import RecoveryFunnel from '../components/dashboard/RecoveryFunnel';
import OutcomeChart from '../components/dashboard/OutcomeChart';
import FailureReasons from '../components/dashboard/FailureReasons';
import TopCases from '../components/dashboard/TopCases';
import RecentActivity from '../components/dashboard/RecentActivity';
import QuickActions from '../components/dashboard/QuickActions';

export default function Dashboard() {
  const { success, error: showError } = useToast();
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
      if (isRefresh) {
        success('Dashboard Refreshed', 'Latest data has been loaded successfully.');
      }
    } catch (e: any) {
      console.error(e);
      setError('Failed to load dashboard data. Please try again.');
      if (isRefresh) showError('Refresh Failed', 'Could not fetch latest metrics.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [timeRange, success, showError]);

  useEffect(() => {
    setLoading(true);
    fetchMetrics();
    const interval = setInterval(() => fetchMetrics(false), 15000); // Poll every 15s
    return () => clearInterval(interval);
  }, [fetchMetrics]);

  const runSimulation = async () => {
    setSimulating(true);
    try {
      const resp = await api.post('/recovery/simulation/run');
      await fetchMetrics(true);
      if (resp.data.message) {
        success('Simulation Complete', resp.data.message);
      }
    } catch (e) {
      console.error(e);
      showError('Simulation Failed', 'Could not run batch simulation.');
    } finally {
      setSimulating(false);
    }
  };

  if (loading && !metrics) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-8 animate-pulse">
        <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded-xl w-full"></div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[1,2,3,4,5].map(i => <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl w-full"></div>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-gray-200 dark:bg-gray-800 rounded-xl w-full"></div>
          <div className="h-80 bg-gray-200 dark:bg-gray-800 rounded-xl w-full"></div>
        </div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[50vh] animate-in fade-in">
        <p className="text-red-500 font-medium mb-4">{error}</p>
        <button onClick={() => fetchMetrics(true)} className="px-6 py-2.5 bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-200 text-white dark:text-gray-900 font-medium rounded-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">Retry connection</button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      
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
