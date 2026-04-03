const mongoose = require("mongoose"); 
const Offer = require("../models/OfferModel"); 

// ================= CREATE OFFER =================
const createOffer = async (req, res) => {
  try {
    console.log("BODY DATA:", req.body); // 🔥 debug

    const { carId, buyerId, sellerId, offerPrice,message } = req.body;

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
      offerPrice,
      message
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
    const { buyerId, sellerId } = req.query;

    let filter = {};

    if (buyerId) {
      filter.buyerId = buyerId; // ✅ direct use (no need ObjectId)
    }

    if (sellerId) {
      filter.sellerId = sellerId;
    }

    const offers = await Offer.find(filter)
      .populate("buyerId")
      .populate("sellerId")
      .populate("carId")
      .sort({created: -1})  // latest offer sabse uper aayega...
 
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

    const { status, counterOffer } = req.body;

    let updateData = {
      updatedAt: Date.now()
    };

    // ✅ status update
    if (status) {
      if (!["pending", "accepted", "rejected"].includes(status)) {
        return res.status(400).json({
          message: "Invalid status"
        });
      }
      updateData.status = status;
    }

    // ✅ counter offer update
    if (counterOffer) {
      updateData.counterOffer = counterOffer;
      updateData.status = "pending"; // 🔥 important
    }

    const offer = await Offer.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
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