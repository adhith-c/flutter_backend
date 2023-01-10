// const express = require("express");
// const router = express();

// const {
//   getAdminLogin,
//   postAdminLogin,
//   userDetails,
//   banners,
//   addBanners,
// } = require("../controllers/adminController");
// router.get("/adminLogin", getAdminLogin);
// router.post("/adminLogin", postAdminLogin);
// router.get("/userDetails", userDetails);
// router.get("/banners", banners);
// router.post("/addBanner", addBanners);
const express = require("express");
const router = express.Router();
// const { isAdmin, adminLogged } = require("../middleware");
// const multer = require("multer");
// const methodOverride = require("method-override");
// const { storage, cloudinary } = require("../cloudinary/index");
// const upload = multer({
//   storage,
// });

// router.use(methodOverride("_method"));

const { postAdminLogin } = require("../controllers/adminController");
// const productController = require("../controller/productController");
// const categoryController = require("../controller/categoryController");
// const brandsController = require("../controller/brandController");
// const orderController = require("../controller/orderController");
// const { logout } = require("../controller/userController");

// router.get("/", adminController.getAdminLogin);
router.post("/signin", postAdminLogin);
//router.get("/dashboard", adminController.getDashboard);
//<-------------------------------------------------------- PRODUCT Management-------------------------------------------------------------------->

// // view Products
// router.get("/viewproducts", productController.viewProductAdmin);
// // Edit Product
// router.get("/addproducts", productController.addProducts);
// router.post(
//   "/add-products",
//   isAdmin,
//   upload.array("image"),
//   productController.postAddProducts
// );
// // Edit Products
// router.get("/editproducts/:id", isAdmin, productController.getEditProduct);
// router.put(
//   "/edit-products/:id",
//   isAdmin,
//   upload.array("image"),
//   productController.putEditProduct
// );
// // delete Products
// router.get("/deleteproducts/:id", isAdmin, productController.deleteProducts);

module.exports = router;
