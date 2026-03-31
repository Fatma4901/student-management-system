import db from "@/lib/db";
import { 
  BookOpen, GraduationCap, Users, Plus, List, ArrowRight, 
  BarChart3, Globe, ShieldCheck, Activity, TrendingUp,
  Award, Clock, Calendar, ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // Fetch real counts from the database
  const [[{ studentCount }]]: any = await db.query("SELECT COUNT(*) as studentCount FROM students");
  const [[{ courseCount }]]: any = await db.query("SELECT COUNT(*) as courseCount FROM courses");
  const [[{ marksCount }]]: any = await db.query("SELECT COUNT(*) as marksCount FROM marks");

  // Fetch recent students
  const [recentStudents]: any = await db.query(`
    SELECT s.*, c.name as course_name 
    FROM students s 
    LEFT JOIN courses c ON s.course_id = c.id 
    ORDER BY s.created_at DESC 
    LIMIT 5
  `);

  // Fetch chart data (Students per course)
  const [courseStats]: any = await db.query(`
    SELECT c.name, COUNT(s.id) as student_count 
    FROM courses c 
    LEFT JOIN students s ON c.id = s.course_id 
    GROUP BY c.id, c.name
    ORDER BY student_count DESC
    LIMIT 5
  `);

  const maxStudents = Math.max(...courseStats.map((c: any) => c.student_count), 1);

  const stats = [
    { 
      name: 'Total Students', 
      value: studentCount, 
      icon: Users, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50/50', 
      link: '/students',
      trend: '+12.5%',
      description: 'Active enrollments'
    },
    { 
      name: 'Active Streams', 
      value: courseCount, 
      icon: BookOpen, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50/50', 
      link: '/courses',
      trend: 'Finalized',
      description: 'Departmental units'
    },
    { 
      name: 'Marks Assigned', 
      value: marksCount, 
      icon: GraduationCap, 
      color: 'text-violet-600', 
      bg: 'bg-violet-50/50', 
      link: '/marks',
      trend: 'Real-time',
      description: 'Verified parameters'
    },
  ];

  return (
    <div className="space-y-10 selection:bg-blue-100">
      {/* 🚀 PREMIUM HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
           <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">
              <Activity className="w-4 h-4" /> Live System Monitor
           </div>
           <h1 className="text-4xl font-extrabold text-slate-900 tracking-tighter">Command <span className="text-slate-400 font-light">Overview</span></h1>
           <p className="text-slate-500 font-medium max-w-lg leading-relaxed">Centralized intelligence dashboard for institutional oversight and academic synchronization.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="hidden md:flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-[13px] font-bold text-slate-500 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm active:scale-95">
              <Globe className="w-4 h-4" /> <span>Network Status</span>
           </button>
           <Link href="/students" className="group relative flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-[14px] hover:bg-black hover:shadow-2xl hover:shadow-slate-500/20 active:scale-95 transition-all overflow-hidden">
              <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" /> 
              <span>Register Identity</span>
           </Link>
        </div>
      </div>

      {/* 📊 High-Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(37,99,235,0.08)] hover:border-blue-200 transition-all duration-500 relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bg} rounded-bl-full opacity-0 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none`} />
            
            <div className="flex flex-col gap-8 relative z-10">
              <div className="flex justify-between items-start">
                 <div className={`p-4 ${stat.bg} ${stat.color} rounded-2xl border border-blue-50 group-hover:scale-110 transition-transform duration-500`}>
                   <stat.icon className="w-8 h-8" />
                 </div>
                 <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-green-500 bg-green-50 px-2 py-1 rounded-lg border border-green-100/50">{stat.trend}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">{stat.description}</span>
                 </div>
              </div>

              <div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.name}</p>
                <div className="flex items-baseline gap-2">
                   <h3 className="text-5xl font-black text-slate-900 leading-none tracking-tighter">{stat.value}</h3>
                </div>
              </div>

              <Link href={stat.link} className="flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-widest hover:text-blue-800 transition-colors w-fit">
                Sync Details <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* 🔬 Advanced Analytical Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Protocols Area */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden relative group/grid">
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none" />
           
           <div className="p-8 border-b border-slate-50 flex items-center justify-between relative z-10">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600"><Clock className="w-4 h-4" /></div>
              Protocol Log <span className="text-slate-400 font-light">Recent</span>
            </h2>
            <Link href="/students" className="px-4 py-2 text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">View Archive</Link>
          </div>

          <div className="overflow-x-auto relative z-10">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#fcfdfe] text-slate-400 uppercase text-[10px] font-black tracking-[0.2em]">
                <tr>
                  <th className="px-8 py-5 border-b border-slate-50">Identity</th>
                  <th className="px-8 py-5 border-b border-slate-50">Calibration Stream</th>
                  <th className="px-8 py-5 border-b border-slate-50 text-right">Synchronization</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/60">
                {recentStudents.map((student: any) => (
                  <tr key={student.id} className="hover:bg-[#fcfdfe] transition-all duration-300 group/row">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover/row:bg-white transition-colors border border-slate-200/50 group-hover/row:border-blue-100">
                            <Users className="w-3.5 h-3.5" />
                         </div>
                         <div className="flex flex-col">
                            <div className="font-bold text-slate-900 group-hover/row:text-blue-600 transition-colors">{student.name}</div>
                            <div className="text-[10px] font-bold text-slate-400 truncate w-32 lowercase">{student.email}</div>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl shadow-sm text-[10px] font-black text-slate-700 uppercase tracking-wide">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        {student.course_name || 'Protocol Null'}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 px-3 py-1.5 bg-slate-950 rounded-xl w-fit ml-auto border border-white/5 shadow-xl">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,1)]" />
                        <span className="text-[9px] font-black text-white uppercase tracking-widest">Encrypted Sync</span>
                      </div>
                    </td>
                  </tr>
                ))}
                {recentStudents.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-8 py-12 text-center text-slate-400 font-bold text-sm">
                      Zero protocols detected in buffer.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Intelligence Report Card */}
        <div className="bg-slate-950 rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.3)] p-10 flex flex-col relative overflow-hidden group">
           {/* Abstract Decoration */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none" />
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />
           
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-10">
               <div className="p-3 bg-white/5 border border-white/10 rounded-2xl text-blue-400 group-hover:rotate-12 transition-transform duration-500">
                  <BarChart3 className="w-6 h-6" />
               </div>
               <div>
                  <h2 className="text-xl font-extrabold text-white tracking-tight">Stream Insights</h2>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Demographic Analytics</p>
               </div>
            </div>

            <div className="space-y-6">
              {courseStats.map((stat: any) => {
                const percentage = Math.max((stat.student_count / maxStudents) * 100, 2);
                return (
                  <div key={stat.name} className="group/stat">
                    <div className="flex justify-between items-end mb-2.5">
                      <div className="flex flex-col">
                         <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest group-hover/stat:text-white transition-colors">{stat.name}</span>
                         <span className="text-[9px] font-bold text-blue-500/80">Calibration Depth</span>
                      </div>
                      <span className="text-2xl font-black text-white leading-none tracking-tighter">{stat.student_count} <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Units</span></span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
                      <div
                        className="bg-gradient-to-r from-blue-500 via-indigo-600 to-violet-600 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}

              {courseStats.length === 0 && (
                <div className="py-12 flex flex-col items-center justify-center gap-4 bg-white/5 rounded-3xl border border-dashed border-white/10 opacity-50">
                  <Activity className="w-8 h-8 text-slate-500" />
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Awaiting Datasets</p>
                </div>
              )}
            </div>
            
            <div className="mt-auto pt-12">
               <Link
                 href="/courses"
                 className="group/btn relative w-full flex items-center justify-center gap-3 py-4 bg-white text-slate-900 font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl hover:bg-blue-50 transition-all border border-transparent shadow-xl active:scale-95"
               >
                  Configure Global Streams <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
               </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}