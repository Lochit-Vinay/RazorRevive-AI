import { Settings as SettingsIcon, Save, Shield, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '../components/ui/ToastContext';

export default function Settings() {
  const { success } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate an API call
    setTimeout(() => {
      setIsSaving(false);
      success('Successfully Saved', 'Your settings have been updated.');
    }, 800);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure your AI Recovery Agent preferences.</p>
      </div>

      <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-md border border-white/40 dark:border-gray-700/50 p-8 space-y-8 mt-6">
        
        {/* Agent Settings */}
        <section>
          <div className="flex items-center space-x-2 mb-4">
            <SettingsIcon className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">AI Agent Behavior</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-700">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white text-sm">Autonomous Execution</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Allow the agent to execute safe recoveries without human approval.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </section>

        {/* Guardrail Settings */}
        <section>
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Guardrails & Safety</h2>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-700">
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Global Cooldown Period (Minutes)</label>
              <input type="number" defaultValue={30} className="w-full md:w-1/3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5" />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Minimum time between recovery attempts for a single customer.</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-700">
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Escalation Threshold (₹)</label>
              <input type="number" defaultValue={50000} className="w-full md:w-1/3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5" />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Any failure above this amount will require mandatory human approval.</p>
            </div>
          </div>
        </section>

        <div className="pt-4 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-medium rounded-lg text-sm transition-colors"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
