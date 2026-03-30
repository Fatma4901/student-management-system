const mysql = require('mysql2/promise');

async function test() {
  try {
    const pool = mysql.createPool({ uri: 'mysql://user:pass@host:3306/db' });
    const conn = await pool.getConnection(); // this will fail of course, but let's see configuration
    console.log(pool.pool.config.connectionConfig);
  } catch(e) {
    console.error("Error connecting", e.message);
  }
}
test();
