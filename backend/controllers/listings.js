const Listing = require("../models/listing");


// ==========================
// GET ALL LISTINGS
// ==========================
module.exports.index = async (req, res) => {
  try {

    const allListings = await Listing.find({})
      .populate("owner");

    res.status(200).json({
      success: true,
      listings: allListings
    });

  } catch (err) {

    console.error("Error fetching listings:", err);

    res.status(500).json({
      success: false,
      message: "Error fetching listings"
    });

  }
};



// ==========================
// GET SINGLE LISTING
// ==========================
module.exports.showListing = async (req, res) => {
  try {

    const { id } = req.params;

    const listing = await Listing.findById(id)
      .populate("owner")
      .populate({
        path: "reviews",
        populate: { path: "author" }
      });

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found"
      });
    }

    res.status(200).json({
      success: true,
      listing
    });

  } catch (err) {

    console.error("Error fetching listing:", err);

    res.status(500).json({
      success: false,
      message: "Error fetching listing"
    });

  }
};



// ==========================
// CREATE LISTING
// ==========================
module.exports.createListing = async (req, res) => {
  try {

    const { title, description, price, country, location } = req.body;

    // Convert coordinates safely
    const lat = req.body.lat ? Number(req.body.lat) : null;
    const lng = req.body.lng ? Number(req.body.lng) : null;

    const newListing = new Listing({
      title,
      description,
      price: Number(price),
      country,
      location,
      owner: req.user._id
    });

    // Save coordinates only if provided
    if (lat !== null && lng !== null) {
      newListing.coordinates = {
        lat,
        lng
      };
    }

    // Save image if uploaded
    if (req.file) {
      newListing.image = {
        url: req.file.path,
        filename: req.file.filename
      };
    }

    await newListing.save();

    res.status(201).json({
      success: true,
      message: "Listing created successfully",
      listing: newListing
    });

  } catch (err) {

    console.error("CREATE LISTING ERROR:", err);

    res.status(400).json({
      success: false,
      message: err.message
    });

  }
};



// ==========================
// UPDATE LISTING
// ==========================
module.exports.updateListing = async (req, res) => {
  try {

    const { id } = req.params;

    const { title, description, price, country, location } = req.body;

    const lat = req.body.lat ? Number(req.body.lat) : null;
    const lng = req.body.lng ? Number(req.body.lng) : null;

    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found"
      });
    }

    // Update fields
    listing.title = title;
    listing.description = description;
    listing.price = Number(price);
    listing.country = country;
    listing.location = location;

    // Update coordinates if provided
    if (lat !== null && lng !== null) {
      listing.coordinates = {
        lat,
        lng
      };
    }

    // Update image
    if (req.file) {
      listing.image = {
        url: req.file.path,
        filename: req.file.filename
      };
    }

    await listing.save();

    res.status(200).json({
      success: true,
      message: "Listing updated successfully",
      listing
    });

  } catch (err) {

    console.error("UPDATE ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Error updating listing"
    });

  }
};



// ==========================
// DELETE LISTING
// ==========================
module.exports.destroyListing = async (req, res) => {
  try {

    const { id } = req.params;

    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Listing deleted successfully"
    });

  } catch (err) {

    console.error("DELETE ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Error deleting listing"
    });

  }
};