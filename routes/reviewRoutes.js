import express from "express";
import { ExpressError, wrapAsync } from "../ExpressError.js";
import Review from "../models/review.js";
import { Listing } from "../models/listing.js";
import { validateReview } from "../utils/middlewares.js";
const router = express.Router( { mergeParams:true } );



// REVIEWS
// POST Route to create reviews
router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if(!listing) throw new ExpressError(400, "Client Side error");
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await listing.save();
    await newReview.save();

    res.redirect(`/listings/${listing._id}#reviews`);
  })
);


// Delete Review Route
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    if(!id || !reviewId) throw new ExpressError(400, "Client Error..");
    // if (!id || !reviewId) return next(new ExpressError(404, "Oops not found!"));
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    res.redirect(`/listings/${id}#reviews`);
  })
);

  

export default router;