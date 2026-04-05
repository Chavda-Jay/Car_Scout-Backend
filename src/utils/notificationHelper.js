const Notification = require("../models/NotificationModel");

// Common helper to create a notification entry
const createNotification = async ({
  userId,
  senderId,
  carId,
  offerId,
  type,
  title,
  message
}) => {
  return await Notification.create({
    userId,
    senderId,
    carId,
    offerId,
    type,
    title,
    message
  });
};

module.exports = {
  createNotification
};
