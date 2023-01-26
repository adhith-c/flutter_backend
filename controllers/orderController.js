const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {
    urlencoded
} = require('express');


const methodOverride = require('method-override');
const multer = require('multer');

const {
    storage,
    cloudinary
} = require('../cloudinary/index');
const upload = multer({
    storage
});
const Product = require('../model/product');
const User = require('../model/user');
const Brand = require('../model/brand');
const Category = require('../model/category');
const Order = require('../model/order');
const asyncErrorCatcher = require('../util/asynErrorCatch');
const {
    findByIdAndUpdate
} = require('../model/user');


router.use(methodOverride('_method'));

cloudinary.config({
    cloud_name: 'dinwlxluq',
    api_key: '214423739351133',
    api_secret: 'AOqguffGbX94C6LPl4QoztTNws8'
});
const viewOrders = async (req, res) => {
    const order = await Order.find({});
    console.log('order:', order);
    const userId = order.userId;
    console.log(' userId', order[0].email)
    const user = await User.findOne({
        _id: userId
    });
    console.log('userid:', user);
    req.flash('success', 'order viewpage')
    res.render('admin/viewOrder', {
        order
    });
}

const getEditOrder = async (req, res) => {
    const {
        id
    } = req.params;
    console.log(id);
    const order = await Order.findById(id);
    console.log(order);
    res.render('admin/editOrder', {
        item: order
    });
}

const putEditOrder = async (req, res) => {
    const {
        id
    } = req.params;
    const orders = await Order.findByIdAndUpdate(id, {
        ...req.body
    });
    console.log(orders);
    await orders.save();
    req.flash('success', 'order edited successfully');
    res.redirect('/admin/vieworders');
}

const getOrderItems = async (req, res) => {
    let orderId = req.body.id;
    orderId = mongoose.Types.ObjectId(orderId);

    const orderItems = await Order.find({
        _id: orderId
    }, {
        orderItems: 1,
        _id: 0
    }).populate({
        path: "orderItems",
        populate: {
            path: "productId",
        }
    })
    console.log(orderItems[0].orderItems)
    res.send({
        orderItems
    })
}
const getOrderSummary = async (req, res) => {
    console.log('hi')
    let orderId = req.body.id;
    orderId = mongoose.Types.ObjectId(orderId);
    const order = await Order.findOne({
        _id: orderId
    });
    console.log('order', order)
    res.send({
        order
    });
}
const cancelOrder = async (req, res) => {
    let orderId = req.body.orderId;
    orderId = mongoose.Types.ObjectId(orderId);
    await Order.findByIdAndUpdate(orderId, {
        orderStatus: "cancelled"
    })
    res.send({
        status: "cancelled"
    });
}

module.exports = {
    viewOrders,
    getEditOrder,
    putEditOrder,
    getOrderItems,
    getOrderSummary,
    cancelOrder
}