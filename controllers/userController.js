require("dotenv").config();
const User = require("../models/user");
const Otp = require("../models/otp");
const jwt = require("jsonwebtoken");

const {
  hashPassword,
  comparePassword,
  hashOtp,
  compareOtp,
} = require("../utils/helper");

const { sendOtpVerification } = require("../utils/otpMailer");

exports.homePage = async (req, res) => {
  try {
    res.send("homepage");
  } catch (err) {
    console.log(err);
  }
};

// exports.register = async (req, res) => {
//   try {
//     res.send("SIGNUP");
//   } catch (err) {
//     console.log(err);
//   }
// };

exports.register = async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, mobileNumber, password } = req.body;
    const existingUser = await User.findOne({ mobileNumber });
    if (existingUser) {
      if (existingUser.isVerified == false) {
        await User.findOneAndDelete({ mobileNumber });
      }
    }
    const userName = await User.findOne({ mobileNumber });
    if (!userName) {
      const hashedpassword = hashPassword(password);
      const user = await User.create({
        name,
        email,
        mobileNumber,
        password: hashedpassword,
      });
      user.save().then((data) => {
        sendOtpVerification(data, req, res);
        res.status(200).json(user);
      });
    } else {
      res.send("Email already Taken");
    }
  } catch (err) {
    console.log(err);
  }
};

exports.otpVerify = async (req, res) => {
  try {
    const userId = req.params.id;
    const { otp } = req.body;
    const userOtp = await Otp.findOne({ userId });
    if (Date.now() < userOtp.expiresAt) {
      const isValidOtp = compareOtp(otp, userOtp.otp);
      if (isValidOtp) {
        await User.findOneAndUpdate({ _id: userId }, { isVerified: true });
        await Otp.findOneAndDelete({ userId });
        res.send("Otp verified successfully");
      } else {
        res.send("invalid OTP");
      }
    } else {
      await Otp.findOneAndDelete({ userId });
      await User.findByIdAndDelete({ _id: userId });
      res.send("Otp expired .Register again");
    }
  } catch (err) {
    console.log(err);
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById({ _id: userId });
    await Otp.findOneAndDelete({ userId });
    const email = user.email;
    sendOtpVerification({ _id: userId, email }, req, res);
  } catch (err) {
    console.log(err);
  }
};

exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userEmail = await User.findOne({ email });
    // let user;
    if (userEmail) {
      const isValidPass = comparePassword(password, userEmail.password);
      if (isValidPass) {
        const token = jwt.sign(
          {
            id: userEmail._id,
            name: userEmail.FirstName + userEmail.LastName,
            type: "user",
          },
          process.env.JWT_SECRET_KEY
        );
        res.send(`successfully logged in ...${token}`);
      } else {
        res.send("invalid password");
      }
    } else {
      res.send("invalid email");
    }
  } catch (err) {
    console.log(err);
  }
};

exports.addProfilePic = async (req, res) => {
  try {
    const { id, url } = req.body;
    const user = await User.findByIdAndUpdate(id, { url: url });
    res.send(user);
  } catch (err) {
    console.log(err);
  }
};

exports.editProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { ...req.body });
    res.send(user);
  } catch (err) {
    console.log(err);
  }
};
