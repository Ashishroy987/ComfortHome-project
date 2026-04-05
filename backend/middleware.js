const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");
const { listingschema, reviewSchema } = require("./schema");


// ===================== LOGIN CHECK =====================
module.exports.isLoggedIn = (req, res, next) => {

  // Passport authentication check
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({
      success: false,
      message: "You must be logged in"
    });
  }

  next();
};


// ===================== OWNER CHECK =====================
module.exports.isOwner = async (req, res, next) => {

  try {

    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found"
      });
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Login required"
      });
    }

    if (!listing.owner.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "You are not the owner of this listing"
      });
    }

    next();

  } catch (err) {

    console.error("Owner check error:", err);

    return res.status(500).json({
      success: false,
      message: "Error verifying listing owner"
    });

  }

};


// ===================== LISTING VALIDATION =====================
module.exports.validateListing = (req, res, next) => {

  const { error } = listingschema.validate(req.body);

  if (error) {

    const errMsg = error.details.map(el => el.message).join(",");

    return res.status(400).json({
      success: false,
      message: errMsg
    });

  }

  next();
};


// ===================== REVIEW VALIDATION =====================
module.exports.validateReview = (req, res, next) => {

  const { error } = reviewSchema.validate(req.body);

  if (error) {

    const errMsg = error.details.map(el => el.message).join(",");

    return res.status(400).json({
      success: false,
      message: errMsg
    });

  }

  next();
};


// ===================== REVIEW AUTHOR CHECK =====================
module.exports.isReviewAuthor = async (req, res, next) => {

  try {

    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Login required"
      });
    }

    if (!review.author.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "You are not the author of this review"
      });
    }

    next();

  } catch (err) {

    console.error("Review author check error:", err);

    return res.status(500).json({
      success: false,
      message: "Error verifying review author"
    });

  }

};