'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, BookOpen, GraduationCap, LogOut, Settings, ShieldCheck, UserCircle, ChevronRight } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'student'] },
  { name: 'Students', href: '/students', icon: Users, roles: ['admin'] },
  { name: 'Courses', href: '/courses', icon: BookOpen, roles: ['admin'] },
  { name: 'My Results', href: '/marks', icon: GraduationCap, roles: ['admin', 'student'] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('admin'); // Default to admin for legacy

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const decoded = JSON.parse(jsonPayload);
        setUserEmail(decoded.email);
        setUserRole(decoded.role || 'admin');
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    localStorage.removeItem('token');
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/login');
  };

  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="w-72 bg-white/80 backdrop-blur-xl border-r border-slate-200/50 h-screen flex flex-col fixed inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out font-sans shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)]">
      {/* 🚀 Header / Brand */}
      <div className="px-8 py-10 text-center">
        <Link href="/" className="flex flex-col items-center gap-3 group">
          <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[1.2rem] shadow-xl shadow-blue-500/20 group-hover:rotate-6 transition-transform duration-500">
             <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase">
            SMS <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Pro</span>
          </span>
        </Link>
      </div>

      {/* 🧭 Navigation Section */}
      <div className="flex-1 px-4 space-y-10 overflow-y-auto w-full no-scrollbar pb-10">
        <div>
          <p className="px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 opacity-70">Main Portal</p>
          <nav className="space-y-1.5 px-2">
            {filteredNavItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-5 py-4 rounded-2xl font-bold transition-all duration-300 group ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-2xl shadow-slate-950/20'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-blue-400' : 'group-hover:text-blue-600'}`} />
                    <span className="text-[14px]">{item.name}</span>
                  </div>
                  {isActive ? (
                     <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                  ) : (
                     <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-40 group-hover:translate-x-0 transition-all" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {userRole === 'admin' && (
          <div>
             <p className="px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 opacity-70">Management</p>
             <div className="space-y-1.5 px-2">
                <button className="flex items-center gap-3 w-full px-5 py-4 rounded-2xl text-[14px] font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all group">
                   <Settings className="w-5 h-5 group-hover:text-amber-600" />
                   <span>Settings</span>
                </button>
                <button className="flex items-center gap-3 w-full px-5 py-4 rounded-2xl text-[14px] font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all group">
                   <ShieldCheck className="w-5 h-5 group-hover:text-green-600" />
                   <span>Security</span>
                </button>
             </div>
          </div>
        )}
      </div>

      {/* 👤 Footer / User Account */}
      <div className="p-6 mt-auto">
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 rounded-[2rem] p-6 shadow-2xl shadow-slate-950/30 relative overflow-hidden group">
          {/* Subtle decoration */}
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors pointer-events-none" />
          
          <div className="relative z-10 flex flex-col gap-5">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 shadow-inner group-hover:border-blue-500/50 transition-colors">
                  <UserCircle className="w-6 h-6 text-slate-400 group-hover:text-blue-400" />
               </div>
               <div className="overflow-hidden">
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-0.5">
                    {userRole === 'admin' ? 'Authorized Admin' : 'Active Student'}
                  </p>
                  <p className="text-[13px] font-bold text-white truncate w-[130px]" title={userEmail}>
                    {userEmail.split('@')[0]}
                  </p>
               </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 text-white font-bold rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 hover:border-white/10 text-[10px] uppercase tracking-widest group/btn"
            >
              <LogOut className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
              <span>Secure Log Out</span>
            </button>
          </div>
        </div>
        
        <div className="mt-6 flex justify-between items-center px-2">
           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Build v2.4.1</span>
           <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_4px_rgba(34,197,94,1)]"></div>
              <span className="text-[9px] font-black text-slate-900 uppercase">Operational</span>
           </div>
        </div>
      </div>
    </div>
  );
}
