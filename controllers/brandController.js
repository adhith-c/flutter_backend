 const express = require('express');
 const router = express.Router();
 const session = require('express-session');
 const methodOverride = require('method-override');
 const {
     default: mongoose
 } = require('mongoose');
 const multer = require('multer');

 const {
     storage,
     cloudinary
 } = require('../cloudinary/index');
 const upload = multer({
     storage
 });

 const Brand = require('../model/brand');
 const Category = require('../model/category');
 const Cart = require('../model/cart');
 const Wishlist = require('../model/wishlist');
 const Product = require('../model/product');
 const asyncErrorCatcher = require('../util/asynErrorCatch');

 router.use(methodOverride('_method'));

 cloudinary.config({
     cloud_name: 'dinwlxluq',
     api_key: '214423739351133',
     api_secret: 'AOqguffGbX94C6LPl4QoztTNws8'
 });


 const getBrand = async (req, res) => {

     const brands = await Brand.find({});
     res.render('admin/viewBrand', {
         brands
     });
 }

 const getNewBrand = (req, res) => {
     res.render('admin/addBrand');
 }

 const postNewBrand = async (req, res) => {
     const brands = new Brand(req.body);
     brands.image = req.files.map(file => ({
         url: file.path,
         filename: file.filename
     }));
     await brands.save();
     console.log(brands, 'is the new brand');
     req.flash('success', 'brand saved successfully');
     res.redirect('/admin/viewbrand');
 }

 const getEditBrand = async (req, res) => {
     const {
         id
     } = req.params;
     const brands = await Brand.findById(id);
     res.render('admin/editBrand', {
         brands
     });
 }
 const putEditBrand = async (req, res) => {
     const {
         id
     } = req.params;
     const brands = await Brand.findByIdAndUpdate(id, {
         ...req.body
     });
     console.log(brands);
     await brands.save();
     req.flash('success', 'category edited successfully');
     res.redirect('/admin/viewbrand');
 }

 const deleteBrand = async (req, res) => {
     const {
         id
     } = req.params;
     const deletebrand = await Brand.findByIdAndDelete(id);
     console.log(deletebrand);
     //await brands.save();
     res.redirect('/admin/viewbrand');
 }

 const getBrandProductPage = async (req, res) => {
     let brandId = req.params.id;
     brandId = mongoose.Types.ObjectId(brandId);
     const brand = await Brand.findById(brandId);
     const brands = await Brand.find({});
     const brandName = brand.brandName;

     const products = await Product.find({
         brand: brandName
     });
     let pageproduct = await Product.aggregate([{
         $match: {
             brand: brandName
         }
     }])
     pageproduct=JSON.stringify(pageproduct)
     console.log(pageproduct)
     let userId = req.session.userId;
     const categories = await Category.find({});
     userId = mongoose.Types.ObjectId(userId);
     let cartCount = await Cart.aggregate([{
         $match: {
             userId
         }
     }, {
         $project: {
             _id: 0,
             count: {
                 $size: "$cartItems"
             }
         }
     }]);
     let wishlistCount = await Wishlist.aggregate([{
         $match: {
             userId
         }
     }, {
         $project: {
             _id: 0,
             count: {
                 $size: "$Items"
             }
         }
     }]);
     res.render('user/brand', {
         brand,
         products,
         categories,
         cartCount,
         wishlistCount,
         brands,
         pageproduct
     })
 }

 module.exports = {
     getBrand,
     getNewBrand,
     postNewBrand,
     getEditBrand,
     putEditBrand,
     deleteBrand,
     getBrandProductPage
 }