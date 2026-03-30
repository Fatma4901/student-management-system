import db from "@/lib/db";
import { BookOpen, GraduationCap, Users, Plus, List, ArrowRight } from 'lucide-react';
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

  const stats = [
    { name: 'Total Students', value: studentCount, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', link: '/students' },
    { name: 'Active Courses', value: courseCount, icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50', link: '/courses' },
    { name: 'Total Marks', value: marksCount, icon: GraduationCap, color: 'text-green-600', bg: 'bg-green-50', link: '/marks' },
  ];

  return (
    <div className="p-8 w-full max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Check your latest student statistics and manage your school records.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/students" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-200">
            <Plus className="w-4 h-4" /> Add Student
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="group bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} opacity-20 rounded-bl-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform`} />
            <div className="flex items-center gap-6 relative z-10">
              <div className={`p-4 ${stat.bg} ${stat.color} rounded-2xl`}>
                <stat.icon className="w-10 h-10" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{stat.name}</p>
                <h3 className="text-4xl font-black text-gray-900">{stat.value}</h3>
              </div>
            </div>
            <Link href={stat.link} className="mt-6 flex items-center gap-1 text-sm font-bold text-blue-600 group-hover:gap-2 transition-all">
              Manage records <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Students Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <List className="w-5 h-5 text-blue-600" /> Recent Students
            </h2>
            <Link href="/students" className="text-sm font-medium text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-gray-500 uppercase text-xs font-bold">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Course</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentStudents.map((student: any) => (
                  <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{student.name}</div>
                      <div className="text-xs text-gray-400">{student.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                        {student.course_name || 'No Course'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1" />
                      <span className="text-sm font-medium text-gray-600 italic">Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Tips / Placeholder */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl shadow-xl p-8 text-white flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">System Status</h3>
            <p className="text-blue-100 text-sm leading-relaxed">Everything is running smoothly! Your Railway database is connected and Vercel is handling requests.</p>
            <div className="pt-4 space-y-3">
              <div className="flex items-center justify-between bg-white/10 p-3 rounded-xl border border-white/10">
                <span className="text-xs">Database Speed</span>
                <span className="text-xs font-bold">Optimal</span>
              </div>
              <div className="flex items-center justify-between bg-white/10 p-3 rounded-xl border border-white/10">
                <span className="text-xs">Uptime</span>
                <span className="text-xs font-bold text-green-300">99.9%</span>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <button className="w-full py-4 bg-white text-blue-700 font-black rounded-2xl hover:bg-blue-50 transition-colors shadow-lg">
              RUN FULL REPORT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}