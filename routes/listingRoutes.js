import express from "express";
import { ExpressError, wrapAsync } from "../ExpressError.js";
import { listingSchemaJoi } from "../schema.js";
import { Listing } from "../models/listing.js";

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
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

// POST Route to Create a New Listing
router.post(
  "/",
  wrapAsync(async (req, res) => {
    try {
      // Validate the request body
      await listingSchemaJoi.validateAsync(req.body);

      // Proceed if validation is successful
      const { listing } = req.body;
      const newListing = new Listing(listing);
      await newListing.save();

      res.redirect("/listings");
    } catch (error) {
      console.log(error.details);
      throw new ExpressError(400, error.details[0].message);
    }
  })
);

// Show Route to view specific listing
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
  })
);

// Edit Route to edit listing
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

// PUT route to update listing
router.put(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { listing } = req.body;
    const update = await Listing.findByIdAndUpdate(id, listing);
    res.redirect(`/listings/${id}`); // redirect to the updated listing page
  })
);

// Delete Route to delete specific listing
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    if(!id) throw new ExpressError(400, "Error from client side"); 
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

export default router;
