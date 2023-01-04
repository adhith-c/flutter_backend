const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobileNumber: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    // addressDetails: [
    //   {
    //     address: {
    //       type: String,
    //     },
    //     city: {
    //       type: String,
    //     },
    //     country: {
    //       type: String,
    //     },
    //     pinCode: {
    //       type: String,
    //     },
    //     mobileNumber: {
    //       type: String,
    //     },
    //   },
    // ],
    isVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    url: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
