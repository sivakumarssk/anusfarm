const pool = require("../config/db");

// Add Address
const addAddress = async (
  userId,
  type,
  address,
  phone,
  latitude,
  longitude
) => {
  const result = await pool.query(
    `INSERT INTO addresses
    (user_id, address_type, full_address, phone, latitude, longitude)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`,
    [userId, type, address, phone, latitude, longitude]
  );

  return result.rows[0];
};

// Get User Addresses
const getAddresses = async (userId) => {
  const result = await pool.query(
    `SELECT *
     FROM addresses
     WHERE user_id = $1
     ORDER BY id DESC`,
    [userId]
  );

  return result.rows;
};

// Update Address
const updateAddress = async (
  id,
  userId,
  type,
  address,
  phone,
  latitude,
  longitude
) => {
  const result = await pool.query(
    `UPDATE addresses
     SET
        address_type = $1,
        full_address = $2,
        phone = $3,
        latitude = $4,
        longitude = $5
     WHERE id = $6
     AND user_id = $7
     RETURNING *`,
    [
      type,
      address,
      phone,
      latitude,
      longitude,
      id,
      userId,
    ]
  );

  return result.rows[0];
};

// Delete Address
const deleteAddress = async (id, userId) => {
  await pool.query(
    `DELETE FROM addresses
     WHERE id = $1
     AND user_id = $2`,
    [id, userId]
  );
};

module.exports = {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
};