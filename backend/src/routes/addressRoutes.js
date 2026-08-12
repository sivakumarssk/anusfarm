const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createAddress,
  fetchAddresses,
  editAddress,
  removeAddress,
} = require("../controllers/addressController");

router.post("/", authMiddleware, createAddress);

router.get("/", authMiddleware, fetchAddresses);

router.put("/:id", authMiddleware, editAddress);

router.delete("/:id", authMiddleware, removeAddress);

module.exports = router;