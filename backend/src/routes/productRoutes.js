const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
  addProduct,
  getProducts,
  getProductsByCategory,
  getProductById,
  updateProduct,
  updateProductStock,
  deleteProduct,
  toggleProductStatus,
} = require("../controllers/productController");


// CREATE PRODUCT with image
router.post( "/",upload.single("image"), addProduct);

// READ ALL PRODUCTS
router.get("/",getProducts);

// GET PRODUCTS BY CATEGORY
router.get("/category/:category",getProductsByCategory);

// READ SINGLE PRODUCT
router.get("/:id",getProductById);

router.put("/:id/status", toggleProductStatus);

router.put("/:id/stock", updateProductStock);

// UPDATE PRODUCT with image
router.put("/:id",upload.single("image"), updateProduct);

// DELETE PRODUCT
router.delete("/:id",deleteProduct);


module.exports = router;