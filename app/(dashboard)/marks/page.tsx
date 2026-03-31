'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Select from '@/components/Select';
import Table from '@/components/Table';
import Modal from '@/components/Modal';
import ConfirmModal from '@/components/ConfirmModal';
import toast, { Toaster } from 'react-hot-toast';
import { 
  Trophy, TrendingUp, Search, Plus, Edit, Trash2, 
  BarChart3, User, BookOpen, GraduationCap, 
  AlertCircle, ChevronRight, CheckCircle2, ShieldCheck, 
  Target, Download, Settings
} from 'lucide-react';

export default function MarksPage() {
  const [marks, setMarks] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>('admin');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('');

  // Form State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<any>({});
  const [editingMark, setEditingMark] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    student_id: '',
    course_id: '',
    marks: ''
  });

  // Delete State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [markToDelete, setMarkToDelete] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchData();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserRole(payload.role || 'admin');
    } catch (e) {
      setUserRole('admin');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [marksRes, stdRes, courseRes] = await Promise.all([
        fetch('/api/marks', { headers }),
        fetch('/api/students', { headers }),
        fetch('/api/courses', { headers })
      ]);

      if (marksRes.ok) {
        const marksData = await marksRes.json();
        setMarks(marksData.data || []);
      }
      if (stdRes.ok) {
        const stdData = await stdRes.json();
        setStudents(stdData.data || []);
      }
      if (courseRes.ok) {
        const courseData = await courseRes.json();
        setCourses(courseData.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to synchronize grading datatable');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.student_id) {
       toast.error("Please assign an identity.");
       return;
    }

    try {
      const token = localStorage.getItem('token');
      const url = '/api/marks';
      const method = editingMark ? 'PUT' : 'POST';
      
      let body;
      if (editingMark) {
        body = { id: editingMark.id, student_id: formData.student_id, course_id: formData.course_id, marks: parseInt(formData.marks) };
      } else {
        body = Object.keys(selectedSubjects).map(courseId => ({
          student_id: formData.student_id,
          course_id: courseId,
          marks: parseInt(selectedSubjects[courseId])
        })).filter(entry => !isNaN(entry.marks));

        if (body.length === 0) {
          toast.error("Please enter at least one subject parameter.");
          return;
        }
      }

      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || 'Identity parameters updated');
        await fetchData();
        setModalOpen(false);
        resetForm();
        setSelectedSubjects({});
      } else {
        toast.error(data.message || 'Operation failed');
      }
    } catch (error) {
      toast.error('Network synchronization error');
    }
  };

  const handleDelete = async () => {
    if (!markToDelete) return;
    setDeleteLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/marks?id=${markToDelete}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Subject parameter purged');
        await fetchData();
      } else {
        toast.error(data.message || 'Purge failed');
      }
    } catch (error) {
      toast.error('Network synchronization error');
    } finally {
      setDeleteLoading(false);
      setDeleteConfirmOpen(false);
      setMarkToDelete(null);
    }
  };

  const resetForm = () => {
    setFormData({ student_id: '', course_id: '', marks: '' });
    setEditingMark(null);
    setSelectedSubjects({});
  };

  const openModal = (mark?: any) => {
    if (userRole !== 'admin') {
      toast.error('Access Denied: Read-only mode activated.');
      return;
    }
    
    if (mark) {
      setEditingMark(mark);
      setFormData({
        student_id: mark.student_id.toString(),
        course_id: mark.course_id.toString(),
        marks: mark.marks.toString()
      });
    } else {
      resetForm();
    }
    setModalOpen(true);
  };

  const getGrade = (m: number) => {
    if (m >= 90) return 'A+';
    if (m >= 80) return 'A';
    if (m >= 70) return 'B';
    if (m >= 60) return 'C';
    if (m >= 50) return 'D';
    return 'F';
  };

  const getStatus = (m: number) => m >= 50 ? 'Pass' : 'Fail';

  const filteredMarks = useMemo(() => {
    return marks.filter((m) => {
      const matchName = m.student_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCourse = courseFilter ? m.course_id.toString() === courseFilter : true;
      return matchName && matchCourse;
    });
  }, [marks, searchQuery, courseFilter]);

  const topPerformer = useMemo(() => {
    if (marks.length === 0) return null;
    return [...marks].sort((a, b) => b.marks - a.marks)[0];
  }, [marks]);

  const avgMarks = useMemo(() => {
    if (marks.length === 0) return 0;
    return (marks.reduce((sum, m) => sum + m.marks, 0) / marks.length);
  }, [marks]);

  const studentOptions = students.map(s => ({ value: s.id.toString(), label: `${s.name} (${s.email})` }));
  const courseOptions = courses.map(c => ({ value: c.id.toString(), label: c.name }));

  const columns = [
    { 
      key: 'student_name', 
      header: 'Student Identity', 
      render: (val: string, row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200/50 group-hover/row:bg-white transition-colors duration-500">
            <User className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
             <span className="font-bold text-slate-900">{val}</span>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Sync: #{row.id.toString().padStart(4, '0')}</span>
          </div>
        </div>
      ) 
    },
    { 
      key: 'course_name', 
      header: 'Academic Parameter', 
      render: (val: string) => (
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-lg shadow-sm">
           <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
           <span className="text-[11px] font-black text-slate-700 uppercase tracking-wide">{val}</span>
        </div>
      ) 
    },
    { 
      key: 'marks', 
      header: 'Quantified Value', 
      render: (val: number) => (
        <div className="flex flex-col">
           <span className="font-black text-slate-900 text-[15px]">{val} <span className="text-[11px] text-slate-300 font-bold uppercase">/ 100</span></span>
           <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1.5 border border-slate-200/50">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${val >= 85 ? 'from-green-400 to-emerald-500' : val >= 60 ? 'from-blue-400 to-indigo-500' : val >= 40 ? 'from-yellow-400 to-orange-500' : 'from-red-400 to-rose-500'}`}
                style={{ width: `${val}%` }}
              />
           </div>
        </div>
      ) 
    },
    { 
      key: 'grade', 
      header: 'Evaluation', 
      render: (_: any, row: any) => {
        const g = getGrade(row.marks);
        return (
          <div className="flex flex-col items-center">
             <span className={`text-xl font-black italic tracking-tighter ${g === 'F' ? 'text-red-500' : 'text-slate-900'}`}>{g}</span>
             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{getStatus(row.marks)}</span>
          </div>
        );
      }
    },
    {
      key: 'actions',
      header: 'System Ops',
      render: (_: any, row: any) => (
        <div className="flex items-center gap-2">
          {userRole === 'admin' ? (
            <>
              <button
                onClick={() => openModal(row)}
                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                title="Calibrate Protocol"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setMarkToDelete(row.id);
                  setDeleteConfirmOpen(true);
                }}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                title="Purge Identity Parameter"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg opacity-40">
               <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Registered</span>
            </div>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-10 selection:bg-blue-100">
      <Toaster position="top-right" 
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            borderRadius: '16px',
            fontSize: '12px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }
        }} 
      />
      
      {/* 🚀 Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">
             <GraduationCap className="w-4 h-4" /> Academic Board
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tighter">Grading Protocols</h1>
          <p className="text-slate-500 font-medium max-w-lg">Execute academic parameter calibrations and manage student performance datasets.</p>
        </div>
        
        {userRole === 'admin' && (
          <Button onClick={() => openModal()} className="group relative flex items-center gap-2 px-8 py-3.5 bg-slate-900 border-none shadow-2xl shadow-slate-950/20 active:scale-95 transition-all">
             <Target className="w-5 h-5 group-hover:scale-110 transition-transform" /> 
             <span>Calibrate Marks</span>
          </Button>
        )}
      </div>

      {/* 📊 High-End Analytics Bar */}
      {marks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col gap-1 relative overflow-hidden group">
             <TrendingUp className="absolute -right-2 -bottom-2 w-16 h-16 text-blue-50/50 group-hover:scale-110 transition-transform duration-700" />
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest relative z-10">Mean Performance</span>
             <span className="text-3xl font-black text-slate-900 relative z-10">{avgMarks.toFixed(1)} <span className="text-sm font-bold text-slate-300">/ 100</span></span>
          </div>
          
          <div className="lg:col-span-2 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex items-center justify-between gap-6 group hover:shadow-xl hover:shadow-yellow-400/5 transition-all duration-500 px-8 py-6">
             {topPerformer && (
               <>
                 <div className="flex flex-col gap-1">
                   <span className="text-[10px] font-black text-yellow-600 uppercase tracking-widest flex items-center gap-1.5"><Trophy className="w-3 h-3" /> Top Protocol</span>
                   <span className="text-xl font-bold text-slate-900 truncate max-w-[200px]">{topPerformer.student_name}</span>
                   <p className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
                     <span className="font-bold text-green-600">{topPerformer.marks}% GPA</span> 
                     <span className="opacity-30">|</span> 
                     {topPerformer.course_name}
                   </p>
                 </div>
                 <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-[1.3rem] flex items-center justify-center text-white shadow-xl shadow-yellow-500/20 group-hover:rotate-12 transition-transform duration-500 shrink-0">
                    <TrendingUp className="w-8 h-8" />
                 </div>
               </>
             )}
          </div>

          <div className="lg:col-span-1 bg-slate-950 p-6 rounded-[2rem] shadow-2xl flex flex-col gap-1 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <ShieldCheck className="w-16 h-16 text-white" />
             </div>
             <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest relative z-10 font-black">Sync Status</span>
             <span className="text-2xl font-bold text-white relative z-10 flex items-center gap-2">CRYPTO 4 <CheckCircle2 className="w-5 h-5 text-green-500" /></span>
          </div>
        </div>
      )}

      {/* 🔍 Smart Tools Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-3xl border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] group/bar">
         <div className="flex-1 relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search by student identity credentials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100/30 focus:border-blue-500 focus:bg-white outline-none transition-all text-[14px] font-bold text-slate-700 placeholder:text-slate-400/70"
            />
         </div>
         
         <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
               <BarChart3 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <select 
                 value={courseFilter}
                 onChange={(e) => setCourseFilter(e.target.value)}
                 className="w-full pl-11 pr-10 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100/30 focus:border-blue-500 focus:bg-white outline-none transition-all text-[13px] font-bold text-slate-700 appearance-none cursor-pointer"
               >
                 <option value="">All Streams</option>
                 {courseOptions.map(opt => (
                   <option key={opt.value} value={opt.value}>{opt.label}</option>
                 ))}
               </select>
            </div>

            <button className="hidden md:flex items-center gap-2 px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-[13px] font-bold text-slate-500 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm active:scale-95">
               <Download className="w-4 h-4" /> <span>Sync Log</span>
            </button>
         </div>
      </div>

      {/* 📋 Data Grid */}
      <div className="bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-100/80 overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none" />
        <Table columns={columns} data={filteredMarks} loading={loading} emptyMessage={searchQuery || courseFilter ? "No protocol matches found" : "Grading database is currently null"} />
      </div>

      {/* Admin Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingMark ? "Calibrate Parameter" : "Initialize Grading Protocol"}>
        <form onSubmit={handleSubmit} className="space-y-8 px-1 py-1">
          <div className="p-5 bg-blue-600 rounded-3xl border border-blue-400 shadow-2xl shadow-blue-600/20 relative overflow-hidden group">
             <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
             <Select label="1. Target Student Identity" value={formData.student_id} onChange={(value) => setFormData({ ...formData, student_id: value })} options={studentOptions} placeholder="Choose Target Identification..." required />
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3 pl-2">
               <Target className="w-5 h-5 text-indigo-600" />
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">2. Quantitative Calibration</h3>
            </div>
            
            {editingMark ? (
              <div className="p-6 bg-slate-950 rounded-[2rem] space-y-4 border border-slate-800 shadow-2xl relative overflow-hidden">
                 <div className="absolute right-0 top-0 p-4 opacity-10"><Settings className="w-16 h-16 text-white" /></div>
                 <p className="text-[11px] font-black text-indigo-400 uppercase tracking-widest relative z-10 flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5" /> Modifying Protocol: {editingMark.course_name}</p>
                 <Input label="Verified Marks (0.0 - 100.0)" type="number" value={formData.marks} onChange={(value) => setFormData({ ...formData, marks: value })} min="0" max="100" placeholder="Parameter value" required />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-3 custom-scrollbar">
                {courses.map((course: any) => (
                  <div key={course.id} className="flex flex-col gap-2 p-5 bg-slate-50 border border-slate-100 rounded-2xl group hover:bg-white hover:border-indigo-400/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all">
                     <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest group-hover:text-indigo-600 transition-colors">{course.name}</span>
                     <div className="relative">
                        <input 
                          type="number" 
                          min="0" 
                          max="100" 
                          placeholder="Value"
                          className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-[1.2rem] focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all text-lg font-black text-slate-900 placeholder:text-slate-200"
                          value={selectedSubjects[course.id] || ''}
                          onChange={(e) => setSelectedSubjects({...selectedSubjects, [course.id]: e.target.value})}
                        />
                        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">PARAM</span>
                     </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end items-center gap-4 pt-8 mt-6 border-t border-slate-100">
             <button
               type="button"
               disabled={deleteLoading}
               onClick={() => setModalOpen(false)}
               className="px-6 py-3.3 text-[12px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors"
             >
               Terminate
             </button>
             <Button type="submit" className="px-12 py-4 font-bold shadow-2xl shadow-indigo-600/20 active:scale-95 text-[15px] rounded-2xl bg-slate-900 border-none">
                {editingMark ? (
                  <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Save Sync</span>
                ) : (
                  <span className="flex items-center gap-2"><Plus className="w-5 h-5" /> Commit Dataset</span>
                )}
             </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Purge Protocol"
        message="Are you absolutely sure you want to purge this identity parameter? This operation is persistent."
      />
    </div>
  );
}