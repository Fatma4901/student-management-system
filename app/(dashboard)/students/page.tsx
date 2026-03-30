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
import toast from 'react-hot-toast';

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // PHONE NUMBER VALIDATION
    if (formData.phone && formData.phone.length !== 10) {
      toast.error('Invalid Phone Number: Must be exactly 10 digits.', {
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const url = editingStudent ? '/api/students' : '/api/students';
      const method = editingStudent ? 'PUT' : 'POST';
      const body = editingStudent
        ? { ...formData, id: editingStudent.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || (editingStudent ? 'Student updated successfully' : 'Student added successfully'));
        await fetchStudents();
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
    if (!studentToDelete) return;
    setDeleteLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/students?id=${studentToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || 'Student deleted successfully');
        await fetchStudents();
      } else {
        toast.error(data.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Network error');
    } finally {
      setDeleteLoading(false);
      setDeleteConfirmOpen(false);
      setStudentToDelete(null);
    }
  };

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', course_id: '' });
    setEditingStudent(null);
  };

  const openModal = (student?: Student) => {
    if (student && !('nativeEvent' in student)) {
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

  useEffect(() => {
    checkAuth();
    fetchStudents();
    fetchCourses();
  }, []);

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

  // FILTER LOGIC: Apply search and course filter instantly
  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCourse =
      selectedCourse === 'all' ||
      student.course_id?.toString() === selectedCourse;

    return matchesSearch && matchesCourse;
  });

  // Dropdown options for the Modal Form (only real courses)
  const formCourseOptions = courses.map(course => ({
    value: course.id.toString(),
    label: course.name
  }));

  // Dropdown options for the Search Filter (includes "All")
  const filterCourseOptions = [
    { value: 'all', label: 'All Courses' },
    ...formCourseOptions
  ];

  const columns = [
    { key: 'name', header: 'Name', render: (val: string) => <span className="font-bold text-gray-900">{val}</span> },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone', render: (val: string) => val || <span className="text-gray-300 italic">None</span> },
    { key: 'course_name', header: 'Course', render: (val: string) => <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-bold uppercase">{val || 'No Course'}</span> },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: any, row: Student) => (
        <div className="space-x-2">
          <Button
            onClick={() => openModal(row)}
            variant="secondary"
            className="text-xs py-1 px-3"
          >
            Edit
          </Button>
          <Button
            onClick={() => {
              setStudentToDelete(row.id);
              setDeleteConfirmOpen(true);
            }}
            variant="danger"
            className="text-xs py-1 px-3"
          >
            Delete
          </Button>
        </div>
      )
    }
  ];

  return (
    <>
      <div className="p-8 w-full max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Students Management</h1>
            <p className="text-gray-500 text-sm">View, search, and manage student records efficiently.</p>
          </div>
          <Button onClick={() => openModal()} className="shadow-lg shadow-blue-100">
            + Add New Student
          </Button>
        </div>

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
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
            />
          </div>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm font-medium text-gray-700"
          >
            {filterCourseOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <Table
            columns={columns}
            data={filteredStudents}
            loading={loading}
            emptyMessage={searchTerm || selectedCourse !== 'all' ? "No students match your filters" : "No students found"}
          />
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingStudent ? 'Edit Student' : 'Add New Student'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            value={formData.name}
            onChange={(value) => setFormData({ ...formData, name: value })}
            placeholder="e.g. John Doe"
            required
          />
          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(value) => setFormData({ ...formData, email: value })}
            placeholder="e.g. john@example.com"
            required
          />
          <Input
            label="Phone Number"
            type="tel"
            maxLength={10}
            value={formData.phone}
            onChange={(value) => setFormData({ ...formData, phone: value.replace(/\D/g, '') })}
            placeholder="e.g. 9876543210 (10 digits)"
          />
          <Select
            label="Enrolled Course"
            value={formData.course_id}
            onChange={(value) => setFormData({ ...formData, course_id: value })}
            options={formCourseOptions}
            placeholder="-- Select a Course --"
          />

          <div className="flex justify-end items-center gap-3 pt-6 mt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setModalOpen(false)}
              className="px-6 py-2.5 font-bold text-gray-600 hover:text-gray-900"
            >
              Cancel
            </Button>
            <Button type="submit" className="px-8 py-2.5 font-bold shadow-lg shadow-blue-200">
              {editingStudent ? 'Update Student' : 'Create Student'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Student"
        message={`Are you sure you want to delete this student? This action cannot be undone.`}
      />
    </>
  );
}