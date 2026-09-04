import { FileText, ShieldAlert, CheckCircle, Clock } from 'lucide-react';

export default function AuditLogs() {
  const logs = [
    { id: 'log-1', action: 'Guardrail Override', user: 'System (Cooldown)', time: '2 mins ago', status: 'blocked', desc: 'Blocked duplicate execution for Case #49. 30min cooldown active.' },
    { id: 'log-2', action: 'Simulation Run', user: 'Lochit Vinay', time: '1 hour ago', status: 'success', desc: 'Triggered batch simulation for 30 mock cases.' },
    { id: 'log-3', action: 'Recovery Attempt', user: 'RazorRevive Agent', time: '2 hours ago', status: 'success', desc: 'Executed automated email sequence for Case #22.' },
    { id: 'log-4', action: 'AI Recommendation', user: 'AI Engine', time: '5 hours ago', status: 'info', desc: 'Classified Case #18 as HIGH RISK (Insufficient Funds).' },
  ];

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
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400 flex items-center">
                    <Clock className="w-4 h-4 mr-2" /> {log.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {log.status === 'blocked' && <ShieldAlert className="w-4 h-4 mr-2 text-red-500" />}
                      {log.status === 'success' && <CheckCircle className="w-4 h-4 mr-2 text-green-500" />}
                      {log.status === 'info' && <FileText className="w-4 h-4 mr-2 text-blue-500" />}
                      <span className="font-medium text-gray-900 dark:text-white">{log.action}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                    {log.user}
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                    {log.desc}
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
