const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary.config");

// Konfigurasi penyimpanan Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "uploads",
        allowed_formats: ["jpg", "jpeg", "png"],
    },
});

// Middleware upload
const upload = multer({ storage });

module.exports = upload;
