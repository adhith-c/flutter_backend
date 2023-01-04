const bcrypt = require("bcrypt");

function hashPassword(password) {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(password, salt);
}
function comparePassword(raw, hash) {
  return bcrypt.compareSync(raw, hash);
}

function hashOtp(OTP) {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(OTP, salt);
}
function compareOtp(raw, hash) {
  return bcrypt.compareSync(raw, hash);
}

module.exports = {
  hashPassword,
  comparePassword,
  hashOtp,
  compareOtp,
};
