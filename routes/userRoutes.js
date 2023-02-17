const express = require("express");
const router = express();

const {
  homePage,

  register,
  otpVerify,
  userLogin,
  // resendOtp,
  addProfilePic,
  editProfile,
  postNewAddress,
  editAddress,
  deleteAddress,
  getAddress,
} = require("../controllers/userController");

router.get("/", homePage);
// router.get("/register", register);
router.post("/register", register);
router.post("/otpVerify", otpVerify);
// router.post("/resendOtp/:id", resendOtp);
router.post("/login", userLogin);
router.put("/addProfilePhoto", addProfilePic);
router.put("/editProfile/:id", editProfile);

router.post("/addnewaddress'/:userId", postNewAddress);
router.post("/editaddress/:userId/:id", editAddress);
router.post("/deleteaddress/:userId", deleteAddress);
router.post("/getaddress/:userId", getAddress);

module.exports = router;
