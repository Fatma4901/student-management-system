export interface Admin {
  id: number;
  email: string;
  password: string;
}

export interface Course {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export interface Student {
  id: number;
  name: string;
  email: string;
  phone?: string;
  course_id?: number;
  course?: Course;
  created_at: string;
}

export interface Mark {
  id: number;
  student_id: number;
  subject: string;
  marks: number;
  exam_date?: string;
  created_at: string;
  student?: Student;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}