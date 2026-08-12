const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getNotifications,
  createNotification,
  unreadCount,
  readNotifications,
} = require("../controllers/notificationController");

router.get("/", authMiddleware, getNotifications);

router.post("/", authMiddleware, createNotification);

router.get("/unread-count", authMiddleware, unreadCount);

router.put("/read", authMiddleware, readNotifications);

module.exports = router;