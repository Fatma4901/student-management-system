/**
 * Run this script to create tables on Railway MySQL:
 *   node setup-railway-db.js
 * 
 * Make sure your .env.local has the correct DATABASE_URL
 */

require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

async function setup() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('❌ DATABASE_URL not found in .env.local');
    process.exit(1);
  }

  console.log('Connecting to Railway MySQL...');
  
  const pool = mysql.createPool({
    uri: url,
    ssl: { rejectUnauthorized: false },
    connectionLimit: 2,
  });

  try {
    // Test connection first
    const [rows] = await pool.query('SELECT 1 as test');
    console.log('✅ Connected to Railway MySQL successfully!');

    // Create admin table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      )
    `);
    console.log('✅ admin table created');

    // Create courses table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ courses table created');

    // Create students table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(20),
        course_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
      )
    `);
    console.log('✅ students table created');

    // Create marks table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS marks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        course_id INT NOT NULL,
        marks INT NOT NULL CHECK (marks >= 0 AND marks <= 100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ marks table created');

    // Show existing tables
    const [tables] = await pool.query('SHOW TABLES');
    console.log('\n📋 Tables in database:', tables);

    console.log('\n🎉 Database setup complete! You can now sign up on Vercel.');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

setup();
