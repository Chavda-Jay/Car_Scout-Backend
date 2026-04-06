const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const inspectionSchema = new Schema({
  carId: {
    type: mongoose.Types.ObjectId,
    ref: "cars",
    required: true,
    unique: true
  },

  report: {
    type: String,
    required: true
  },

  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },

  accidentHistory: {
    type: String,
    default: "No accident history available"
  },

  serviceHistory: {
    type: String,
    default: "No service history available"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("inspections", inspectionSchema);
