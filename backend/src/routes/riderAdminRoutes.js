const express = require("express");

const router = express.Router();

const {  getAllAdminRiders, createAdminRider,  editAdminRider,   toggleAdminRider} = require("../controllers/riderAdminController");

// GET ALL RIDERS
router.get( "/riders", getAllAdminRiders);

// ADD RIDER
router.post( "/riders", createAdminRider);

// UPDATE RIDER
router.put( "/riders/:id", editAdminRider);

// ACTIVATE / DEACTIVATE
router.put( "/riders/:id/status", toggleAdminRider);

module.exports = router;