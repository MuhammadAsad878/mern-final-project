import passport from "passport";
import User from "../models/user.js";
import express from "express";
import {setRedirectUrl} from "../utils/middlewares.js";
import { Login, Logout, RenderLoginForm, RenderSignUpForm, SignUp } from "../controllers/usersController.js";

const router = express.Router();

// GET /auth/signup Form
router.get("/signup",RenderSignUpForm);

// POST /auth/signup
router.post("/signup", SignUp);

// GET /auth/login Form
router.get("/login", RenderLoginForm);

router.post(
  "/login",
setRedirectUrl,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/auth/login",
  }),
 Login
);

router.get("/logout",Logout);

export default router;
