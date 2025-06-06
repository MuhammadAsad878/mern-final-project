import express from 'express';
import connectToDB from './db/connectDb.js';
import path from 'path';
import methodOverride from 'method-override';
import listingRoutes from './routes/listingRoutes.js';
import { fileURLToPath } from 'url';
import ejsMate from 'ejs-mate';
import reviewRoutes from './routes/reviewRoutes.js';
// import logger from './logger.js';
// import morgan from 'morgan';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import flash from 'connect-flash';
import userRoutes from './routes/userRoutes.js';
import passport from 'passport';
import User from './models/user.js';
import LocalStrategy from 'passport-local';
import dotenv from "dotenv";
dotenv.config();


// console.log(process.env);
const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


connectToDB().then(() => startApp()).catch((err) => console.log(err));

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));
// app.use(morgan('combined', {stream: { write: (message) => logger.info(message.trim()),},}));

// MongoDB Store for Session
const store = MongoStore.create({
  mongoUrl: process.env.MONGO_ATLAS_URL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600, // for lazy update 
})
.on('error', (err) => {
  console.log('Session Store Error:', err); 
});

// Session Middleware
app.use(
  session({
    store: store, // MongoDB Store for Session
    secret: process.env.SECRET, // Secret for session encryption
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
  })
);


// Passport , Flash & Session Middleware
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());  // store credentials in session
passport.deserializeUser(User.deserializeUser()); // remove credentials from session

// Middleware to pass flash messages & current user to all routes
app.use((req, res, next) => {
  res.locals.errorMsg = req.flash('error');
  res.locals.successMsg = req.flash('success');
  res.locals.currUser = req.user;
  next();
});



// Routes
app.get('/favicon.ico', (req, res) => res.status(204).end());
app.get('/about-us', (req, res) => {
  res.render('includes/aboutUs.ejs'); 
});
app.use(['/listings','/'], listingRoutes);
app.use('/listings/:id/reviews', reviewRoutes);
app.use('/auth', userRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.log('-------ERROR-------');
  res.render('listings/error.ejs', { err });
});

const startApp = ()=> {
  app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}/`);
  });
}
