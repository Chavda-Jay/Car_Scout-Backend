const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  offerId: {
    type: mongoose.Types.ObjectId,
    ref: "offers",
    required: true
  },

  buyerId: {
    type: mongoose.Types.ObjectId,
    ref: "users",
    required: true
  },

  sellerId: {
    type: mongoose.Types.ObjectId,
    ref: "users",
    required: true
  },

  carId: {
    type: mongoose.Types.ObjectId,
    ref: "cars",
    required: true
  },

  agreedPrice: {
    type: Number,
    required: true
  },

  tokenAmount: {
    type: Number,
    required: true
  },

  razorpayOrderId: {
    type: String,
    required: true
  },

  razorpayPaymentId: {
    type: String,
    default: null
  },

  razorpaySignature: {
    type: String,
    default: null
  },

  status: {
    type: String,
    enum: ["created", "paid", "failed"],
    default: "created"
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  paidAt: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model("payments", paymentSchema);
