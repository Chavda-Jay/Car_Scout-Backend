const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "users",
    required: true
  },
  senderId: {
    type: mongoose.Types.ObjectId,
    ref: "users"
  },
  carId: {
    type: mongoose.Types.ObjectId,
    ref: "cars"
  },
  offerId: {
    type: mongoose.Types.ObjectId,
    ref: "offers"
  },
  type: {
    type: String,
    enum: [
      "new_offer",
      "offer_accepted",
      "offer_rejected",
      "counter_offer",
      "counter_response"
    ],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("notifications", notificationSchema);
