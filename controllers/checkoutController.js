const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const {
    isLoggedIn,
    isActive
} = require('../middleware');
const asyncErrorCatcher = require('../util/asynErrorCatch');
const Cart = require('../model/cart');
const Order = require('../model/order');
const User = require('../model/user');
const Product = require('../model/product');
const Category = require('../model/category');
const Wishlist = require('../model/wishlist');

const {
    request
} = require('express');
const order = require('../model/order');

const rzp = new Razorpay({
    key_id: process.env.key_id,
    key_secret: process.env.key_secret,
})
let discCart, subCart, grandCart;
const getValFromCart = async (req, res) => {
    console.log('getvalfromcart', req.body);
    let {
        discount,
        subTotal,
        grandTotal
    } = req.body;
    discCart = discount;
    subCart = subTotal;
    grandCart = grandTotal;
    res.send({
        msg: 'hi'
    })
}
const getCheckout = async (req, res) => {
    const user = await User.findOne({
        _id: req.session.userId
    });
    const categories = await Category.find({});
    let userId = req.session.userId;
    userId = mongoose.Types.ObjectId(userId);
    let cart = await Cart.findOne({
        userId
    }).populate({
        path: "userId",
        path: "cartItems",
        populate: {
            path: "productId"
        }
    });
    const items = cart.cartItems;
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
    res.render('user/checkout', {
        user,
        items,
        discCart,
        subCart,
        grandCart,
        categories,
        cartCount,
        wishlistCount
    });
}

const postCheckout = async (req, res) => {
    //console.log('req.user', req.user);
    console.log('req.body', req.body);
    const obj = JSON.parse(JSON.stringify(req.body));
    console.log('req.body', obj);
    let userId = req.session.userId;
    userId = mongoose.Types.ObjectId(userId);
    const cart = await Cart.findOne({
        userId: userId
    }).populate({
        path: "cartItems",
        populate: {
            path: "productId",
        }
    });
    let discountItems = [...cart.discount];

    let orderItems = [];
    cart.cartItems.forEach((items) => {
        eachItem = {
            productId: items.productId._id,
            productName: items.productId.productname,
            productQuantity: items.productQuantity,
            productPrice: items.productId.price
        };
        orderItems.push(eachItem);
    });
    const user = await User.findOne({
        _id: userId
    })
    let Address = req.body.Address;
    Address = mongoose.Types.ObjectId(Address);
    //const addressDetail = await User.findOne({_id:user._id,{addressDetails:1});
    let addressDetail = await User.aggregate([{
            $match: {
                _id: userId
            }
        }, {
            $unwind: "$addressDetails"
        }, {
            $match: {
                "addressDetails._id": Address
            }
        }

    ])
    addressDetail = addressDetail[0].addressDetails;
    console.log('address drtails', addressDetail);
    let neworder = new Order({
        userId: userId,
        firstName: req.body.firstname,
        lastName: req.body.lastname,
        email: req.body.email,
        addressDetails: {
            address: addressDetail.address,
            city: addressDetail.city,
            country: addressDetail.country,
            pincode: addressDetail.pinCode,
            mobileNumber: addressDetail.mobileNumber
        },
        orderItems: orderItems,
        totalAmount: req.body.totalAmount,
        paymentType: req.body.payment,
        orderNotes: req.body.orderNotes,
        discount: discountItems
    })
    await neworder.save();
    req.session.orderId = neworder._id;
    let insertId = neworder._id;
    req.session.save();
    console.log('req.session.orderid', req.session.orderId);
    res.redirect('/checkout/verifyorder');
    await Cart.updateOne({
        userId: userId
    }, {
        $pullAll: {
            discount: neworder.discount
        }
    })

}

const verifyOrder = async (req, res) => {
    let orderId = req.session.orderId;
    orderId = mongoose.Types.ObjectId(orderId);
    console.log('req.session.orderId', orderId)
    const order = await Order.findOne({
        _id: orderId
    });
    console.log('order id is', order);
    let orderItems = [];
    order.orderItems.forEach((items) => {
        eachItem = {
            productId: items.productId._id,
            productQuantity: items.productQuantity,
            productPrice: items.productId.price
        };
        console.log('each item:', eachItem);
        orderItems.push(eachItem);
        console.log('items:', items);
    });
    const categories = await Category.find({});
    let userId = req.session.userId;
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
    res.render('user/confirmOrder', {
        order: order,
        discCart: discCart,
        subCart: subCart,
        grandCart: grandCart,
        categories: categories,
        cartCount: cartCount,
        wishlistCount: wishlistCount
    });

}


const payment = async (req, res) => {
    let orderedId = req.session.orderId;
    let insertedId = orderedId;
    let userId = req.session.userId;
    orderedId = mongoose.Types.ObjectId(orderedId);
    userId = mongoose.Types.ObjectId(userId);
    const order = await Order.findOne({
        _id: orderedId
    });
    console.log("order in payment", order);
    // let insertId = order._id;
    console.log('insertId', insertedId);
    const {
        address,
        mobileNumber
    } = req.body;
    if (order.paymentType == 'COD') {
        await Order.updateOne({
            _id: orderedId
        }, {
            $set: {
                isComplete: true
            }
        });
        console.log("COD");
        await Cart.findOneAndDelete({
            userId: userId
        });
        res.send({
            msg: 'COD'
        });
    } else {
        const options = {
            amount: order.totalAmount * 100, // amount in the smallest currency unit   
            currency: "INR",
            receipt: "" + insertedId // "" + insertedId
        };
        const user = await User.findById(req.session.userId);
        const fullName = user.firstname + " " + user.lastname;
        const mobileNumber = user.addressDetails[0].mobileNumber;
        const userEmail = user.username;
        rzp.orders.create(options, function (err, order) {
            console.log('err', err)
            const orderId = order.id;
            const userDetails = {
                fullName,
                mobileNumber,
                userEmail,
            };
            res.send({
                options,
                userDetails,
                orderId
            });
        });
    }

}

const isApproved = async (req, res) => {
    let userId = req.session.userId;
    userId = mongoose.Types.ObjectId(userId);
    const {
        response,
        payDetails,
        userDetails,
        orderId
    } = req.body;
    let hmac = crypto.createHmac('sha256', process.env.key_secret);
    hmac = hmac.update(response.razorpay_order_id + "|" + response.razorpay_payment_id);
    hmac = hmac.digest('hex');
    //await cartModel.findByIdAndDelete(cartId);
    if (hmac == response.razorpay_signature) {
        const successOrderId = mongoose.Types.ObjectId(payDetails.receipt);
        await Order.findByIdAndUpdate(successOrderId, {
            orderStatus: 'approved',
            paymentStatus: 'paid',
            paymentId: orderId,
            isComplete: true
        });
        req.flash('orderId', successOrderId);
        res.send({
            paymentStatus: 'success'
        });
        await Cart.findOneAndDelete({
            userId: userId
        });
    } else {
        res.send({
            paymentStatus: 'fail'
        });
    }

}

const addNewAddress = async (req, res) => {
    const obj = JSON.parse(JSON.stringify(req.body));
    const {
        userId,
        address,
        city,
        country,
        pinCode,
        mobileNumber
    } = obj;
    const user = await User.findOne({
        _id: userId
    });
    console.log(obj);
    const eachitem = {
        address: address,
        city: city,
        country: country,
        pinCode: pinCode,
        mobileNumber: mobileNumber
    }
    user.addressDetails.push(eachitem);
    await user.save();
}

const orderSuccess = async (req, res) => {
    const orderId = mongoose.Types.ObjectId(req.session.orderId);
    const order = await Order.findById(orderId);
    console.log(order);
    const categories = await Category.find({});
    let userId = req.session.userId;
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
    if (order.paymentType == "COD") {
        res.render('user/orderSuccess', {
            payment: '',
            order,
            categories,
            cartCount,
            wishlistCount
        });

    } else {
        res.render('user/orderSuccess', {
            payment: true,
            order,
            categories,
            cartCount,
            wishlistCount
        });
    }
}

const orderFailed = async (req, res) => {
    const categories = await Category.find({});
    let userId = req.session.userId;
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
    res.render('user/orderFailed', {
        categories,
        cartCount,
        wishlistCount
    });
}

module.exports = {
    getCheckout,
    postCheckout,
    payment,
    isApproved,
    verifyOrder,
    addNewAddress,
    orderSuccess,
    orderFailed,
    getValFromCart

}