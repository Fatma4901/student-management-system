"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { GraduationCap, ArrowRight, ShieldCheck, Zap, Users, CheckCircle2, LayoutDashboard, Database, Star, Search, Info, Loader2, Trophy } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function LandingPage() {
  const [emailSearch, setEmailSearch] = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSearch) return;

    setLoading(true);
    setSearchResult(null);
    try {
      const res = await fetch(`/api/public/search?email=${emailSearch}`);
      const data = await res.json();

      if (data.success) {
        setSearchResult(data.data);
      } else {
        toast.error(data.message || "Student not found");
      }
    } catch (err) {
      toast.error("Failed to connect to results server");
    } finally {
      setLoading(false);
    }
  };

  // Calculate Average
  const average = searchResult?.marks?.length > 0 
    ? (searchResult.marks.reduce((s: number, m: any) => s + m.marks, 0) / searchResult.marks.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 flex flex-col font-sans">
      <Toaster position="top-right" />
      
      {/* 🚀 STICKY ENTERPRISE NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
             <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tighter">SMS <span className="text-blue-600">Pro</span></span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
           <Link href="#search" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">Track Result</Link>
           <Link href="#solutions" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">Solutions</Link>
           <Link href="#security" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">Security</Link>
        </div>

        <div className="flex items-center gap-4">
           <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors px-4 py-2 hover:bg-slate-50 rounded-xl">Sign In</Link>
           <Link href="/signup" className="text-sm font-bold text-white bg-slate-900 hover:bg-black px-6 py-2.5 rounded-xl transition-all shadow-md active:scale-95">Admin Register</Link>
        </div>
      </nav>

      {/* 🔮 HERO SECTION (DUAL GRID) */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto w-full">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-left space-y-8 max-w-xl">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-black uppercase tracking-widest border border-blue-100">
                  <Star className="w-3 h-3 fill-blue-700" /> Trusted by 500+ Institutions
               </div>
               <h1 className="text-6xl md:text-8xl font-black text-slate-950 leading-[0.95] tracking-tight">
                  Empower every <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-700">learner.</span>
               </h1>
               <p className="text-xl text-slate-600 leading-relaxed font-medium">
                  The first all-in-one student success platform designed for high-performance schools. Manage enrollment, grading, and growth in a single place.
               </p>
               <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link href="#search" className="group flex items-center justify-center gap-3 px-8 py-5 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-200 transition-all active:scale-95">
                     Check Your Result <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="/login" className="flex items-center justify-center gap-2 px-8 py-5 border-2 border-slate-200 text-slate-700 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all active:scale-95">
                     Admin Dashboard
                  </Link>
               </div>
            </div>
            
            {/* 🔬 LIVE SEARCH LOGIC SECTION */}
            <div id="search" className="p-10 bg-slate-50 rounded-[3rem] border border-blue-100 shadow-xl shadow-blue-50/50 space-y-8 relative overflow-hidden group">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/50 blur-3xl group-hover:bg-blue-200/40 transition-colors"></div>
               <div>
                  <h3 className="text-2xl font-black text-slate-900 italic">Verify <span className="text-blue-600">Marks</span></h3>
                  <p className="text-slate-500 font-medium text-sm mt-1">Enter student email to verify performance instantly.</p>
               </div>

               <form onSubmit={handleSearch} className="relative">
                  <input 
                    type="email" 
                    placeholder="e.g. john@test.com"
                    value={emailSearch}
                    onChange={(e) => setEmailSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-black"
                    required
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <button 
                    disabled={loading}
                    type="submit" 
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-transform active:scale-90 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                  </button>
               </form>

               {searchResult ? (
                  <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 bg-white border border-blue-100 p-6 rounded-3xl shadow-lg relative z-10">
                     <div className="flex justify-between items-start mb-6">
                        <div>
                           <p className="text-xs font-black text-blue-500 uppercase tracking-widest mb-1">Official Digital Report</p>
                           <h4 className="text-2xl font-black text-slate-900">{searchResult.student.name}</h4>
                           <p className="text-xs font-bold text-slate-400 capitalize">{searchResult.student.enrolled_course}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-3xl font-black text-blue-600 leading-none">{average}%</p>
                           <p className="text-[10px] font-black text-slate-400 uppercase mt-1">Aggregate</p>
                        </div>
                     </div>

                     <div className="space-y-3">
                        {searchResult.marks.length === 0 ? (
                           <div className="p-4 bg-slate-50 rounded-xl text-center text-xs font-bold text-slate-400">No marks entered yet.</div>
                        ) : (
                           searchResult.marks.map((m: any) => (
                              <div key={m.id} className="space-y-1">
                                 <div className="flex justify-between text-xs font-black text-slate-600 px-1">
                                    <span>{m.subject_name}</span>
                                    <span>{m.marks}/100</span>
                                 </div>
                                 <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div 
                                       className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out" 
                                       style={{ width: `${m.marks}%` }}
                                    />
                                 </div>
                              </div>
                           ))
                         )}
                     </div>

                     <div className="mt-6 pt-4 border-t border-dashed border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-md">
                           <CheckCircle2 className="w-3 h-3" /> VERIFIED RECORD
                        </div>
                        <Trophy className="w-5 h-5 text-yellow-400" />
                     </div>
                  </div>
               ) : (
                  <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 border-2 border-dashed border-slate-200 rounded-[2rem] bg-white/50">
                     <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-300 transition-transform group-hover:scale-110">
                        <Search className="w-8 h-8" />
                     </div>
                     <p className="text-sm font-bold text-slate-400">Search to reveal performance metrics</p>
                  </div>
               )}
            </div>
         </div>
      </section>

      {/* 📊 TRUST BAR */}
      <section className="bg-slate-50/50 py-12 border-y border-gray-50 overflow-hidden">
         <div className="max-w-7xl mx-auto px-6 whitespace-nowrap overflow-x-auto no-scrollbar scroll-smooth flex justify-between gap-12 text-slate-400 font-bold text-sm tracking-widest uppercase">
            <div className="flex items-center gap-3"><Users className="w-5 h-5 text-blue-500" /> 10k+ Active Students</div>
            <div className="flex items-center gap-3"><Database className="w-5 h-5 text-indigo-500" /> Millions of Marks Tracked</div>
            <div className="flex items-center gap-3"><LayoutDashboard className="w-5 h-5 text-purple-500" /> Real-time Analytics</div>
            <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-green-500" /> ISO Certified Security</div>
         </div>
      </section>

      {/* 🚀 SOLUTIONS SECTION */}
      <section id="solutions" className="py-24 px-6 max-w-7xl mx-auto bg-white">
         <div className="text-center space-y-4 mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900">Built for the entire <span className="text-blue-600">ecosystem.</span></h2>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto">One platform, thousands of simplified workflows to save your institution time and resources.</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* For Students */}
            <div className="group p-8 bg-slate-50 rounded-[2.5rem] hover:bg-blue-600 transition-all duration-500 border border-transparent hover:border-blue-500 shadow-sm">
               <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-10 shadow-sm group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-blue-600" />
               </div>
               <h3 className="text-2xl font-black text-slate-900 group-hover:text-white transition-colors mb-4 italic">For Students</h3>
               <p className="text-slate-600 group-hover:text-blue-50 transition-colors leading-relaxed font-semibold">Track your grades, download reports, and manage your academic profile with ease. Instant access to progress.</p>
            </div>

            {/* For Teachers */}
            <div className="group p-8 bg-slate-50 rounded-[2.5rem] hover:bg-indigo-600 transition-all duration-500 border border-transparent hover:border-indigo-500 shadow-sm">
               <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-10 shadow-sm group-hover:scale-110 transition-transform">
                  <Zap className="w-8 h-8 text-indigo-600" />
               </div>
               <h3 className="text-2xl font-black text-slate-900 group-hover:text-white transition-colors mb-4 italic">For Teachers</h3>
               <p className="text-slate-600 group-hover:text-indigo-50 transition-colors leading-relaxed font-semibold">Batch-record marks in seconds, calculate averages automatically, and generate comprehensive PDFs for parents.</p>
            </div>

            {/* For Admins */}
            <div className="group p-8 bg-slate-50 rounded-[2.5rem] hover:bg-purple-600 transition-all duration-500 border border-transparent hover:border-purple-500 shadow-sm">
               <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-10 shadow-sm group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-8 h-8 text-purple-600" />
               </div>
               <h3 className="text-2xl font-black text-slate-900 group-hover:text-white transition-colors mb-4 italic">For Administrators</h3>
               <p className="text-slate-600 group-hover:text-purple-50 transition-colors leading-relaxed font-semibold">Total institutional oversight. Manage staff, oversee student populations, and secure data across the entire school.</p>
            </div>
         </div>
      </section>

      {/* 🚀 FOOTER */}
      <footer className="mt-auto border-t border-gray-100 py-12 px-6 bg-slate-50/50">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
               <GraduationCap className="w-5 h-5 text-blue-600" />
               <span className="text-lg font-black text-slate-900">SMS <span className="text-blue-600">Pro</span></span>
            </div>
            <div className="flex gap-8 text-xs font-black text-slate-400 uppercase tracking-widest">
               <span className="hover:text-slate-600 cursor-pointer">Terms</span>
               <span className="hover:text-slate-600 cursor-pointer">Privacy</span>
               <span className="hover:text-slate-600 cursor-pointer">Status</span>
               <span className="hover:text-slate-600 cursor-pointer">v2.4.1</span>
            </div>
            <p className="text-sm font-bold text-slate-400">© 2026 SMS Pro. Building better futures.</p>
         </div>
      </footer>
    </div>
  );
}