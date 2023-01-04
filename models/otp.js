const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const otpVerification = new Schema({
  userId: String,
  userEmail: String,
  otp: String,
  expiresAt: Date,
});

module.exports = mongoose.model("Otp", otpVerification);
