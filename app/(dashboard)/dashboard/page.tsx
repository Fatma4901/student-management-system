'use client';

import { BookOpen, GraduationCap, Users } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="p-8 w-full max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Students</p>
            <h3 className="text-2xl font-bold text-gray-900">Manage</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Active Courses</p>
            <h3 className="text-2xl font-bold text-gray-900">Manage</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Marks Database</p>
            <h3 className="text-2xl font-bold text-gray-900">View</h3>
          </div>
        </div>
      </div>
    </div>
  );
}