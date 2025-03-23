**Post Login Route**

When we go to add new listing and it says first you have to be logged in and redirect to login form when we login then it has to return back to that originalUrl from where we are being redirected to login route

`import {setRedirectUrl} from "../utils/middlewares.js";`


import mongoose from 'mongoose';
import { Listing } from '../models/listing.js';
import { reviewSchemaJoi } from '../schema.js';
import Review from '../models/review.js';


export const `IsLoggedIn` = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl =  req.originalUrl;
    req.flash('error', 'You must be signed in first!');
    return res.redirect('/auth/login');
  }
  next();
};

export const `setRedirectUrl` = (req, res, next) => {
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl || '/listings';
  }
  next();
}

export const `IsOwner` = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing.owner.equals(req.user._id)) {
    req.flash('error', 'You are not the owner of this listing!');
    return res.redirect(`/listings/${id}`);
  }
  next();
}

export const `IsAuthor` = async( req,res,next ) => {
  const { reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author._id.equals(req.user._id)) {
    req.flash('error', 'You are not the author of this review!');
    return res.redirect(`/listings/${id}`);
  }
  next();
}


export const `validateReview` = async (req,res,next) =>{
  let {error} = reviewSchemaJoi.validate(req.body);
  if(error){ 
    throw new ExpressError(400, "Please fill review form !");
  }
    next();
  }


***  `Authorization for Listings & Reviews` ***
  as only authorized persons can create listing and create or delete reviews


  **MVC Controller**
  MVC Model-View-Controller is a design pattern we mostly used to make our code more compact and manageable
  1. `MODEL`:        contain all data related to schema, database etc
  2. `VIEW`:         contain all the data related to UI which will be rendered e.g ejs templates
  3. `Controller`:   contain all the functionality we have developed for each route 

  We can apply this MVC Controller for all our routes functionalities

  root/ 
  Controller/
    listingsController.js / funcitons for all listing routes e.g Index, Show, Destroy, Edit etc
    reviewsController.js / funcitons for all review routes e.g Index, Show, Destroy, Edit etc
    usersController.js  / funcitons for all users routes e.g Index, Show, Destroy, Edit etc

export each function and use it in wrapAsync or in (req,res) callback like below

`import {ShowListings, DestroyListing} from '../controllers/listingsController.js';`

1. app.get('/', wrapAsync(ShowListings));
2. app.delete('/:id', wrapAsync( DestroyListing ));


**Router.route**
A way to group together routes with different verbs but same paths e.g following

router.route('/users/:user_id')
  .all((req, res, next) => {
  // runs for all HTTP verbs first
  // think of it as route specific middleware!
    next()
  })
  .get((req, res, next) => {
    res.json(req.user)
  })
  .put((req, res, next) => {
  // just an example of maybe updating the user
    req.user.name = req.params.name
    // save user ... etc
    res.json(req.user)
  })
  .post((req, res, next) => {
    next(new Error('not implemented'))
  })
  .delete((req, res, next) => {
    next(new Error('not implemented'))
  })
