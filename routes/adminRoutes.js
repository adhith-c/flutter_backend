const express = require('express');
const router = express.Router();
const {
    isAdmin,
    adminLogged
} = require('../middleware');
const multer = require('multer');
const methodOverride = require('method-override');
const {
    storage,
    cloudinary
} = require('../cloudinary/index');
const upload = multer({
    storage
});

router.use(methodOverride('_method'));

const adminController = require("../controller/adminController");
const productController = require("../controller/productController");
const categoryController = require("../controller/categoryController");
const brandsController = require("../controller/brandController");
const orderController = require("../controller/orderController");
const {
    logout
} = require('../controller/userController');

router.get('/', adminController.getAdminLogin);
router.post('/signin', adminLogged, adminController.postAdminLogin);
router.get('/dashboard', isAdmin, adminController.getDashboard)
//<-------------------------------------------------------- PRODUCT Management-------------------------------------------------------------------->

// view Products
router.get('/viewproducts', isAdmin, productController.viewProductAdmin);
// Edit Product
router.get('/addproducts', isAdmin, productController.addProducts);
router.post('/add-products', isAdmin, upload.array('image'), productController.postAddProducts);
// Edit Products
router.get('/editproducts/:id', isAdmin, productController.getEditProduct);
router.put('/edit-products/:id', isAdmin, upload.array('image'), productController.putEditProduct);
// delete Products
router.get('/deleteproducts/:id', isAdmin, productController.deleteProducts);

//<-------------------------------------------------------- Category Management-------------------------------------------------------------------->

// viewCategory
router.get('/viewcategory', isAdmin, categoryController.getCategory);

// Add new Category
router.get('/addcategory', categoryController.getAddCategory);
router.post('/add-category', isAdmin, categoryController.postAddCategory);

// Edit or Update Category
router.get('/editcategory/:id', isAdmin, categoryController.getEditCategory);
router.put('/edit-category/:id', isAdmin, categoryController.putEditCategory);
//delete category
router.get('/deletecategory/:id', isAdmin, categoryController.deleteCategory);


//<-------------------------------------------------------- Brand Management-------------------------------------------------------------------->

// view Brand
router.get('/viewbrand', isAdmin, brandsController.getBrand)

// Add new Brand
router.get('/addbrand', brandsController.getNewBrand)
router.post('/add-brand', isAdmin, upload.array('image'), brandsController.postNewBrand)

// Edit or Update Brand
router.get('/editbrand/:id', isAdmin, brandsController.getEditBrand)
router.put('/edit-brand/:id', isAdmin, brandsController.putEditBrand)
//delete brand
router.get('/deletebrand/:id', isAdmin, brandsController.deleteBrand);

//<-------------------------------------------------------------ORDER MANAGEMENT--------------------------------------------------------------->

//View Orders
router.get('/vieworders', orderController.viewOrders);

//edit order
router.get('/editorders/:id', orderController.getEditOrder);
router.put('/edit-order/:id', orderController.putEditOrder);



//<-------------------------------------------------------- USER Management-------------------------------------------------------------------->
// User Management

// view Users
router.get('/viewusers', isAdmin, adminController.viewUsers);
router.get('/blockunblock/:id', isAdmin, adminController.blockUnblockUser)


//<-------------------------------------------------------------COUPON MANAGEMENT--------------------------------------------------------------->

//View coupons
router.get('/viewcoupons', adminController.getCoupon);

// Add new Coupon
router.get('/addcoupons', adminController.getNewCoupon);
router.post('/add-coupon', isAdmin, adminController.postNewCoupon);

//edit coupons
router.get('/editcoupon/:id', adminController.getEditCoupon);
router.put('/edit-coupon/:id', adminController.putEditCoupon);

//delete coupon
router.get('/deletecoupon/:id', isAdmin, adminController.deleteCoupon);


//<-------------------------------------------------------------BANNER MANAGEMENT--------------------------------------------------------------->

//View Banner
router.get('/viewbanner', adminController.getBanner);

// Add new Banner
router.get('/addbanner', adminController.getNewBanner);
router.post('/add-banner', isAdmin, upload.array('image'), adminController.postNewBanner);

//edit Banner
router.get('/editbanner/:id', adminController.getEditBanner);
router.put('/edit-banner/:id', adminController.putEditBanner);

//delete Banner
router.get('/deletebanner/:id', isAdmin, adminController.deleteBanner);

//<--------------------------------------------------------------------------------------------------------------------------------------------->


//<--------------------------------------------------------------------------------------------------------------------------------------------->


router.get('/logout', adminController.logout);
// router.get('/chart', (req, res) => {
//     res.render('admin/chart')
// })


module.exports = router;