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
const getAllProducts = async () => {

  const result = await pool.query(
    `SELECT * FROM products
     ORDER BY id DESC`
  );

  return result.rows;
};



// ================= GET PRODUCT BY ID =================
const getProductById = async (id) => {

  const result = await pool.query(
    `SELECT * FROM products
     WHERE id=$1`,
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