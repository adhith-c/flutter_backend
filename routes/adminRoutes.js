const express = require("express");
const router = express();

const {
  getAdminLogin,
  postAdminLogin,
  userDetails,
  banners,
  addBanners,
} = require("../controllers/adminController");
router.get("/adminLogin", getAdminLogin);
router.post("/adminLogin", postAdminLogin);
router.get("/userDetails", userDetails);
router.get("/banners", banners);
router.post("/addBanner", addBanners);

module.exports = router;
