import Joi from "joi";

const listingSchemaJoi = Joi.object({
  listing: Joi.object({
    title: Joi.string().required().messages({
      "string.empty": "Title cannot be empty",
      "any.required": "Title is required"
    }),
    description: Joi.string().required().messages({
      "string.empty": "Description cannot be empty",
      "any.required": "Description is required"
    }),
    location: Joi.string().required().messages({
      "string.empty": "Location cannot be empty",
      "any.required": "Location is required"
    }),
    country: Joi.string().required().messages({
      "string.empty": "Country cannot be empty",
      "any.required": "Country is required"
    }),
    price: Joi.number().min(0).required().messages({
      "number.base": "Price must be a number",
      "number.min": "Price must not be > 0",
      "any.required": "Price is required"
    }),
    image: Joi.string().allow("", null).optional()
  }).required().messages({"string.listing" : "All fields are required"}) // Ensures `listing` itself is not missing
});

const reviewSchemaJoi = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5).messages({
      "number.empty": "Rating is necessary",
      "any.required": "Rating is required"
    }),
    comment: Joi.string().required().messages({
      "any.required" : "Please add review to submit",
    }),
  }).required(),
})
export { listingSchemaJoi, reviewSchemaJoi };
