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

    const marksValue = parseInt(formData.marks);
    if (marksValue < 0 || marksValue > 100) {
      toast.error('Marks must be between 0 and 100');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const url = '/api/marks';
      const method = editingMark ? 'PUT' : 'POST';
      const body = editingMark ? { ...formData, marks: marksValue, id: editingMark.id } : { ...formData, marks: marksValue };

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
        toast.success(data.message || (editingMark ? 'Marks updated successfully' : 'Marks added successfully'));
        await fetchData();
        setModalOpen(false);
        resetForm();
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
    if (m >= 90) return 'A';
    if (m >= 75) return 'B';
    if (m >= 50) return 'C';
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
    { key: 'student_name', header: 'Student Name' },
    { key: 'course_name', header: 'Course' },
    { key: 'marks', header: 'Marks', render: (val: number) => <span className="font-semibold text-gray-800">{val} / 100</span> },
    { key: 'grade', header: 'Grade', render: (_: any, row: any) => {
        const g = getGrade(row.marks);
        return <span className="font-bold text-gray-700">{g}</span>;
      }
    },
    { key: 'status', header: 'Status', render: (_: any, row: any) => {
        const isPass = getStatus(row.marks) === 'Pass';
        return (
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${isPass ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {isPass ? 'PASS' : 'FAIL'}
          </span>
        );
      }
    },
    { key: 'actions', header: 'Actions', render: (_: any, row: any) => (
        <div className="space-x-2">
          <Button onClick={() => openModal(row)} variant="secondary" className="text-xs">Edit</Button>
          <Button onClick={() => { setMarkToDelete(row.id); setDeleteConfirmOpen(true); }} variant="danger" className="text-xs">Delete</Button>
        </div>
      )
    }
  ];

  return (
    <>
      <div className="p-8 w-full max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Marks Management</h1>
          <Button onClick={() => openModal()}>Assign Marks</Button>
        </div>

        {/* Bonus Analytics Bar */}
        {marks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white shadow-sm border border-gray-100 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">System Avg Marks</p>
                <p className="text-2xl font-bold text-gray-800">
                  {(marks.reduce((sum, m) => sum + m.marks, 0) / marks.length).toFixed(1)} <span className="text-lg font-normal text-gray-400">/ 100</span>
                </p>
              </div>
            </div>
            {topPerformer && (
              <div className="p-4 bg-white shadow-sm border border-gray-100 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Top Performer</p>
                  <p className="text-lg font-bold text-gray-800">{topPerformer.student_name}</p>
                  <p className="text-sm text-green-600 font-medium">{topPerformer.course_name} — {topPerformer.marks}/100</p>
                </div>
                <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 text-xl">🏆</div>
              </div>
            )}
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <Input 
             value={searchQuery} 
             onChange={setSearchQuery} 
             placeholder="Search by student name..." 
             className="md:w-1/2 mb-0" 
          />
          <Select 
             value={courseFilter} 
             onChange={setCourseFilter} 
             options={courseOptions} 
             placeholder="Filter by Course (All)" 
             className="md:w-1/2 mb-0" 
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <Table columns={columns} data={filteredMarks} loading={loading} emptyMessage="No marks found fitting criteria." />
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingMark ? "Edit Marks" : "Assign Marks"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select label="Student" value={formData.student_id} onChange={(value) => setFormData({ ...formData, student_id: value })} options={studentOptions} required />
          <Select label="Course" value={formData.course_id} onChange={(value) => setFormData({ ...formData, course_id: value })} options={courseOptions} required />
          <Input label="Marks (0-100)" type="number" value={formData.marks} onChange={(value) => setFormData({ ...formData, marks: value })} min="0" max="100" required />

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editingMark ? "Update Marks" : "Assign Marks"}</Button>
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