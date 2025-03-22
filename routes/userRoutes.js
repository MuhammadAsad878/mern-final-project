import passport from "passport";
import User from "../models/user.js";
import express from "express";
import {setRedirectUrl} from "../utils/middlewares.js";

const router = express.Router();

router.get("/signup", (req, res) => {
  res.render("user/signup.ejs");
});

router.post("/signup", async (req, res) => {
  try {
    let { email, username, password } = req.body;
    let user = new User({ email, username });
    const regUser = await User.register(user, password);
    req.login(regUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to AirBnb!");
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/auth/signup");
  }
});

router.get("/login", (req, res) => {
  res.render("user/login.ejs");
});

router.post(
  "/login",
setRedirectUrl,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/auth/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect(res.locals.redirectUrl || "/listings");
  }
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.locals = null;
    req.flash("success", "Logged out successfully");
    res.redirect("/listings");
  });
});

export default router;
