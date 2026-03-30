import mysql from "mysql2/promise";

const db = mysql.createPool({
  uri: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // important for Railway
  },
  connectionLimit: 10, // good for production
});

export default db;