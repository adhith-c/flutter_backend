require("dotenv").config();
const Admin = require("../models/admin");
const User = require("../models/user");
const Banner = require("../models/banner");
const { hashPassword, comparePassword } = require("../utils/helper");

exports.getAdminLogin = async (req, res) => {
  try {
    const admin = await Admin.find({});
    if (admin.length == 0) {
      const hashedpassword = hashPassword(process.env.PASSWORD);
      const newAdmin = new Admin({
        name: process.env.NAME,
        email: process.env.EMAIL,
        password: hashedpassword,
      });
      await newAdmin.save();
      res.send(newAdmin);
    } else {
      res.send("login page of admin");
    }
  } catch (err) {
    console.log(err);
  }
};

exports.postAdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (admin) {
      const isValid = comparePassword(password, admin.password);
      if (isValid) {
        const token = jwt.sign(
          {
            id: admin._id,
            name: admin.name,
            type: "admin",
          },
          process.env.JWT_ADMIN_SECRET_KEY
        );
        res.send("login success");
      } else {
        res.send("incorrect password");
      }
    } else {
      res.send("invalid email");
    }
  } catch (err) {
    console.log(err);
  }
};

exports.userDetails = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    console.log(err);
  }
};

exports.banners = async (req, res) => {
  try {
    const banners = await Banner.find({});
    res.send(banners);
  } catch (err) {
    console.log(err);
  }
};

exports.addBanners = async (req, res) => {
  try {
    const { offer, description } = req.body;
    const newBanner = new Banner({
      offer,
      description,
    });
    await newBanner.save();
    res.send(newBanner);
  } catch (err) {
    console.log(err);
  }
};
