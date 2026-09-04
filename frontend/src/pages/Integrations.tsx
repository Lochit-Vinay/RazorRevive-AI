import { Zap, Mail, MessageSquare, Webhook, CheckCircle2 } from 'lucide-react';

export default function Integrations() {
  const integrations = [
    { name: 'Razorpay Payment Gateway', desc: 'Core payment processing and failure webhooks.', icon: Zap, status: 'connected', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'SendGrid', desc: 'Automated email recovery campaigns.', icon: Mail, status: 'connected', color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { name: 'Twilio SMS', desc: 'SMS-based payment reminders.', icon: MessageSquare, status: 'disconnected', color: 'text-green-500', bg: 'bg-green-500/10' },
    { name: 'Custom Webhooks', desc: 'Export recovery events to internal systems.', icon: Webhook, status: 'disconnected', color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Integrations</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Connect your tools to enable multi-channel recovery workflows.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {integrations.map((integration, idx) => (
          <div key={idx} className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-md border border-white/40 dark:border-gray-700/50 p-6 flex items-start space-x-4 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <div className={`p-3 rounded-xl ${integration.bg} ${integration.color}`}>
              <integration.icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{integration.name}</h3>
                {integration.status === 'connected' ? (
                  <span className="flex items-center text-xs font-bold text-green-500 bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Connected
                  </span>
                ) : (
                  <button className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    Connect
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{integration.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
