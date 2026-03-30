import db from "@/lib/db";
import { BookOpen, GraduationCap, Users, Plus, List, ArrowRight, BarChart3 } from 'lucide-react';
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

  // Calculate max students for the chart progress bars
  const maxStudents = Math.max(...courseStats.map((c: any) => c.student_count), 1);

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
          <Link href="/students" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-200 font-medium">
            <Plus className="w-5 h-5" /> Add Student
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
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.name}</p>
                <h3 className="text-4xl font-black text-gray-900 mt-1">{stat.value}</h3>
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
              <List className="w-5 h-5 text-blue-600" /> Recent Enrolled
            </h2>
            <Link href="/students" className="text-sm font-bold text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/80 text-gray-500 uppercase text-xs font-bold">
                <tr>
                  <th className="px-6 py-4 tracking-wider">Name</th>
                  <th className="px-6 py-4 tracking-wider">Course</th>
                  <th className="px-6 py-4 text-right tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentStudents.map((student: any) => (
                  <tr key={student.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{student.name}</div>
                      <div className="text-xs font-medium text-gray-400 mt-0.5">{student.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold border border-gray-200">
                        {student.course_name || 'No Course'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <span className="block w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                        <span className="text-sm font-bold text-gray-700">Active</span>
                      </div>
                    </td>
                  </tr>
                ))}
                {recentStudents.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500 font-medium">
                      No students enrolled yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dynamic Data Chart */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-purple-600" /> Demographics
            </h2>

            <div className="space-y-5">
              {courseStats.map((stat: any) => {
                // Calculate percentage for the bar width
                const percentage = Math.max((stat.student_count / maxStudents) * 100, 2);

                return (
                  <div key={stat.name} className="group">
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-bold text-gray-700 group-hover:text-blue-600 transition-colors">{stat.name}</span>
                      <span className="font-black text-gray-900">{stat.student_count}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full group-hover:scale-x-[1.02] transform origin-left transition-transform duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}

              {courseStats.length === 0 && (
                <div className="py-8 text-center border-2 border-dashed border-gray-200 rounded-2xl">
                  <p className="text-sm font-medium text-gray-500">No course data to display.</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-auto pt-8 relative z-10">
            <Link
              href="/courses"
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-slate-50 text-slate-700 font-bold rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-all border border-slate-200 hover:border-blue-200"
            >
              Manage Courses
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}