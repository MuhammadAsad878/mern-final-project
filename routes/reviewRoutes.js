import express from "express";
import {  wrapAsync } from "../utils/ExpressError.js";
import { validateReview, IsLoggedIn, IsAuthor } from "../utils/middlewares.js";
import { CreateReview, DeleteReview } from "../controllers/reviewController.js";


const router = express.Router( { mergeParams:true } );
// REVIEWS


// POST Route to create reviews
router.post(
  "/",
  IsLoggedIn,
  validateReview,
  wrapAsync(CreateReview)
);


// Delete Review Route
router.delete(
  "/:reviewId",
  IsAuthor,
  IsLoggedIn,
  wrapAsync(DeleteReview)
);

  

export default router;