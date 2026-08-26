import React from 'react';
import { PlayCircle, RefreshCw } from 'lucide-react';

interface Props {
  timeRange: string;
  setTimeRange: (val: string) => void;
  onRefresh: () => void;
  onSimulate: () => void;
  lastUpdated: Date | null;
  simulating: boolean;
  refreshing: boolean;
}

export default function DashboardHeader({
  timeRange,
  setTimeRange,
  onRefresh,
  onSimulate,
  lastUpdated,
  simulating,
  refreshing
}: Props) {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Revenue Recovery Overview</h2>
        <p className="text-gray-500 mt-1 max-w-2xl text-sm">
          Monitor the end-to-end payment recovery pipeline: failures detected, AI recommendations, deterministic guardrail decisions, and total revenue recovered.
        </p>
      </div>
      
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
          {['24h', '7d', '30d', 'all'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                timeRange === range 
                  ? 'bg-gray-100 text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {range === 'all' ? 'All Time' : range.toUpperCase()}
            </button>
          ))}
        </div>

        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="flex items-center justify-center p-2.5 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm disabled:opacity-50"
          title="Refresh Data"
        >
          <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
        </button>

        <button
          onClick={onSimulate}
          disabled={simulating}
          className="flex items-center space-x-2 bg-razorpay-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow-sm font-medium transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <PlayCircle className="w-5 h-5" />
          <span>{simulating ? 'Simulating...' : 'Run Simulation'}</span>
        </button>
      </div>
      
      {/* Last Updated - Absolute positioning on desktop or flow on mobile */}
      {lastUpdated && (
        <div className="w-full text-right text-xs text-gray-400 mt-1 md:absolute md:top-6 md:right-8">
          Last updated: {Math.floor((new Date().getTime() - lastUpdated.getTime()) / 1000)}s ago
        </div>
      )}
    </div>
  );
}
