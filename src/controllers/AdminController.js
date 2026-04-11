const carSchema = require("../models/CarModel");
const userSchema = require("../models/UserModel");
const offerSchema = require("../models/OfferModel");
const paymentSchema = require("../models/PaymentModel");

const getDashboard = async (req, res) => {
  try {
    const totalCars = await carSchema.countDocuments();
    const totalUsers = await userSchema.countDocuments();
    const totalOffers = await offerSchema.countDocuments();
    const totalPayments = await paymentSchema.countDocuments();
    const paidPayments = await paymentSchema.countDocuments({ status: "paid" });

    res.json({
      totalCars,
      totalUsers,
      totalOffers,
      totalPayments,
      paidPayments
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

const getAllPayments = async (req, res) => {
  try {
    const payments = await paymentSchema
      .find()
      .populate("buyerId", "firstName lastName email")
      .populate("sellerId", "firstName lastName email")
      .populate("carId", "brand model price")
      .populate("offerId", "offerPrice counterOffer agreedPrice tokenAmount status paymentStatus")
      .sort({ createdAt: -1 });

    res.status(200).json({
      data: payments
    });
  } catch (err) {
    console.log("GET PAYMENTS ERROR:", err);
    res.status(500).json({
      message: err.message
    });
  }
};

module.exports = {
  getDashboard,
  getAllPayments
};
