const express = require("express");

const productController = require("../controllers/productController");
const router = express.Router();
router.get('/', productController.viewProducts);
router.get("/viewproduct/:id", productController.viewProductUser);
// router.get('/dashboard', adminController.isAdmin, adminController.adminDashbord);
// router.get('/product', adminController.product);
// router.get('/logout', adminController.logout);

module.exports = router;
