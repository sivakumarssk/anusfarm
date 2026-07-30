
const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {addLocation,getLocation,} = require("../controllers/locationController");

// Save location
router.post("/", authMiddleware, addLocation);

// Get saved location
router.get("/", authMiddleware, getLocation);

module.exports = router;