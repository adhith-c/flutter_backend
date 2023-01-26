const express = require('express');

const checkoutController = require("../controller/checkoutController");
const router = express.Router();

router.get('/', checkoutController.getCheckout);
router.post('/', checkoutController.postCheckout);
router.post('/addnewaddress', checkoutController.addNewAddress);
router.get('/verifyorder', checkoutController.verifyOrder);
router.post('/payment', checkoutController.payment);
router.post('/is-order-approved', checkoutController.isApproved);
router.get('/orderSuccess', checkoutController.orderSuccess);
router.get('/orderFailed', checkoutController.orderFailed);
router.post('/getvalfromcart', checkoutController.getValFromCart)


module.exports = router;