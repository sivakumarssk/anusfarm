
const express = require("express");
const router = express.Router();

const {sendOTP,verifyOTP,getProfile} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

// Send OTP
router.post("/send-otp", sendOTP);


// Verify OTP
router.post("/verify-otp", verifyOTP);


// Get Profile
router.get("/profile", authMiddleware, getProfile);


module.exports = router;