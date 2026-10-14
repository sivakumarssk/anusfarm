
const pool = require("../config/db");



// ============================================================
// CREATE PRODUCT
// ============================================================

const addProduct = async (req, res) => {
  console.log("BODY:", req.body);
  console.log("FILE:", req.file);

  try {
    const {
      name,
      price,
      category_id,
      stock,
      description,
    } = req.body;

    const totalStock = Number(stock);

    // ========================================================
    // VALIDATE STOCK
    // ========================================================

    if (
      !Number.isInteger(totalStock) ||
      totalStock < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Total stock must be a valid number",
      });
    }

    const image = req.file
      ? req.file.filename
      : null;

    // ========================================================
    // INSERT PRODUCT
    // ========================================================

    const result = await pool.query(
      `
      INSERT INTO products
      (
        name,
        price,
        category_id,
        image,
        stock,
        description
      )
      VALUES
      ($1,$2,$3,$4,$5,$6)
      RETURNING *
      `,
      [
        name,
        price,
        category_id,
        image,
        totalStock,
        description,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: result.rows[0],
    });

  } catch (error) {
    console.error("ADD PRODUCT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ============================================================
// GET ALL PRODUCTS
// ============================================================

const getProducts = async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT
        p.*,
        c.name AS category,

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
        ) AS subscription_required,

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
        ) AS instant_available

      FROM products p

      LEFT JOIN categories c
        ON p.category_id = c.id

      ORDER BY p.id DESC
    `);

    const products = result.rows.map((product) => ({
      ...product,

      category: product.category || "",

      image: product.image
        ? `${req.protocol}://${req.get("host")}/uploads/${product.image}`
        : null,

      subscription_required:
        Number(product.subscription_required || 0),

      instant_available:
        Number(product.instant_available || 0),
    }));

    res.json({
      success: true,
      products,
    });

  } catch (error) {

    console.error(
      "GET PRODUCTS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ============================================================
// GET PRODUCTS BY CATEGORY
// ============================================================


// ============================================================
// GET PRODUCTS BY CATEGORY
// ============================================================

const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const result = await pool.query(
      `
      SELECT
        p.*,

        c.name AS category,

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
        ) AS subscription_required,

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
        ) AS instant_available

      FROM products p

      LEFT JOIN categories c
        ON p.category_id = c.id

      WHERE LOWER(c.name) = LOWER($1)
      AND LOWER(p.status) = 'active'

      ORDER BY p.id DESC
      `,
      [category]
    );

    const products = result.rows.map((product) => ({
      ...product,

      image: product.image
        ? `${req.protocol}://${req.get("host")}/uploads/${product.image}`
        : null,

      subscription_required:
        Number(product.subscription_required || 0),

      instant_available:
        Number(product.instant_available || 0),
    }));

    res.json({
      success: true,
      products,
    });

  } catch (error) {
    console.error(
      "GET PRODUCTS BY CATEGORY ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};






// ============================================================
// GET PRODUCT BY ID
// ============================================================

const getProductById = async (req, res) => {
  try {

    const { id } = req.params;

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
        ) AS subscription_required,

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
        ) AS instant_available

      FROM products p

      WHERE p.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const product = {
      ...result.rows[0],

      subscription_required:
        Number(result.rows[0].subscription_required || 0),

      instant_available:
        Number(result.rows[0].instant_available || 0),

      image: result.rows[0].image
        ? `${req.protocol}://${req.get("host")}/uploads/${result.rows[0].image}`
        : null,
    };

    res.json({
      success: true,
      product,
    });

  } catch (error) {

    console.error(
      "GET PRODUCT BY ID ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ============================================================
// UPDATE PRODUCT
// ============================================================

const updateProduct = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      name,
      price,
      category_id,
      stock,
      description,
    } = req.body;

    const existingProduct = await pool.query(
      `
      SELECT *
      FROM products
      WHERE id = $1
      `,
      [id]
    );

    if (existingProduct.rows.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const oldProduct = existingProduct.rows[0];

    const totalStock =
      stock !== undefined
        ? Number(stock)
        : Number(oldProduct.stock);

    if (
      !Number.isInteger(totalStock) ||
      totalStock < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Total stock must be a valid number",
      });
    }

    const image = req.file
      ? req.file.filename
      : oldProduct.image;

    const result = await pool.query(
      `
      UPDATE products
      SET
        name = $1,
        price = $2,
        category_id = $3,
        image = $4,
        stock = $5,
        description = $6,
        updated_at = CURRENT_TIMESTAMP

      WHERE id = $7

      RETURNING *
      `,
      [
        name ?? oldProduct.name,
        price ?? oldProduct.price,
        category_id ?? oldProduct.category_id,
        image,
        totalStock,
        description ?? oldProduct.description,
        id,
      ]
    );

    res.json({
      success: true,
      message: "Product updated successfully",
      product: result.rows[0],
    });

  } catch (error) {

    console.error(
      "UPDATE PRODUCT ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================================
// UPDATE STOCK
// ============================================================

const updateProductStock = async (req, res) => {
  try {

    const { id } = req.params;
    const { stock } = req.body;

    const totalStock = Number(stock);

    // ========================================================
    // VALIDATE
    // ========================================================

    if (
      !Number.isInteger(totalStock) ||
      totalStock < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Stock must be a valid number",
      });
    }

    // ========================================================
    // UPDATE ONLY TOTAL STOCK
    // ========================================================

    const result = await pool.query(
      `
      UPDATE products
      SET
        stock = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
      `,
      [
        totalStock,
        id,
      ]
    );

    if (result.rows.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Stock updated successfully",
      product: result.rows[0],
    });

  } catch (error) {

    console.error(
      "UPDATE STOCK ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================================
// PERMANENTLY DELETE PRODUCT
// ============================================================

const deleteProduct = async (req, res) => {

  const client = await pool.connect();

  try {

    const { id } = req.params;

    await client.query("BEGIN");

    await client.query(
      `
      DELETE FROM delivery_items
      WHERE product_id = $1
      `,
      [id]
    );

    const result = await client.query(
      `
      DELETE FROM products
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {

      await client.query("ROLLBACK");

      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await client.query("COMMIT");

    return res.status(200).json({
      success: true,
      message: "Product permanently deleted",
    });

  } catch (error) {

    await client.query("ROLLBACK");

    console.error(
      "PERMANENT DELETE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  } finally {

    client.release();
  }
};


// ============================================================
// TOGGLE PRODUCT STATUS
// ============================================================

const toggleProductStatus = async (req, res) => {
  try {

    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      `
      UPDATE products
      SET status = $1
      WHERE id = $2
      RETURNING *
      `,
      [status, id]
    );

    if (result.rows.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Status updated",
      product: result.rows[0],
    });

  } catch (error) {

    console.error(
      "TOGGLE STATUS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ============================================================
// EXPORT
// ============================================================

module.exports = {
  addProduct,
  getProducts,
  getProductsByCategory,
  getProductById,
  updateProduct,
  updateProductStock,
  deleteProduct,
  toggleProductStatus,
};