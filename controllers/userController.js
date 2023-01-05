require("dotenv").config();
const User = require("../models/user");
const Otp = require("../models/otp");
const jwt = require("jsonwebtoken");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const twilio = require("twilio");
const client = require("twilio")(accountSid, authToken);

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
    let mobileNumber = req.body.mobileNumber;
    mobileNumber = mobileNumber.toString();
    mobileNumber = mobileNumber.slice(2);
    mobileNumber = Number(mobileNumber);
    console.log(req.body.mobileNumber);
    console.log(req.body.otp);
    const verification_check = await client.verify.v2
      .services(process.env.TWILIO_AUTH_SERVICE_SID)
      .verificationChecks.create({
        to: `+91${req.body.mobileNumber}`,
        code: `${req.body.otp}`,
      });
    console.log(verification_check.status);

    if (verification_check.status == "approved") {
      await User.updateOne(
        { mobileNumber: req.body.mobileNumber },
        { $set: { isVerified: true } }
      );
      res.status(200).json({ msg: "otp verified successfully" });
    } else {
      return { status: false };
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
