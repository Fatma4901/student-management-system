const { createPool } = require('mysql2/promise');
require('dotenv').config();

async function fixDatabase() {
    console.log("🚀 STARTING RELIABILITY SYNC FOR RAILWAY DATABASE...");
    
    if (!process.env.DATABASE_URL) {
        console.error("❌ ERROR: DATABASE_URL is not set in your .env file!");
        process.exit(1);
    }

    const pool = createPool({
        uri: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log("📡 CONNECTING TO INSTITUTIONAL SYSTEM...");

        // 1. Fix Students Table Columns
        console.log("🛠️  SYNCHRONIZING STUDENT TABLE MODULES...");
        await pool.query(`ALTER TABLE students ADD COLUMN IF NOT EXISTS password VARCHAR(255)`);
        await pool.query(`ALTER TABLE students ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'student'`);
        
        // 2. Fix Nullability (Ensures insertion doesn't fail if fields are missing)
        await pool.query(`ALTER TABLE students MODIFY COLUMN phone VARCHAR(20) NULL`);
        await pool.query(`ALTER TABLE students MODIFY COLUMN course_id INT NULL`);
        
        // 3. Ensure Auto-Increment is enabled (Crucial for 500 errors)
        try {
            await pool.query(`ALTER TABLE students MODIFY COLUMN id INT AUTO_INCREMENT PRIMARY KEY`);
        } catch (e) {
            console.log("ℹ️  Note: Primary key is already configured or locked.");
        }

        // 4. Register Roles for Admins
        console.log("🛠️  SYNCHRONIZING ADMINISTRATIVE MODULES...");
        await pool.query(`ALTER TABLE admin ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'admin'`);

        console.log("\n✅ SUCCESS! YOUR RAILWAY DATABASE HAS BEEN RE-CALIBRATED.");
        console.log("You can now safely deploy and register new students.");

    } catch (error) {
        console.error("\n❌ DATABASE ERROR:", error.message);
    } finally {
        await pool.end();
    }
}

fixDatabase();
