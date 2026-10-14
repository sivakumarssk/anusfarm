const pool = require("../config/db");

// ==========================================
// ADD ADDRESS
// ==========================================
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
    (
      user_id,
      address_type,
      full_address,
      phone,
      latitude,
      longitude
    )
    VALUES
    (
      $1,
      $2,
      $3,
      $4,
      $5,
      $6
    )
    RETURNING *`,
    [
      userId,
      type,
      address,
      phone,
      latitude,
      longitude,
    ]
  );

  return result.rows[0];
};


// ==========================================
// GET USER ADDRESSES
// ==========================================
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


// ==========================================
// UPDATE ADDRESS
// ==========================================
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


// ==========================================
// DELETE ADDRESS
// ==========================================
const deleteAddress = async (id, userId) => {
  await pool.query(
    `DELETE FROM addresses
     WHERE id = $1
     AND user_id = $2`,
    [id, userId]
  );
};
// SAVE SELECTED ADDRESS FOR THIS USER
const selectAddress = async (userId, addressId) => {
  const result = await pool.query(
    `UPDATE users
     SET selected_address_id = $1
     WHERE id = $2
       AND EXISTS (
         SELECT 1
         FROM addresses
         WHERE id = $1 AND user_id = $2
       )
     RETURNING selected_address_id`,
    [addressId, userId]
  );

  return result.rows[0];
};

// GET THIS USER'S SELECTED ADDRESS
const getSelectedAddress = async (userId) => {
  const result = await pool.query(
    `SELECT a.*
     FROM users u
     JOIN addresses a
       ON a.id = u.selected_address_id
      AND a.user_id = u.id
     WHERE u.id = $1`,
    [userId]
  );

  return result.rows[0] || null;
};


module.exports = {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  selectAddress, 
  getSelectedAddress,
};

