
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CasesList from './pages/CasesList';
import CaseDetails from './pages/CaseDetails';
import Performance from './pages/Performance';
import AuditLogs from './pages/AuditLogs';
import SettingsPage from './pages/Settings';
import { LayoutDashboard, AlertTriangle, Moon, Sun, Settings, BarChart3, FileText, Bell, Users, Zap, LogOut } from 'lucide-react';
import { ToastProvider } from './components/ui/ToastContext';
import { ThemeProvider, useTheme } from './components/ui/ThemeContext';
import { AuthProvider, useAuth } from './components/ui/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

function Layout({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex font-sans selection:bg-razorpay-primary selection:text-white transition-colors duration-300">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gradient-to-b dark:from-gray-900/95 dark:to-[#02042b]/95 backdrop-blur-xl text-gray-900 dark:text-white shadow-2xl flex flex-col z-10 border-r border-gray-200 dark:border-white/5 relative overflow-hidden transition-colors duration-300">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-blue-500/10 blur-[50px] -z-10 pointer-events-none"></div>
        <div className="px-5 py-6 border-b border-gray-200 dark:border-white/10 flex items-center space-x-3">
          <img src="/logo.png" alt="Project Logo" className="w-12 h-12 object-contain rounded-xl shadow-sm dark:shadow-lg shrink-0" />
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 whitespace-nowrap truncate">RazorRevive AI</h1>
            <p className="text-[9px] text-gray-500 dark:text-gray-400 mt-0.5 font-medium tracking-wider uppercase leading-tight truncate">Recovery Agent</p>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1.5">
          <Link to="/" className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-all duration-300 group dark:hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <LayoutDashboard className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            <span className="font-medium text-sm">Dashboard</span>
          </Link>
          <Link to="/cases" className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-white transition-all duration-300 group dark:hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <AlertTriangle className="w-5 h-5 text-gray-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors" />
            <span className="font-medium text-sm">Recovery Cases</span>
          </Link>
          <div className="pt-4 pb-2">
            <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Analytics & Data</p>
          </div>
          <Link to="/performance" className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-white transition-all duration-300 group dark:hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <BarChart3 className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
            <span className="font-medium text-sm">Performance</span>
          </Link>
          <Link to="/audit-logs" className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-white transition-all duration-300 group dark:hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <FileText className="w-5 h-5 text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
            <span className="font-medium text-sm">Audit Logs</span>
          </Link>
          <div className="pt-4 pb-2">
            <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Configuration</p>
          </div>
          <Link to="/settings" className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300 group dark:hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <Settings className="w-5 h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors" />
            <span className="font-medium text-sm">Settings</span>
          </Link>
          
          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-white/5 space-y-2">
            <button
              onClick={toggleTheme}
              className="flex items-center justify-between px-4 py-3 w-full rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-300 group border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-black/20"
            >
              <div className="flex items-center space-x-3">
                {theme === 'dark' ? <Sun className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition-colors" /> : <Moon className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />}
                <span className="font-medium text-sm">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </div>
            </button>
            <button
              onClick={logout}
              className="flex items-center justify-between px-4 py-3 w-full rounded-xl hover:bg-red-100 dark:hover:bg-white/10 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-all duration-300 group border border-red-100 dark:border-white/5 bg-red-50 dark:bg-red-500/10"
            >
              <div className="flex items-center space-x-3">
                <LogOut className="w-5 h-5 text-red-500 dark:text-red-400 group-hover:text-red-600 dark:group-hover:text-red-300 transition-colors" />
                <span className="font-medium text-sm">Log Out</span>
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
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="*" element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/cases" element={<CasesList />} />
                      <Route path="/cases/:id" element={<CaseDetails />} />
                      <Route path="/performance" element={<Performance />} />
                      <Route path="/audit-logs" element={<AuditLogs />} />
                      <Route path="/settings" element={<SettingsPage />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              } />
            </Routes>
          </AuthProvider>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
