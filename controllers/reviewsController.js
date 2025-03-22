import { ExpressError } from "../utils/ExpressError.js";
import { Listing } from "../models/listing.js";
import Review  from "../models/review.js";

export const CreateReview =  async (req, res) => {
      const listing = await Listing.findById(req.params.id);
      if(!listing) throw new ExpressError(400, "Client Side error");
      let newReview = new Review(req.body.review);
      newReview.author = req.user._id;
      listing.reviews.push(newReview);
      await listing.save();
      await newReview.save();
      res.redirect(`/listings/${listing._id}#reviews`);
    
};

export const DeleteReview = async (req, res) => {
  let { id, reviewId } = req.params;
  if(!id || !reviewId) throw new ExpressError(400, "Client Error..");
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  res.redirect(`/listings/${id}#reviews`);
}