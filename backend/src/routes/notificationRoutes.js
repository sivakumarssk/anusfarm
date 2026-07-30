const express = require("express");
const router = express.Router();

const { getNotifications,createNotification} = require("../controllers/notificationController");


router.get("/notifications", getNotifications);


router.post("/notifications",createNotification);


module.exports = router;