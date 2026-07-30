const express = require("express");
const router = express.Router();
const {getProfile,updateProfile,getAllUsers,} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");

console.log("✅ userRoutes loaded");
// GET PROFILE
router.get("/profile",authMiddleware,getProfile);

router.get("/", getAllUsers);
// UPDATE NAME
router.put( "/update-profile",authMiddleware,updateProfile);


module.exports = router;