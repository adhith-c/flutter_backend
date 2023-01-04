const experss = require("express");

const router = experss();
// const {
//   addProperty,
//   likePost,
//   commentPost,
// } = require("../controllers/propertyController");

router.get("/maps", async (req, res) => {
  res.render("maps");
});
// router.post("/addProperty/:id", addProperty);
// router.post("/user/likePost/:id", likePost);
// router.post("/user/commentPost/:id", commentPost);

module.exports = router;
