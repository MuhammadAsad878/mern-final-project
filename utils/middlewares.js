import { Listing } from '../models/listing.js';
import { reviewSchemaJoi } from '../schema.js';
import Review from '../models/review.js';


export const IsLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl =  req.originalUrl;
    req.flash('error', 'You must be signed in first!');
    return res.redirect('/auth/login');
  }
  next();
};

export const setRedirectUrl = (req, res, next) => {
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl || '/listings';
  }
  next();
}

export const IsOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing.owner.equals(req.user._id)) {
    req.flash('error', 'You are not the owner of this listing!');
    return res.redirect(`/listings/${id}`);
  }
  next();
}

export const IsAuthor = async( req,res,next ) => {
  const { reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author._id.equals(req.user._id)) {
    req.flash('error', 'You are not the author of this review!');
    return res.redirect(`/listings/${id}`);
  }
  next();
}


export const validateReview = async (req,res,next) =>{
  let {error} = reviewSchemaJoi.validate(req.body);
  if(error){ 
    throw new ExpressError(400, "Please fill review form !");
  }
    next();
  }