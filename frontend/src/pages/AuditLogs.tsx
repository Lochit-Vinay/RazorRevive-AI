import { FileText, ShieldAlert, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return `${seconds} secs ago`;
  if (minutes < 60) return `${minutes} mins ago`;
  if (hours < 24) return `${hours} hours ago`;
  return `${days} days ago`;
}

const renderMetadata = (log: any) => {
  if (!log.metadata) return <span className="text-gray-500 italic text-xs">System event</span>;
  try {
    const data = JSON.parse(log.metadata);
    
    // AI Analysis Payload
    if (data.rootCause) {
      return (
        <div className="space-y-1 text-xs">
          <div><span className="font-semibold text-gray-800 dark:text-gray-300">ROOT CAUSE:</span> <span className="text-blue-600 dark:text-blue-400 font-medium">{data.rootCause.replace(/_/g, ' ')}</span></div>
          <div><span className="font-semibold text-gray-800 dark:text-gray-300">CONFIDENCE:</span> {Math.round(data.confidence * 100)}% | <span className="font-semibold text-gray-800 dark:text-gray-300">RECOVERABILITY:</span> {data.recoverability}</div>
          <div><span className="font-semibold text-gray-800 dark:text-gray-300">ACTION:</span> <span className="text-purple-600 dark:text-purple-400 font-medium">{data.recommendedAction}</span></div>
          <div className="text-gray-500 dark:text-gray-400 italic truncate max-w-sm" title={data.reason}>"{data.reason}"</div>
        </div>
      );
    }
    
    // Recovery Action Payload
    if (data.actionType || data.actionId) {
      return (
        <div className="space-y-1 text-xs">
          {data.actionType && <div><span className="font-semibold text-gray-800 dark:text-gray-300">EXECUTED:</span> <span className="text-green-600 dark:text-green-400 font-medium">{data.actionType}</span></div>}
          {data.amount && <div><span className="font-semibold text-gray-800 dark:text-gray-300">AMOUNT:</span> ₹{data.amount}</div>}
          {data.outcome && <div><span className="font-semibold text-gray-800 dark:text-gray-300">OUTCOME:</span> {data.outcome}</div>}
        </div>
      );
    }

    // Generic JSON Fallback
    return (
      <div className="space-y-1 text-xs">
        {Object.entries(data).filter(([k]) => k !== 'id' && k !== 'recoveryCaseId' && k !== 'createdAt' && k !== 'idempotencyKey').map(([k, v]) => (
          <div key={k}><span className="font-semibold text-gray-800 dark:text-gray-300 uppercase">{k}:</span> {String(v)}</div>
        ))}
      </div>
    );
  } catch (e) {
    return <span className="text-xs text-gray-500">{log.metadata}</span>;
  }
};

export default function AuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/dashboard/audit-logs');
        setLogs(response.data);
      } catch (error) {
        console.error('Failed to fetch audit logs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const getStatusIcon = (eventType: string) => {
    if (eventType.includes('GUARDRAIL') || eventType.includes('BLOCKED')) return <ShieldAlert className="w-4 h-4 mr-2 text-red-500" />;
    if (eventType.includes('SUCCESS') || eventType.includes('EXECUTED')) return <CheckCircle className="w-4 h-4 mr-2 text-green-500" />;
    if (eventType.includes('FAILED')) return <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500" />;
    return <FileText className="w-4 h-4 mr-2 text-blue-500" />;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Audit Logs</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Immutable record of all system, AI, and human actions.</p>
      </div>

      <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-md border border-white/40 dark:border-gray-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 font-medium">Timestamp</th>
                <th className="px-6 py-4 font-medium">Action</th>
                <th className="px-6 py-4 font-medium">Actor</th>
                <th className="px-6 py-4 font-medium">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">Loading audit logs...</td>
                </tr>
              ) : logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400 flex items-center">
                    <Clock className="w-4 h-4 mr-2" /> {timeAgo(log.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(log.eventType)}
                      <span className="font-medium text-gray-900 dark:text-white">{log.eventType.replace(/_/g, ' ')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                    {log.actor}
                  </td>
                  <td className="px-6 py-4">
                    {renderMetadata(log)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
