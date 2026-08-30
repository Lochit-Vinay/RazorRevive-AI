
import { Link } from 'react-router-dom';
import { PlayCircle, AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  onRefresh: () => void;
  onSimulate: () => void;
  simulating: boolean;
  refreshing: boolean;
}

export default function QuickActions({ onRefresh, onSimulate, simulating, refreshing }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
      <div className="space-y-3">
        <button
          onClick={onSimulate}
          disabled={simulating}
          className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 group transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-700 dark:group-hover:text-blue-400">
            <PlayCircle className="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
            {simulating ? 'Running...' : 'Run Simulation'}
          </div>
        </button>

        <Link
          to="/cases"
          className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/30 group transition-all"
        >
          <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-orange-700 dark:group-hover:text-orange-400">
            <AlertTriangle className="w-5 h-5 mr-3 text-gray-400 group-hover:text-orange-600 dark:group-hover:text-orange-400" />
            View Recovery Cases
          </div>
        </Link>

        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 group transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-green-700 dark:group-hover:text-green-400">
            <RefreshCw className={`w-5 h-5 mr-3 text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh Dashboard'}
          </div>
        </button>
      </div>
    </div>
  );
}
