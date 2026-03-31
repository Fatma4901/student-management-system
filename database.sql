-- Create database
CREATE DATABASE IF NOT EXISTS student_management;
USE student_management;

-- Admin table (Supports Role-Based Access Control)
CREATE TABLE IF NOT EXISTS admin (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin'
);

-- Courses table (Institutional Departments)
CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students table (Supports secure student login)
CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255),
  phone VARCHAR(20),
  course_id INT,
  role VARCHAR(20) DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
);

-- Marks table (Academic parameters)
CREATE TABLE IF NOT EXISTS marks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  marks INT NOT NULL CHECK (marks >= 0 AND marks <= 100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Insert sample data
-- Note: Password is hashed using bcryptjs (10-12 rounds)
-- Admin Password: "admin123"
INSERT INTO admin (email, password, role) 
VALUES ('admin@test.com', '$2b$10$MsbboHogftZrzQu1kthH8OFeDtZhrc8eaRs.UAzVMoe.JC6fCL0W.', 'admin') 
ON DUPLICATE KEY UPDATE email=email;

INSERT INTO courses (name, description) VALUES
('Computer Science', 'Programming and software development'),
('Mathematics', 'Advanced mathematics and statistics'),
('Physics', 'Physics and applied sciences') ON DUPLICATE KEY UPDATE name=name;

-- Standard Students
INSERT INTO students (name, email, phone, course_id, role) VALUES
('John Doe', 'john@test.com', '1234567890', 1, 'student'),
('Jane Smith', 'jane@test.com', '0987654321', 2, 'student') ON DUPLICATE KEY UPDATE name=name;