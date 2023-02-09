const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");
const Product = require("../models/product");
const Cart = require("../models/cart");
const Wishlist = require("../models/wishlist");
const Category = require("../models/category");

const Otp = require("../models/otp");
const { isLoggedIn, isActive } = require("../middleware");
// const asyncErrorCatcher = require('../util/asynErrorCatch');
const cart = require("../models/cart");
const product = require("../models/product");
const user = require("../models/user");

const getWishlist = async (req, res) => {
  if (req.params.userId) {
    let userId = req.params.userId;
    userId = mongoose.Types.ObjectId(userId);
    console.log("userId", userId);
    const categories = await Category.find({});

    const userfind = await User.findOne({
      _id: userId,
    });
    console.log("userfind", userfind);
    const wishlist = await Wishlist.findOne({
      userId: userId,
    }).populate({
      path: "userId",
      path: "Items",
      populate: {
        path: "productId",
      },
    });
    let wishlistCount = await Wishlist.aggregate([
      {
        $match: {
          userId,
        },
      },
      {
        $project: {
          count: {
            $size: "$Items",
          },
        },
      },
    ]);
    let cartCount = await Cart.aggregate([
      {
        $match: {
          userId,
        },
      },
      {
        $project: {
          _id: 0,
          count: {
            $size: "$cartItems",
          },
        },
      },
    ]);
    if (wishlist) {
      let items = wishlist.Items;
      res.status(200).json({ wishlist });
    } else {
      res.status(404).json({ msg: "WishList Empty" });
    }
  } else {
    res.status(500).json({ msg: "invalid userId" });
  }
};

const addToWishlist = async (req, res) => {
  if (req.params.userId) {
    let productId = req.params.id;

    productId = new mongoose.Types.ObjectId(productId);
    let userId = req.params.userId;
    userId = mongoose.Types.ObjectId(userId);
    let userExist = await Wishlist.findOne({
      userId: userId,
    });
    console.log("userexist", userExist);
    if (userExist) {
      let productExist = await Wishlist.findOne({
        $and: [
          {
            userId,
          },
          {
            Items: {
              $elemMatch: {
                productId,
              },
            },
          },
        ],
      });
      if (productExist) {
        // req.flash("error", "product already exists in Your WishList");
        // res.redirect("/wishlist");
        // res.status(400).json({ msg: "Product already exists in Your WishList" })
        await Wishlist.updateOne(
          {
            userId: userId,
          },
          {
            $pull: {
              Items: {
                productId: productId,
              },
            },
          }
        );
        res.status(202).json({ msg: "Product Removed from wishlist" });
      } else {
        await Wishlist.updateOne(
          {
            userId,
          },
          {
            $push: {
              Items: {
                productId,
              },
            },
          }
        );
        res.status(200).json({ message: "product added successfully" });
      }
    } else {
      try {
        let wishlist = new Wishlist({
          userId,
          Items: [
            {
              productId,
            },
          ],
        });
        await wishlist.save();
        res
          .status(201)
          .json({ message: "wishlist created and saved successfully" });
      } catch (err) {
        const msg = "wishlist adding failed";
        res.status(500).json({
          msg: msg,
        });
      }
    }
    let wishlistCount = await Wishlist.aggregate([
      {
        $match: {
          userId,
        },
      },
      {
        $project: {
          count: {
            $size: "$Items",
          },
        },
      },
    ]);
  } else {
    res.status(401).json({ msg: "invalid user" });
    //const msg = 'please login to continue';res.send({ msg });return;
  }
};

const deleteFromWishlist = async (req, res) => {
  try {
    let userId = req.params.userId;
    let productId = req.params.id;
    productId = mongoose.Types.ObjectId(productId);
    userId = mongoose.Types.ObjectId(userId);
    let userExist = await Wishlist.findOne({
      userId: userId,
    });
    if (userExist) {
      let productExist = await Wishlist.findOne({
        $and: [
          {
            userId,
          },
          {
            Items: {
              $elemMatch: {
                productId,
              },
            },
          },
        ],
      });
      if (productExist) {
        await Wishlist.updateOne(
          {
            userId: userId,
          },
          {
            $pull: {
              Items: {
                productId: productId,
              },
            },
          }
        );
        res.status(200).json({ msg: "success" });
      } else {
        res.status(404).json({ msg: "product not found" });
      }
    } else {
      res.status(404).json({ msg: "invalid userId" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  deleteFromWishlist,
};
