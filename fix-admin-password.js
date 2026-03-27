const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const fs = require('fs');

async function fix() {
  let output = '';
  try {
    // Generate correct hash for admin123
    const hash = await bcrypt.hash('admin123', 10);
    output += 'New hash for admin123: ' + hash + '\n';

    // Verify it works
    const isValid = await bcrypt.compare('admin123', hash);
    output += 'Verification: ' + isValid + '\n';

    // Update database
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'student_management'
    });

    await conn.query('UPDATE admin SET password = ? WHERE email = ?', [hash, 'admin@test.com']);
    output += 'Updated admin password in database!\n';

    // Verify from DB
    const [rows] = await conn.query('SELECT * FROM admin WHERE email = ?', ['admin@test.com']);
    const dbVerify = await bcrypt.compare('admin123', rows[0].password);
    output += 'DB verification: ' + dbVerify + '\n';

    await conn.end();
  } catch (err) {
    output += 'ERROR: ' + err.message + '\n';
  }
  fs.writeFileSync('d:/junkies_coder/SmsVS/fix_result.txt', output);
  process.exit(0);
}

fix();
