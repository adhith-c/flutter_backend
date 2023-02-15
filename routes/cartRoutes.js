const express = require("express");

const cartController = require("../controllers/cartController");
const router = express.Router();
router.get("/:userId", cartController.getCart);
router.post("/addtocart/:userId", cartController.addToCart);
router.post("/addtoexistingcart/:userId", cartController.addToExistingCart);
router.post("/decfromcart/:userId", cartController.decrementFromCart);
router.post("/delfromcart/:userId", cartController.deleteFromCart);
// router.post("/checkcoupon/:userId", cartController.checkCoupon);

module.exports = router;
