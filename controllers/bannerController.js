const express = require("express");
const router = express.Router();
const Banner = require("../models/banner");

const viewBanners = async (req, res) => {
  try {
    const banner = await Banner.find({});
    if (banner) {
      res.status(200).json(banner);
    } else {
      res.status(500).json({ message: "no banners added by admin" });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  viewBanners,
};
