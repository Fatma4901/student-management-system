import db from "./lib/db.js";

async function testDB() {
  try {
    console.log("Testing database connection...");

    // Check if admin table exists and has data
    const [rows] = await db.query("SELECT * FROM admin");
    console.log("Admin table data:", rows);

    // Test password comparison
    const bcrypt = await import("bcryptjs");
    const hashedPassword = rows[0]?.password;
    const plainPassword = "admin123";

    console.log("Hashed password from DB:", hashedPassword);
    console.log("Testing password comparison...");

    const isValid = await bcrypt.compare(plainPassword, hashedPassword);
    console.log("Password valid:", isValid);

  } catch (error) {
    console.error("Database error:", error);
  } finally {
    process.exit(0);
  }
}

testDB();