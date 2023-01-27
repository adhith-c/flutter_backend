const express = require("express");

const bannerController = require("../controllers/bannerController");
const router = express.Router();
router.get("/", bannerController.viewBanners);
// router.get("/viewproduct/:id", productController.viewProductUser);

// router.get('/logout', adminController.logout);

module.exports = router;
