const { request } = require("http");

module.exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log(req.user);
    next();
  } else {
    //req.flash('error', 'Must be logged in');
    return res.redirect("user/login");
  }
};

module.exports.isActive = (req, res, next) => {
  if (req.user.status === "active") {
    console.log(req.user.status);
    next();
  } else {
    //req.flash("error", "You are currently blocked");
    return res.redirect("user/login");
  }
};

module.exports.ifAdminNAlive = (req, res, next) => {
  if (!req.session) {
    return res.redirect("admin/login");
  }
};

module.exports.isAuth = (req, res, next) => {
  if (req.session.userAuth) {
    next();
  } else {
    return res.redirect("user/login");
  }
};

module.exports.adminLogged = (req, res, next) => {
  const { email, password } = req.body;
  console.log("req body", req.body);
  if (
    email &&
    email === "admin@gmail.com" &&
    password &&
    password === "123456"
  ) {
    // req.session.admin = "gjhgjhkjhkgjhgjhjh";
    console.log("is adm", req.session);
    req.session.isAdmin = true;
    // console.log("is adm", req.session.isAdmin);
    // next();
    res.redirect("/admin/dashboard");
  } else {
    //req.flash("error", "incorrect username or password");
    console.log("else blk");
    res.redirect("/admin/");
  }
};

module.exports.isAdmin = (req, res, next) => {
  if (req.session.isAdmin) {
    next();
  } else {
    req.flash("error", "Not authorized");
    res.redirect("/admin/");
  }
};
