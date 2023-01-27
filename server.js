require("dotenv").config();

const express = require("express");
const logger = require("morgan");
const ejsMate = require("ejs-mate");
const app = express();
const path = require("path");
// const passport = require("passport");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoDBStore = require("connect-mongodb-session")(session);

const dbConfig = require("./config/dbConfig");

app.use(logger("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRouter = require("./routes/userRoutes");
const adminRouter = require("./routes/adminRoutes");
const cartRoutes = require("./routes/cartRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
// const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require("./routes/productRoutes");
const bannerRoutes = require("./routes/bannerRoutes");

// const propertyRouter = require("./routes/propertyRoutes");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public/user/")));
app.use(cookieParser());

const store = new MongoDBStore({
  uri: "mongodb://127.0.0.1:27017/ecommerce",
  collection: "sessionValues",
});

store.on("error", function (error) {
  console.log(error);
});
app.use(
  session({
    secret: "This is a secret",
    cookie: {
      maxAge: 1000 * 60 * 60, // 1 week
    },
    store: store,
    resave: false,
    saveUninitialized: false,
  })
);
// const sessionConfig = {
//   secret: "ecom",
//   resave: false,
//   saveUninitialized: true,
//   store: MongoStore.create({
//     mongoUrl: "mongodb://0.0.0.0:27017/ecommerce",
//   }),
//   cookie: {
//     path: "/",
//     httpOnly: true,
//     expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
//     maxAge: 1000 * 60 * 60 * 24 * 7,
//     secure: false,
//   },
// };
// app.use(session(sessionConfig));
app.use(flash());
app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use((req, res, next) => {
  // res.locals.login = req.isAuthenticated();
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.admin = req.session.isAdmin;
  res.locals.currentUser = req.user;
  res.locals.session = req.session;
  req.session.wow = "dfkjdfdkjfdkf";
  console.log("session value in middle ware", req.session);
  next();
});
app.use(function (req, res, next) {
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  next();
});
app.use("/", userRouter);
app.use("/admin", adminRouter);
app.use("/cart", cartRoutes);
app.use("/checkout", checkoutRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/products", productRoutes);
app.use("/banner", bannerRoutes);
// app.use("/", propertyRouter);

dbConfig();
app.listen(process.env.PORT, () => {
  console.log(`Listening to the server on ${process.env.PORT} !!!`);
});
