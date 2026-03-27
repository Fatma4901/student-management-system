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

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  };

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/students', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
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
        headers: {
          'Authorization': `Bearer ${token}`,
        },
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

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', course_id: '' });
    setEditingStudent(null);
  };

  const openModal = (student?: Student) => {
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

  const courseOptions = courses.map(course => ({
    value: course.id.toString(),
    label: course.name
  }));

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'course_name', header: 'Course' },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: any, row: Student) => (
        <div className="space-x-2">
          <Button
            onClick={() => openModal(row)}
            variant="secondary"
            className="text-xs"
          >
            Edit
          </Button>
          <Button
            onClick={() => {
              setStudentToDelete(row.id);
              setDeleteConfirmOpen(true);
            }}
            variant="danger"
            className="text-xs"
          >
            Delete
          </Button>
        </div>
      )
    }
  ];

  return (
    <>
      <div className="p-8 w-full max-w-7xl mx-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Students Management</h1>
            <Button onClick={() => openModal()}>
              Add New Student
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow">
            <Table
              columns={columns}
              data={students}
              loading={loading}
              emptyMessage="No students found"
            />
          </div>
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
            required
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(value) => setFormData({ ...formData, email: value })}
            required
          />
          <Input
            label="Phone"
            value={formData.phone}
            onChange={(value) => setFormData({ ...formData, phone: value })}
          />
          <Select
            label="Course"
            value={formData.course_id}
            onChange={(value) => setFormData({ ...formData, course_id: value })}
            options={courseOptions}
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingStudent ? 'Update' : 'Create'}
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