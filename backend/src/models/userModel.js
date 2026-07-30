const db = require("../config/db");

// Get user profile
const getUserById = async (id) => {
  const result = await db.query(
    `
    SELECT
      id,
      name,
      phone,
      email,
      profile_image,
      created_at
    FROM users
    WHERE id = $1
    `,
    [id]
  );

  return result.rows[0];
};

// Update profile
const updateUserProfile = async (
  id,
  name,
  email,
  profile_image
) => {
  const result = await db.query(
    `
    UPDATE users
    SET
      name = $1,
      email = $2,
      profile_image = $3
    WHERE id = $4
    RETURNING
      id,
      name,
      phone,
      email,
      profile_image
    `,
    [
      name,
      email,
      profile_image,
      id,
    ]
  );

  return result.rows[0];
};

module.exports = {
  getUserById,
  updateUserProfile,
};