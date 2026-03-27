const mysql = require('mysql2/promise');

async function migrate() {
  try {
    const db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'student_management'
    });

    console.log("Connected to DB, dropping marks table...");
    await db.query("DROP TABLE IF EXISTS marks;");
    
    console.log("Creating new marks table...");
    await db.query(`
      CREATE TABLE marks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        course_id INT NOT NULL,
        marks INT NOT NULL CHECK (marks >= 0 AND marks <= 100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
      );
    `);
    
    console.log("Migration successful!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();
