const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/CloudinaryUtil");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "cars",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

module.exports = upload;