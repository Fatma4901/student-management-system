import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'student_management'
});

async function testDB() {
  try {
    console.log('Testing database connection...');

    // Check admin table
    const [adminRows] = await db.query('SELECT id, email, LEFT(password, 20) as password_preview FROM admin');
    console.log('Admin records:', adminRows);

    // Test password comparison
    if (adminRows.length > 0) {
      const bcrypt = await import('bcryptjs');
      const testPassword = 'admin123';
      const hashedPassword = adminRows[0].password;
      const isValid = await bcrypt.default.compare(testPassword, hashedPassword);
      console.log(`Password 'admin123' matches hash: ${isValid}`);
    }

  } catch (error) {
    console.error('Database error:', error.message);
  } finally {
    process.exit(0);
  }
}

testDB();