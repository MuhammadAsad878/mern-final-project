import { Listing } from "../models/listing.js";
import { listingSchemaJoi } from "../schema.js";
import { ExpressError } from "../utils/ExpressError.js";
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding.js'
import mongoose from "mongoose";
import { configDotenv } from "dotenv";



configDotenv();
const mapAccessToken = process.env.MAP_ACCESS_TOKEN;


const mbxGeoClient = mbxGeocoding({ accessToken: mapAccessToken });

console.log("listingController.js > ", mapAccessToken);

export async function IndexListings(req, res) {
  const listings = await Listing.find({}).lean(); // lean reduce mem-usage by => palain JS object inst of mong obj
  const countDoc = await Listing.countDocuments(); // direct listing.countDocuments() to count instaead of find.count
  res.render("listings/index.ejs", { listings, countDoc });
}

export async function NewListing(req, res) {

  let location = req.body.listing.location;
  let resData = await mbxGeoClient
    .forwardGeocode({
      query: location,
      limit: 1, // limit sets how much related values objects come in response  
    })
    .send();

  console.log(resData.body.features[0]);
  console.log(resData.body.features[0].geometry.coordinates);



  // Validate the request body
  await listingSchemaJoi.validateAsync(req.body);
  // Proceed if validation is successful
  const { listing } = req.body;
  if (!listing) throw new ExpressError(400, "Invalid listing data");

  const newListing = new Listing(listing);
  newListing.owner = req.user._id;
  if(req.file){
    let url = req.file.path;
    let filename = req.file.filename;
  newListing.image = { url, filename };
  }
  newListing.geometry = resData.body.features[0].geometry;

  let saveListing = await newListing.save();
  console.log(saveListing); 
  req.flash("success", "Listing added successfully");
  res.redirect("/listings");

}

export async function ShowListing(req, res) {
  const { id } = req.params;
  // Validate if ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    req.flash("error", "Invalid listing ID!");
    return res.redirect("/listings"); // Redirect to a safe page
  }

  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner")
    .lean();
  res.render("listings/show.ejs", { listing });
}

export async function EditListingPage(req, res) {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}

export async function UpdateListing(req, res) {
  let { id } = req.params;
  if (req.body.listing === undefined) throw new ExpressError(400, "Invalid listing data");
  let listing = await Listing.findByIdAndUpdate(id, req.body.listing);

  if (typeof req.file !== "undefined") {
    const url = String(req.file.path);
    const filename = String(req.file.filename);
    listing.image = { url, filename };
    await listing.save();
  }

  await listingSchemaJoi.validateAsync(req.body);

  req.flash("success", "Listing updated successfully");
  res.redirect(`/listings/${id}`); // redirect to the updated listing page
}

export async function DeleteListing(req, res) {
  const { id } = req.params;
  if (!id) throw new ExpressError(400, "Error from client side");
  let listing = await Listing.findByIdAndDelete(id);
  req.flash("success", listing.title, " Deleted successfully");
  res.redirect("/listings");
}
