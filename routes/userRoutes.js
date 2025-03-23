import passport from "passport";
import express from "express";
import {setRedirectUrl} from "../utils/middlewares.js";
import { Login, Logout, RenderLoginForm, RenderSignUpForm, SignUp } from "../controllers/usersController.js";

const router = express.Router();

// GET /auth/signup Form and POST /auth/signup  SIGNUP
router.route("/signup")
.get(RenderSignUpForm)
.post(SignUp);


// GET /auth/login Form and POST /auth/login  LOGIN
router.route("/login")
.get(RenderLoginForm)
.post(
  setRedirectUrl,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/auth/login",
  }),
  Login
)

// GET /auth/logout LOGOUT
router.get("/logout",Logout);

export default router;




// router.get("/signup",RenderSignUpForm);

// // POST /auth/signup
// router.post("/signup", SignUp);

// // GET /auth/login Form
// router.get("/login", RenderLoginForm);

// router.post(
//   "/login",
// setRedirectUrl,
//   passport.authenticate("local", {
//     failureFlash: true,
//     failureRedirect: "/auth/login",
//   }),
//  Login
// );

// router.get("/logout",Logout);