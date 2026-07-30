const pool = require("../config/db");

const getLatestOrders = async () => {
  const result = await pool.query(`
    SELECT id
    FROM orders
    ORDER BY id DESC
    LIMIT 5
  `);

  return result.rows;
};

const getLatestUsers = async () => {
  const result = await pool.query(`
    SELECT id, name
    FROM users
    ORDER BY id DESC
    LIMIT 5
  `);

  return result.rows;
};

const getLowStockProducts = async () => {
  const result = await pool.query(`
    SELECT id, name, stock
    FROM products
    WHERE stock <= 10
    ORDER BY stock ASC
  `);

  return result.rows;
};

module.exports = {
  getLatestOrders,
  getLatestUsers,
  getLowStockProducts
};