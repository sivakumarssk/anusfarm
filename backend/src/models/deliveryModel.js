const pool = require("../config/db");

const getDeliveryLocation = async () => {
  const result = await pool.query(
    "SELECT * FROM delivery_locations LIMIT 1"
  );

  return result.rows[0];
};

module.exports = {
  getDeliveryLocation,
};