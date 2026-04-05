const Notification = require("../models/NotificationModel");

// Fetch all notifications for a user
const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        message: "userId is required"
      });
    }

    const notifications = await Notification.find({ userId })
      .populate("senderId", "firstName lastName role")
      .populate("carId", "brand model")
      .populate("offerId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      data: notifications
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// Return unread count for navbar badge
const getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        message: "userId is required"
      });
    }

    const count = await Notification.countDocuments({
      userId,
      isRead: false
    });

    res.status(200).json({
      count
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// Mark one notification as read
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found"
      });
    }

    res.status(200).json({
      message: "Notification marked as read",
      data: notification
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "userId is required"
      });
    }

    await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true }
    );

    res.status(200).json({
      message: "All notifications marked as read"
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

module.exports = {
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead
};
