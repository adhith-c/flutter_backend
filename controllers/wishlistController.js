const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../model/user');
const Product = require('../model/product');
const Cart = require('../model/cart');
const Wishlist = require('../model/wishlist');
const Category = require('../model/category');

const Otp = require('../model/otp');
const {
    isLoggedIn,
    isActive
} = require('../middleware');
const asyncErrorCatcher = require('../util/asynErrorCatch');
const cart = require('../model/cart');
const product = require('../model/product');
const user = require('../model/user');

const getWishlist = async (req, res) => {
    if (req.session.userId) {
        let userId = req.session.userId;
        userId = mongoose.Types.ObjectId(userId);
        console.log('userId', userId);
        const categories = await Category.find({});

        const userfind = await User.findOne({
            _id: userId
        });
        console.log('userfind', userfind);
        const wishlist = await Wishlist.findOne({
            userId: userId
        }).populate({
            path: "userId",
            path: "Items",
            populate: {
                path: "productId"
            }
        });
        let wishlistCount = await Wishlist.aggregate([{
            $match: {
                userId
            }
        }, {
            $project: {
                count: {
                    $size: "$Items"
                }
            }
        }]);
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
        if (wishlist) {
            let items = wishlist.Items;
            res.render('user/wishlist', {
                items,
                wishlistCount,
                cartCount,
                categories
            });
        } else {
            res.render('user/wishlist', {
                items: '',
                wishlistCount,
                cartCount,
                categories
            });
        }
    } else {
        res.redirect('/login');
    }


}

const addToWishlist = async (req, res) => {
    if (req.session.username) {

        let productId = req.params.id;

        productId = new mongoose.Types.ObjectId(productId);
        let userId = req.session.userId;
        userId = mongoose.Types.ObjectId(userId);
        let userExist = await Wishlist.findOne({
            userId: userId
        });
        console.log('userexist', userExist);
        if (userExist) {

            let productExist = await Wishlist.findOne({
                $and: [{
                    userId
                }, {
                    Items: {
                        $elemMatch: {
                            productId
                        }
                    }
                }]
            });
            if (productExist) {
                req.flash("error", "product already exists in Your WishList")
                res.redirect('/wishlist');
            } else {
                await Wishlist.updateOne({
                    userId
                }, {
                    $push: {
                        Items: {
                            productId
                        }
                    }
                });
                res.redirect('/wishlist');
            }
        } else {
            try {
                let wishlist = new Wishlist({
                    userId,
                    Items: [{
                        productId
                    }]
                });
                await wishlist.save();
            } catch (err) {
                const msg = 'wishlist adding failed';
                res.send({
                    msg
                });
            }
        }
        let wishlistCount = await Wishlist.aggregate([{
            $match: {
                userId
            }
        }, {
            $project: {
                count: {
                    $size: "$Items"
                }
            }
        }]);
    } else {
        res.redirect('/login');
        //const msg = 'please login to continue';res.send({ msg });return;
    }
}


const deleteFromWishlist = async (req, res) => {
    console.log('req body: ', req.body);
    let productId = req.body.wishlistid;
    productId = mongoose.Types.ObjectId(productId);
    console.log('productid', productId);
    let userId = req.session.userId;
    userId = mongoose.Types.ObjectId(userId);
    console.log('userid', userId);
    await Wishlist.updateOne({
        userId: userId
    }, {
        $pull: {
            "Items": {
                "productId": productId
            }
        }
    });

}


module.exports = {
    getWishlist,
    addToWishlist,
    deleteFromWishlist
}