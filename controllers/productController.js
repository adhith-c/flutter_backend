const express = require("express");

const router = express.Router();

const { urlencoded } = require("express");

// const session = require("express-session");
// const methodOverride = require("method-override");
const multer = require("multer");
const mongoose = require("mongoose");
const { storage, cloudinary } = require("../cloudinary/index");
const upload = multer({
  storage,
});
const Product = require("../models/product");

// router.use(methodOverride("_method"));

cloudinary.config({
  cloud_name: "dinwlxluq",
  api_key: "214423739351133",
  api_secret: "AOqguffGbX94C6LPl4QoztTNws8",
});

exports.viewProductAdmin = async (req, res) => {
  const products = await Product.find({});
  res.json({ products });
};
exports.postAddProducts = async (req, res) => {
  //res.redirect('/admin/viewproducts');  first check
  try {
    console.log("body of postaddproducts", req.body);
    const products = new Product(req.body);
    products.image = req.files.map((file) => ({
      url: file.path,
      filename: file.filename,
    }));

    await products.save();
    res.status(200).json("success");
  } catch (err) {
    console.log(err);
  }
};

// const viewProductUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const products = await Product.findById(id);
//     const relatedProducts = await Product.find({
//       category: products.category,
//     });
//     let userId = req.session.userId;
//     const categories = await Category.find({});
//     userId = mongoose.Types.ObjectId(userId);
//     let cartCount = await Cart.aggregate([
//       {
//         $match: {
//           userId,
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           count: {
//             $size: "$cartItems",
//           },
//         },
//       },
//     ]);
//     let wishlistCount = await Wishlist.aggregate([
//       {
//         $match: {
//           userId,
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           count: {
//             $size: "$Items",
//           },
//         },
//       },
//     ]);
//     res.render("user/product", {
//       products,
//       relatedProducts,
//       cartCount,
//       wishlistCount,
//       categories,
//     });
//   } catch (error) {
//     res.render("user/404");
//     console.log(error);
//   }
// };

// const addProducts = async (req, res) => {
//   const category = await Category.find({});
//   const brand = await Brand.find({});
//   res.render("admin/addProducts", {
//     category,
//     brand,
//   });
// };

// const getEditProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const product = await Product.findById(id);
//     res.render("admin/editProducts", {
//       product,
//     });
//   } catch (error) {
//     res.render("user/404");
//   }
// };

// const putEditProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const obj = JSON.parse(JSON.stringify(req.body));
//     const phots = req.files.map((f) => ({
//       url: f.path,
//       filename: f.filename,
//     }));
//     console.log(obj);
//     const product = await Product.findByIdAndUpdate(id, obj);
//     console.log(product);
//     product.image.push(...phots);
//     product.save();
//     req.flash("success", "product edited successfully");
//     res.redirect("/admin/viewproducts");
//   } catch (error) {
//     res.render("user/404");
//     console.log(error);
//   }
// };

// const deleteProducts = async (req, res) => {
//   try {
//     const { id } = req.params;
//     // const deleteproducts = await Product.findByIdAndDelete(id);  permanent delete
//     const deleteproducts = await Product.findByIdAndUpdate(id, {
//       isDeleted: true,
//     });
//     console.log(deleteproducts);
//     res.redirect("/admin/viewproducts");
//   } catch (error) {
//     res.render("user/404");
//   }
// };
