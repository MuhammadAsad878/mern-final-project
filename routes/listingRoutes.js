import express from "express";
import { wrapAsync } from "../utils/ExpressError.js";
import { IsLoggedIn, IsOwner } from "../utils/middlewares.js";
import { IndexListings, NewListing, ShowListing, EditListingPage, UpdateListing, DeleteListing} from "../controllers/listingsController.js";
import multer from "multer";
import { storage } from "../cloudConfig.js";



const upload = multer({ storage });

// const upload = multer({ dest: 'uploads/' })
const router = express.Router();

//  Index Route GET & POST Listings
router.route("/")
  .get(wrapAsync(IndexListings))
  .post(IsLoggedIn,upload.single('listing[image]'), wrapAsync(NewListing));
  // .post(,(req,res) => {


// GET Route render new listing form
router.get("/new", IsLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

// "/:id" Routes for GET, PUT, DELETE specific listing
router.route("/:id")
  .get(wrapAsync(ShowListing))
  .put(
    IsLoggedIn,
    IsOwner,
    upload.single('listing[image]'),
    wrapAsync(UpdateListing))
  .delete(IsLoggedIn, wrapAsync(DeleteListing));


// Edit Route 
router.get(
  "/:id/edit",
  IsLoggedIn,
  IsOwner,
  wrapAsync(EditListingPage)
);


export default router;



// //  Index Route 
// router.get("/", wrapAsync(IndexListings));

// // GET Route 
// router.get("/new", IsLoggedIn, (req, res) => {
//   res.render("listings/new.ejs");
// });

// // POST Route 
// router.post("/", IsLoggedIn, wrapAsync(NewListing));

// // Show Route to view specific listing
// router.get(
//   "/:id",
//   wrapAsync(ShowListing)
// );

// // Edit Route 
// router.get(
//   "/:id/edit",
//   IsLoggedIn,
//   IsOwner,
//   wrapAsync(EditListingPage)
// );

// // PUT route to update listing
// router.put(
//   "/:id",
//   IsLoggedIn,
//   IsOwner,
//   wrapAsync(UpdateListing)
// );

// // Delete Route to delete specific listing
// router.delete(
//   "/:id",
//   IsLoggedIn,
//   wrapAsync(DeleteListing)
// );