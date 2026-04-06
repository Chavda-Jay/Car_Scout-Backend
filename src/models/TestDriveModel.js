const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const testDriveSchema = new Schema({
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

  requestedDate: {
    type: String,
    required: true
  },

  requestedTime: {
    type: String,
    required: true
  },

  location: {
    type: String,
    required: true
  },

  message: {
    type: String,
    default: ""
  },

  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "completed"],
    default: "pending"
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

module.exports = mongoose.model("testdrives", testDriveSchema);
