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
    const { status, counterOffer, actionBy, tokenAmount } = req.body;

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

    if (counterOffer !== undefined && actionBy === "seller") {
      if (!tokenAmount || tokenAmount < 10000) {
        return res.status(400).json({
          message: "Token amount must be at least Rs. 10000"
        });
      }

      if (tokenAmount > counterOffer * 0.1) {
        return res.status(400).json({
          message: "Token amount cannot exceed 10% of counter offer"
        });
      }

      updateData.counterOffer = counterOffer;
      updateData.tokenAmount = tokenAmount;
      updateData.agreedPrice = null;
      updateData.status = "countered";
      updateData.paymentStatus = "not_required";

      const offer = await Offer.findByIdAndUpdate(
        req.params.id,
        updateData,
        { returnDocument: "after" }
      );

      await createNotification({
        userId: existingOffer.buyerId._id,
        senderId: existingOffer.sellerId._id,
        carId: existingOffer.carId._id,
        offerId: existingOffer._id,
        type: "counter_offer",
        title: "Counter Offer Received",
        message: `Seller has sent a counter offer of Rs. ${counterOffer} with token amount Rs. ${tokenAmount} for ${existingOffer.carId.brand} ${existingOffer.carId.model}.`
      });

      return res.status(200).json({
        message: "Counter offer updated",
        data: offer
      });
    }

    if (status === "accepted" && actionBy === "seller") {
      if (!tokenAmount || tokenAmount < 10000) {
        return res.status(400).json({
          message: "Token amount must be at least Rs. 10000"
        });
      }

      if (tokenAmount > existingOffer.offerPrice * 0.1) {
        return res.status(400).json({
          message: "Token amount cannot exceed 10% of offer price"
        });
      }

      updateData.status = "accepted";
      updateData.agreedPrice = existingOffer.offerPrice;
      updateData.tokenAmount = tokenAmount;
      updateData.paymentStatus = "pending";

      const offer = await Offer.findByIdAndUpdate(
        req.params.id,
        updateData,
        { returnDocument: "after" }
      );

      await createNotification({
        userId: existingOffer.buyerId._id,
        senderId: existingOffer.sellerId._id,
        carId: existingOffer.carId._id,
        offerId: existingOffer._id,
        type: "token_requested",
        title: "Offer Accepted",
        message: `Your offer for ${existingOffer.carId.brand} ${existingOffer.carId.model} has been accepted. Please pay token amount of Rs. ${tokenAmount}.`
      });

      return res.status(200).json({
        message: "Offer accepted with token amount",
        data: offer
      });
    }

    if (status === "accepted" && actionBy === "buyer") {
      if (!existingOffer.counterOffer || !existingOffer.tokenAmount) {
        return res.status(400).json({
          message: "Counter offer or token amount not found"
        });
      }

      updateData.status = "accepted";
      updateData.agreedPrice = existingOffer.counterOffer;
      updateData.paymentStatus = "pending";

      const offer = await Offer.findByIdAndUpdate(
        req.params.id,
        updateData,
        { returnDocument: "after" }
      );

      await createNotification({
        userId: existingOffer.sellerId._id,
        senderId: existingOffer.buyerId._id,
        carId: existingOffer.carId._id,
        offerId: existingOffer._id,
        type: "counter_response",
        title: "Buyer Accepted Counter Offer",
        message: `Buyer accepted your counter offer for ${existingOffer.carId.brand} ${existingOffer.carId.model}. Waiting for token payment of Rs. ${existingOffer.tokenAmount}.`
      });

      await createNotification({
        userId: existingOffer.buyerId._id,
        senderId: existingOffer.sellerId._id,
        carId: existingOffer.carId._id,
        offerId: existingOffer._id,
        type: "token_requested",
        title: "Counter Offer Accepted",
        message: `You accepted the seller's counter offer. Please pay token amount of Rs. ${existingOffer.tokenAmount}.`
      });

      return res.status(200).json({
        message: "Counter offer accepted",
        data: offer
      });
    }

    if (status === "rejected") {
      updateData.status = "rejected";

      const offer = await Offer.findByIdAndUpdate(
        req.params.id,
        updateData,
        { returnDocument: "after" }
      );

      if (actionBy === "seller") {
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

      if (actionBy === "buyer") {
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

      return res.status(200).json({
        message: "Offer rejected",
        data: offer
      });
    }

    return res.status(400).json({
      message: "Invalid offer update request"
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
