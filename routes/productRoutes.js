const express = require('express');

const productController = require("../controller/productController");
const router = express.Router();
//router.get('/', adminController.signinPage);
router.get('/viewproduct/:id', productController.viewProductUser);
// router.get('/dashboard', adminController.isAdmin, adminController.adminDashbord);
// router.get('/product', adminController.product);
// router.get('/logout', adminController.logout);


module.exports = router;