const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");


// ==========================
// LISTING SCHEMA
// ==========================
const listingSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    image: {
      url: {
        type: String,
        default:
          "https://images.unsplash.com/photo-1505691938895-1758d7feb511"
      },
      filename: {
        type: String,
        default: "default-image"
      }
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    location: {
      type: String,
      required: true
    },

    // ==========================
    // MAP COORDINATES
    // ==========================
    coordinates: {
      lat: {
        type: Number,
        required: true
      },
      lng: {
        type: Number,
        required: true
      }
    },

    country: {
      type: String,
      required: true
    },

    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review"
      }
    ],

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }

  },
  { timestamps: true }
);


// ==========================
// DELETE REVIEWS WHEN LISTING DELETED
// ==========================
listingSchema.post("findOneAndDelete", async (listing) => {

  if (listing) {
    await Review.deleteMany({
      _id: { $in: listing.reviews }
    });
  }

});


// ==========================
// MODEL EXPORT
// ==========================
const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;