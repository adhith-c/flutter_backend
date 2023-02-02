const express = require("express");

const router = express.Router();

const { urlencoded } = require("express");
const passport = require("passport");
const session = require("express-session");
const methodOverride = require("method-override");
const multer = require("multer");
const mongoose = require("mongoose");
const { storage, cloudinary } = require("../cloudinary/index");
const upload = multer({
  storage,
});
const Product = require("../models/product");
const User = require("../models/user");
const Brand = require("../models/brand");
const Category = require("../models/category");
const Order = require("../models/order");
const Cart = require("../models/cart");
const Wishlist = require("../models/wishlist");

// const asyncErrorCatcher = require("../util/asynErrorCatch");

router.use(methodOverride("_method"));

cloudinary.config({
  cloud_name: "dinwlxluq",
  api_key: "214423739351133",
  api_secret: "AOqguffGbX94C6LPl4QoztTNws8",
});
const viewProducts = async (req, res) => {
  try {
    const products = await Product.find({ isDeleted: false });
    if (products) {
      res.status(200).json({ products });
    } else {
      res.status(500).json({ msg: "not found" });
    }
  } catch (error) {
    console.log(error);
  }
};
const viewProductUser = async (req, res) => {
  try {
    const { id } = req.params;
    const products = await Product.findById(id);
    const relatedProducts = await Product.find({
      category: products.category,
    });
    if (products) {
      res.status(200).json({ products, relatedProducts });
    } else {
      res.status(500).json({ msg: "not found" });
    }
    // let userId = req.session.userId;
    // const categories = await Category.find({});
    // userId = mongoose.Types.ObjectId(userId);
    // let cartCount = await Cart.aggregate([
    //   {
    //     $match: {
    //       userId,
    //     },
    //   },
    //   {
    //     $project: {
    //       _id: 0,
    //       count: {
    //         $size: "$cartItems",
    //       },
    //     },
    //   },
    // ]);
    // let wishlistCount = await Wishlist.aggregate([
    //   {
    //     $match: {
    //       userId,
    //     },
    //   },
    //   {
    //     $project: {
    //       _id: 0,
    //       count: {
    //         $size: "$Items",
    //       },
    //     },
    //   },
    // ]);
    // res.render("user/product", {
    //   products,
    //   relatedProducts,
    //   cartCount,
    //   wishlistCount,
    //   categories,
    // });
  } catch (error) {
    // res.render("user/404");
    console.log(error);
  }
};

const viewProductAdmin = async (req, res) => {
  const products = await Product.find({});
  res.render("admin/viewProducts", {
    products,
  });
};
const addProducts = async (req, res) => {
  const category = await Category.find({});
  const brand = await Brand.find({});
  res.render("admin/addProducts", {
    category,
    brand,
  });
};

const postAddProducts = async (req, res) => {
  //res.redirect('/admin/viewproducts');  first check
  console.log("body of postaddproducts", req.body);
  const products = new Product(req.body);
  products.image = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));

  await products.save();
  console.log(products, "is the new product");
  req.flash("success", "product saved successfully");
  res.redirect("/admin/viewproducts");
};

const getEditProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render("admin/editProducts", {
      product,
    });
  } catch (error) {
    res.render("user/404");
  }
};

const putEditProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const obj = JSON.parse(JSON.stringify(req.body));
    const phots = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }));
    console.log(obj);
    const product = await Product.findByIdAndUpdate(id, obj);
    console.log(product);
    product.image.push(...phots);
    product.save();
    req.flash("success", "product edited successfully");
    res.redirect("/admin/viewproducts");
  } catch (error) {
    res.render("user/404");
    console.log(error);
  }
};

const deleteProducts = async (req, res) => {
  try {
    const { id } = req.params;
    // const deleteproducts = await Product.findByIdAndDelete(id);  permanent delete
    const deleteproducts = await Product.findByIdAndUpdate(id, {
      isDeleted: true,
    });
    console.log(deleteproducts);
    res.redirect("/admin/viewproducts");
  } catch (error) {
    res.render("user/404");
  }
};

module.exports = {
  viewProducts,
  viewProductUser,
  viewProductAdmin,
  addProducts,
  postAddProducts,
  getEditProduct,
  putEditProduct,
  deleteProducts,
};
