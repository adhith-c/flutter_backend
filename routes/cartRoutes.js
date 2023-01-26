const express = require('express');

const cartController = require("../controller/cartController");
const router = express.Router();
router.get('/', cartController.getCart);
// router.get('/addtocart/:id', cartController.addToCart);
router.post('/addtocart', cartController.addToCart);
router.post('/addtoexistingcart', cartController.addToExistingCart);
router.post('/decfromcart', cartController.decrementFromCart);
router.post('/delfromcart', cartController.deleteFromCart);
router.post('/checkcoupon', cartController.checkCoupon);





module.exports = router;