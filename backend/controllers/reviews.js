const Listing = require("../models/listing");
const Review = require("../models/review");


// ==============================
// CREATE REVIEW
// POST /listings/:id/reviews
// ==============================
module.exports.createReview = async (req, res) => {

    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        return res.status(404).json({
            success: false,
            message: "Listing not found"
        });
    }

    
    const newReview = new Review(req.body);

    // add author
    newReview.author = req.user._id;

    // add review to listing
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.status(201).json({
        success: true,
        message: "Review created successfully",
        review: newReview
    });
};



// ==============================
// DELETE REVIEW
// DELETE /listings/:id/reviews/:reviewId
// ==============================
module.exports.destroyReview = async (req, res) => {

    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId }
    });

    await Review.findByIdAndDelete(reviewId);

    res.status(200).json({
        success: true,
        message: "Review deleted successfully"
    });

};