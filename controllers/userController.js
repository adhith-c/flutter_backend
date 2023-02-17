require("dotenv").config();
const User = require("../models/user");
const Otp = require("../models/otp");
const jwt = require("jsonwebtoken");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const twilio = require("twilio");
const client = require("twilio")(accountSid, authToken);

const { hashPassword, comparePassword } = require("../utils/helper");

const { sendOtpVerification } = require("../utils/otpMailer");
const { response } = require("../routes/userRoutes");

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
      res.status(401);
    }
  } catch (err) {
    console.log(err);
  }
};

exports.otpVerify = async (req, res) => {
  try {
    let mobileNumber = req.body.mobileNumber;
    if (!mobileNumber && !req.body.otp) {
      res.status(400).json({ meg: "MOBILE_NUMBER IS NOT GIVEN" });
    } else {
      console.log("mobile num", mobileNumber);
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
        console.log("otp is approved");
        await User.updateOne(
          { mobileNumber: req.body.mobileNumber },
          { $set: { isVerified: true } }
        );
        res.status(200).json({ msg: "otp verified successfully" });
      } else {
        res.status(400).json({ msg: "otp verified failed" });
        // return { status: false };
      }
    }
  } catch (err) {
    console.log(err);
    res.status(406).json({ msg: "twlioo error contact backend dev" });
  }
};

exports.userLogin = async (req, res) => {
  try {
    console.log("monuuu");
    const { mobileNumber, password } = req.body;
    const user = await User.findOne({
      $or: [{ mobileNumber: mobileNumber }, { email: mobileNumber }],
    });

    console.log(user, "dnhfjd", mobileNumber);
    // let user;
    if (user) {
      const isValidPass = comparePassword(password, user.password);
      if (isValidPass) {
        req.session.userId = user._id;
        req.session.username = user.name;
        console.log(req.session.userId, req.session.username);
        res.status(200).json({ userId: user._id });
      } else {
        res.status(403).send("invalid password");
      }
    } else {
      res.status(401).send("invalid Phone Number");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
};

exports.addProfilePic = async (req, res) => {
  try {
    const { id, url } = req.body;
    const user = await User.findByIdAndUpdate(id, { url: url });
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send({ err });
  }
};

exports.editProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { ...req.body });
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send({ err });
  }
};

exports.getAddress = async (req, res) => {
  try {
    let addressId = req.body.addressid;
    let userId = req.params.userId;
    userId = mongoose.Types.ObjectId(userId);
    addressId = mongoose.Types.ObjectId(addressId);
    const address = await User.aggregate([
      {
        $match: {
          _id: userId,
        },
      },
      {
        $unwind: "$addressDetails",
      },
      {
        $match: {
          "addressDetails._id": addressId,
        },
      },
    ]);
    res.status(200).json({ address: address[0] });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err });
  }
};
exports.postNewAddress = async (req, res) => {
  try {
    let userId = req.params.userId;
    userId = mongoose.Types.ObjectId(userId);
    const user = await User.findById(userId);
    console.log(user);
    let obj = JSON.parse(JSON.stringify(req.body)); //console.log(req.body);
    console.log(obj);
    user.addressDetails.push(obj);
    await user.save();
    res.status(200).json({ user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err });
  }
};

exports.editAddress = async (req, res) => {
  try {
    let userId = req.params.userId;
    userId = mongoose.Types.ObjectId(userId);
    let id = req.params.id;
    id = mongoose.Types.ObjectId(id);
    // console.log(id);
    let obj = JSON.parse(JSON.stringify(req.body));
    await User.findOneAndUpdate(
      {
        $and: [
          {
            _id: userId,
          },
          {
            "addressDetails._id": id,
          },
        ],
      },
      {
        $set: {
          "addressDetails.$": obj,
        },
      }
    );
    res.status(200).json({ obj });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    let userId = req.params.userId;
    userId = mongoose.Types.ObjectId(userId);
    let addressId = req.body.addressid;
    addressId = mongoose.Types.ObjectId(addressId);
    console.log(addressId);
    await User.updateOne(
      {
        _id: userId,
      },
      {
        $pull: {
          addressDetails: {
            _id: addressId,
          },
        },
      }
    );
    res.status(200).json({ msg: "address deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err });
  }
};
