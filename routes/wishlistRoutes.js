const express = require("express");

const wishlistController = require("../controllers/wishlistController");
const router = express.Router();
router.get("/:userId", wishlistController.getWishlist);
router.get("/addtowishlist/:userId/:id", wishlistController.addToWishlist);

router.post("/delfromwishlist", wishlistController.deleteFromWishlist);

module.exports = router;
