const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");


// CREATE PRODUCT with image
router.post(
  "/",
  upload.single("image"),
  addProduct
);


// READ ALL PRODUCTS
router.get(
  "/",
  getProducts
);


// READ SINGLE PRODUCT
router.get(
  "/:id",
  getProductById
);


// UPDATE PRODUCT with image
router.put(
  "/:id",
  upload.single("image"),
  updateProduct
);


// DELETE PRODUCT
router.delete(
  "/:id",
  deleteProduct
);


module.exports = router;