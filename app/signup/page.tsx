'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PasswordInput from '@/components/PasswordInput';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { GraduationCap, ArrowRight, Lock, Mail, Loader2, ChevronLeft, ShieldCheck, UserPlus } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Account created successfully! Please log in.");
        router.push('/login');
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      setError('Something went wrong. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden font-sans selection:bg-blue-200">
      <Toaster position="top-center" 
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            borderRadius: '16px',
            fontSize: '14px',
            fontWeight: 600
          }
        }} 
      />
      
      {/* 🔮 Background Ambient Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-semibold text-sm mb-10 transition-colors group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>

        <div className="bg-white/70 backdrop-blur-2xl rounded-[2.5rem] border border-white shadow-[0_8px_40px_-12px_rgba(0,0,0,0.05)] p-10 space-y-8">
          <div className="text-center space-y-3">
            <div className="inline-flex p-3 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl shadow-lg shadow-indigo-500/20 mb-2">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Admin</h2>
            <p className="text-slate-500 font-medium text-sm">Join the next-gen education platform</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-1.5 focus-within:text-indigo-600 transition-colors">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1" htmlFor="email">Work Email Address</label>
              <div className="relative group/input">
                <input
                  id="email"
                  type="email"
                  placeholder="admin@smspro.com"
                  required
                  className="w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-500 transition-all text-slate-900 font-medium shadow-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within/input:text-indigo-500 transition-colors" />
              </div>
            </div>

            <div className="space-y-1.5 focus-within:text-indigo-600 transition-colors">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1" htmlFor="password">Security Password</label>
              <div className="relative group/input">
                <PasswordInput
                  value={password}
                  onChange={setPassword}
                  placeholder="Choose a password"
                  required
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within/input:text-indigo-500 transition-colors z-10 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5 focus-within:text-indigo-600 transition-colors">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1" htmlFor="confirm">Confirm Password</label>
              <div className="relative group/input">
                <PasswordInput
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeholder="Repeat your password"
                  required
                />
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within/input:text-indigo-500 transition-colors z-10 pointer-events-none" />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl animate-in fade-in slide-in-from-top-1">
                <p className="text-red-600 text-[11px] text-center font-bold uppercase tracking-wide">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full group relative flex items-center justify-center h-14 bg-slate-900 text-white rounded-2xl font-bold text-[15px] hover:bg-black hover:shadow-xl hover:shadow-indigo-500/10 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden shadow-lg shadow-slate-200"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></span>
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Registering...</span>
                </div>
              ) : (
                <span className="relative flex items-center gap-2">Create Account <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
              )}
            </button>
          </form>

          <div className="pt-4 text-center">
             <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Already registered?</p>
             <Link href="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                Sign in to Admin Dashboard
             </Link>
          </div>
        </div>

         <p className="mt-8 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-relaxed">
          High Performance Education Infrastructure<br/>
          Secure Node v2.4.1 • ISO 27001
        </p>
      </div>
    </div>
  );
}
