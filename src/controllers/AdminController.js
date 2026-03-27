const carSchema = require("../models/CarModel");
const userSchema = require("../models/UserModel");
const offerSchema = require("../models/OfferModel");

const getDashboard = async (req, res) => {
  const totalCars = await carSchema.countDocuments();
  const totalUsers = await userSchema.countDocuments();
  const totalOffers = await offerSchema.countDocuments();

  res.json({
    totalCars,
    totalUsers,
    totalOffers
  });
};

module.exports = { getDashboard };