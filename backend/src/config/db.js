const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: 10,
  idleTimeoutMillis: 30000,
});

// Test connection
pool.query("SELECT NOW()")
  .then(() => console.log("✅ PostgreSQL Connected"))
  .catch((err) => console.log("❌ Database Error:", err.message));

module.exports = pool;