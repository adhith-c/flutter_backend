const express = require('express');
const router = express.Router();
const {
    urlencoded
} = require('express');

const methodOverride = require('method-override');
const mongoose = require('mongoose');
const multer = require('multer');

const {
    storage,
    cloudinary
} = require('../cloudinary/index');
const upload = multer({
    storage
});

const Category = require('../model/category');
const Product = require('../model/product');
const asyncErrorCatcher = require('../util/asynErrorCatch');


router.use(methodOverride('_method'));

cloudinary.config({
    cloud_name: 'dinwlxluq',
    api_key: '214423739351133',
    api_secret: 'AOqguffGbX94C6LPl4QoztTNws8'
});

const getCategory = async (req, res) => {
    //res.render('admin/view-category');
    const category = await Category.find({});
    res.render('admin/viewCategory', {
        category
    });
}

const getAddCategory = (req, res) => {
    res.render('admin/addCategory');
}
const postAddCategory = async (req, res) => {
    const category = new Category(req.body);
    await category.save();
    console.log(category, 'is the new category');
    req.flash('success', 'new category added successfully');
    res.redirect('/admin/viewcategory');
    swal("Good job!", "You clicked the button!", "success");
}

const getEditCategory = async (req, res) => {
    const {
        id
    } = req.params;
    const category = await Category.findById(id);
    res.render('admin/editCategory', {
        category
    });
}

const putEditCategory = async (req, res) => {
    const {
        id
    } = req.params;
    const category = await Category.findByIdAndUpdate(id, {
        ...req.body
    });
    console.log(category);
    await category.save();
    req.flash('success', 'category edited successfully');
    res.redirect('/admin/viewcategory');
}

const deleteCategory = async (req, res) => {
    const {
        id
    } = req.params;
    const deletecategory = await Category.findByIdAndDelete(id);
    console.log(deletecategory);
    res.redirect('/admin/viewcategory');
}
getCategoryProducts = async (req, res) => {
    let catId = req.body.catId;
    catId = mongoose.Types.ObjectId(catId)
    const category = await Category.findOne({
        _id: catId
    });
    const products = await Product.find({
        category: category.categoryName
    })
    console.log(products)
    res.send({
        products: products
    })
}

const sortCategory = async (req, res) => {
    console.log(req.body)
    let catid = req.body.catid;
    let selectval = req.body.selectId;
    console.log(catid)
    // return
    try {
        catid = mongoose.Types.ObjectId(catid);
    } catch (error) {
        console.log('error');
        return
    }
    const category = await Category.findOne({
        _id: catid
    })

    console.log(category);
    const name = category.categoryName;
    // selectval = parseInt(selectval)
    let products = false;
    if (selectval == "0") {
        products = await Product.find({
            category: name
        }).sort({
            "productname": 1
        });
        console.log('hii if')
        res.send({
            sortedProducts: products
        });
    } else {
        products = await Product.find({
            category: name
        }).sort({
            "productname": -1
        });
        console.log(products[0].image[0])

        res.send({
            sortedProducts: products
        });
    }

}
const sortPrice = async (req, res) => {
    console.log(req.body)
    let catid = req.body.catid;
    let selectval = req.body.selectId;
    console.log(catid)

    try {
        catid = mongoose.Types.ObjectId(catid);
    } catch (error) {
        console.log('error');
        return
    }
    const category = await Category.findOne({
        _id: catid
    })

    console.log(category);
    const name = category.categoryName;
    // selectval = parseInt(selectval)
    let products = false;
    if (selectval == "0") {
        products = await Product.find({
            category: name
        }).sort({
            "price": 1
        });
        console.log('hii if')
        res.send({
            sortedProducts: products
        });
    } else {
        products = await Product.find({
            category: name
        }).sort({
            "price": -1
        });
        console.log(products)

        res.send({
            sortedProducts: products
        });
    }

}


module.exports = {
    getCategory,
    getAddCategory,
    postAddCategory,
    getEditCategory,
    putEditCategory,
    deleteCategory,
    getCategoryProducts,
    sortCategory,
    sortPrice
}