import mysql from 'mysql2/promise';
import fs from 'fs';

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root'
});

async function setupDatabase() {
  try {
    console.log('Setting up database...');

    // Create database
    await db.query('CREATE DATABASE IF NOT EXISTS student_management');
    console.log('✓ Database created');

    // Use database
    await db.query('USE student_management');

    // Drop existing tables to ensure clean setup
    console.log('Dropping existing tables...');
    await db.query('DROP TABLE IF EXISTS marks');
    await db.query('DROP TABLE IF EXISTS students');
    await db.query('DROP TABLE IF EXISTS courses');
    await db.query('DROP TABLE IF EXISTS admin');

    // Read and execute SQL file
    const sql = fs.readFileSync('database.sql', 'utf8');
    const statements = sql.split(';').filter(stmt => stmt.trim());

    for (const statement of statements) {
      if (statement.trim()) {
        await db.query(statement);
      }
    }
    console.log('✓ Tables and data created');

    // Verify admin user
    const [rows] = await db.query('SELECT id, email FROM admin');
    console.log('✓ Admin users:', rows);

    console.log('Database setup complete!');
    console.log('Default login: admin@test.com / admin123');

  } catch (error) {
    console.error('Database setup error:', error);
  } finally {
    process.exit(0);
  }
}

setupDatabase();