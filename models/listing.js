// This contains schema and model for Listings
import mongoose, { set } from "mongoose";
import Review from "../models/review.js";
const Schema = mongoose.Schema;
const defaultLink =
  "https://images.unsplash.com/photo-1468413253725-0d5181091126?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: {
    type: String,
    default: defaultLink,
    set: (v) => (v === "" ? defaultLink : v),
    // we can also use set: (v) => condition ? true : false to set default link value if string is empty

    },
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

// Listing reviews delete post middleware
listingSchema.post(
  "findOneAndDelete",
  async (listing) => {
    if(listing){
    await Review.deleteMany({_id: {$in: listing.reviews}});
  }
  });
const Listing = mongoose.model("Listing", listingSchema);

export { Listing, listingSchema };
