const pool = require("../config/db");


// ================= CREATE PRODUCT =================
const addProduct = async (req, res) => {
   console.log("BODY:", req.body);
    console.log("FILE:", req.file);
  try {

    const {
      name,
      price,
      category_id,
      stock,
      description
    } = req.body;


    const image = req.file
  ? req.file.filename
  : null;


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


    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: result.rows[0]
    });


  } catch (error) {

    res.status(500).json({
      success:false,
      message:error.message
    });

  }
};
// ================= GET ALL PRODUCTS =================
const getProducts = async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT
        p.*,
        c.name AS category
      FROM products p
      LEFT JOIN categories c
      ON p.category_id = c.id
      ORDER BY p.id DESC
    `);

    const products = result.rows.map(product => ({
      ...product,
      image: product.image
        ? `${req.protocol}://${req.get("host")}/uploads/${product.image}`
        : null
    }));

    res.json({
      success: true,
      products
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

// ================= GET PRODUCTS BY CATEGORY =================
const getProductsByCategory = async (req, res) => {

  try {

    const { category } = req.params;

    const result = await pool.query(
      `
      SELECT
        p.*,
        c.name AS category
      FROM products p
      LEFT JOIN categories c
      ON p.category_id = c.id
      WHERE LOWER(c.name) = LOWER($1)
      ORDER BY p.id DESC
      `,
      [category]
    );

    const products = result.rows.map(product => ({
      ...product,
      image: product.image
        ? `${req.protocol}://${req.get("host")}/uploads/${product.image}`
        : null
    }));

    res.json({
      success: true,
      products
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// ================= GET PRODUCT BY ID =================
const getProductById = async (req,res)=>{

  try {

    const {id} = req.params;


    const result = await pool.query(
      `SELECT * FROM products
       WHERE id=$1`,
      [id]
    );


    if(result.rows.length === 0){

      return res.status(404).json({
        success:false,
        message:"Product not found"
      });

    }


    const product = {
      ...result.rows[0],

      image: result.rows[0].image
        ? `${req.protocol}://${req.get("host")}/uploads/${result.rows[0].image}`
        : null
    };


    res.json({
      success:true,
      product
    });


  } catch(error){

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};

// ================= UPDATE PRODUCT =================
const updateProduct = async(req,res)=>{

  try {

    const {id} = req.params;


    const {
      name,
      price,
      category_id,
      stock,
      description,
      status
    } = req.body;



    let image = req.body.image;


    if(req.file){
      image = req.file.filename;
    }



    const result = await pool.query(
      `UPDATE products SET
        name=$1,
        price=$2,
        category_id=$3,
        image=$4,
        stock=$5,
        description=$6,
        status=$7
       WHERE id=$8
//        RETURNING *`,
       [
        name,
        price,
        category_id,
        image,
        stock,
        description,
        status,
        id
       ]
    );



    if(result.rows.length === 0){

      return res.status(404).json({
        success:false,
        message:"Product not found"
      });

    }



    res.json({
      success:true,
      message:"Product updated successfully",
      product:result.rows[0]
    });



  } catch(error){

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};
// ================= UPDATE STOCK =================
const updateProductStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    const result = await pool.query(
      `UPDATE products
       SET stock = $1
       WHERE id = $2
       RETURNING *`,
      [stock, id]
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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ================= DELETE PRODUCT =================
const deleteProduct = async(req,res)=>{

  try {


    const {id}=req.params;


    const result = await pool.query(
      `DELETE FROM products
       WHERE id=$1
       RETURNING *`,
       [id]
    );



    if(result.rows.length === 0){

      return res.status(404).json({
        success:false,
        message:"Product not found"
      });

    }



    res.json({
      success:true,
      message:"Product deleted successfully"
    });



  } catch(error){


    res.status(500).json({
      success:false,
      message:error.message
    });
  }

};
  const toggleProductStatus = async (req, res) => {
  try {

    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      `UPDATE products
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      message: "Status updated",
      product: result.rows[0]
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



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