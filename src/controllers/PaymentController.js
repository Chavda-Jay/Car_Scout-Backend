const crypto = require("crypto");
const Offer = require("../models/OfferModel");
const Car = require("../models/CarModel");
const Payment = require("../models/PaymentModel");
const razorpayInstance = require("../utils/razorpay");
const { createNotification } = require("../utils/notificationHelper");

const createPaymentOrder = async (req, res) => {
  try {
    const { offerId } = req.body;

    if (!offerId) {
      return res.status(400).json({
        message: "offerId is required"
      });
    }

    const offer = await Offer.findById(offerId).populate("carId buyerId sellerId");

    if (!offer) {
      return res.status(404).json({
        message: "Offer not found"
      });
    }

    if (offer.status !== "accepted") {
      return res.status(400).json({
        message: "Payment can be created only for accepted offers"
      });
    }

    if (!offer.tokenAmount || offer.tokenAmount <= 0) {
      return res.status(400).json({
        message: "Token amount is not set"
      });
    }

    if (offer.paymentStatus === "paid") {
      return res.status(400).json({
        message: "Token already paid for this offer"
      });
    }

    const options = {
      amount: offer.tokenAmount * 100,
      currency: "INR",
      receipt: `offer_${offer._id}`,
      notes: {
        offerId: String(offer._id),
        carId: String(offer.carId._id),
        buyerId: String(offer.buyerId._id),
        sellerId: String(offer.sellerId._id)
      }
    };

    const order = await razorpayInstance.orders.create(options);

    offer.razorpayOrderId = order.id;
    offer.paymentStatus = "pending";
    offer.updatedAt = Date.now();
    await offer.save();

    await Payment.create({
      offerId: offer._id,
      buyerId: offer.buyerId._id,
      sellerId: offer.sellerId._id,
      carId: offer.carId._id,
      agreedPrice: offer.agreedPrice,
      tokenAmount: offer.tokenAmount,
      razorpayOrderId: order.id,
      status: "created"
    });

    res.status(200).json({
      message: "Razorpay order created successfully",
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY,
        offerId: offer._id,
        tokenAmount: offer.tokenAmount,
        agreedPrice: offer.agreedPrice
      }
    });
  } catch (err) {
    console.log("CREATE PAYMENT ORDER ERROR:", err);
    res.status(500).json({
      message: err.message
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      offerId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    if (!offerId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        message: "All payment fields are required"
      });
    }

    const offer = await Offer.findById(offerId).populate("carId buyerId sellerId");

    if (!offer) {
      return res.status(404).json({
        message: "Offer not found"
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      offer.paymentStatus = "failed";
      offer.updatedAt = Date.now();
      await offer.save();

      await Payment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          status: "failed"
        }
      );

      await createNotification({
        userId: offer.buyerId._id,
        senderId: offer.sellerId._id,
        carId: offer.carId._id,
        offerId: offer._id,
        type: "payment_failed",
        title: "Payment Failed",
        message: `Your token payment for ${offer.carId.brand} ${offer.carId.model} could not be verified.`
      });

      return res.status(400).json({
        message: "Invalid payment signature"
      });
    }

    offer.razorpayOrderId = razorpay_order_id;
    offer.razorpayPaymentId = razorpay_payment_id;
    offer.razorpaySignature = razorpay_signature;
    offer.paymentStatus = "paid";
    offer.tokenPaidAt = Date.now();
    offer.updatedAt = Date.now();
    await offer.save();

    await Car.findByIdAndUpdate(offer.carId._id, {
      status: "reserved"
    });

    await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "paid",
        paidAt: Date.now()
      }
    );

    await createNotification({
      userId: offer.sellerId._id,
      senderId: offer.buyerId._id,
      carId: offer.carId._id,
      offerId: offer._id,
      type: "token_paid",
      title: "Token Received",
      message: `Buyer has paid token amount of Rs. ${offer.tokenAmount} for ${offer.carId.brand} ${offer.carId.model}.`
    });

    res.status(200).json({
      message: "Payment verified successfully",
      data: offer
    });
  } catch (err) {
    console.log("VERIFY PAYMENT ERROR:", err);
    res.status(500).json({
      message: err.message
    });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment
};
