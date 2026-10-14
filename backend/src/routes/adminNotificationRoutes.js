const express = require("express");
const router = express.Router();
const { getNotifications, getUnreadCount, markRead} = require("../controllers/adminNotificationController");


router.get("/notifications",getNotifications);

router.get("/notifications/count",getUnreadCount);

router.put("/notifications/read",markRead);


module.exports = router;