const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create folders dynamically if they don't exist
const ensureFolderExists = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "uploads/others"; // Default folder

    // You can customize based on route path, fieldname, etc.
    if (req.originalUrl.includes("add-book")) {
      folder = "uploads/bookCovers";
    } else if (req.originalUrl.includes("profile")) {
      folder = "uploads/profilePics";
    }

    ensureFolderExists(folder); // Make sure folder exists
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // e.g., 123456.jpg
  },
});

// File filter (only allow images)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
