const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PropertySchema = new Schema({
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  pinCode: {
    type: String,
    required: true,
  },
  //   mobileNumber: {
  //     type: String,
  //     required: true,
  //   },
  price: {
    type: Number,
    required: true,
  },
  propertyType: {
    type: String,
    required: true,
  },
  listingType: {
    type: String,
    required: true,
  },
  views: {
    type: String,
  },
  rooms: {
    type: Number,
    required: true,
  },
  BathRooms: {
    type: Number,
    required: true,
  },
  HalfBathRooms: {
    type: Number,
    required: true,
  },
  squareFoot: {
    type: Number,
    required: true,
  },
  yearBuilt: {
    type: Date,
  },
  Description: {
    type: String,
    required: true,
  },
  locatiom: {
    type: { type: String, required: true },
    coordinates: [],
  },
});
PropertySchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Property", PropertySchema);
