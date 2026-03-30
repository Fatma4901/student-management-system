'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Select from '@/components/Select';
import Table from '@/components/Table';
import Modal from '@/components/Modal';
import ConfirmModal from '@/components/ConfirmModal';
import toast from 'react-hot-toast';

export default function MarksPage() {
  const [marks, setMarks] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    fetchData();
  }, []);

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
      toast.error('Failed to load marks datatable');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.student_id) {
       toast.error("Please select a student.");
       return;
    }

    try {
      const token = localStorage.getItem('token');
      const url = '/api/marks';
      const method = editingMark ? 'PUT' : 'POST';
      
      // Multi-subject bulk save for POST, single save for PUT (edit)
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
          toast.error("Please enter at least one mark.");
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
        toast.success(data.message || 'Marks saved successfully');
        await fetchData();
        setModalOpen(false);
        resetForm();
        setSelectedSubjects({});
      } else {
        toast.error(data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Network error');
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
        toast.success('Marks deleted successfully');
        await fetchData();
      } else {
        toast.error(data.message || 'Delete failed');
      }
    } catch (error) {
      toast.error('Network error');
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
    if (mark && !('nativeEvent' in mark)) {
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

  // Grade & Status logic
  const getGrade = (m: number) => {
    if (m >= 90) return 'A+';
    if (m >= 80) return 'A';
    if (m >= 70) return 'B';
    if (m >= 60) return 'C';
    if (m >= 50) return 'D';
    return 'F';
  };

  const getStatus = (m: number) => m >= 50 ? 'Pass' : 'Fail';

  // Computed Values
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

  const studentOptions = students.map(s => ({ value: s.id.toString(), label: `${s.name} (${s.email})` }));
  const courseOptions = courses.map(c => ({ value: c.id.toString(), label: c.name }));

  const columns = [
    { key: 'student_name', header: 'Student Name', render: (val: string) => <span className="font-bold text-gray-900">{val}</span> },
    { key: 'course_name', header: 'Subject', render: (val: string) => <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs font-bold">{val}</span> },
    { key: 'marks', header: 'Marks', render: (val: number) => <span className="font-black text-blue-600">{val} / 100</span> },
    { key: 'grade', header: 'Grade', render: (_: any, row: any) => {
        const g = getGrade(row.marks);
        return <span className={`font-black text-lg ${g === 'F' ? 'text-red-500' : 'text-gray-900'}`}>{g}</span>;
      }
    },
    { key: 'status', header: 'Status', render: (_: any, row: any) => {
        const isPass = getStatus(row.marks) === 'Pass';
        return (
          <div className="flex items-center gap-1.5 justify-center">
             <span className={`block w-2 h-2 rounded-full ${isPass ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]'}`} />
             <span className={`text-xs font-bold ${isPass ? 'text-green-600' : 'text-red-600'}`}>
               {isPass ? 'PASS' : 'FAIL'}
             </span>
          </div>
        );
      }
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: any, row: any) => (
        <div className="space-x-2">
          <Button onClick={() => openModal(row)} variant="secondary" className="text-xs py-1 px-3">Edit</Button>
          <Button onClick={() => { setMarkToDelete(row.id); setDeleteConfirmOpen(true); }} variant="danger" className="text-xs py-1 px-3">Delete</Button>
        </div>
      )
    }
  ];

  return (
    <>
      <div className="p-8 w-full max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Marks Management</h1>
            <p className="text-gray-500 text-sm">Assign, track, and manage student grades effectively.</p>
          </div>
          <Button onClick={() => openModal()} className="shadow-lg shadow-blue-100">
            + Assign Marks
          </Button>
        </div>

        {/* Bonus Analytics Bar */}
        {marks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 opacity-50 rounded-bl-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform" />
              <div className="relative z-10">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">System Avg Marks</p>
                <p className="text-4xl font-black text-gray-900">
                  {(marks.reduce((sum, m) => sum + m.marks, 0) / marks.length).toFixed(1)} <span className="text-xl font-bold text-gray-300">/ 100</span>
                </p>
              </div>
            </div>
            {topPerformer && (
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-50 opacity-50 rounded-bl-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform" />
                <div className="relative z-10">
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Top Performer</p>
                  <p className="text-2xl font-black text-gray-900">{topPerformer.student_name}</p>
                  <p className="text-sm text-green-600 font-bold mt-1 bg-green-50 inline-block px-2 py-0.5 rounded-md">{topPerformer.course_name} — {topPerformer.marks}/100</p>
                </div>
                <div className="relative z-10 h-14 w-14 bg-yellow-100 rounded-2xl flex items-center justify-center text-yellow-600 text-3xl shadow-sm">
                  🏆
                </div>
              </div>
            )}
          </div>
        )}

        {/* 🔍 FILTER SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div className="md:col-span-2 relative">
             <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
             </div>
             <input 
               type="text"
               placeholder="Search by student name..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
             />
          </div>
          <select 
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm font-medium text-gray-700"
          >
            <option value="">All Subjects</option>
            {courseOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <Table columns={columns} data={filteredMarks} loading={loading} emptyMessage={searchQuery || courseFilter ? "No marks match your filters" : "No marks found"} />
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingMark ? "Edit Subject Marks" : "Assign Full Report Card Marks"}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 mb-2">
             <Select label="1. Select Student" value={formData.student_id} onChange={(value) => setFormData({ ...formData, student_id: value })} options={studentOptions} placeholder="Choose Student..." required />
          </div>

          <div className="space-y-4 px-2">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest pl-2">2. Enter Subject Marks</h3>
            
            {editingMark ? (
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl space-y-3">
                 <p className="text-xs font-bold text-blue-500 uppercase">Editing Subject: {editingMark.course_name}</p>
                 <Input label="Marks (0-100)" type="number" value={formData.marks} onChange={(value) => setFormData({ ...formData, marks: value })} min="0" max="100" placeholder="e.g. 85" required />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {courses.map((course: any) => (
                  <div key={course.id} className="grid grid-cols-2 items-center gap-4 p-4 bg-gray-50/50 border border-gray-100 rounded-2xl group hover:bg-white hover:border-blue-200 transition-all">
                     <span className="text-sm font-bold text-gray-700 group-hover:text-blue-600">{course.name}</span>
                     <input 
                       type="number" 
                       min="0" 
                       max="100" 
                       placeholder="0-100"
                       className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-black"
                       value={selectedSubjects[course.id] || ''}
                       onChange={(e) => setSelectedSubjects({...selectedSubjects, [course.id]: e.target.value})}
                     />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end items-center gap-3 pt-6 border-t border-gray-100">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setModalOpen(false)}
              className="px-6 py-2.5 font-bold text-gray-600 hover:text-gray-900"
            >
              Cancel
            </Button>
            <Button type="submit" className="px-8 py-2.5 font-bold shadow-lg shadow-blue-200">
              {editingMark ? "Update Marks" : "Save Report Card"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Marks"
        message="Are you sure you want to delete this mark entry? This action cannot be undone."
      />
    </>
  );
}