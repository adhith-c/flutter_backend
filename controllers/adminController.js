const express = require("express");
const router = express.Router();

const { urlencoded } = require("express");
const passport = require("passport");
const mongoose = require("mongoose");
const session = require("express-session");
const methodOverride = require("method-override");
const multer = require("multer");

const { storage, cloudinary } = require("../cloudinary/index");
const upload = multer({
  storage,
});
const Product = require("../model/product");
const User = require("../model/user");
const Brand = require("../model/brand");
const Coupon = require("../model/coupon");
const Order = require("../model/order");
const Banner = require("../model/banner");
const asyncErrorCatcher = require("../util/asynErrorCatch");

router.use(methodOverride("_method"));

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const getAdminLogin = (req, res) => {
  res.render("admin/signin");
};
const postAdminLogin = (req, res) => {
  // res.render('admin/index');
  res.redirect("/admin/dashboard");
};

const viewUsers = async (req, res) => {
  const users = await User.find({});
  res.render("admin/viewUsers", {
    users,
  });
};

const logout = (req, res) => {
  req.session.isAdmin = false;
  res.redirect("/admin/");
};

const getDashboard = async (req, res, next) => {
  let todaySale = 0,
    totalSale = 0,
    todayRevenue = 0,
    totalRevenue = 0;
  const todayOrders = await Order.find({
    $and: [
      {
        createdAt: {
          $lt: Date.now(),
          $gt: Date.now() - 86400000,
        },
      },
      {
        paymentStatus: {
          $ne: "notpaid",
        },
      },
    ],
  });
  todayOrders.forEach((order) => {
    todaySale += order.totalAmount;
  });

  const totalOrders = await Order.find({
    paymentStatus: {
      $eq: "paid",
    },
  });
  totalOrders.forEach((order) => {
    totalSale += order.totalAmount;
  });
  todayRevenue = (todaySale * 10) / 100;
  totalRevenue = (totalSale * 10) / 100;
  todayRevenue = parseFloat(todayRevenue).toFixed(2);
  totalRevenue = parseFloat(totalRevenue).toFixed(2);
  const graph = await Order.aggregate([
    {
      $group: {
        _id: {
          month: {
            $month: "$createdAt",
          },
          day: {
            $dayOfMonth: "$createdAt",
          },
          year: {
            $year: "$createdAt",
          },
        },
        totalPrice: {
          $sum: "$totalAmount",
        },
        count: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        totalPrice: 1,
        _id: 1,
      },
    },
    {
      $sort: {
        _id: -1,
      },
    },
    {
      $limit: 7,
    },
  ]);
  console.log(graph);
  let values = [];
  let revenue = [];
  let graphlabels = [];
  graph.forEach((g) => {
    graphlabels.push(g._id);
    values.push(g.totalPrice);
    revenue.push((g.totalPrice * 10) / 100);
  });
  graphlabels = JSON.stringify(graphlabels);
  console.log("graphlabels", graphlabels);
  const recentSales = await Order.find({
    paymentStatus: {
      $eq: "paid",
    },
  });
  const categorySale = await Order.aggregate([
    {
      $match: {
        orderStatus: {
          $nin: ["pending", "cancelled"],
        },
      },
    },
    {
      $unwind: "$orderItems",
    },
    {
      $project: {
        total: {
          $multiply: [
            "$orderItems.productPrice",
            "$orderItems.productQuantity",
          ],
        },
        productId: "$orderItems.productId",
        _id: 0,
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "products",
      },
    },
    {
      $unwind: "$products",
    },
    {
      $project: {
        total: "$total",
        categoryName: "$products.category",
      },
    },
    {
      $group: {
        _id: "$categoryName",
        count: {
          $sum: "$total", // $sum: "$orderItems.productQuantity"
        },
      },
    },
  ]);
  let label = [];
  let categoryValues = [];
  console.log("categorysale");
  console.log(categorySale);
  categorySale.forEach((g) => {
    categoryValues.push(g.count);
    label.push(g._id);
  });
  const paymentStats = await Order.aggregate([
    {
      $group: {
        _id: "$paymentType",
        count: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        _id: 0,
        count: 1,
      },
    },
  ]);
  let paymentGraph = [];
  paymentStats.forEach((payment) => {
    paymentGraph.push(payment.count);
  });
  res.render("admin/index", {
    todaySale,
    totalSale,
    todayRevenue,
    totalRevenue,
    values,
    revenue,
    recentSales,
    paymentGraph,
    categoryValues,
    label,
    graphlabels,
  });
};
const blockUnblockUser = async (req, res) => {
  try {
    let { id } = req.params;
    const blockuser = await User.findOne({
      _id: id,
    });
    id = mongoose.Types.ObjectId(id);
    let status = blockuser.status;
    if (status == "active") {
      await User.findByIdAndUpdate(id, {
        isBlocked: true,
        status: "blocked",
      });
      req.flash(
        "success",
        `Blocked the user ${blockuser.firstname} ${blockuser.lastname}`
      );
    } else {
      await User.findByIdAndUpdate(id, {
        isBlocked: false,
        status: "active",
      });
      req.flash(
        "success",
        `unBlocked the user ${blockuser.firstname} ${blockuser.lastname}`
      );
    }
    res.redirect("/admin/viewusers");
  } catch (error) {
    res.render("user/404");
  }
};

const getCoupon = async (req, res) => {
  const coupons = await Coupon.find({});
  res.render("admin/viewCoupon", {
    coupons,
  });
};

const getNewCoupon = (req, res) => {
  res.render("admin/addCoupon");
};

const postNewCoupon = async (req, res) => {
  const coupon = new Coupon(req.body);

  await coupon.save();
  console.log(coupon, "is the new brand");
  req.flash("success", "coupon saved successfully");
  res.redirect("/admin/viewcoupons");
};

const getEditCoupon = async (req, res) => {
  const { id } = req.params;
  const coupon = await Coupon.findById(id);
  res.render("admin/editCoupon", {
    coupon,
  });
};
const putEditCoupon = async (req, res) => {
  const { id } = req.params;
  const coupon = await Coupon.findByIdAndUpdate(id, {
    ...req.body,
  });
  console.log(coupon);
  await coupon.save();
  req.flash("success", "coupon edited successfully");
  res.redirect("/admin/viewcoupons");
};

const deleteCoupon = async (req, res) => {
  const { id } = req.params;
  const deletecoupon = await Coupon.findByIdAndDelete(id);
  console.log(deletecoupon);
  res.redirect("/admin/viewcoupons");
};

const getBanner = async (req, res) => {
  const banners = await Banner.find({});
  res.render("admin/viewBanner", {
    banners,
  });
};
const getNewBanner = async (req, res) => {
  const coupons = await Coupon.find({});
  res.render("admin/addBanner", {
    coupons,
  });
};

const postNewBanner = async (req, res) => {
  const obj = JSON.parse(JSON.stringify(req.body));
  const banner = new Banner(obj);
  banner.image = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  await banner.save();
  console.log(banner, "is the new banner");
  req.flash("success", "banner saved successfully");
  res.redirect("/admin/viewbanner");
};
const getEditBanner = async (req, res) => {
  const { id } = req.params;
  const banner = await Banner.findById(id);
  res.render("admin/editBanner", {
    banner,
  });
};
const putEditBanner = async (req, res) => {
  const { id } = req.params;
  const banner = await Banner.findByIdAndUpdate(id, {
    ...req.body,
  });
  console.log(banner);
  await banner.save();
  req.flash("success", "Banner edited successfully");
  res.redirect("/admin/viewBanner");
};
const deleteBanner = async (req, res) => {
  const { id } = req.params;
  const deletebanner = await Banner.findByIdAndDelete(id);
  console.log(deletebanner);
  //await brands.save();
  res.redirect("/admin/viewbanner");
};

module.exports = {
  getAdminLogin,
  postAdminLogin,
  viewUsers,
  logout,
  getDashboard,
  blockUnblockUser,
  getCoupon,
  getNewCoupon,
  postNewCoupon,
  getEditCoupon,
  putEditCoupon,
  deleteCoupon,
  getBanner,
  getNewBanner,
  postNewBanner,
  getEditBanner,
  putEditBanner,
  deleteBanner,
};
