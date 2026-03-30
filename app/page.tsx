"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { GraduationCap, ArrowRight, ShieldCheck, Zap, Users, CheckCircle2, LayoutDashboard, Database, Star, Search, Info, Loader2, Trophy, BookOpen, UserCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function LandingPage() {
  const [emailSearch, setEmailSearch] = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  // Real-time Logic States
  const [dbData, setDbData] = useState<any>(null);
  const [admins, setAdmins] = useState<any[]>([]);

  useEffect(() => {
    fetchLiveInfo();
  }, []);

  const fetchLiveInfo = async () => {
    try {
      // Fetch stats and featured courses
      const statsRes = await fetch('/api/public/stats');
      const statsJson = await statsRes.json();
      if (statsJson.success) setDbData(statsJson.data);

      // Fetch admin list (public limited version)
      const adminRes = await fetch('/api/public/admins');
      const adminJson = await adminRes.json();
      if (adminJson.success) setAdmins(adminJson.data || []);
    } catch (err) {
      console.error("Error loading home page logic", err);
    }
  };

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
    : 0;

  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 flex flex-col font-sans overflow-x-hidden">
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
           <Link href="#subjects" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">Our Subjects</Link>
           <Link href="#admins" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">Management Board</Link>
        </div>

        <div className="flex items-center gap-4">
           <Link href="/login" className="text-sm font-bold text-slate-900 px-4 py-2 hover:bg-slate-50 rounded-xl">Sign In</Link>
           <Link href="/signup" className="text-sm font-bold text-white bg-slate-900 hover:bg-black px-6 py-2.5 rounded-xl transition-all shadow-md active:scale-95">Register Admin</Link>
        </div>
      </nav>

      {/* 🔮 HERO SECTION (DUAL GRID) */}
      <section className="pt-32 pb-10 px-6 max-w-7xl mx-auto w-full">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-left space-y-8 max-w-xl">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-100">
                  <Star className="w-3 h-3 fill-indigo-700" /> Professional Ed-Tech Hub
               </div>
               <h1 className="text-6xl md:text-8xl font-black text-slate-950 leading-[0.95] tracking-tight">
                  The future of <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-700 italic">Academy.</span>
               </h1>
               <p className="text-xl text-slate-600 leading-relaxed font-medium">
                  A high-performance student success platform designed for elite modern school systems. All yours, in one cloud-based dashboard.
               </p>
               <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link href="#search" className="group flex items-center justify-center gap-3 px-8 py-5 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-200 transition-all active:scale-95">
                     Check Performance <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
               </div>
            </div>
            
            {/* 🔬 LIVE SEARCH LOGIC SECTION */}
            <div id="search" className="p-10 bg-slate-50 rounded-[3rem] border border-blue-100 shadow-xl shadow-blue-50/50 space-y-8 relative overflow-hidden group">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/50 blur-3xl group-hover:bg-blue-200/40 transition-colors"></div>
               <div>
                  <h3 className="text-2xl font-black text-slate-900 italic">Verify <span className="text-blue-600">Marks</span></h3>
                  <p className="text-slate-500 font-medium text-sm mt-1">Real-time database validation for academic records.</p>
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
                           <p className="text-xs font-black text-blue-500 uppercase tracking-widest mb-1 font-mono hover:text-blue-600">OFFICIAL-TX-VERIFIED</p>
                           <h4 className="text-2xl font-black text-slate-900 leading-tight">{searchResult.student.name}</h4>
                           <p className="text-xs font-bold text-slate-400 capitalize">{searchResult.student.enrolled_course}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-4xl font-black text-blue-600 leading-none">{average}%</p>
                           <p className="text-[10px] font-black text-slate-400 uppercase mt-1">Final Score</p>
                        </div>
                     </div>

                     <div className="space-y-4">
                        {searchResult.marks.length === 0 ? (
                           <div className="p-4 bg-slate-50 rounded-xl text-center text-xs font-bold text-slate-400 border border-dashed border-gray-200">Processing student grades...</div>
                        ) : (
                           searchResult.marks.map((m: any) => (
                              <div key={m.id} className="space-y-1.5">
                                 <div className="flex justify-between text-xs font-black text-slate-700 px-1">
                                    <span className="flex items-center gap-1.5"><BookOpen className="w-3 h-3 text-blue-500" /> {m.subject_name}</span>
                                    <span>{m.marks}/100</span>
                                 </div>
                                 <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-gray-50">
                                    <div 
                                       className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(59,130,246,0.3)]" 
                                       style={{ width: `${m.marks}%` }}
                                    />
                                 </div>
                              </div>
                           ))
                         )}
                     </div>

                     <div className="mt-6 pt-4 border-t border-dashed border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[10px] font-black text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                           <CheckCircle2 className="w-3 h-3" /> VERIFIED GENUINE
                        </div>
                        <Trophy className="w-5 h-5 text-yellow-400 drop-shadow-sm transition-transform hover:scale-125" />
                     </div>
                  </div>
               ) : (
                  <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 border-2 border-dashed border-slate-200 rounded-[2rem] bg-white/50 group-hover:border-blue-300 transition-colors">
                     <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-300 transition-transform group-hover:rotate-12">
                        <Search className="w-8 h-8" />
                     </div>
                     <p className="text-sm font-bold text-slate-400">Search student profile to verify records</p>
                  </div>
               )}
            </div>
         </div>
      </section>

      {/* 🚀 REAL-TIME STATS BAR */}
      <section className="bg-slate-900 py-16 overflow-hidden border-y border-slate-800">
         <div className="max-w-7xl mx-auto px-6 flex flex-wrap lg:flex-nowrap justify-between items-center gap-12 text-slate-400 font-bold text-xs uppercase tracking-widest relative z-10">
            <div className="flex flex-col gap-2">
               <span className="text-white text-4xl font-black font-mono transition-all tabular-nums">{dbData?.stats.students || '0'}</span>
               <div className="flex items-center gap-3"><Users className="w-4 h-4 text-blue-500" /> Active Student Enrollments</div>
            </div>
            <div className="flex flex-col gap-2">
               <span className="text-white text-4xl font-black font-mono transition-all tabular-nums">{dbData?.stats.marks || '0'}</span>
               <div className="flex items-center gap-3"><LayoutDashboard className="w-4 h-4 text-purple-500" /> Performance Entries Recorded</div>
            </div>
            <div className="flex flex-col gap-2">
               <span className="text-white text-4xl font-black font-mono transition-all tabular-nums">{dbData?.stats.courses || '0'}</span>
               <div className="flex items-center gap-3"><Database className="w-4 h-4 text-indigo-500" /> Global Subject Catalog</div>
            </div>
         </div>
      </section>

      {/* 🚀 LIVE SUBJECTS GALLERY */}
      <section id="subjects" className="py-24 px-6 max-w-7xl mx-auto">
         <div className="text-center space-y-4 mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 italic">Academic <span className="text-blue-600">Excellence.</span></h2>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto uppercase text-xs tracking-tighter">Our current institutional academic offerings pulled from system records.</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {dbData?.featuredCourses?.map((course: any) => (
               <div key={course.id} className="group p-10 bg-slate-50 rounded-[3rem] border border-transparent hover:border-blue-200 hover:bg-white hover:shadow-2xl transition-all duration-500 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[100%] scale-0 group-hover:scale-100 transition-transform origin-top-right duration-700"></div>
                  <div className="w-14 h-14 bg-white flex items-center justify-center rounded-2xl mb-8 shadow-sm relative z-10 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                     <BookOpen className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 relative z-10 tracking-tight">{course.name}</h3>
                  <p className="text-base text-slate-500 mt-4 font-semibold relative z-10 group-hover:text-slate-700 leading-relaxed">{course.description || "In-depth subject study and advanced syllabus covering core institutional goals."}</p>
               </div>
            ))}
         </div>
      </section>

      {/* 🚀 OUR ADMIN TEAM SECTION */}
      <section id="admins" className="py-24 px-6 bg-slate-50 border-y border-slate-100">
         <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-4 mb-20">
               <h2 className="text-4xl md:text-5xl font-black text-slate-900">Administrative <span className="text-indigo-600">Board.</span></h2>
               <p className="text-slate-500 font-medium max-w-2xl mx-auto italic">Verified institutional officers managing the SMS Pro ecosystem.</p>
            </div>

            <div className="flex flex-wrap justify-center gap-12">
               {admins.map((admin) => (
                  <div key={admin.id} className="group flex flex-col items-center gap-4">
                     <div className="relative">
                        <div className="w-28 h-28 bg-white rounded-[2rem] border-4 border-white shadow-md group-hover:border-indigo-600 group-hover:rotate-6 transition-all flex items-center justify-center overflow-hidden">
                           <UserCircle className="w-20 h-20 text-slate-200 group-hover:text-indigo-600 transition-colors" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1.5 rounded-full border-4 border-slate-50 shadow-sm animate-pulse">
                           <CheckCircle2 className="w-4 h-4" />
                        </div>
                     </div>
                     <div className="text-center">
                        <p className="text-sm font-black text-slate-900 tracking-tight">{admin.email.split('@')[0].toUpperCase()}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Verified Board Member</p>
                     </div>
                  </div>
               ))}
               
               {admins.length === 0 && (
                  <p className="text-center text-slate-400 font-bold italic">Establishing administrative verification Board...</p>
               )}
            </div>
         </div>
      </section>

      {/* 🚀 FOOTER */}
      <footer className="mt-auto border-t border-gray-100 py-12 px-6 bg-white">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-slate-400 font-bold">
            <div className="flex items-center gap-3">
               <GraduationCap className="w-6 h-6 text-blue-600" />
               <span className="text-xl font-black text-slate-900 leading-none">SMS <span className="text-blue-600">Pro</span></span>
            </div>
            <div className="flex gap-8 text-xs uppercase tracking-widest">
               <span className="hover:text-slate-700 cursor-pointer transition-colors">Cloud Security</span>
               <span className="hover:text-slate-700 cursor-pointer transition-colors">Privacy Policy</span>
               <span className="hover:text-slate-700 cursor-pointer transition-colors">v2.5.0-STABLE</span>
            </div>
            <p className="text-sm font-black italic">Building the next century of education.</p>
         </div>
      </footer>
    </div>
  );
}