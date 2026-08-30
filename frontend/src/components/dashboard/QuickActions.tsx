
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
      <div className="space-y-3">
        <button
          onClick={onSimulate}
          disabled={simulating}
          className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 group transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center text-sm font-medium text-gray-700 group-hover:text-blue-700">
            <PlayCircle className="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-600" />
            {simulating ? 'Running...' : 'Run Simulation'}
          </div>
        </button>

        <Link
          to="/cases"
          className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-orange-500 hover:bg-orange-50 group transition-all"
        >
          <div className="flex items-center text-sm font-medium text-gray-700 group-hover:text-orange-700">
            <AlertTriangle className="w-5 h-5 mr-3 text-gray-400 group-hover:text-orange-600" />
            View Recovery Cases
          </div>
        </Link>

        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-green-500 hover:bg-green-50 group transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center text-sm font-medium text-gray-700 group-hover:text-green-700">
            <RefreshCw className={`w-5 h-5 mr-3 text-gray-400 group-hover:text-green-600 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh Dashboard'}
          </div>
        </button>
      </div>
    </div>
  );
}
