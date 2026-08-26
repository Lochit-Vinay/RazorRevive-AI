import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CasesList from './pages/CasesList';
import CaseDetails from './pages/CaseDetails';
import { LayoutDashboard, AlertTriangle } from 'lucide-react';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-razorpay-blue text-white shadow-xl flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold tracking-tight">AI Recovery Agent</h1>
          <p className="text-sm text-gray-400 mt-1">Razorpay Buildathon 2026</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
            <LayoutDashboard className="w-5 h-5 text-gray-300" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link to="/cases" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
            <AlertTriangle className="w-5 h-5 text-gray-300" />
            <span className="font-medium">Recovery Cases</span>
          </Link>
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
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/cases" element={<CasesList />} />
          <Route path="/cases/:id" element={<CaseDetails />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
