const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Cart = require("../models/cart");
const Coupon = require("../models/coupon");
const User = require("../models/user");
const Wishlist = require("../models/wishlist");
const Category = require("../models/category");

let total = 0;
let totalAmount;
const getCart = async (req, res) => {
  try {
    let userId = req.params.userId;
    const categories = await Category.find({});
    const userfind = await User.find({
      _id: userId,
    });
    // let id = req.params.userId;
    id = mongoose.Types.ObjectId(userId);
    let cart = await Cart.findOne({
      userId: id,
    }).populate({
      path: "userId",
      path: "cartItems",
      populate: {
        path: "productId",
      },
    });
    if (cart) {
      let items = cart.cartItems;
      for (let item of items) {
        total += item.productQuantity * item.productId.price;
      }
      console.log(total);
      totalAmount = total;
      console.log("cart", cart);
      console.log("cart items", items);
      res.status(200).json({ cart });
    } else {
      res.status(400).json({ msg: "cart empty" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err });
  }
};

const addToCart = async (req, res) => {
  try {
    let userId = req.params.userId;

    //let productId = req.params.id;
    let productId = req.body.productId;
    console.log("productId", productId);
    console.log("reqqq boddyyy", req.body);
    productId = new mongoose.Types.ObjectId(productId);
    let userExist = await Cart.findOne({
      userId,
    });
    if (userExist) {
      let productExist = await Cart.findOne({
        $and: [
          {
            userId,
          },
          {
            cartItems: {
              $elemMatch: {
                productId,
              },
            },
          },
        ],
      });
      if (productExist) {
        //await cartModel.aggregate([{$match:{$and:[{userId},{"cartItems.productId":productId}]}},{$inc:{"cartItems.$.productQuantity":1}}]);
        await Cart.findOneAndUpdate(
          {
            $and: [
              {
                userId,
              },
              {
                "cartItems.productId": productId,
              },
            ],
          },
          {
            $inc: {
              "cartItems.$.productQuantity": 1,
            },
          }
        );
        res.status(200).json({ msg: "product count incremented" });
      } else {
        await Cart.updateOne(
          {
            userId,
          },
          {
            $push: {
              cartItems: {
                productId,
                productQuantity: 1,
              },
            },
          }
        );
        res.status(200).json({ msg: "product added to cart successfully" });
      }
    } else {
      try {
        let cart = new Cart({
          userId,
          cartItems: [
            {
              productId,
              productQuantity: 1,
            },
          ],
        });
        await cart.save();
        res.status(200).json({ msg: "cart added successfully" });
      } catch (err) {
        const msg = "cart adding failed";
        res.status(500).json({ msg });
      }
    }
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

const addToExistingCart = async (req, res) => {
  try {
    let userId = req.params.userId;
    let productId = req.body.prodid;
    productId = new mongoose.Types.ObjectId(productId);
    let userExist = await Cart.findOne({
      userId,
    });
    if (userExist) {
      let productExist = await Cart.findOne({
        $and: [
          {
            userId,
          },
          {
            cartItems: {
              $elemMatch: {
                productId,
              },
            },
          },
        ],
      });
      if (productExist) {
        await Cart.findOneAndUpdate(
          {
            $and: [
              {
                userId,
              },
              {
                "cartItems.productId": productId,
              },
            ],
          },
          {
            $inc: {
              "cartItems.$.productQuantity": 1,
            },
          }
        );
        res.status(200).json({ msg: "updated sucess" });
      } else {
        await Cart.updateOne(
          {
            userId,
          },
          {
            $push: {
              cartItems: {
                productId,
                productQuantity: 1,
              },
            },
          }
        );
        res.status(201).json({ msg: "added product to cart" });
        //res.redirect('/user/cart');
      }
    } else {
      let cart = new Cart({
        userId,
        cartItems: [
          {
            productId,
            productQuantity: 1,
          },
        ],
      });
      try {
        await cart.save();
        res.status(203).json({ msg: "cart created for user" });
      } catch (err) {
        const msg = "cart adding failed";
        res.status(403).json({ msg });
      }
    }
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

const decrementFromCart = async (req, res) => {
  try {
    let userId = req.params.userId;
    let productId = req.body.prodid;
    console.log("decrement prodid is", productId);
    productId = mongoose.Types.ObjectId(productId);
    console.log("decrement prodid is", productId);

    userId = mongoose.Types.ObjectId(userId);
    console.log("decrement userid is", userId);
    await Cart.findOneAndUpdate(
      {
        $and: [
          {
            userId,
          },
          {
            cartItems: {
              $elemMatch: {
                productId,
              },
            },
          },
          {
            "cartItems.productId": productId,
          },
        ],
      },
      {
        $inc: {
          "cartItems.$.productQuantity": -1,
        },
      }
    );
    res.status(200).json({ msg: "decrement product quantity" });
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

const deleteFromCart = async (req, res) => {
  try {
    const productId = req.body.prodid;
    console.log("productid", productId);
    const userId = req.params.userId;
    console.log("userid", userId);
    await Cart.updateOne(
      {
        userId,
      },
      {
        $pull: {
          cartItems: {
            productId: productId,
          },
        },
      }
    );

    res.status(200).json({
      msg: "deleted item from cart",
    });
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

const checkCoupon = async (req, res) => {
  let userId = req.session.userId;
  userId = mongoose.Types.ObjectId(userId);
  let obj = JSON.parse(JSON.stringify(req.body));
  console.log(obj);
  let { couponName, subTotal, grandTotal } = obj;
  const coupon = await Coupon.findOne({
    couponName,
  });
  if (coupon) {
    let discount = coupon.discount;
    let reduce = (subTotal * discount) / 100;
    console.log("reduce", reduce);
    if (reduce > coupon.maxLimit) {
      grandTotal -= coupon.maxLimit;
      reduce = coupon.maxLimit;
    } else {
      grandTotal -= reduce;
    }
    const cart = await Cart.findOne({
      userId: userId,
    });
    cart.discount.push({
      code: coupon.couponName,
      amount: reduce,
    });
    await cart.save();
    res.send({
      reduce,
      grandTotal,
    });
  } else {
    res.send({
      reduce: 0,
      grandTotal: parseInt(subTotal),
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  addToExistingCart,
  decrementFromCart,
  deleteFromCart,
  checkCoupon,
};
