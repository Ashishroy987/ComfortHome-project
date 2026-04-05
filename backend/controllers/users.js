const User = require("../models/user");


// ==========================
// SIGNUP
// ==========================
module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: registeredUser,
      });
    });

  } catch (e) {
    res.status(400).json({
      success: false,
      message: e.message,
    });
  }
};


// ==========================
// LOGIN (Handled in Route)
// ==========================
// Nothing needed here anymore
// Login JSON response is handled inside routes/user.js


// ==========================
// LOGOUT
// ==========================
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  });
};