'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/brand/Logo';
import { useAuth } from '@/lib/auth-context';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const { login, demoLogin } = useAuth();
  const [email, setEmail] = useState('admin@brightwaytrading.sa');
  const [password, setPassword] = useState('Admin@123456');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      toast.success('Welcome back, Abid Mughal!');
      router.push('/dashboard');
    } else {
      setErrorMsg(res.error || 'Invalid credentials.');
      toast.error(res.error || 'Login failed');
    }
  };

  const handleDemoAccess = () => {
    demoLogin();
    toast.success('Logged in as Administrator (Interactive Demo Mode)');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0c2340] via-[#12335c] to-[#071326] flex items-center justify-center p-4 selection:bg-[#c5a059]/30">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#c5a059]/40 animate-in fade-in duration-300">
        {/* Top Header */}
        <div className="bg-[#0c2340] p-6 text-center text-white border-b-2 border-[#c5a059] relative">
          <div className="flex justify-center mb-3">
            <Logo size={64} />
          </div>
          <h2
            className="text-xl font-extrabold text-white tracking-wide leading-tight"
            style={{ fontFamily: 'var(--font-cairo), sans-serif' }}
            dir="rtl"
          >
            مؤسسة قصد وقيمة التجارية
          </h2>
          <h3 className="text-xs font-black text-[#f5e197] tracking-wider uppercase mt-1">
            QASD WA QEEMA TRADING EST.
          </h3>
          <p className="text-[11px] text-slate-300 mt-2">
            Rabigh City &bull; Document Management System
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@brightwaytrading.sa"
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c2340] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c2340] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0c2340] hover:bg-[#12335c] text-white font-bold py-2.5 rounded-lg transition-all shadow-md flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-[#f5e197]" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Button */}
          <div className="relative pt-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400 font-semibold">Or Instant Access</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDemoAccess}
            className="w-full bg-amber-50 hover:bg-amber-100 text-[#0c2340] border border-[#c5a059] font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 text-xs sm:text-sm shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-[#c5a059]" />
            <span>1-Click Explore As Administrator</span>
          </button>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="text-xs text-slate-500 hover:text-[#0c2340] font-semibold transition-colors"
            >
              &larr; Back to Landing Page
            </Link>
          </div>
        </div>

        {/* Footer Note */}
        <div className="bg-slate-50 p-3 text-center border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Protected with Supabase Row Level Security</span>
        </div>
      </div>
    </div>
  );
}
