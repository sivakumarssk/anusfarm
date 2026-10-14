const express = require("express");

const router = express.Router();

const {getNotifications} = require("../controllers/adminController");

router.get("/notifications",getNotifications);


module.exports = router;