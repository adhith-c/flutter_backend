require("dotenv").config();

const express = require("express");
const logger = require("morgan");
const ejsMate = require("ejs-mate");
const app = express();

const dbConfig = require("./config/dbConfig");

app.use(logger("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRouter = require("./routes/userRoutes");
const adminRouter = require("./routes/adminRoutes");
const propertyRouter = require("./routes/propertyRoutes");

app.use("/", userRouter);
app.use("/admin", adminRouter);
app.use("/", propertyRouter);

app.engine("ejs", ejsMate);

app.set("view engine", "ejs");

dbConfig();
app.listen(process.env.PORT, () => {
  console.log(`Listening to the server on ${process.env.PORT} !!!`);
});
