const express = require("express");
const router = express.Router();

const Booking = require("../models/Booking");
const { isLoggedIn } = require("../middleware");


// ======================================
//  Get booking details (for React)
// ======================================
router.get("/:id", isLoggedIn, async (req, res) => {

  try {

    const booking = await Booking
      .findById(req.params.id)
      .populate("listing")
      .populate("user");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    return res.json({
      success: true,
      booking: booking
    });

  } catch (err) {

    console.error("Error fetching booking:", err);

    return res.status(500).json({
      success: false,
      message: "Error fetching booking"
    });

  }

});


// ======================================
//  Create booking manually (optional)
// ======================================
router.post("/create", isLoggedIn, async (req, res) => {

  try {

    const { listingId, amount } = req.body;

    if (!listingId || !amount) {

      return res.status(400).json({
        success: false,
        message: "Missing listing or amount"
      });

    }

    const booking = await Booking.create({
      listing: listingId,
      user: req.user._id,
      amount,
      isPaid: false
    });

    return res.json({
      success: true,
      bookingId: booking._id
    });

  } catch (err) {

    console.error("Error creating booking:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to create booking"
    });

  }

});


module.exports = router;
