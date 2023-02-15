const express = require("express");

const wishlistController = require("../controllers/wishlistController");
const router = express.Router();
router.get("/:userId", wishlistController.getWishlist);
router.get("/addtowishlist/:userId/:id", wishlistController.addToWishlist);

router.delete(
  "/delfromwishlist/:userId/:id",
  wishlistController.deleteFromWishlist
);

module.exports = router;
