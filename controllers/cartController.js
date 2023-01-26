const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const swal = require('sweetalert');
const nodemailer = require('nodemailer');

const {
    isLoggedIn,
    isActive
} = require('../middleware');
const asyncErrorCatcher = require('../util/asynErrorCatch');
const Cart = require('../model/cart');
const Coupon = require('../model/coupon');
const User = require('../model/user');
const Wishlist = require('../model/wishlist');
const Category = require('../model/category');

const {
    request
} = require('express');
const {
    cloudinary
} = require('../cloudinary');

let total = 0;
let totalAmount;
const getCart = async (req, res) => {
    if (req.session.userId) {
        const categories = await Category.find({});
        const userfind = await User.find({
            _id: req.session.userId
        });
        let id = req.session.userId;
        id = mongoose.Types.ObjectId(id);
        let cart = await Cart.findOne({
            userId: id
        }).populate({
            path: "userId",
            path: "cartItems",
            populate: {
                path: "productId"
            }
        });
        let cartCount = await Cart.aggregate([{
            $match: {
                userId: id
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
                userId: id
            }
        }, {
            $project: {
                count: {
                    $size: "$Items"
                }
            }
        }]);
        if (cart) {
            let items = cart.cartItems;
            for (let item of items) {
                total += item.productQuantity * item.productId.price;
            }
            console.log(total);
            totalAmount = total;
            console.log('cart', cart)

            console.log('cart items', items);
            //console.log('cart items prod name:', cart.cartItems.productId)
            console.log('cart details', cart);
            res.render('user/cart', {
                items,
                cartCount,
                wishlistCount,
                categories
            });
        } else {
            res.render('user/cart', {
                items: '',
                cartCount,
                wishlistCount,
                categories
            });
        }
    }

}


const addToCart = async (req, res) => {
    if (req.session.userId) {
        //let productId = req.params.id;
        let productId = req.body.productId;
        console.log('productId', productId);
        console.log('reqqq boddyyy', req.body);
        productId = new mongoose.Types.ObjectId(productId);
        let userId = req.session.userId;
        let userExist = await Cart.findOne({
            userId
        });
        if (userExist) {

            let productExist = await Cart.findOne({
                $and: [{
                    userId
                }, {
                    cartItems: {
                        $elemMatch: {
                            productId
                        }
                    }
                }]
            });
            if (productExist) {
                //await cartModel.aggregate([{$match:{$and:[{userId},{"cartItems.productId":productId}]}},{$inc:{"cartItems.$.productQuantity":1}}]);
                await Cart.findOneAndUpdate({
                    $and: [{
                        userId
                    }, {
                        "cartItems.productId": productId
                    }]
                }, {
                    $inc: {
                        "cartItems.$.productQuantity": 1
                    }
                });
            } else {
                await Cart.updateOne({
                    userId
                }, {
                    $push: {
                        cartItems: {
                            productId,
                            productQuantity: 1
                        }
                    }
                });

            }
            res.send({
                cart: true
            })
        } else {
            try {
                let cart = new Cart({
                    userId,
                    cartItems: [{
                        productId,
                        productQuantity: 1
                    }]
                });
                await cart.save();
                res.send({
                    cart: true
                })
            } catch (err) {
                const msg = 'cart adding failed';
            }
        }
        let cartCount = await Cart.aggregate([{
            $match: {
                userId
            }
        }, {
            $project: {
                count: {
                    $size: "$cartItems"
                }
            }
        }]);
    } else {
        console.log("hii brooo");
        res.send({
            cart: false
        })
        // const msg = 'please login to continue'; res.send({ msg});return;
    }

}

const addToExistingCart = async (req, res) => {
    if (req.session.userId) {
        let productId = req.body.prodid;
        productId = new mongoose.Types.ObjectId(productId);
        let userId = req.session.userId;
        let userExist = await Cart.findOne({
            userId
        });
        if (userExist) {
            let productExist = await Cart.findOne({
                $and: [{
                    userId
                }, {
                    cartItems: {
                        $elemMatch: {
                            productId
                        }
                    }
                }]
            });
            if (productExist) {
                await Cart.findOneAndUpdate({
                    $and: [{
                        userId
                    }, {
                        "cartItems.productId": productId
                    }]
                }, {
                    $inc: {
                        "cartItems.$.productQuantity": 1
                    }
                });
                res.redirect('/user/cart');
            } else {
                await Cart.updateOne({
                    userId
                }, {
                    $push: {
                        cartItems: {
                            productId,
                            productQuantity: 1
                        }
                    }
                });
                //res.redirect('/user/cart');
                res.send({
                    msg: 'hi'
                });
            }
        } else {
            let cart = new Cart({
                userId,
                cartItems: [{
                    productId,
                    productQuantity: 1
                }]
            });
            try {
                await cart.save();
            } catch (err) {
                const msg = 'cart adding failed';
                console.log('cart', cart)
                res.send({
                    msg
                });
            }
        }
        let cartCount = await Cart.aggregate([{
            $match: {
                userId
            }
        }, {
            $project: {
                count: {
                    $size: "$cartItems"
                }
            }
        }]);
        // res.send({ cartCount });
    } else {
        res.redirect('/login');
        // const msg = 'please login to continue'; res.send({ msg});return;
    }
}

const decrementFromCart = async (req, res) => {
    if (req.session.username) {
        let productId = req.body.prodid;
        console.log('decrement prodid is', productId);
        productId = mongoose.Types.ObjectId(productId);
        console.log('decrement prodid is', productId);

        let userId = req.session.userId;
        userId = mongoose.Types.ObjectId(userId);
        console.log('decrement userid is', userId);
        await Cart.findOneAndUpdate({
            $and: [{
                userId
            }, {
                "cartItems": {
                    $elemMatch: {
                        productId
                    }
                }
            }, {
                "cartItems.productId": productId
            }]
        }, {
            $inc: {
                "cartItems.$.productQuantity": -1
            }
        });
        let cartCount = await Cart.aggregate([{
            $match: {
                userId
            }
        }, {
            $project: {
                count: {
                    $size: "$cartItems"
                }
            }
        }]);
        res.send({
            cartCount
        });
    } else {
        res.redirect('/login');
        // const msg = 'please login to continue'; res.send({ msg});return;
    }
}


const deleteFromCart = async (req, res) => {
    const productId = req.body.prodid;
    console.log('productid', productId);
    const userId = req.session.userId;
    console.log('userid', userId);
    await Cart.updateOne({
        userId
    }, {
        $pull: {
            "cartItems": {
                "productId": productId
            }
        }
    });
    let cartCount = await Cart.aggregate([{
        $match: {
            userId
        }
    }, {
        $project: {
            count: {
                $size: "$cartItems"
            }
        }
    }]);
    res.send({
        cartCount
    });

}

const checkCoupon = async (req, res) => {
    let userId = req.session.userId;
    userId = mongoose.Types.ObjectId(userId);
    let obj = JSON.parse(JSON.stringify(req.body));
    console.log(obj)
    let {
        couponName,
        subTotal,
        grandTotal
    } = obj;
    const coupon = await Coupon.findOne({
        couponName
    })
    if (coupon) {
        let discount = coupon.discount;
        let reduce = subTotal * discount / 100;
        console.log('reduce', reduce);
        if (reduce > coupon.maxLimit) {
            grandTotal -= coupon.maxLimit;
            reduce = coupon.maxLimit;

        } else {
            grandTotal -= reduce;
        }
        const cart = await Cart.findOne({
            userId: userId
        });
        cart.discount.push({
            code: coupon.couponName,
            amount: reduce
        });
        await cart.save();
        res.send({
            reduce,
            grandTotal
        })
    } else {
        res.send({
            reduce: 0,
            grandTotal: parseInt(subTotal)
        })
    }

}

module.exports = {
    getCart,
    addToCart,
    addToExistingCart,
    decrementFromCart,
    deleteFromCart,
    checkCoupon


}