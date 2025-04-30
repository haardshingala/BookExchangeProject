const cloudinary = require("./utils/cloudinary");
const path = require("path");

// Replace with an actual image path from your system
const imagePath = path.join(__dirname, "test-image.png");

cloudinary.uploader.upload(imagePath, {
  folder: "book-covers", // Optional: organize uploads into a folder
})
  .then((result) => {
    console.log("✅ Upload successful!");
    console.log("Secure URL:", result.secure_url);
  })
  .catch((error) => {
    console.error("❌ Upload failed:", error);
  });
