const router = require("express").Router();
const notificationController = require("../controllers/NotificationController");

router.get("/", notificationController.getUserNotifications);
router.get("/unread-count", notificationController.getUnreadCount);
router.put("/read-all", notificationController.markAllAsRead);
router.put("/read/:id", notificationController.markAsRead);

module.exports = router;
