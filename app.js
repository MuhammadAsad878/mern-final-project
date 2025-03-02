// MODULES || Packages || Libraries 
import express from 'express';                    // Express framework
import connectToDB from './db/connectDb.js';      // /db/connectDb.js for DB Connectivity
import path from 'path';                         // Built in module used for working with paths
import methodOverride from 'method-override';   // to make PUT,DELETE Requests possible (3rd party)
import Listing from './models/listing.js';
import { fileURLToPath } from 'url';        // to convert fileURL's to Paths (Built-in)
import ejsMate from 'ejs-mate';      // enhance ejs templating funcionality using <%- body %> ( 3rd party)
import {ExpressError, wrapAsync} from './ExpressError.js'; // Custome err class & wrapAsync
import { listingSchema , reviewSchema } from './schema.js';
import Review from './models/review.js';

const app = express();                        // Making express app
const port = 8080;                                // Initializing Server Port
const __filename = fileURLToPath(import.meta.url);  // extract the current file url  and convert it to os unders
const __dirname = path.dirname(__filename);          // standable path path.dirname(__filename) extracts dirname
connectToDB().then(()=>startApp()).finally(console.log("OK "));                  // Calling DB Connectivity function


// MiddleWares
app.set("view engine", "ejs");              // set view engine ejs to render EJS Embedded JS
app.set("views",path.resolve(__dirname,"views"));  // to set views directory for static files curr-dir-name/views
app.use(express.urlencoded({extended:true}));  // to parse request data
app.use(methodOverride("_method"));         // method-overrride use to check for differect methods to use REST
app.engine('ejs',ejsMate);                    // setting ejsMate as ejs engine
app.use(express.static(path.join(__dirname,'/public')));  // set public folder to server static files




//NOTE:Always put routes like "/listings/new" before routes like "/listings/:id" as if "/listings/:id" placed first then express will consider it like "/listings/new" 

//  Index Route to show all listings
app.get(['/listings','/'], wrapAsync(async (req, res) => {
  const listings = await Listing.find({}).lean(); // lean reduce mem-usage by => palain JS object inst of mong obj
  const countDoc = await Listing.countDocuments(); // direct listing.countDocuments() to count instaead of find.count
  res.render("listings/index.ejs", { listings, countDoc });

}));

// GET Route to get a form for New listing
app.get("/listings/new",(req,res)=>{
  res.render('listings/new.ejs');
});

// POST Route to Create a New Listing
app.post("/listings",wrapAsync(async(req,res)=>{
  try {
    // Validate the request body
    await listingSchema.validateAsync(req.body);

    // Proceed if validation is successful
    const { listing } = req.body;
    const newListing = new Listing(listing);
    await newListing.save();

    res.redirect('/listings');
  } catch (error) {
    console.log(error.details);
    throw new ExpressError(400, error.details[0].message);
  }
}));

// Show Route to view specific listing
app.get("/listings/:id", wrapAsync(async (req,res)=>{
  const {id}  = req.params;
  const listing = await Listing.findById(id).populate('reviews');
  res.render('listings/show.ejs',{listing});
}));

// Edit Route to edit listing
app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
  const {id} = req.params;
  const listing = await Listing.findById(id);
  res.render('listings/edit.ejs', {listing});
}));

// PUT route to update listing
app.put("/listings/:id",wrapAsync(async(req,res)=>{
  const {id} = req.params;
  const {listing} = req.body;
    const update = await Listing.findByIdAndUpdate(id, listing);
    res.redirect(`/listings/${id}`);   // redirect to the updated listing page
}));

// Delete Route to delete specific listing
app.delete('/listings/:id',wrapAsync(async(req,res)=>{
  const {id} = req.params;
 await Listing.findByIdAndDelete(id);
  res.redirect('/listings');
}));

// REVIEWS
// POST Route to create reviews
app.post('/listings/:id/reviews',validateReview ,wrapAsync(async(req,res)=>{

  const listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);

  listing.reviews.push(newReview);
  await listing.save();
  await newReview.save();

  // res.redirect(`/listings/${listing._id}`);
  res.redirect(`/listings/${listing._id}#reviews`);
}));

  // Delete Review Route
app.delete('/listings/:id/review/:reviewId',wrapAsync(async(req,res)=>{
  let { id , reviewId } = req.params;
  if(!id || !reviewId){
  return next(new ExpressError(404, "Oops not found!"));
  }
  await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
  res.redirect(`/listings/${id}#reviews`);  

  }));
// 404 Page Not found Error  // This middleware check if request not matches any upper path then error page not found
app.use('*', async (req,res,next)=>{
  console.log("Empty route found *******************");
  next(new ExpressError(404, "Oops Page not found!"));
}); 
 
// ERROR Handling Middleware
app.use((err,req,res,next)=>{
  console.log("-------ERROR-------");     // this will handle our errors
  console.log(err);
  let { status, message } = err;
  // res.status(status).send(message);   // send status which received in error and message
  res.render('listings/error.ejs', {err});
});

// We can also set default status & message so it not cause any error if status or message is undefined for example 
// let { status=500 , message= "Some Error"} = err; IF status or message not passed then status= 500 & message must be 
// message = "Some Error";






async function validateReview(req,res,next){
let {error} = reviewSchema.validate(req.body);
if(error){ 
  throw new ExpressError(400, "Please fill review form !");
}else{
  next();
}
}


function startApp(){ // function to start app 
app.listen(port, ()=>{
  console.log("Server Started on port ",port);
  console.log("Server started on  ",`http://localhost:8080/listings/`);
});
}
