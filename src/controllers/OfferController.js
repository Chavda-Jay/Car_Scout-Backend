const Offer = require("../models/OfferModel");
const { createNotification } = require("../utils/notificationHelper");

// ================= CREATE OFFER =================
const createOffer = async (req, res) => {
  try {
    console.log("BODY DATA:", req.body);

    const { carId, buyerId, sellerId, offerPrice, message } = req.body;

    if (!carId || !buyerId || !sellerId || !offerPrice) {
      return res.status(400).json({
        message: "All fields are required!"
      });
    }

    const offer = await Offer.create({
      carId,
      buyerId,
      sellerId,
      offerPrice,
      message
    });

    // Notify seller when buyer places a new offer
    await createNotification({
      userId: sellerId,
      senderId: buyerId,
      carId,
      offerId: offer._id,
      type: "new_offer",
      title: "New Offer Received",
      message: `A buyer has placed an offer of Rs. ${offerPrice} on your car.`
    });

    res.status(201).json({
      message: "Offer sent successfully",
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
      filter.buyerId = buyerId;
    }

    if (sellerId) {
      filter.sellerId = sellerId;
    }

    const offers = await Offer.find(filter)
      .populate("buyerId")
      .populate("sellerId")
      .populate("carId")
      .sort({ createdAt: -1 });

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
    const { status, counterOffer, actionBy } = req.body;

    const existingOffer = await Offer.findById(req.params.id)
      .populate("buyerId")
      .populate("sellerId")
      .populate("carId");

    if (!existingOffer) {
      return res.status(404).json({
        message: "Offer not found"
      });
    }

    let updateData = {
      updatedAt: Date.now()
    };

    // Status update
    if (status) {
      if (!["pending", "accepted", "rejected"].includes(status)) {
        return res.status(400).json({
          message: "Invalid status"
        });
      }
      updateData.status = status;
    }

    // Counter offer update by seller
    if (counterOffer) {
      updateData.counterOffer = counterOffer;
      updateData.status = "pending";
    }

    const offer = await Offer.findByIdAndUpdate(
      req.params.id,
      updateData,
     { returnDocument: "after" }
    );

    // Notify buyer when seller sends a counter offer
    if (counterOffer && actionBy === "seller") {
      await createNotification({
        userId: existingOffer.buyerId._id,
        senderId: existingOffer.sellerId._id,
        carId: existingOffer.carId._id,
        offerId: existingOffer._id,
        type: "counter_offer",
        title: "Counter Offer Received",
        message: `Seller has sent a counter offer of Rs. ${counterOffer} for ${existingOffer.carId.brand} ${existingOffer.carId.model}.`
      });
    }

    // Notify buyer when seller accepts or rejects direct offer
    if (status === "accepted" && actionBy === "seller") {
      await createNotification({
        userId: existingOffer.buyerId._id,
        senderId: existingOffer.sellerId._id,
        carId: existingOffer.carId._id,
        offerId: existingOffer._id,
        type: "offer_accepted",
        title: "Offer Accepted",
        message: `Your offer for ${existingOffer.carId.brand} ${existingOffer.carId.model} has been accepted by the seller.`
      });
    }

    if (status === "rejected" && actionBy === "seller") {
      await createNotification({
        userId: existingOffer.buyerId._id,
        senderId: existingOffer.sellerId._id,
        carId: existingOffer.carId._id,
        offerId: existingOffer._id,
        type: "offer_rejected",
        title: "Offer Rejected",
        message: `Your offer for ${existingOffer.carId.brand} ${existingOffer.carId.model} has been rejected by the seller.`
      });
    }

    // Notify seller when buyer accepts or rejects counter offer
    if (status === "accepted" && actionBy === "buyer") {
      await createNotification({
        userId: existingOffer.sellerId._id,
        senderId: existingOffer.buyerId._id,
        carId: existingOffer.carId._id,
        offerId: existingOffer._id,
        type: "counter_response",
        title: "Buyer Accepted Counter Offer",
        message: `Buyer accepted your counter offer for ${existingOffer.carId.brand} ${existingOffer.carId.model}.`
      });
    }

    if (status === "rejected" && actionBy === "buyer") {
      await createNotification({
        userId: existingOffer.sellerId._id,
        senderId: existingOffer.buyerId._id,
        carId: existingOffer.carId._id,
        offerId: existingOffer._id,
        type: "counter_response",
        title: "Buyer Rejected Counter Offer",
        message: `Buyer rejected your counter offer for ${existingOffer.carId.brand} ${existingOffer.carId.model}.`
      });
    }

    res.status(200).json({
      message: "Offer updated",
      data: offer
    });
  } catch (err) {
    console.log("UPDATE OFFER ERROR:", err);
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
