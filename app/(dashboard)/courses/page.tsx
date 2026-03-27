'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Select from '@/components/Select';
import Table from '@/components/Table';
import Modal from '@/components/Modal';
import ConfirmModal from '@/components/ConfirmModal';
import { Course } from '@/types';
import toast from 'react-hot-toast';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
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
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = '/api/courses';
      const method = editingCourse ? 'PUT' : 'POST';
      const body = editingCourse ? { ...formData, id: editingCourse.id } : formData;
      const token = localStorage.getItem('token');

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
        toast.success(data.message || (editingCourse ? 'Course updated successfully' : 'Course added successfully'));
        await fetchCourses();
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
    if (!courseToDelete) return;
    setDeleteLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/courses?id=${courseToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || 'Course deleted successfully');
        await fetchCourses();
      } else {
        toast.error(data.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Network error');
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
    if (course && !('nativeEvent' in course)) {
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
    { key: 'name', header: 'Course Name' },
    { key: 'description', header: 'Description' },
    {
      key: 'created_at', header: 'Created At',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: any, row: Course) => (
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
              setCourseToDelete(row.id);
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
            <h1 className="text-3xl font-bold text-gray-900">Courses Management</h1>
            <Button onClick={() => openModal()}>
              Add New Course
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow">
            <Table
              columns={columns}
              data={courses}
              loading={loading}
              emptyMessage="No courses found"
            />
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCourse ? "Edit Course" : "Add New Course"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Course Name"
            value={formData.name}
            onChange={(value) => setFormData({ ...formData, name: value })}
            required
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Course description (optional)"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingCourse ? "Update Course" : "Create Course"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Course"
        message={`Are you sure you want to delete this course? This action cannot be undone.`}
      />
    </>
  );
}