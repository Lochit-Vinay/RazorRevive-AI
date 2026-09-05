import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../components/ui/AuthContext';
import { Shield, Lock, Mail, Loader2, AlertCircle, TrendingUp, CheckCircle2, Zap, BrainCircuit, Activity, Database, Cpu, ArrowRight, ArrowDown, BarChart3, Coins, Network, Users } from 'lucide-react';

function FadeInScroll({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`
      }}
    >
      {children}
    </div>
  );
}

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
    <div className="flex flex-col bg-gray-900 font-sans selection:bg-blue-500 selection:text-white">
      
      {/* Hero / Login Section */}
      <div className="min-h-screen flex w-full">
      {/* Left Panel - Immersive Branding */}
      <div className="hidden lg:flex lg:w-[55%] relative flex-col justify-between overflow-hidden bg-[#02042b] p-12 border-r border-white/5">
        
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[30rem] h-[30rem] bg-blue-600/40 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute top-1/4 -right-20 w-96 h-96 bg-purple-600/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute -bottom-40 left-1/4 w-[40rem] h-[40rem] bg-indigo-600/30 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '4s' }}></div>
          
          {/* Subtle Grid overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgwem0yMCAyMGgyMHYyMEgyMHoiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-40 mix-blend-overlay"></div>
        </div>

        {/* Top Header - Logo */}
        <div className="relative z-10 flex items-center space-x-4">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
            <img src="/logo.png" alt="RazorRevive AI Logo" className="relative w-16 h-16 object-contain rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.5)] border border-white/10" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-blue-100 to-gray-400">
              RazorRevive AI
            </h1>
            <p className="text-xs font-bold text-blue-400 tracking-widest uppercase mt-1">Buildathon Edition</p>
          </div>
        </div>

        {/* Main Value Prop */}
        <div className="relative z-10 max-w-lg mt-20">
          <h2 className="text-6xl font-extrabold text-white leading-[1.1] tracking-tight mb-6">
            Autonomous <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Revenue Recovery</span>
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed font-light">
            Empower your payment stack with an intelligent agent that automatically analyzes, orchestrates, and resolves failed transactions with human-like precision.
          </p>

          {/* Floating Feature Cards */}
          <div className="mt-12 grid grid-cols-1 gap-4">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-2xl hover:bg-white/10 transition-colors duration-300 flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">Intelligent AI Inference</p>
                <p className="text-sm text-gray-400 mt-1 leading-relaxed">Lightning-fast reasoning engine to parse failure contexts and recommend optimal recovery actions.</p>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-2xl hover:bg-white/10 transition-colors duration-300 flex items-start space-x-4">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">Automated Safety Guardrails</p>
                <p className="text-sm text-gray-400 mt-1 leading-relaxed">Deterministic rule engine ensuring 100% idempotent executions, strict cooldowns, and secure fallback mechanisms.</p>
              </div>
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
      <div className="w-full lg:w-[45%] flex flex-col justify-center items-center p-8 sm:p-12 bg-[#050914] relative overflow-hidden">
        
        {/* Right Side Immersive Glows */}
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDIiLz4KPHBhdGggZD0iTTAgMEw4IDhaTTAgOEw4IDBaIiBzdHJva2U9IiNmZmYiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz4KPC9zdmc+')] opacity-20 pointer-events-none mix-blend-overlay"></div>

        {/* Mobile Header (Hidden on Desktop) */}
        <div className="lg:hidden flex flex-col items-center mb-12 relative z-10">
          <div className="relative">
             <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
             <img src="/logo.png" alt="RazorRevive AI Logo" className="relative w-20 h-20 object-contain rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.5)] border border-white/10 mb-4" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400">RazorRevive AI</h1>
        </div>

        <div className="w-full max-w-md relative z-20">
          <div className="bg-gray-900/60 backdrop-blur-3xl border border-gray-700/50 rounded-3xl p-8 sm:p-10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)] ring-1 ring-white/5 relative overflow-hidden">
            {/* Subtle inner highlight */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            
            <div className="text-center lg:text-left mb-10 relative z-10">
              <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-gray-400">Sign in to the Admin Dashboard to continue.</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              
              {error && (
                <div className="rounded-xl bg-red-500/10 p-4 flex items-start border border-red-500/30 animate-in slide-in-from-top-2">
                  <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                  <div className="ml-3 text-sm text-red-200 font-medium">
                    {error}
                  </div>
                </div>
              )}

              <div className="space-y-2">
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
                    className="block w-full pl-11 pr-4 py-3.5 bg-black/40 border border-gray-700/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-white placeholder-gray-500 transition-all duration-300 hover:bg-black/60 hover:border-gray-600 shadow-inner"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="space-y-2">
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
                    className="block w-full pl-11 pr-4 py-3.5 bg-black/40 border border-gray-700/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-white placeholder-gray-500 transition-all duration-300 hover:bg-black/60 hover:border-gray-600 shadow-inner"
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
                    className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-600 rounded bg-gray-900 transition-colors cursor-pointer"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400 cursor-pointer hover:text-gray-300 transition-colors">
                    Remember me
                  </label>
                </div>
              </div>

              <div className="pt-6 relative z-10">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="relative group w-full flex justify-center py-4 px-4 rounded-xl text-sm font-bold text-white overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:from-blue-500 group-hover:to-indigo-500 transition-colors duration-300"></div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent transition-opacity duration-300"></div>
                  <div className="relative flex items-center shadow-[0_0_20px_rgba(37,99,235,0.4)] group-hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]">
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <span className="flex items-center tracking-wide">
                        Authenticate Securely
                        <Shield className="ml-2 w-4 h-4" />
                      </span>
                    )}
                  </div>
                </button>
              </div>
              
              <p className="text-center text-xs text-gray-500 pt-6">
                Protected by Razorpay Buildathon Security Policies.
              </p>
            </form>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div 
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-60 hover:opacity-100 transition-opacity animate-bounce cursor-pointer z-30"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <span className="text-gray-400 text-xs tracking-widest uppercase mb-2">Scroll to explore</span>
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center p-1">
            <div className="w-1 h-2 bg-blue-400 rounded-full animate-ping"></div>
          </div>
        </div>

      </div>
      </div>

      {/* Subtle connection line going down */}
      <div className="absolute left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-blue-500/50 to-transparent z-20"></div>

      {/* WHY AI REVENUE RECOVERY */}
      <section className="relative z-10 py-32 bg-gradient-to-b from-[#050914] to-[#02042b]">
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <FadeInScroll>
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Why AI Revenue Recovery?</h2>
              <p className="text-xl text-gray-400 leading-relaxed font-light">
                Revenue loss rarely happens in one clean step. A payment degrades, a checkout gets abandoned, or a subscription fails. 
                We close the loop from detecting the problem to diagnosing it, choosing the right intervention, and recovering the money.
              </p>
            </div>
          </FadeInScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FadeInScroll delay={100}>
              <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.04] transition-all duration-500 hover:-translate-y-2 group h-full shadow-[0_0_40px_-15px_rgba(0,0,0,0.5)]">
                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                  <Activity className="w-7 h-7 text-blue-400 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Payment Degradation</h3>
                <p className="text-gray-400 leading-relaxed font-light text-sm md:text-base">
                  Detect the root cause of payment failures instantly. Identify whether it's insufficient funds, expired instruments, or bank timeouts.
                </p>
              </div>
            </FadeInScroll>
            
            <FadeInScroll delay={200}>
              <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.04] transition-all duration-500 hover:-translate-y-2 group h-full shadow-[0_0_40px_-15px_rgba(0,0,0,0.5)]">
                <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
                  <BrainCircuit className="w-7 h-7 text-purple-400 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Smart Interventions</h3>
                <p className="text-gray-400 leading-relaxed font-light text-sm md:text-base">
                  Rather than indiscriminate retries, the AI proposes the optimal recovery path—such as mandate retries, dynamic routing, or tailored messaging.
                </p>
              </div>
            </FadeInScroll>

            <FadeInScroll delay={300}>
              <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.04] transition-all duration-500 hover:-translate-y-2 group h-full shadow-[0_0_40px_-15px_rgba(0,0,0,0.5)]">
                <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                  <Coins className="w-7 h-7 text-emerald-400 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Bounded Recovery</h3>
                <p className="text-gray-400 leading-relaxed font-light text-sm md:text-base">
                  Recover money safely. All AI recommendations are passed through a deterministic guardrail layer to ensure idempotency and compliance.
                </p>
              </div>
            </FadeInScroll>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS PIPELINE */}
      <section className="relative z-10 py-32 bg-[#02042b] overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80rem] h-[40rem] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <FadeInScroll>
            <div className="text-center max-w-3xl mx-auto mb-24">
              <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-6 tracking-tight">
                The Architecture of Recovery
              </h2>
              <p className="text-xl text-gray-400 font-light">
                A 4-step pipeline that guarantees safe, automated, and auditable revenue recovery.
              </p>
            </div>
          </FadeInScroll>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden lg:block absolute top-[40px] left-10 w-[calc(100%-80px)] h-0.5 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-emerald-500/20 z-0"></div>

            {/* Step 1 */}
            <FadeInScroll delay={0}>
              <div className="relative z-10 flex flex-col items-center text-center max-w-[250px] group">
                <div className="w-20 h-20 bg-[#050914] border border-blue-500/30 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.15)] mb-6 group-hover:border-blue-500/60 group-hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] transition-all duration-500">
                  <Database className="w-10 h-10 text-blue-400" />
                </div>
                <h4 className="text-lg font-bold text-white mb-3">1. Input & Validation</h4>
                <p className="text-sm text-gray-400 font-light leading-relaxed">Payment failure context is securely ingested and strictly validated via Zod schemas.</p>
              </div>
            </FadeInScroll>

            <ArrowRight className="lg:hidden w-8 h-8 text-gray-700 my-4" />

            {/* Step 2 */}
            <FadeInScroll delay={150}>
              <div className="relative z-10 flex flex-col items-center text-center max-w-[250px] group">
                <div className="w-20 h-20 bg-[#050914] border border-purple-500/30 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.15)] mb-6 group-hover:border-purple-500/60 group-hover:shadow-[0_0_40px_rgba(168,85,247,0.3)] transition-all duration-500">
                  <BrainCircuit className="w-10 h-10 text-purple-400" />
                </div>
                <h4 className="text-lg font-bold text-white mb-3">2. AI Diagnosis</h4>
                <p className="text-sm text-gray-400 font-light leading-relaxed">Groq-powered inference engine determines the root cause and suggests a recovery vector.</p>
              </div>
            </FadeInScroll>

            <ArrowRight className="lg:hidden w-8 h-8 text-gray-700 my-4" />

            {/* Step 3 */}
            <FadeInScroll delay={300}>
              <div className="relative z-10 flex flex-col items-center text-center max-w-[250px] group">
                <div className="w-20 h-20 bg-[#050914] border border-emerald-500/30 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.15)] mb-6 group-hover:border-emerald-500/60 group-hover:shadow-[0_0_40px_rgba(16,185,129,0.3)] transition-all duration-500">
                  <Shield className="w-10 h-10 text-emerald-400" />
                </div>
                <h4 className="text-lg font-bold text-white mb-3">3. Guardrails</h4>
                <p className="text-sm text-gray-400 font-light leading-relaxed">Rules evaluate the AI's suggestion against safety policies, cooldowns, and idempotency locks.</p>
              </div>
            </FadeInScroll>

            <ArrowRight className="lg:hidden w-8 h-8 text-gray-700 my-4" />

            {/* Step 4 */}
            <FadeInScroll delay={450}>
              <div className="relative z-10 flex flex-col items-center text-center max-w-[250px] group">
                <div className="w-20 h-20 bg-[#050914] border border-blue-500/30 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.15)] mb-6 group-hover:border-blue-500/60 group-hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] transition-all duration-500">
                  <Zap className="w-10 h-10 text-blue-400" />
                </div>
                <h4 className="text-lg font-bold text-white mb-3">4. Safe Execution</h4>
                <p className="text-sm text-gray-400 font-light leading-relaxed">Only approved actions are executed, and the entire decision chain is recorded in the Audit Trail.</p>
              </div>
            </FadeInScroll>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#050914] py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-lg" />
            <span className="text-white font-bold tracking-tight">RazorRevive AI</span>
          </div>
          <div className="text-gray-500 text-sm flex items-center space-x-2">
            <span>Built for the</span>
            <span className="text-blue-400 font-bold">Razorpay Buildathon</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
