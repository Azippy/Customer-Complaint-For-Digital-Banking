const express = require("express");

const {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} = require("../controllers/notification.controller.js");

const protect = require("../middleware/auth.middleware.js");

const router = express.Router();

router.get("/", protect, getNotifications);

router.patch("/read-all", protect, markAllNotificationsAsRead);

router.patch("/:id/read", protect, markNotificationAsRead);

module.exports = router;
