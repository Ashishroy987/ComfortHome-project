const express = require("express");
const router = express.Router();
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const userController = require("../controllers/users");


// ==========================
// SIGNUP
// ==========================
router.post("/signup", wrapAsync(userController.signup));


// ==========================
// LOGIN (Custom JSON Auth)
// ==========================
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    req.login(user, (err) => {
      if (err) return next(err);

      return res.status(200).json({
        success: true,
        message: "Logged in successfully",
        user,
      });
    });
  })(req, res, next);
});


// ==========================
// LOGOUT
// ==========================
router.post("/logout", userController.logout);

module.exports = router;