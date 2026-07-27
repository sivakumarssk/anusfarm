const pool = require("../config/db");


// ================= CREATE PRODUCT =================
const addProduct = async (req, res) => {
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

    const result = await pool.query(
      `SELECT * FROM products
       ORDER BY id DESC`
    );


    const products = result.rows.map(product => ({
      ...product,

      image: product.image
        ? `${req.protocol}://${req.get("host")}/uploads/${product.image}`
        : null
    }));


    res.json({
      success:true,
      products
    });


  } catch(error) {

    res.status(500).json({
      success:false,
      message:error.message
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
      description
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





module.exports = {

  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct

};