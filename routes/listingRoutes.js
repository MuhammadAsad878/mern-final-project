import express from "express";
import { wrapAsync } from "../utils/ExpressError.js";
import { IsLoggedIn, IsOwner } from "../utils/middlewares.js";
import { IndexListings, NewListing, ShowListing, EditListingPage, UpdateListing, DeleteListing} from "../controllers/listingsController.js";

const router = express.Router();

//  Index Route 
router.get("/", wrapAsync(IndexListings));

// GET Route 
router.get("/new", IsLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

// POST Route 
router.post("/", IsLoggedIn, wrapAsync(NewListing));

// Show Route to view specific listing
router.get(
  "/:id",
  wrapAsync(ShowListing)
);

// Edit Route 
router.get(
  "/:id/edit",
  IsLoggedIn,
  IsOwner,
  wrapAsync(EditListingPage)
);

// PUT route to update listing
router.put(
  "/:id",
  IsLoggedIn,
  IsOwner,
  wrapAsync(UpdateListing)
);

// Delete Route to delete specific listing
router.delete(
  "/:id",
  IsLoggedIn,
  wrapAsync(DeleteListing)
);

export default router;
