const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const offerSchema = new Schema({
  buyerId: {
    type: mongoose.Types.ObjectId,
    ref: "users"
  },

  sellerId: {
    type: mongoose.Types.ObjectId,
    ref: "users"
  },

  carId: {
    type: mongoose.Types.ObjectId,
    ref: "cars"
  },

  offerPrice: {
    type: Number
  },

  counterOffer: {
    type: Number,
    default: null
  },

  agreedPrice: {
    type: Number,
    default: null
  },

  tokenAmount: {
    type: Number,
    default: null
  },

  message: {
    type: String
  },

  status: {
    type: String,
    enum: ["pending", "countered", "accepted", "rejected"],
    default: "pending"
  },

  paymentStatus: {
    type: String,
    enum: ["not_required", "pending", "paid", "failed"],
    default: "not_required"
  },

  razorpayOrderId: {
    type: String,
    default: null
  },

  razorpayPaymentId: {
    type: String,
    default: null
  },

  razorpaySignature: {
    type: String,
    default: null
  },

  tokenPaidAt: {
    type: Date,
    default: null
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("offers", offerSchema);
