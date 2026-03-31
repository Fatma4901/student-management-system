"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  GraduationCap, ArrowRight, ShieldCheck, Zap, Users, 
  CheckCircle2, LayoutDashboard, Database, Star, Search, 
  Loader2, Trophy, ChevronRight, BarChart3, LockKeyhole
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function LandingPage() {
  const [emailSearch, setEmailSearch] = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const average = searchResult?.marks?.length > 0 
    ? (searchResult.marks.reduce((s: number, m: any) => s + m.marks, 0) / searchResult.marks.length).toFixed(1)
    : "0";

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-200 flex flex-col font-sans overflow-x-hidden relative">
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
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-indigo-400/20 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />
      
      {/* 🚀 STICKY ENTERPRISE NAVBAR */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200/50 py-3 shadow-sm' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg shadow-blue-500/30">
               <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              SMS <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Pro</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 bg-white/50 px-6 py-2.5 rounded-full border border-gray-200/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
             <Link href="#search" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Track Result</Link>
             <Link href="#solutions" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Features</Link>
             <Link href="#security" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Security</Link>
             <Link href="#trust" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Customers</Link>
          </div>

          <div className="flex items-center gap-3">
             <Link href="/login" className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors px-4 py-2 hover:bg-white rounded-lg">Sign In</Link>
             <Link href="/student-signup" className="hidden sm:flex text-sm font-semibold text-blue-600 px-5 py-2.5 rounded-xl border-2 border-blue-600/20 hover:bg-blue-600 hover:text-white transition-all transform active:scale-95">
                Student Register
             </Link>
             <Link href="/signup" className="group relative text-sm font-semibold text-white px-5 py-2.5 rounded-xl overflow-hidden flex items-center gap-2 transform transition-all active:scale-95 shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] hover:shadow-[0_0_60px_-15px_rgba(37,99,235,0.7)]">
                <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 group-hover:scale-105 transition-transform duration-500"></span>
                <span className="relative z-10 flex items-center gap-2">Admin Register <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
             </Link>
          </div>
        </div>
      </nav>

      {/* 🔮 HERO SECTION */}
      <section className="pt-40 pb-24 px-6 max-w-7xl mx-auto w-full relative z-10">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* HERO CONTENT */}
            <div className="text-left space-y-8 max-w-xl animate-in slide-in-from-bottom-8 fade-in duration-1000 fill-mode-forwards">
               <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100/50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-200/50 backdrop-blur-sm shadow-sm w-fit">
                  <Star className="w-3.5 h-3.5 fill-blue-600/50 text-blue-600" /> Most advanced LMS 2026
               </div>
               <h1 className="text-6xl md:text-7xl font-extrabold text-slate-900 leading-[1.05] tracking-tight">
                  Next-Gen <br/>
                  <span className="relative inline-block">
                    <span className="absolute inset-0 bg-blue-200/40 blur-xl rounded-full"></span>
                    <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">Education</span>
                  </span><br/>
                  Platform
               </h1>
               <p className="text-lg text-slate-600 leading-relaxed font-medium">
                  A beautiful, intelligent grading and student management system designed for premium institutions. Experience absolute administrative clarity.
               </p>
               <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <Link href="#search" className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-xl font-bold text-[15px] hover:bg-black hover:shadow-2xl hover:shadow-slate-500/20 transition-all active:scale-95 overflow-hidden ring-1 ring-slate-900/50">
                     <span className="absolute inset-0 w-full h-full bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                     <span className="relative flex items-center gap-2">Verify Student <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
                  </Link>
                  <Link href="/student-signup" className="flex items-center justify-center gap-2 px-8 py-4 bg-white border border-blue-200 text-blue-700 shadow-sm rounded-xl font-bold text-[15px] hover:bg-blue-50/50 hover:shadow-md transition-all active:scale-95">
                     Student Access
                  </Link>
               </div>
               <div className="flex items-center gap-4 pt-6 text-sm font-semibold text-slate-500">
                  <div className="flex -space-x-3">
                     {[1,2,3,4].map(i => (
                        <div key={i} className={`w-8 h-8 rounded-full border-2 border-slate-50 flex items-center justify-center text-[10px] text-white font-bold shadow-sm ${['bg-blue-500','bg-indigo-500','bg-purple-500','bg-pink-500'][i-1]}`}>
                           {String.fromCharCode(64+i)}
                        </div>
                     ))}
                  </div>
                  <p>Loved by <span className="text-slate-900 font-bold">10,000+</span> educators</p>
               </div>
            </div>
            
            {/* 🔬 GLASSMORPHISM SEARCH CARD */}
            <div id="search" className="relative group perspective-1000">
               {/* Animated rings bg */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-blue-100 to-indigo-50/50 rounded-full blur-[80px] -z-10 group-hover:bg-blue-200/50 transition-colors duration-700"></div>
               
               <div className="relative p-10 bg-white/60 backdrop-blur-2xl rounded-[2.5rem] border border-white/80 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] hover:shadow-[0_16px_60px_-15px_rgba(37,99,235,0.15)] transition-all duration-500 overflow-hidden transform group-hover:translate-y-[-5px]">
                  
                  {/* Decorative Elements inside card */}
                  <div className="absolute top-0 right-0 p-6 opacity-30">
                    <Database className="w-24 h-24 text-blue-200" />
                  </div>
                  
                  <div className="relative z-10">
                     <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-lg text-[10px] font-bold uppercase tracking-widest mb-6 border border-green-200 shadow-sm">
                        <span className="relative flex h-2 w-2">
                           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                           <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Live Portal Connected
                     </div>
                     <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Academic <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Verification</span></h3>
                     <p className="text-slate-500 font-medium text-sm mb-8">Securely verify student academic performance records directly from the global institutional database.</p>

                     <form onSubmit={handleSearch} className="relative group/form mb-4">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-0 group-focus-within/form:opacity-20 transition duration-500"></div>
                        <div className="relative flex items-center">
                           <input 
                             type="email" 
                             placeholder="Student Email Address"
                             value={emailSearch}
                             onChange={(e) => setEmailSearch(e.target.value)}
                             className="w-full pl-12 pr-16 py-5 bg-white border border-gray-200 hover:border-blue-300 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-medium text-slate-800 shadow-sm placeholder:text-gray-400"
                             required
                           />
                           <Search className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within/form:text-blue-500 transition-colors" />
                           <button 
                             disabled={loading}
                             type="submit" 
                             className="absolute right-2 p-3 bg-slate-900 text-white rounded-xl hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center min-w-[3rem]"
                           >
                             {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                           </button>
                        </div>
                     </form>

                     {/* RESULTS DISPLAY */}
                     <div className="min-h-[140px] flex flex-col justify-end">
                       {searchResult ? (
                          <div className="animate-in fade-in zoom-in-95 duration-500 bg-white/90 backdrop-blur-md border border-blue-100 p-6 rounded-2xl shadow-xl shadow-blue-900/5 relative overflow-hidden">
                             {/* Result Watermark */}
                             <div className="absolute -right-6 -bottom-6 opacity-[0.03] pointer-events-none transform rotate-12">
                                <ShieldCheck className="w-48 h-48" />
                             </div>

                             <div className="flex justify-between items-start mb-6">
                                <div>
                                   <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1.5 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Verified Identity</p>
                                   <h4 className="text-xl font-bold text-slate-900">{searchResult.student.name}</h4>
                                   <p className="text-xs font-semibold text-slate-500 capitalize bg-slate-100 px-2 py-0.5 rounded-md inline-block mt-1 border border-slate-200">{searchResult.student.enrolled_course}</p>
                                </div>
                                <div className="text-right bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                                   <p className="text-3xl font-black text-blue-700 leading-none">{average}<span className="text-lg text-blue-400">%</span></p>
                                   <p className="text-[9px] font-bold text-blue-500/80 uppercase mt-1">Aggregate GPA</p>
                                </div>
                             </div>

                             <div className="space-y-4">
                                {searchResult.marks.length === 0 ? (
                                   <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl text-center text-xs font-semibold text-slate-400 flex flex-col items-center justify-center gap-2">
                                     <BarChart3 className="w-6 h-6 opacity-30"/>
                                     Awaiting faculty evaluation
                                   </div>
                                ) : (
                                   searchResult.marks.map((m: any, idx: number) => (
                                      <div key={m.id} className="space-y-1.5" style={{ animationDelay: `${idx * 100}ms` }}>
                                         <div className="flex justify-between text-[11px] font-bold text-slate-700 px-1 uppercase tracking-wide">
                                            <span>{m.subject_name}</span>
                                            <span className="text-slate-500">{m.marks}/100</span>
                                         </div>
                                         <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/50">
                                            <div 
                                               className={`h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r shadow-sm ${m.marks >= 85 ? 'from-green-400 to-emerald-500' : m.marks >= 60 ? 'from-blue-400 to-indigo-500' : m.marks >= 40 ? 'from-yellow-400 to-orange-500' : 'from-red-400 to-rose-500'}`}
                                               style={{ width: `${m.marks}%` }}
                                            />
                                         </div>
                                      </div>
                                   ))
                                 )}
                             </div>
                             
                             {searchResult.marks.length > 0 && parseFloat(average) >= 85 && (
                                <div className="mt-5 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200/50 p-3 rounded-xl flex items-center gap-3 shadow-sm shadow-amber-100/50">
                                  <div className="p-2 bg-amber-100 rounded-lg shadow-sm"><Trophy className="w-4 h-4 text-amber-600" /></div>
                                  <div>
                                    <p className="text-xs font-bold text-amber-900">Exceptional Performance</p>
                                    <p className="text-[10px] text-amber-700 font-medium">Top percentile rank awarded</p>
                                  </div>
                                </div>
                             )}
                          </div>
                       ) : (
                          <div className="py-8 flex flex-col items-center justify-center text-center space-y-3 opacity-60 transition-opacity hover:opacity-100">
                             <div className="relative">
                               <div className="absolute inset-0 bg-blue-200 blur-md rounded-full"></div>
                               <div className="relative w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 border border-blue-50 shadow-sm">
                                  <LockKeyhole className="w-5 h-5" />
                               </div>
                             </div>
                             <p className="text-[11px] font-semibold text-slate-500 max-w-[200px] leading-relaxed">Strictly confidential. Database access requires secure token or explicit permission.</p>
                          </div>
                       )}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 📊 TRUST BAR */}
      <section id="trust" className="bg-white border-y border-gray-200/60 py-12 relative z-10 w-full overflow-hidden">
         <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
         <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
         
         <div className="max-w-7xl mx-auto px-6 flex justify-between gap-16 text-slate-500 font-bold text-[13px] tracking-wide w-[200%] md:w-full animate-[scroll_20s_linear_infinite] md:animate-none overflow-hidden">
            <div className="flex items-center gap-3 hover:text-blue-600 transition-colors cursor-default"><Users className="w-5 h-5" /> 10,000+ Students</div>
            <div className="flex items-center gap-3 hover:text-indigo-600 transition-colors cursor-default"><Database className="w-5 h-5" /> 2M+ Records</div>
            <div className="flex items-center gap-3 hover:text-purple-600 transition-colors cursor-default"><LayoutDashboard className="w-5 h-5" /> 99.99% Uptime</div>
            <div className="flex items-center gap-3 hover:text-green-600 transition-colors cursor-default"><CheckCircle2 className="w-5 h-5" /> ISO 27001 Certified</div>
            <div className="flex items-center gap-3 hover:text-slate-900 transition-colors cursor-default"><ShieldCheck className="w-5 h-5" /> FERPA Compliant</div>
         </div>
      </section>

      {/* 🚀 SOLUTIONS SECTION */}
      <section id="solutions" className="py-32 px-6 max-w-7xl mx-auto w-full relative z-10">
         <div className="text-center space-y-5 mb-24">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Enterprise Infrastructure. <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-500 to-slate-800">Beautifully Designed.</span></h2>
            <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto leading-relaxed">We stripped away the complexity of traditional LMS tools to give you lightning-fast workflows that feel instantly familiar.</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feat 1 */}
            <div className="group p-8 bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.1)] hover:border-blue-200 transition-all duration-500 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-[2] duration-700 z-0"></div>
               <div className="relative z-10">
                 <div className="w-14 h-14 bg-blue-100/50 rounded-2xl flex items-center justify-center mb-8 border border-blue-100 group-hover:bg-blue-600 transition-colors duration-500 shadow-sm">
                    <Users className="w-6 h-6 text-blue-700 group-hover:text-white transition-colors" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight group-hover:text-blue-700 transition-colors">Student Identity</h3>
                 <p className="text-slate-500 font-medium leading-relaxed text-[15px]">Centralized student directory with intelligent search functionalities. Manage enrollments, courses, and demographics securely.</p>
               </div>
            </div>

            {/* Feat 2 */}
            <div className="group p-8 bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(79,70,229,0.1)] hover:border-indigo-200 transition-all duration-500 relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-white to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
               <div className="relative z-10">
                 <div className="w-14 h-14 bg-indigo-100/50 rounded-2xl flex items-center justify-center mb-8 border border-indigo-100 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-sm">
                    <Zap className="w-6 h-6 text-indigo-700" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight group-hover:text-indigo-700 transition-colors">Lightning Grading</h3>
                 <p className="text-slate-500 font-medium leading-relaxed text-[15px]">A spreadsheet-like interface for faculty to batch enter marks in seconds. Auto-calculates aggregates, GPAs, and percentiles.</p>
               </div>
            </div>

            {/* Feat 3 */}
            <div id="security" className="group p-8 bg-slate-950 rounded-3xl border border-slate-800 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] transition-all duration-500 relative overflow-hidden">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-950 to-slate-950 z-0 opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
               <div className="relative z-10">
                 <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mb-8 border border-slate-700/50 shadow-inner group-hover:border-blue-500/50 transition-colors duration-500">
                    <ShieldCheck className="w-6 h-6 text-blue-400" />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Bank-Grade Security</h3>
                 <p className="text-slate-400 font-medium leading-relaxed text-[15px]">Role-based access control (RBAC), end-to-end encryption for sensitive academic records, and comprehensive audit logs.</p>
               </div>
            </div>
         </div>
      </section>

      {/* 🚀 BANNER / CTA */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full relative z-10">
        <div className="relative rounded-[3rem] bg-gradient-to-br from-blue-600 to-indigo-700 p-12 md:p-20 overflow-hidden shadow-2xl shadow-blue-900/20 text-center">
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
           <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-400/30 rounded-full blur-[80px]"></div>
           <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-400/30 rounded-full blur-[80px]"></div>
           
           <div className="relative z-10 max-w-3xl mx-auto space-y-8">
             <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">Ready to modernise your institution?</h2>
             <p className="text-blue-100 text-lg md:text-xl font-medium max-w-2xl mx-auto">Join thousands of schools moving to a faster, safer, and more beautiful way to manage education.</p>
             <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/signup" className="px-8 py-4 bg-white text-blue-700 rounded-xl font-bold text-[16px] hover:bg-slate-50 hover:scale-105 hover:shadow-xl transition-all active:scale-95">Get Started Free</Link>
                <Link href="/login" className="px-8 py-4 bg-transparent border border-blue-300 text-white rounded-xl font-bold text-[16px] hover:bg-blue-800/50 hover:border-blue-200 transition-all">Sign In Admin</Link>
             </div>
           </div>
        </div>
      </section>

      {/* 🚀 FOOTER */}
      <footer className="mt-auto border-t border-gray-200/80 pt-16 pb-8 px-6 bg-white relative z-10">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
            <div className="flex flex-col gap-4">
               <div className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-sm">
                     <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-extrabold text-slate-900 tracking-tight">SMS <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Pro</span></span>
               </div>
               <p className="text-sm font-medium text-slate-500 max-w-xs">The premier student management cloud platform for modern academic institutions worldwide.</p>
            </div>
            
            <div className="grid grid-cols-2 md:flex gap-12 text-[14px]">
               <div className="flex flex-col gap-3">
                  <h4 className="font-bold text-slate-900">Product</h4>
                  <Link href="#" className="font-medium text-slate-500 hover:text-blue-600 transition-colors">Features</Link>
                  <Link href="#" className="font-medium text-slate-500 hover:text-blue-600 transition-colors">Security</Link>
               </div>
               <div className="flex flex-col gap-3">
                  <h4 className="font-bold text-slate-900">Legal</h4>
                  <Link href="#" className="font-medium text-slate-500 hover:text-blue-600 transition-colors">Privacy</Link>
                  <Link href="#" className="font-medium text-slate-500 hover:text-blue-600 transition-colors">Terms</Link>
               </div>
            </div>
         </div>
         
         <div className="max-w-7xl mx-auto pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[13px] font-medium text-slate-400">© 2026 SMS Pro Inc. All rights reserved.</p>
            <div className="flex items-center gap-2 text-[13px] font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-gray-200/60">
               <span>System Status:</span> 
               <span className="flex items-center gap-1.5 text-green-600 font-bold"><span className="w-2 h-2 rounded-full bg-green-500"></span> All systems operational</span>
            </div>
         </div>
      </footer>
    </div>
  );
}