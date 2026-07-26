const pool = require("../config/db");

const saveLocation = async (userId, latitude, longitude, address) => {
  const result = await pool.query(
    `INSERT INTO user_locations (user_id, latitude, longitude, address)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [userId, latitude, longitude, address]
  );

  return result.rows[0];
};

module.exports = {
  saveLocation,
};