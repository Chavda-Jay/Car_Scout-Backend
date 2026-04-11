const router = require("express").Router();
const paymentController = require("../controllers/PaymentController");

router.post("/create-order", paymentController.createPaymentOrder);
router.post("/verify", paymentController.verifyPayment);

module.exports = router;
