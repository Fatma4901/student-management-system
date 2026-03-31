import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50 flex-col md:flex-row overflow-hidden font-sans">
      {/* 🧭 PREMIUM SIDEBAR */}
      <Sidebar />
      
      {/* 📊 MAIN CONTENT AREA */}
      <main className="flex-1 md:ml-72 flex flex-col min-h-screen overflow-y-auto relative bg-[#f8fafc]">
        {/* Subtle background flair for deep depth */}
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-blue-400/5 rounded-full blur-[100px] pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-indigo-400/5 rounded-full blur-[100px] pointer-events-none -z-10" />
        
        <div className="flex-1 relative z-10 px-8 py-10 w-full max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
           {children}
        </div>

        {/* Global Footer in Dashboard */}
        <footer className="mt-auto px-8 py-6 border-t border-slate-200/50 bg-white/50 backdrop-blur-sm flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest pointer-events-none select-none">
           <span>Management System Cloud Environment</span>
           <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Connected To Railway Database
           </div>
        </footer>
      </main>
    </div>
  );
}
