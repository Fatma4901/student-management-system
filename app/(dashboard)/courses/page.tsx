'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Table from '@/components/Table';
import Modal from '@/components/Modal';
import ConfirmModal from '@/components/ConfirmModal';
import { Course } from '@/types';
import toast, { Toaster } from 'react-hot-toast';
import { 
  BookOpen, Plus, Edit, Trash2, Calendar, FileText, 
  Settings, Loader2, ShieldCheck, ChevronRight, CheckCircle2 
} from 'lucide-react';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [userRole, setUserRole] = useState<string>('admin');

  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchCourses();
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

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/courses', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setCourses(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      toast.error('Failed to sync academic streams');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const method = editingCourse ? 'PUT' : 'POST';
      const body = editingCourse ? { ...formData, id: editingCourse.id } : formData;

      const response = await fetch('/api/courses', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || (editingCourse ? 'Stream updated' : 'Stream created'));
        await fetchCourses();
        setModalOpen(false);
        resetForm();
      } else {
        toast.error(data.message || 'Operation failed');
      }
    } catch (error) {
      toast.error('Network synchronization error');
    }
  };

  const handleDelete = async () => {
    if (!courseToDelete) return;
    setDeleteLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/courses?id=${courseToDelete}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Academic stream retired');
        await fetchCourses();
      } else {
        toast.error(data.message || 'Purge failed');
      }
    } catch (error) {
      toast.error('Network synchronization error');
    } finally {
      setDeleteLoading(false);
      setDeleteConfirmOpen(false);
      setCourseToDelete(null);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setEditingCourse(null);
  };

  const openModal = (course?: Course) => {
    if (userRole !== 'admin') {
      toast.error('Read-only mode enabled for students.');
      return;
    }
    
    if (course) {
      setEditingCourse(course);
      setFormData({
        name: course.name,
        description: course.description || ''
      });
    } else {
      resetForm();
    }
    setModalOpen(true);
  };

  const columns = [
    { 
      key: 'name', 
      header: 'Course Designation',
      render: (val: string, row: Course) => (
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm">
              <BookOpen className="w-5 h-5" />
           </div>
           <div className="flex flex-col">
              <span className="font-bold text-slate-900">{val}</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Reference: #{row.id.toString().padStart(3, '0')}</span>
           </div>
        </div>
      )
    },
    { 
      key: 'description', 
      header: 'Stream Description',
      render: (val: string) => (
        <p className="max-w-xs text-slate-500 line-clamp-2 font-medium leading-relaxed">
          {val || <span className="text-slate-300 italic italic tracking-tight">No meta-description available for this stream.</span>}
        </p>
      )
    },
    {
      key: 'created_at', 
      header: 'Initialization',
      render: (value: string) => (
        <div className="flex items-center gap-2 text-slate-400 font-bold text-[11px]">
           <Calendar className="w-3.5 h-3.5 opacity-50" />
           {new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Management',
      render: (_: any, row: Course) => (
        <div className="flex items-center gap-2">
          {userRole === 'admin' ? (
            <>
              <button
                onClick={() => openModal(row)}
                className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                title="Edit Protocol"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setCourseToDelete(row.id);
                  setDeleteConfirmOpen(true);
                }}
                className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                title="Purge Stream"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg opacity-40">
               <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
               <span className="text-[10px] font-black text-slate-400 uppercase">Authenticated</span>
            </div>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-10 selection:bg-indigo-100">
      <Toaster position="top-right" 
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            borderRadius: '16px',
            fontSize: '12px',
            fontWeight: 800,
            textTransform: 'uppercase'
          }
        }} 
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">
             <Settings className="w-4 h-4" /> System Control
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tighter">Academic Streams</h1>
          <p className="text-slate-500 font-medium max-w-lg">Define and categorize institutional departments and curriculum structures.</p>
        </div>
        
        {userRole === 'admin' && (
          <Button onClick={() => openModal()} className="group relative flex items-center gap-2 px-8 py-3.5 bg-slate-900 border-none shadow-2xl shadow-slate-950/20 active:scale-95 transition-all">
             <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" /> 
             <span>Define New Stream</span>
          </Button>
        )}
      </div>

      {/* Grid Pattern BG Wrapper */}
      <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-100/80 overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none" />
        
        <Table
          columns={columns}
          data={courses}
          loading={loading}
          emptyMessage="Academic database initialized but no active streams found."
        />
      </div>

      {/* Admin Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCourse ? "Synchronize Stream" : "Initialize Stream"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
           <div className="p-5 bg-slate-900 rounded-2xl flex items-start gap-4 shadow-xl">
              <div className="p-2 bg-blue-500/20 rounded-lg"><BookOpen className="w-5 h-5 text-blue-400" /></div>
              <div className="space-y-1">
                 <p className="text-[11px] font-black text-blue-400 uppercase tracking-widest">Protocol Metadata</p>
                 <p className="text-[10px] font-medium text-slate-400 leading-relaxed">Stream designations must be unique and descriptive for proper student categorization.</p>
              </div>
           </div>

           <div className="space-y-5">
              <Input
                label="Stream Designation Name"
                value={formData.name}
                onChange={(value) => setFormData({ ...formData, name: value })}
                placeholder="e.g. Advanced Cybersecurity"
                required
              />
              
              <div className="space-y-1.5 focus-within:text-blue-600 transition-colors">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Curriculum Brief</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100/40 focus:border-blue-500 focus:bg-white outline-none transition-all text-[14px] font-medium text-slate-700 shadow-inner placeholder:text-slate-400/50"
                  placeholder="Enter a comprehensive overview of the academic stream..."
                />
              </div>
           </div>

           <div className="flex justify-end items-center gap-4 pt-8 mt-6 border-t border-slate-100">
             <button
               type="button"
               onClick={() => setModalOpen(false)}
               className="px-6 py-3.3 text-[12px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors"
             >
               Terminate
             </button>
             <Button type="submit" className="px-10 py-3.5 font-bold shadow-2xl shadow-blue-500/20 active:scale-95">
                {editingCourse ? (
                  <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Save Sync</span>
                ) : (
                  <span className="flex items-center gap-2"><Plus className="w-4 h-4" /> Commit Record</span>
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
        message="Are you absolutely sure you want to retire this academic stream? This will affect student categorizations."
      />
    </div>
  );
}