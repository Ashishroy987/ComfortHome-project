// ==========================
// ENV CONFIG
// ==========================
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const cors = require("cors");

const User = require("./models/user");

// ==========================
// ROUTES
// ==========================
const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");
const paymentRoutes = require("./routes/paymentRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

// ==========================
// DATABASE
// ==========================
const dbUrl =
  process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/comforthome";

mongoose
  .connect(dbUrl)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Mongo Error:", err));

// ==========================
// TRUST PROXY (needed for Render HTTPS cookies)
// ==========================
app.set("trust proxy", 1);

// ==========================
// CORS CONFIG
// ==========================
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// ==========================
// BODY PARSER
// ==========================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================
// SESSION CONFIG
// ==========================
const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret || sessionSecret.length < 32) {
  throw new Error("SESSION_SECRET must be at least 32 characters long");
}

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: { secret: sessionSecret },
  touchAfter: 24 * 3600,
});

store.on("error", (e) => console.log("SESSION STORE ERROR", e));

app.use(
  session({
    store,
    name: "comforthome-session",
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

// ==========================
// PASSPORT CONFIG
// ==========================
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ==========================
// GLOBAL USER MIDDLEWARE
// ==========================
app.use((req, res, next) => {
  res.locals.currUser = req.user;
  next();
});

// ==========================
// ROUTES
// ==========================
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/users", userRouter);
app.use("/payment", paymentRoutes);
app.use("/bookings", bookingRoutes);

// ==========================
// ROOT ROUTE
// ==========================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "ComfortHome API running",
  });
});

// ==========================
// 404 HANDLER
// ==========================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

// ==========================
// GLOBAL ERROR HANDLER
// ==========================
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  res.status(statusCode).json({
    success: false,
    message,
  });
});

module.exports = app;