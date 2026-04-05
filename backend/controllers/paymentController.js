const Razorpay = require("razorpay");
const crypto = require("crypto");
const Listing = require("../models/listing");
const Booking = require("../models/Booking");

// =============================
// Initialize Razorpay
// =============================
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// ======================================
// Create Razorpay Order
// ======================================
module.exports.createOrder = async (req, res) => {
  try {

    const { listingId } = req.body;

    if (!listingId) {
      return res.status(400).json({
        success: false,
        message: "Listing ID missing"
      });
    }

    // Find listing
    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found"
      });
    }

    // Razorpay expects amount in paise
    const amount = listing.price * 100;

    const options = {
      amount: amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        listingId: listingId,
        userId: req.user._id.toString()
      }
    };

    const order = await razorpay.orders.create(options);

    return res.json({
      success: true,
      order: order
    });

  } catch (err) {

    console.error("Order creation error:", err);

    return res.status(500).json({
      success: false,
      message: "Order creation failed"
    });

  }
};


// ======================================
// Verify Razorpay Payment
// ======================================
module.exports.verifyPayment = async (req, res) => {

  try {

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      listingId
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !listingId
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing payment details"
      });
    }

    // Create signature body
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    // Generate expected signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    // Compare signatures
    if (expectedSignature !== razorpay_signature) {

      return res.status(400).json({
        success: false,
        message: "Invalid payment signature"
      });

    }

    // Get listing price
    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found"
      });
    }

    // Save booking
    const booking = await Booking.create({
      listing: listingId,
      user: req.user._id,
      amount: listing.price,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      isPaid: true
    });

    return res.json({
      success: true,
      bookingId: booking._id
    });

  } catch (err) {

    console.error("Payment verification error:", err);

    return res.status(500).json({
      success: false,
      message: "Payment verification failed"
    });

  }

};