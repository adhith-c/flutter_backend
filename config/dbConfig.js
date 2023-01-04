require("dotenv").config;
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const dbConfig = async () => {
  try {
    await mongoose.connect(process.env.MONG_URI).then(() => {
      console.log("database connected !!!");
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = dbConfig;
