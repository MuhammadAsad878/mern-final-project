import User from "../models/user.js";


export function RenderSignUpForm  (req, res) {
  res.render("user/signup.ejs");
}

export function RenderLoginForm  (req, res) {

    res.render("user/login.ejs");
}

export async function SignUp   (req, res) {
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
}

export async function Login  (req, res) {
  req.flash("success", "Welcome back!");
  res.redirect(res.locals.redirectUrl || "/listings");
}

export async function Logout (req, res)  {
  req.logout((err) => {
    if (err) return next(err);
    res.locals = null;
    req.flash("success", "Logged out successfully");
    res.redirect("/listings");
  });
}