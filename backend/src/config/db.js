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
pool.query(`
  SELECT column_name
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'addresses'
  ORDER BY ordinal_position
`)
.then((result) => {
  console.log("========== BACKEND ADDRESSES COLUMNS ==========");
  console.log(result.rows);
  console.log("===============================================");
})
.catch((err) => {
  console.log("COLUMN CHECK ERROR =", err.message);
});

module.exports = pool;