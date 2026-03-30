import mysql from "mysql2/promise";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set!");
}

const db = mysql.createPool({
  uri: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // important for Railway
  },
  connectionLimit: 10, // good for production
  waitForConnections: true,
  connectTimeout: 10000, // 10s timeout
});

export default db;