const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "ecommerce",
    allowedFormats: ["jpeg", "png", "jpg", "webp", "jfif"],
  },
});

module.exports = {
  cloudinary,
  storage,
};
