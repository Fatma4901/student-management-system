const fs = require('fs');
require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

async function test() {
  const log = [];
  try {
    const url = process.env.DATABASE_URL;
    log.push('DATABASE_URL exists: ' + !!url);
    
    if (!url) {
      log.push('ERROR: No DATABASE_URL found');
      fs.writeFileSync('test_railway_output.txt', log.join('\n'), 'utf8');
      return;
    }

    const pool = mysql.createPool({
      uri: url,
      ssl: { rejectUnauthorized: false },
      connectionLimit: 2,
    });

    const [rows] = await pool.query('SELECT 1 as test');
    log.push('Connection: SUCCESS');

    // Check if admin table exists
    try {
      const [tables] = await pool.query('SHOW TABLES');
      log.push('Tables: ' + JSON.stringify(tables));
    } catch (e) {
      log.push('SHOW TABLES error: ' + e.message);
    }

    // Try creating admin table
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS admin (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(100) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL
        )
      `);
      log.push('admin table: CREATED/EXISTS');
    } catch (e) {
      log.push('admin table error: ' + e.message);
    }

    // Create courses table
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS courses (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      log.push('courses table: CREATED/EXISTS');
    } catch (e) {
      log.push('courses table error: ' + e.message);
    }

    // Create students table
    try {
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
      log.push('students table: CREATED/EXISTS');
    } catch (e) {
      log.push('students table error: ' + e.message);
    }

    // Create marks table
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS marks (
          id INT AUTO_INCREMENT PRIMARY KEY,
          student_id INT NOT NULL,
          course_id INT NOT NULL,
          marks INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
          FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
        )
      `);
      log.push('marks table: CREATED/EXISTS');
    } catch (e) {
      log.push('marks table error: ' + e.message);
    }

    // Final table check
    const [finalTables] = await pool.query('SHOW TABLES');
    log.push('Final tables: ' + JSON.stringify(finalTables));

    await pool.end();
    log.push('DONE - All good!');
  } catch (e) {
    log.push('FATAL ERROR: ' + e.message);
  }

  fs.writeFileSync('test_railway_output.txt', log.join('\n'), 'utf8');
}

test();
