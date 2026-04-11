const router = require("express").Router();
const adminController = require("../controllers/AdminController");

router.get("/dashboard", adminController.getDashboard);
router.get("/payments", adminController.getAllPayments);

module.exports = router;
