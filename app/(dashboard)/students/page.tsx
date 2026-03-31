'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Select from '@/components/Select';
import Table from '@/components/Table';
import Modal from '@/components/Modal';
import ConfirmModal from '@/components/ConfirmModal';
import { Student, Course } from '@/types';
import toast, { Toaster } from 'react-hot-toast';
import { 
  Users, Search, UserPlus, Filter, Download, MoreHorizontal, 
  Edit, Trash2, Mail, Phone, BookOpen, GraduationCap, 
  AlertCircle, ChevronRight, CheckCircle2, Loader2, Plus,
  ShieldCheck
} from 'lucide-react';

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [userRole, setUserRole] = useState<string>('admin');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course_id: ''
  });
  
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchStudents();
    fetchCourses();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    
    // Check role for RBAC
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserRole(payload.role || 'admin');
    } catch (e) {
      setUserRole('admin');
    }
  };

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/students', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setStudents(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch students:', error);
      toast.error('Failed to sync student data');
    } finally {
      setLoading(false);
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
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.phone && formData.phone.length !== 10) {
      toast.error('Invalid Phone Number: Must be exactly 10 digits.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const method = editingStudent ? 'PUT' : 'POST';
      const body = editingStudent ? { ...formData, id: editingStudent.id } : formData;

      const response = await fetch('/api/students', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || (editingStudent ? 'Updated successfully' : 'Joined successfully'));
        await fetchStudents();
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
    if (!studentToDelete) return;
    setDeleteLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/students?id=${studentToDelete}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Record purged successfully');
        await fetchStudents();
      } else {
        toast.error(data.message || 'Purge failed');
      }
    } catch (error) {
      toast.error('Network synchronization error');
    } finally {
      setDeleteLoading(false);
      setDeleteConfirmOpen(false);
      setStudentToDelete(null);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', course_id: '' });
    setEditingStudent(null);
  };

  const openModal = (student?: Student) => {
    if (userRole !== 'admin') {
      toast.error('Access Denied: Read-only mode for students.');
      return;
    }
    
    if (student) {
      setEditingStudent(student);
      setFormData({
        name: student.name,
        email: student.email,
        phone: student.phone || '',
        course_id: student.course_id?.toString() || ''
      });
    } else {
      resetForm();
    }
    setModalOpen(true);
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');

  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourse === 'all' || student.course_id?.toString() === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  const formCourseOptions = courses.map(course => ({
    value: course.id.toString(),
    label: course.name
  }));

  const filterCourseOptions = [
    { value: 'all', label: 'All Enrollments' },
    ...formCourseOptions
  ];

  const columns = [
    { 
      key: 'name', 
      header: 'Student Identity', 
      render: (val: string, row: Student) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200/50">
            <Users className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
             <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{val}</span>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID: {row.id.toString().padStart(4, '0')}</span>
          </div>
        </div>
      ) 
    },
    { 
      key: 'email', 
      header: 'Communication', 
      render: (val: string, row: Student) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-slate-500 font-medium tracking-tight">
            <Mail className="w-3.5 h-3.5 opacity-50" /> {val}
          </div>
          {row.phone && (
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
               <Phone className="w-3 h-3 opacity-50" /> {row.phone}
            </div>
          )}
        </div>
      )
    },
    { 
      key: 'course_name', 
      header: 'Academic Stream', 
      render: (val: string, row: Student) => (
        <div className="group/badge relative inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-all cursor-default">
           <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
           <span className="text-[11px] font-black text-slate-700 uppercase tracking-wide">{val || 'Unassigned'}</span>
        </div>
      ) 
    },
    {
      key: 'actions',
      header: 'System Operations',
      render: (_: any, row: Student) => (
        <div className="flex items-center gap-2">
          {userRole === 'admin' ? (
            <>
              <button
                onClick={() => openModal(row)}
                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                title="Edit Identity"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setStudentToDelete(row.id);
                  setDeleteConfirmOpen(true);
                }}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                title="Purge Record"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg opacity-40">
               <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
               <span className="text-[10px] font-black text-slate-400 uppercase">View Only</span>
            </div>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-10 selection:bg-blue-200">
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
      
      {/* 🚀 Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">
             <GraduationCap className="w-4 h-4" /> Registrar Office
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tighter">Student Identity <span className="text-slate-400 font-light">Cloud</span></h1>
          <p className="text-slate-500 font-medium max-w-lg">Manage and secure high-frequency student enrollment data across global academic departments.</p>
        </div>
        
        {userRole === 'admin' && (
          <div className="flex gap-3">
             <Button onClick={() => openModal()} className="group relative flex items-center gap-2 px-8 py-3.5 bg-slate-900 border-none shadow-2xl shadow-slate-950/20 active:scale-95 transition-all">
                <span className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></span>
                <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" /> 
                <span>Create Identity</span>
             </Button>
          </div>
        )}
      </div>

      {/* 📊 Metrics Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col gap-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Students</span>
            <span className="text-3xl font-black text-slate-900">{students.length}</span>
         </div>
         <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col gap-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Streams</span>
            <span className="text-3xl font-black text-slate-900">{courses.length}</span>
         </div>
         <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col gap-1">
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Global Uptime</span>
            <span className="text-3xl font-black text-slate-900">99.9%</span>
         </div>
         <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col gap-1">
            <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Security Level</span>
            <span className="text-3xl font-black text-slate-900">Tier 4</span>
         </div>
      </div>

      {/* 🔍 Smart Tools Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-3xl border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] group/bar">
         <div className="flex-1 relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within/bar:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by student name or authentication email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100/30 focus:border-blue-500 focus:bg-white outline-none transition-all text-[14px] font-bold text-slate-700 placeholder:text-slate-400/70"
            />
         </div>
         
         <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
               <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <select
                 value={selectedCourse}
                 onChange={(e) => setSelectedCourse(e.target.value)}
                 className="w-full pl-11 pr-10 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100/30 focus:border-blue-500 focus:bg-white outline-none transition-all text-[13px] font-bold text-slate-700 appearance-none cursor-pointer"
               >
                 {filterCourseOptions.map(opt => (
                   <option key={opt.value} value={opt.value}>{opt.label}</option>
                 ))}
               </select>
               <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-90 pointer-events-none" />
            </div>

            <button className="hidden md:flex items-center gap-2 px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-[13px] font-bold text-slate-500 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm active:scale-95">
               <Download className="w-4 h-4" /> <span>Export JSON</span>
            </button>
         </div>
      </div>

      {/* 📋 Data Grid */}
      <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-100/80 overflow-hidden relative group/grid">
        {/* Subtle grid pattern bg */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none" />
        
        <Table
          columns={columns}
          data={filteredStudents}
          loading={loading}
          emptyMessage={searchTerm || selectedCourse !== 'all' ? "No protocols found matching parameters" : "Database initialized but empty"}
        />
      </div>

      {/* 🚀 Admin Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingStudent ? 'Synchronize Identity' : 'Initialize Identity'}
      >
        <form onSubmit={handleSubmit} className="space-y-6 px-1 py-1">
           <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-indigo-600 mt-0.5" />
              <div className="space-y-1">
                 <p className="text-[11px] font-black text-indigo-900 uppercase">Registration Protocol</p>
                 <p className="text-[10px] font-medium text-indigo-700 leading-relaxed">Ensure communication email is unique as it serves as the primary authentication key for student verification access.</p>
              </div>
           </div>

           <div className="grid grid-cols-1 gap-5">
              <Input
                label="Identity Name"
                value={formData.name}
                onChange={(value) => setFormData({ ...formData, name: value })}
                placeholder="Full official name"
                required
              />
              <Input
                label="Communication Email"
                type="email"
                value={formData.email}
                onChange={(value) => setFormData({ ...formData, email: value })}
                placeholder="auth-key@smspro.edu"
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="Contact Phone"
                  type="tel"
                  maxLength={10}
                  value={formData.phone}
                  onChange={(value) => setFormData({ ...formData, phone: value.replace(/\D/g, '') })}
                  placeholder="10-digit international"
                />
                <Select
                  label="Academic Stream"
                  value={formData.course_id}
                  onChange={(value) => setFormData({ ...formData, course_id: value })}
                  options={formCourseOptions}
                  placeholder="Select Stream"
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
               {editingStudent ? (
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
        message="Are you absolutely sure you want to purge this record from memory? This operation cannot be reversed."
      />
    </div>
  );
}