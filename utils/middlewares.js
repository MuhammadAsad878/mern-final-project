class Middleware {
  static IsLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.session.redirectUrl = req.originalUrl;
      req.flash("error", "You must be signed in first!");
      return res.redirect("/auth/login");
    }
    next();
  };

  static setRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
      res.locals.redirectUrl = req.session.redirectUrl || "/listings";
    }
    next();
  };
}

export default Middleware;
