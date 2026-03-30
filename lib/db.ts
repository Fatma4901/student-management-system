import mysql from "mysql2/promise";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set!");
}

const db = mysql.createPool({
  uri: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // important for Railway
  },
  connectionLimit: 3, // Lower for serverless to prevent exhaustion
  waitForConnections: true,
  connectTimeout: 5000, // 5s timeout instead of hanging forever
  queueLimit: 0,
});

export default db;