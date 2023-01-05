const express = require("express");
const router = express();

const {
  homePage,

  register,
  otpVerify,
  userLogin,
  resendOtp,
  addProfilePic,
  editProfile,
} = require("../controllers/userController");

router.get("/", homePage);
// router.get("/register", register);
router.post("/register", register);
router.post("/otpVerify", otpVerify);
router.post("/resendOtp/:id", resendOtp);
router.post("/login", userLogin);
router.put("/addProfilePhoto", addProfilePic);
router.put("/editProfile/:id", editProfile);

module.exports = router;
