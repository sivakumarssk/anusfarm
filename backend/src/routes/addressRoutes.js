// const express = require("express");
// const router = express.Router();

// const authMiddleware = require("../middleware/authMiddleware");

// const { createAddress, fetchAddresses, editAddress, removeAddress,saveSelectedAddress, fetchSelectedAddress,} = require("../controllers/addressController");

// router.post("/", authMiddleware, createAddress);

// router.get("/", authMiddleware, fetchAddresses);

// router.put("/:id", authMiddleware, editAddress);

// router.delete("/:id", authMiddleware, removeAddress);

// router.put("/selected", authMiddleware, saveSelectedAddress);

// router.get("/selected", authMiddleware, fetchSelectedAddress);

// module.exports = router;

const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createAddress,
  fetchAddresses,
  editAddress,
  removeAddress,
  saveSelectedAddress,
  fetchSelectedAddress,
} = require("../controllers/addressController");

router.post("/", authMiddleware, createAddress);
router.get("/", authMiddleware, fetchAddresses);

// Selected address routes must come before /:id
router.put("/selected", authMiddleware, saveSelectedAddress);
router.get("/selected", authMiddleware, fetchSelectedAddress);

router.put("/:id", authMiddleware, editAddress);
router.delete("/:id", authMiddleware, removeAddress);

module.exports = router;

