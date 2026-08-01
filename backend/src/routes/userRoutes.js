const express = require("express");
const router = express.Router();
const {createUser,getAllUsers,getUserById,getProfile,updateProfile,updateUser,deleteUser,} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");


// Create User
router.post("/", createUser);

// Get All Users
router.get("/", getAllUsers);
// Logged-in Profile
// MUST come before /:id
router.get("/profile", authMiddleware, getProfile);

// Update Logged-in Profile
router.put("/update-profile", authMiddleware, updateProfile);

// Get User By ID
// Keep this at the bottom
router.get("/:id", getUserById);

// Update User by ID (Admin)
router.put("/:id", updateUser);
// Delete User
router.delete("/:id", deleteUser);


module.exports = router;