require("dotenv").config();
const Admin = require("../models/admin");
const User = require("../models/user");
const Banner = require("../models/banner");
const { hashPassword, comparePassword } = require("../utils/helper");

// exports.getAdminLogin = async (req, res) => {
//   try {
//     const admin = await Admin.find({});
//     if (admin.length == 0) {
//       const hashedpassword = hashPassword(process.env.PASSWORD);
//       const newAdmin = new Admin({
//         name: process.env.NAME,
//         email: process.env.EMAIL,
//         password: hashedpassword,
//       });
//       await newAdmin.save();
//       res.send(newAdmin);
//     } else {
//       res.send("login page of admin");
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };

exports.postAdminLogin = async (req, res) => {
  try {
    const { mobileNumber, password } = req.body;
    const admin = await Admin.findOne({ mobileNumber });
    if (admin) {
      console.log("admineee");
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
        res.status(200).json("login success");
      } else {
        res.status(409).json("incorrect password");
      }
    } else {
      const hashedpassword = hashPassword(process.env.ADMIN_PASSWORD);
      const newAdmin = new Admin({
        name: process.env.ADMIN_NAME,
        email: process.env.ADMIN_EMAIL,
        mobileNumber: process.env.ADMIN_MOBILENUMBER,
        password: hashedpassword,
      });
      await newAdmin.save();
      const admin = await Admin.findOne({ mobileNumber });
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
          res.status(200).json("login success");
        } else {
          res.status(409).json("incorrect password");
        }
      } else {
        res.status(403).json("error occured");
      }
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
