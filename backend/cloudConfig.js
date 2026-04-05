// cloudConfig.js

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Multer storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "comfortHome_DEV",

    // Allowed file formats
    allowed_formats: ["png", "jpg", "jpeg", "webp"],

    // Optional: better image handling
    transformation: [
      { width: 1200, height: 800, crop: "limit" }
    ]
  }
});

module.exports = { cloudinary, storage };