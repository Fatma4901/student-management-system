import Link from "next/link";
import { GraduationCap, ArrowRight, ShieldCheck, Zap, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo/Icon */}
        <div className="flex justify-center mb-8">
          <div className="p-4 bg-white rounded-2xl shadow-xl border border-gray-100 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
            <div className="p-4 bg-blue-600 rounded-xl">
              <GraduationCap className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        {/* Hero Text */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6">
          Student Management <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Reimagined</span>
        </h1>
        <p className="mt-4 max-w-2xl text-xl text-slate-600 mx-auto mb-10 leading-relaxed">
          The all-in-one professional dashboard to manage enrollments, track academic progress, and organize your institution securely in the cloud.
        </p>

        {/* Calls to Action */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
          <Link 
            href="/login" 
            className="group flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700 shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            Go to Dashboard <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            href="/signup" 
            className="flex items-center justify-center px-8 py-4 text-lg font-bold text-slate-700 bg-white border-2 border-slate-200 rounded-full hover:border-slate-300 hover:bg-slate-50 transition-all"
          >
            Create Admin Account
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-12 text-left">
          <div className="bg-white/60 backdrop-blur-lg p-6 rounded-3xl border border-white shadow-sm hover:shadow-md transition-shadow">
             <ShieldCheck className="w-8 h-8 text-blue-600 mb-4" />
             <h3 className="text-xl font-bold text-slate-900 mb-2">Bank-Grade Security</h3>
             <p className="text-slate-600">Encrypted passwords and secure JWT authentication to protect student data.</p>
          </div>
          <div className="bg-white/60 backdrop-blur-lg p-6 rounded-3xl border border-white shadow-sm hover:shadow-md transition-shadow">
             <Zap className="w-8 h-8 text-amber-500 mb-4" />
             <h3 className="text-xl font-bold text-slate-900 mb-2">Lightning Fast</h3>
             <p className="text-slate-600">Built on Next.js 14 and edge infrastructure for instant reporting and management.</p>
          </div>
          <div className="bg-white/60 backdrop-blur-lg p-6 rounded-3xl border border-white shadow-sm hover:shadow-md transition-shadow">
             <Users className="w-8 h-8 text-purple-600 mb-4" />
             <h3 className="text-xl font-bold text-slate-900 mb-2">Intuitive UI</h3>
             <p className="text-slate-600">A clean, modern interface that requires zero training for administrators to use.</p>
          </div>
        </div>
      </div>
    </div>
  );
}