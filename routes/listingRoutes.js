import express from "express";
import { ExpressError, wrapAsync } from "../ExpressError.js";
import { listingSchemaJoi } from "../schema.js";
import { Listing } from "../models/listing.js";
import {IsLoggedIn, IsOwner} from "../utils/middlewares.js";
import mongoose from "mongoose";

const router = express.Router();
//  Index Route to show all listings
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const listings = await Listing.find({}).lean(); // lean reduce mem-usage by => palain JS object inst of mong obj
    const countDoc = await Listing.countDocuments(); // direct listing.countDocuments() to count instaead of find.count
    res.render("listings/index.ejs", { listings, countDoc });
  })
);

// GET Route to get a form for New listing
router.get("/new",
 IsLoggedIn,
  (req, res) => {
  res.render("listings/new.ejs");
});

// POST Route to Create a New Listing
router.post(
  "/",
  IsLoggedIn,
  wrapAsync(async (req, res) => {
    try {
      // Validate the request body
      await listingSchemaJoi.validateAsync(req.body);
      // Proceed if validation is successful
      const { listing } = req.body;
      const newListing = new Listing(listing);
      newListing.owner = req.user._id;
      await newListing.save();
      req.flash("success","Listing added successfully");
      res.redirect("/listings");
    } catch (error) {
      throw new ExpressError(400, error.details[0].message);
    }
  })
);

// Show Route to view specific listing
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
     // Validate if ID is a valid MongoDB ObjectId  
     if (!mongoose.Types.ObjectId.isValid(id)) {
      req.flash("error", "Invalid listing ID!");
      return res.redirect("/listings"); // Redirect to a safe page
    }

    const listing = await Listing.findById(id).populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    }).populate("owner").lean();
    console.log(listing);
    res.render("listings/show.ejs", { listing });
  })
);


// Edit Route to edit listing
router.get(
  "/:id/edit",
 IsLoggedIn,
 IsOwner,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

// PUT route to update listing
router.put(
  "/:id",
 IsLoggedIn,
 IsOwner,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await listingSchemaJoi.validateAsync(req.body);
    const { listing } = req.body;
    await Listing.findByIdAndUpdate(id, listing);
    res.redirect(`/listings/${id}`); // redirect to the updated listing page
  })
);

// Delete Route to delete specific listing
router.delete(
  "/:id",
  IsLoggedIn,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    if(!id) throw new ExpressError(400, "Error from client side"); 
    let listing =  await Listing.findByIdAndDelete(id);
    req.flash("success",listing.title,  " Deleted successfully")
    res.redirect("/listings");
  })
);

export default router;
