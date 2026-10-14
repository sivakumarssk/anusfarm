
const db = require("../config/db");

// ======================
// CREATE USER
// ======================
const createUser = async (name, phone, email) => {
  const result = await db.query(
    `
    INSERT INTO users (name, phone, email)
    VALUES ($1, $2, $3)
    RETURNING id, name, phone, email
    `,
    [name, phone, email]
  );

  return result.rows[0];
};

// ======================
// GET ALL USERS
// ======================
const getAllUsers = async () => {
  const result = await db.query(
    `
    SELECT
      u.id,
      u.name,
      u.phone,
      u.email,
      CASE
        WHEN EXISTS (
          SELECT 1
          FROM subscriptions s
          WHERE s.user_id = u.id
        )
        THEN 'Subscribed'
        ELSE 'Not Subscribed'
      END AS subscription
    FROM users u
    ORDER BY u.id DESC
    `
  );

  return result.rows;
};

// ======================
// GET USER BY ID
// ======================
const getUserById = async (id) => {
  const result = await db.query(
    `
    SELECT
      id,
      name,
      phone,
      email
    FROM users
    WHERE id = $1
    `,
    [id]
  );

  return result.rows[0];
};

// ======================
// UPDATE USER
// ======================
const updateUser = async (id, name, phone, email) => {
  const result = await db.query(
    `
    UPDATE users
    SET
      name = $1,
      phone = $2,
      email = $3
    WHERE id = $4
    RETURNING
      id,
      name,
      phone,
      email
    `,
    [name, phone, email, id]
  );

  return result.rows[0];
};

// ======================
// DELETE USER
// ======================
const deleteUser = async (id) => {
  const result = await db.query(
    `
    DELETE FROM users
    WHERE id = $1
    RETURNING id
    `,
    [id]
  );

  return result.rows[0];
};

// ======================
// GET PROFILE
// ======================
const getProfile = async (id) => {
  const result = await db.query(
    `
    SELECT
      id,
      name,
      phone,
      email
    FROM users
    WHERE id = $1
    `,
    [id]
  );

  return result.rows[0];
};

// ======================
// UPDATE PROFILE
// ======================
const updateProfile = async (id, name) => {
  const result = await db.query(
    `
    UPDATE users
    SET name = $1
    WHERE id = $2
    RETURNING
      id,
      name,
      phone,
      email
    `,
    [name, id]
  );

  return result.rows[0];
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
};