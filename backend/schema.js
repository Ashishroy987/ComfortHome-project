const Joi = require("joi");

// ==========================
// LISTING VALIDATION
// ==========================
module.exports.listingschema = Joi.object({

  title: Joi.string()
    .trim()
    .required()
    .messages({
      "string.empty": "Title is required"
    }),

  description: Joi.string()
    .trim()
    .required()
    .messages({
      "string.empty": "Description is required"
    }),

  location: Joi.string()
    .trim()
    .required()
    .messages({
      "string.empty": "Location is required"
    }),

  country: Joi.string()
    .trim()
    .required()
    .messages({
      "string.empty": "Country is required"
    }),

  price: Joi.number()
    .required()
    .min(0)
    .messages({
      "number.base": "Price must be a number",
      "number.min": "Price must be positive"
    }),

  // Latitude validation
  lat: Joi.number()
    .required()
    .messages({
      "number.base": "Latitude must be a number"
    }),

  // Longitude validation
  lng: Joi.number()
    .required()
    .messages({
      "number.base": "Longitude must be a number"
    }),

  // Image optional (because multer handles file upload)
  image: Joi.any().optional()

});


// ==========================
// REVIEW VALIDATION
// ==========================
module.exports.reviewSchema = Joi.object({

  rating: Joi.number()
    .required()
    .min(1)
    .max(5)
    .messages({
      "number.base": "Rating must be a number",
      "number.min": "Rating must be at least 1",
      "number.max": "Rating cannot exceed 5"
    }),

  comment: Joi.string()
    .trim()
    .required()
    .messages({
      "string.empty": "Comment is required"
    })

});