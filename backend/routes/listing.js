const express = require("express");
const router = express.Router();
const multer = require("multer");

const { isLoggedIn, isOwner, validateListing } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");

const listingController = require("../controllers/listings");

// REVIEW ROUTES
const reviewRoutes = require("./review");

// ==========================
// CLOUDINARY STORAGE CONFIG
// ==========================
const { storage } = require("../cloudConfig");
const upload = multer({ storage });


// ==========================
// NESTED REVIEW ROUTES
// ==========================
router.use("/:id/reviews", reviewRoutes);


// ==========================
// GET ALL LISTINGS
// ==========================
router.get(
  "/",
  wrapAsync(listingController.index)
);


// ==========================
// CREATE NEW LISTING
// ==========================
router.post(
  "/",
  isLoggedIn,
  upload.single("image"),
  validateListing,
  wrapAsync(listingController.createListing)
);


// ==========================
// GET SINGLE LISTING
// ==========================
router.get(
  "/:id",
  wrapAsync(listingController.showListing)
);


// ==========================
// UPDATE LISTING
// ==========================
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single("image"),
  validateListing,
  wrapAsync(listingController.updateListing)
);


// ==========================
// DELETE LISTING
// ==========================
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing)
);


// ==========================
module.exports = router;