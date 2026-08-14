

const pool = require("../config/db");


// ================= CREATE PRODUCT =================

const createProduct = async (
  name,
  price,
  category_id,
  image,
  stock,
  description
) => {

  const result = await pool.query(
    `INSERT INTO products
    (name, price, category_id, image, stock, description)
    VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING *`,
    [
      name,
      price,
      category_id,
      image,
      stock,
      description
    ]
  );

  return result.rows[0];
};



// ================= GET ALL PRODUCTS =================



// const getAllProducts = async () => {

//   const result = await pool.query(`
//     SELECT
//       p.*,

//       COALESCE(
//         (
//           SELECT SUM(si.quantity)
//           FROM subscription_items si
//           INNER JOIN subscriptions s
//             ON s.id = si.subscription_id
//           WHERE si.product_id = p.id
//           AND LOWER(s.status) = 'active'
//         ),
//         0
//       ) AS subscription_stock,

//       GREATEST(
//         p.stock -
//         COALESCE(
//           (
//             SELECT SUM(si.quantity)
//             FROM subscription_items si
//             INNER JOIN subscriptions s
//               ON s.id = si.subscription_id
//             WHERE si.product_id = p.id
//             AND LOWER(s.status) = 'active'
//           ),
//           0
//         ),
//         0
//       ) AS available_stock

//     FROM products p
//     ORDER BY p.id DESC
//   `);

//   return result.rows;
// };
const getAllProducts = async () => {

  const result = await pool.query(`
    SELECT
      p.*,

      COALESCE(
        (
          SELECT SUM(si.quantity)
          FROM subscription_items si
          INNER JOIN subscriptions s
            ON s.id = si.subscription_id
          WHERE si.product_id = p.id
          AND LOWER(s.status) = 'active'
        ),
        0
      ) AS subscription_stock,

      GREATEST(
        p.stock -
        COALESCE(
          (
            SELECT SUM(si.quantity)
            FROM subscription_items si
            INNER JOIN subscriptions s
              ON s.id = si.subscription_id
            WHERE si.product_id = p.id
            AND LOWER(s.status) = 'active'
          ),
          0
        ),
        0
      ) AS available_stock

    FROM products p

    WHERE LOWER(p.status) = 'active'

    ORDER BY p.id DESC
  `);

  return result.rows;
};
// ================= GET PRODUCT BY ID =================

const getProductById = async (id) => {

  const result = await pool.query(
    `
    SELECT
      p.*,

      COALESCE(
        (
          SELECT SUM(si.quantity)
          FROM subscription_items si
          INNER JOIN subscriptions s
            ON s.id = si.subscription_id
          WHERE si.product_id = p.id
          AND LOWER(s.status) = 'active'
        ),
        0
      ) AS subscription_stock,

      GREATEST(
        p.stock -
        COALESCE(
          (
            SELECT SUM(si.quantity)
            FROM subscription_items si
            INNER JOIN subscriptions s
              ON s.id = si.subscription_id
            WHERE si.product_id = p.id
            AND LOWER(s.status) = 'active'
          ),
          0
        ),
        0
      ) AS available_stock

    FROM products p

    WHERE p.id = $1
    `,
    [id]
  );

  return result.rows[0];
};

// ================= UPDATE PRODUCT =================

const updateProduct = async (
  id,
  name,
  price,
  category_id,
  image,
  stock,
  description
) => {

  const result = await pool.query(
    `UPDATE products
     SET
       name=$1,
       price=$2,
       category_id=$3,
       image=$4,
       stock=$5,
       description=$6
     WHERE id=$7
     RETURNING *`,
    [
      name,
      price,
      category_id,
      image,
      stock,
      description,
      id
    ]
  );

  return result.rows[0];
};



// ================= DELETE PRODUCT =================

const deleteProduct = async (id) => {

  await pool.query(
    `DELETE FROM products
     WHERE id=$1`,
    [id]
  );

  return true;
};



// ================= EXPORT =================

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
};