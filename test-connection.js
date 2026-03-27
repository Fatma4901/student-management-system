const mysql = require('mysql2/promise');
const fs = require('fs');

async function test() {
  let output = '';
  try {
    output += 'Connecting to MySQL...\n';
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'student_management'
    });
    output += 'Connected!\n';

    const [rows] = await conn.query('SELECT * FROM admin');
    output += 'Admin records: ' + JSON.stringify(rows, null, 2) + '\n';

    if (rows.length > 0) {
      const bcrypt = require('bcryptjs');
      const isValid = await bcrypt.compare('admin123', rows[0].password);
      output += 'Password admin123 valid: ' + isValid + '\n';
    }

    await conn.end();
  } catch (err) {
    output += 'ERROR: ' + err.message + '\n';
    output += 'CODE: ' + (err.code || 'n/a') + '\n';
  }
  fs.writeFileSync('d:/junkies_coder/SmsVS/db_result.txt', output);
  process.exit(0);
}

test();
