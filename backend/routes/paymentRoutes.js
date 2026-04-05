const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/paymentController");
const { isLoggedIn } = require("../middleware");

// ===============================
// Create Razorpay Order
// ===============================
router.post(
  "/checkout/:id",
  isLoggedIn,
  paymentController.createOrder
);

// ===============================
// Verify Razorpay Payment
// ===============================
router.post(
  "/verify",
  isLoggedIn,
  paymentController.verifyPayment
);

module.exports = router;