import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../components/ui/AuthContext';
import { Shield, Lock, Mail, Loader2, AlertCircle, TrendingUp, CheckCircle2, Zap } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        email,
        password,
      });

      login(response.data.token, response.data.admin);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-900 font-sans selection:bg-blue-500 selection:text-white">
      
      {/* Left Panel - Immersive Branding */}
      <div className="hidden lg:flex lg:w-[55%] relative flex-col justify-between overflow-hidden bg-[#02042b] p-12 border-r border-white/5">
        
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/30 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute top-1/3 -right-20 w-80 h-80 bg-purple-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute -bottom-40 left-1/4 w-[30rem] h-[30rem] bg-indigo-600/20 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '4s' }}></div>
          
          {/* Subtle Grid overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgwem0yMCAyMGgyMHYyMEgyMHoiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiIvPjwvc3ZnPg==')] opacity-30 mix-blend-overlay"></div>
        </div>

        {/* Top Header - Logo */}
        <div className="relative z-10 flex items-center space-x-4">
          <img src="/logo.png" alt="RazorRevive AI Logo" className="w-16 h-16 object-contain rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.3)]" />
          <div>
            <h1 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
              RazorRevive AI
            </h1>
            <p className="text-xs font-bold text-blue-400 tracking-widest uppercase mt-1">Buildathon Edition</p>
          </div>
        </div>

        {/* Main Value Prop */}
        <div className="relative z-10 max-w-lg mt-20">
          <h2 className="text-5xl font-extrabold text-white leading-[1.1] tracking-tight mb-6">
            Autonomous <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Revenue Recovery</span>
          </h2>
          <p className="text-lg text-gray-400 leading-relaxed font-light">
            Empower your payment stack with an intelligent agent that automatically analyzes, orchestrates, and resolves failed transactions with human-like precision.
          </p>

          {/* Floating Feature Cards */}
          <div className="mt-12 grid grid-cols-2 gap-4">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-2xl hover:bg-white/10 transition-colors duration-300">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-white">42.8%</p>
              <p className="text-sm text-gray-400 mt-1">Average Win-Back Rate</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-2xl hover:bg-white/10 transition-colors duration-300">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-2xl font-bold text-white">&lt; 200ms</p>
              <p className="text-sm text-gray-400 mt-1">Decision Engine Latency</p>
            </div>
          </div>
        </div>

        {/* Bottom Proof */}
        <div className="relative z-10 flex items-center space-x-3 text-sm text-gray-500 mt-20">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <span>System running smoothly. All services operational.</span>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center items-center p-8 sm:p-12 bg-gray-900 relative">
        
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="lg:hidden flex flex-col items-center mb-12">
          <img src="/logo.png" alt="RazorRevive AI Logo" className="w-20 h-20 object-contain rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.3)] mb-4" />
          <h1 className="text-3xl font-black tracking-tight text-white">RazorRevive AI</h1>
        </div>

        <div className="w-full max-w-md">
          <div className="text-center lg:text-left mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-400">Sign in to the Admin Dashboard to continue.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {error && (
              <div className="rounded-xl bg-red-500/10 p-4 flex items-start border border-red-500/20 animate-in slide-in-from-top-2">
                <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                <div className="ml-3 text-sm text-red-200 font-medium">
                  {error}
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 ml-1">
                Admin Email
              </label>
              <div className="relative rounded-xl shadow-sm group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-400">
                  <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-white placeholder-gray-500 transition-all duration-300"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 ml-1">
                Password
              </label>
              <div className="relative rounded-xl shadow-sm group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-white placeholder-gray-500 transition-all duration-300"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-800 transition-colors"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                  Remember me
                </label>
              </div>

              <a href="#" className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
                Forgot password?
              </a>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.2)] text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span className="flex items-center">
                    Authenticate Securely
                    <Shield className="ml-2 w-4 h-4" />
                  </span>
                )}
              </button>
            </div>
            
            <p className="text-center text-xs text-gray-600 pt-6">
              Protected by Razorpay Buildathon Security Policies.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
