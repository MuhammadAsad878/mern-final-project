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

**Starability.css for Rating Syling**
`https://github.com/LunarLogic/starability`
It is little complex to directly write css or functionality from scratch to handle reviews styling so we simply use the above library or we say pre written code to style reviews or rating by simply copying css and then HTML to be inserted in our form 

**Uploading Files / Images**

For uploading files we have to 
1. Configure our form to send data to backend
2. Get & Save data in our local storage backend using multer
3. Upload it on cloud & save or use that url to be saved in our DB.

We cant simply save our files in bson format in MongoDB as file sizes are so large and not convenient to store file data. So,
we change the HTML form enctype="multipart/form-data" and then use 

Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files. It is written on top of busboy for maximum efficiency.

NOTE: Multer will not process any form which is not multipart (multipart/form-data).

Don't forget the enctype="multipart/form-data" in your form.

<form action="/profile" method="post" enctype="multipart/form-data">
  <input type="file" name="avatar" />
</form>

` npm i multer`
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

use like 
.post('/listing', upload.single('listing[image]')), (req,res)=>{
  res.send(req.body || req.file);
});

**Cloud Setup**
Go to cloudinary for free tier cloud
Set .env file with key value pairs without any space quotes like SECRET=mysecret
To acces these variables from file in our project we use third party library `dotenv`
Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env. Storing configuration in the environment separate from code is based on The Twelve-Factor App methodology.
# install locally (recommended)
npm install dotenv --save

import { configDotenv } from 'dotenv';  or require('dotenv').config()
configDotenv();

console.log(process.env.SECRET);

1. WE only use .env file for development phase only not use in production so we can also write in our app.js like 

if(process.env.NODE_ENV != "production"){
  require('dotenv').config() OR import { configDotenv } from 'dotenv';
  
}

We use our .env to store credentials of our cloud like 
CLOUD_NAME
API_KEY
API_SECRET

FOR MULTER STORE CLOUDINARY
# `npm install cloudinary multer-storage-cloudinary` to interact with cloudinary & multer

1. 1st Step is install cloudinary & multer-storage-cloudinary
2. 2nd Step is import and configure cloud using .env
3. 3rd Step is set storage for your cloud with folderName and allowedFormats: ["png","jpg","jpeg"]
4. Get the req.file.path to save in mongodb url field

Flow of data is like  form > backend > cloud > url > db

# 1st & 2nd Step
We create a separate cloudConfig.js file for this setup 

like root/ cloudConfig.js
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { configDotenv } from 'dotenv';
configDotenv();
import pkg from 'cloudinary';
const { v2: cloudinary } = pkg;

// Configure Cloudinary  like connecting backend with cloudinary account
(async function() {
  // Configuration
  cloudinary.config({ 
      cloud_name: process.env.CLOUD_NAME, // Click 'View API Keys' above to copy your cloud name
      api_key: process.env.CLOUD_API_KEY, // Click 'View API Keys' above to copy your API key
      api_secret: process.env.CLOUD_API_SECRET // Click 'View API Keys' above to copy your API secret
  });   
})();

// Configure Multer Storage with Cloudinary like making a folder in drive where we want to save the files
const storage  = new CloudinaryStorage({
  cloudinary: cloudinary,      // 
  params: {
    folder: 'homeEase', // The name of the folder in cloudinary
    allowed_formats: ['jpeg', 'png', 'jpg'], // The allowed File formats
  },
});


export { cloudinary, storage };

// const upload = multer({ storage });

// export { cloudinary, upload };

# 3rd step is to get data from form and pass it to multer to save it to cloud

const upload = multer({ storage });

.post(upload.single('listing[image]'),(req,res) => {
    console.log(req.body);
    res.send(req.file);
  });

# For 4th step we have to modify our listing Schema and some other fields ....

image: {
  url : String,
  filename: String,
}

# then we will modify our controller for createListing

    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    await newListing.save();
    
This will get req.file.path & filename from image we uploaded using upload.single('listing[image]'), as a middleware before our controller
We then initialize the init data.js then init.js to reinitialize the data 
# then we will modify our controller for UpdateListing

 export async function UpdateListing(req, res) {
  let { id } = req.params;
  if(req.body.listing === undefined) throw new ExpressError(400, "Invalid listing data");
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


**Gettin Started with MAPS**

We are using www.mapbox.com free api for location

1. Signup on MapBox and fetch your public token
2. Set public token in .env
3. Now configure your mapbox to show data in your show.ejs to ensure it is working
4. We are using first script to access process.env.MAP_ACCESS_TOKEN and store it in a variables
5. Now use <div id="map"></div> in show.ejs to show the map and also style it accordingly
5. We create a new mapConfig.js file and add the js code to get the map info or rendering data
6. Now test the functionality

# Geocoding & Saving of Coordinates in MongoDB
https://github.com/mapbox/mapbox-sdk-js/tree/main

Geocoding is the process of converting addresses ( like a street address ) into geographic coordinates like (latitude, longitude), which you can use to place marks on maps or position the map.

1. New Listing > controllers > listingsController.js

import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding.js'
export async function NewListing(req, res) {

  let location = req.body.listing.location;
  let data = await mbxGeoClient
    .forwardGeocode({
      query: location,
      limit: 1, // limit sets how much related values objects come in response  
    })
    .send();

  console.log(data.body.features[0]);
  console.log(data.body.features[0].geometry.coordinates);

2. Store coordinates in MongoDB
mongoose contain special type geoJson to store coordinates
so we change our schema for lsiting by adding following fields then passing resData to that listing.geometry to save in mongodb

geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }

  newListing.geometry = resData.body.features[0].geometry;

# Now displaying map according to relevant listing coordinates but first do Map Marker whiich show your locaiton pin point 🗺

1. Go to Map Marker in mapbox/docs to integrate map marker like locaiton icon 