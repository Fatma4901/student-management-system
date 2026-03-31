'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/Button';
import Input from '@/components/Input';
import toast, { Toaster } from 'react-hot-toast';
import { GraduationCap, ArrowLeft, ShieldCheck, Mail, Lock, User, Sparkles, ChevronRight } from 'lucide-react';

export default function StudentSignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/student-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Registration successful! Accessing portal...');
        setTimeout(() => router.push('/login'), 2000);
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (error) {
      toast.error('Network connectivity issues detected');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden selection:bg-blue-100">
      {/* 🔮 Background Flair */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[120px] animate-pulse" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <Toaster position="top-right" />
      
      <div className="w-full max-w-[500px] relative z-10">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-xs uppercase tracking-widest mb-8 transition-colors group">
           <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Terminal
        </Link>

        {/* Signup Card */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-100 p-10 md:p-12 relative group">
           {/* Abstract Decorative Element */}
           <div className="absolute top-6 right-10 text-slate-100 pointer-events-none group-hover:text-blue-50 transition-colors duration-700">
              <GraduationCap className="w-24 h-24" />
           </div>

           <div className="space-y-8 relative z-10">
              <div className="space-y-3">
                 <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-600/30">
                    <Sparkles className="w-7 h-7" />
                 </div>
                 <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Student <span className="text-blue-600">Portal</span></h1>
                 <p className="text-slate-500 font-medium">Initialize your academic identity and synchronize your performance data.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-5">
                   <div className="relative group/field">
                      <User className="absolute left-4 top-[42px] w-5 h-5 text-slate-400 group-focus-within/field:text-blue-600 transition-colors" />
                      <Input
                        label="Full Official Name"
                        value={formData.name}
                        onChange={(value) => setFormData({ ...formData, name: value })}
                        placeholder="John Doe"
                        required
                        className="pl-12"
                      />
                   </div>
                   
                   <div className="relative group/field">
                      <Mail className="absolute left-4 top-[42px] w-5 h-5 text-slate-400 group-focus-within/field:text-blue-600 transition-colors" />
                      <Input
                        label="Institutional Email"
                        type="email"
                        value={formData.email}
                        onChange={(value) => setFormData({ ...formData, email: value })}
                        placeholder="credentials@smspro.edu"
                        required
                        className="pl-12"
                      />
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="relative group/field">
                        <Lock className="absolute left-4 top-[42px] w-5 h-5 text-slate-400 group-focus-within/field:text-blue-600 transition-colors" />
                        <Input
                          label="Access Key"
                          type="password"
                          value={formData.password}
                          onChange={(value) => setFormData({ ...formData, password: value })}
                          placeholder="••••••••"
                          required
                          className="pl-12"
                        />
                      </div>
                      <div className="relative group/field">
                        <ShieldCheck className="absolute left-4 top-[42px] w-5 h-5 text-slate-400 group-focus-within/field:text-blue-600 transition-colors" />
                        <Input
                          label="Confirm Access"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(value) => setFormData({ ...formData, confirmPassword: value })}
                          placeholder="••••••••"
                          required
                          className="pl-12"
                        />
                      </div>
                   </div>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    loading={loading}
                    className="w-full py-4 bg-slate-900 border-none rounded-2xl font-black text-[13px] uppercase tracking-[0.2em] shadow-2xl shadow-slate-950/20 active:scale-[0.98] transition-all hover:bg-black group/btn"
                  >
                    <span className="flex items-center justify-center gap-2">
                       Initialize Identity <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </div>
              </form>

              <div className="text-center pt-4">
                <p className="text-sm font-bold text-slate-400">
                  Already registered? {' '}
                  <Link href="/login" className="text-blue-600 hover:text-indigo-600 transition-colors underline decoration-blue-600/20 underline-offset-8">
                    Access Portal
                  </Link>
                </p>
              </div>
           </div>
        </div>

        {/* Bottom Security Badge */}
        <div className="mt-10 flex items-center justify-center gap-4 text-slate-400 grayscale hover:grayscale-0 transition-all cursor-default">
           <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-100 rounded-xl shadow-sm">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              <span className="text-[10px] font-black uppercase tracking-widest">SSL Encrypted</span>
           </div>
           <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-100 rounded-xl shadow-sm">
              <Lock className="w-4 h-4 text-blue-500" />
              <span className="text-[10px] font-black uppercase tracking-widest">OAuth 2.0 Compliant</span>
           </div>
        </div>
      </div>
    </div>
  );
}
