
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CasesList from './pages/CasesList';
import CaseDetails from './pages/CaseDetails';
import Performance from './pages/Performance';
import AuditLogs from './pages/AuditLogs';
import Integrations from './pages/Integrations';
import TeamMembers from './pages/TeamMembers';
import SettingsPage from './pages/Settings';
import { LayoutDashboard, AlertTriangle, Moon, Sun, Settings, BarChart3, FileText, Bell, Users, Zap } from 'lucide-react';
import { ToastProvider } from './components/ui/ToastContext';
import { ThemeProvider, useTheme } from './components/ui/ThemeContext';

function Layout({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex font-sans selection:bg-razorpay-primary selection:text-white transition-colors duration-300">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-gray-900/95 to-[#02042b]/95 backdrop-blur-xl text-white shadow-2xl flex flex-col z-10 border-r border-white/5 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-blue-500/10 blur-[50px] -z-10 pointer-events-none"></div>
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">RazorRevive AI</h1>
          <p className="text-xs text-gray-400 mt-1.5 font-medium tracking-wide uppercase">Razorpay Buildathon 2026</p>
        </div>
        <nav className="flex-1 p-4 space-y-1.5">
          <Link to="/" className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition-all duration-300 group hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <LayoutDashboard className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
            <span className="font-medium text-sm">Dashboard</span>
          </Link>
          <Link to="/cases" className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition-all duration-300 group hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <AlertTriangle className="w-5 h-5 text-gray-400 group-hover:text-amber-400 transition-colors" />
            <span className="font-medium text-sm">Recovery Cases</span>
          </Link>
          <div className="pt-4 pb-2">
            <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Analytics & Data</p>
          </div>
          <Link to="/performance" className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition-all duration-300 group">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-5 h-5 text-gray-400 group-hover:text-emerald-400 transition-colors" />
              <span className="font-medium text-sm">Performance</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold">PRO</span>
          </Link>
          <Link to="/audit-logs" className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition-all duration-300 group">
            <FileText className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
            <span className="font-medium text-sm">Audit Logs</span>
          </Link>
          <div className="pt-4 pb-2">
            <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Configuration</p>
          </div>
          <Link to="/integrations" className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition-all duration-300 group">
            <Zap className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition-colors" />
            <span className="font-medium text-sm">Integrations</span>
          </Link>
          <Link to="/team" className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition-all duration-300 group">
            <Users className="w-5 h-5 text-gray-400 group-hover:text-pink-400 transition-colors" />
            <span className="font-medium text-sm">Team Members</span>
          </Link>
          <Link to="/settings" className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition-all duration-300 group">
            <Settings className="w-5 h-5 text-gray-400 group-hover:text-gray-200 transition-colors" />
            <span className="font-medium text-sm">Settings</span>
          </Link>
          
          <div className="mt-auto pt-8">
            <button
              onClick={toggleTheme}
              className="flex items-center justify-between px-4 py-3 w-full rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-300 group border border-white/5 bg-black/20"
            >
              <div className="flex items-center space-x-3">
                {theme === 'dark' ? <Sun className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition-colors" /> : <Moon className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />}
                <span className="font-medium text-sm">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </div>
            </button>
          </div>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
          <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/cases" element={<CasesList />} />
            <Route path="/cases/:id" element={<CaseDetails />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/audit-logs" element={<AuditLogs />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/team" element={<TeamMembers />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Layout>
      </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
