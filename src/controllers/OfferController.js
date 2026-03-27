const Offer = require("../models/OfferModel"); // ✅ clear naming

// ================= CREATE OFFER =================
const createOffer = async (req, res) => {
  try {
    console.log("BODY DATA:", req.body); // 🔥 debug

    const { carId, buyerId, sellerId, offerPrice } = req.body;

    // validation
    if (!carId || !buyerId || !sellerId || !offerPrice) {
      return res.status(400).json({
        message: "All fields are required!"
      });
    }

    // create offer
    const offer = await Offer.create({
      carId,
      buyerId,
      sellerId,
      offerPrice
    });

    res.status(201).json({
      message: "Offer sent ✅",
      data: offer
    });

  } catch (err) {
    console.log("CREATE OFFER ERROR:", err);
    res.status(500).json({
      message: err.message
    });
  }
};

// ================= GET ALL OFFERS =================
const getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find()
      .populate("buyerId sellerId carId");

    res.status(200).json({
      data: offers
    });

  } catch (err) {
    console.log("GET OFFERS ERROR:", err);
    res.status(500).json({
      message: err.message
    });
  }
};

// ================= GET SINGLE OFFER =================
const getOfferById = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id)
      .populate("buyerId sellerId carId");

    if (!offer) {
      return res.status(404).json({
        message: "Offer not found"
      });
    }

    res.status(200).json({
      message: "Offer fetched",
      data: offer
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// ================= UPDATE OFFER =================
const updateOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedAt: Date.now()
      },
      { new: true } // ✅ FIX
    );

    res.status(200).json({
      message: "Offer updated",
      data: offer
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// ================= DELETE OFFER =================
const deleteOffer = async (req, res) => {
  try {
    await Offer.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Offer deleted"
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

module.exports = {
  createOffer,
  getAllOffers,
  getOfferById,
  updateOffer,
  deleteOffer
};