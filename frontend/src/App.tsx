
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CasesList from './pages/CasesList';
import CaseDetails from './pages/CaseDetails';
import { LayoutDashboard, AlertTriangle, Moon, Sun } from 'lucide-react';
import { ToastProvider } from './components/ui/ToastContext';
import { ThemeProvider, useTheme } from './components/ui/ThemeContext';

function Layout({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex font-sans selection:bg-razorpay-primary selection:text-white transition-colors duration-300">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-gray-900 to-[#02042b] text-white shadow-2xl flex flex-col z-10 border-r border-gray-800/50">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">AI Recovery Agent</h1>
          <p className="text-xs text-gray-400 mt-1.5 font-medium tracking-wide uppercase">Razorpay Buildathon 2026</p>
        </div>
        <nav className="flex-1 p-4 space-y-1.5">
          <Link to="/" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-all duration-200 group">
            <LayoutDashboard className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            <span className="font-medium text-sm">Dashboard</span>
          </Link>
          <Link to="/cases" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-all duration-200 group">
            <AlertTriangle className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            <span className="font-medium text-sm">Recovery Cases</span>
          </Link>
          <button
            onClick={toggleTheme}
            className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200 group"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" /> : <Moon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />}
            <span className="font-medium text-sm">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
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
          </Routes>
        </Layout>
      </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
