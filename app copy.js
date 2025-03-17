// MODULES || Packages || Libraries 
import express from 'express';                    // Express framework
import connectToDB from './db/connectDb.js';      // /db/connectDb.js for DB Connectivity
import path from 'path';                          // Built in module used for working with paths
import methodOverride from 'method-override';     // to make PUT,DELETE Requests possible (3rd party)
import listingRoutes from './routes/listingRoutes.js';
import { fileURLToPath } from 'url';                  // to convert fileURL's to Paths (Built-in)
import ejsMate from 'ejs-mate';                        // enhance ejs templating funcionality using <%- body %> ( 3rd party)
import {ExpressError} from './ExpressError.js';       // Custome err class & wrapAsync
import reviewRoutes from './routes/reviewRoutes.js';
import logger from "./logger.js";                    // Import custom logger
import morgan from "morgan";                         // Import Morgan for request logging
import session from 'express-session';
import flash from 'connect-flash';

const app = express();                        // Making express app
const port = 3000;                                // Initializing Server Port
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
// Use Morgan with Winston for HTTP request logging
app.use(morgan("combined", { stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

app.use(session({
  secret: "yoursecretkey",
  resave: false,
  saveUninitialized: true,
  cookie:{
    // expires: Date.now() + 7 * 24 * 60 * 60 * 1000, deprecated
    maxAge: 7 * 24 * 60 * 60 * 1000, // set max age for cookie to be expired after this
    httpOnly: true,  // useful for security to prevent cross-scripting-attack
  }
}));
app.use(flash());

app.use((req,res,next)=>{
  res.locals.errorMsg = req.flash("error");
  res.locals.successMsg = req.flash("success");
  next();
})
//NOTE:Always put routes like "/listings/new" before routes like "/listings/:id" as if "/listings/:id" placed first then express will consider it like "/listings/new" 
app.use((req, res, next) => {
  console.log("Request received:", req.method, req.url);
  next();
});

// Routes
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);

// 404 Page Not found Error  // This middleware check if req doesn't match route then give 404 Page not found error!
// app.use('*', async (req,res,next)=>{
//   next(new ExpressError(404, "Oops Page not found!"));
// }); 
 
// ERROR Handling Middleware
app.use((err,req,res,next)=>{
  console.log("-------ERROR-------");     // this will handle our errors
  console.log(err);
  let { status = 500, message = "Some Error Occured!" } = err;
  res.render('listings/error.ejs', {err});
});










function startApp(){ // function to start app 
app.listen(port, ()=>{
  console.log("Server Started on port ",port);
  console.log("Server started on  ",`http://localhost:${port}/`);
});
}
