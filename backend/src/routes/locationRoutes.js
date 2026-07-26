const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { addLocation } = require("../controllers/locationController");

router.post("/", authMiddleware, addLocation);

module.exports = router;