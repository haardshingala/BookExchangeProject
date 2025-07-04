const express = require("express");
const User = require("../models/User");
const Book = require("../models/Book"); // Not used here, but may be needed elsewhere
const router = express.Router();
const { AuthenticateToken } = require("./userAuth");
const { body, validationResult } = require("express-validator");
const { upload, cloudinary } = require("../utils/cloudinary");


router.post("/signup", upload.single("profileImage"), [
  // Ensure fullName is provided and not empty
  body("fullName")
    .notEmpty()
    .withMessage("Full name is required."),

  // Ensure email is provided, not empty, and a valid email address
  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .bail()
    .isEmail()
    .withMessage("Please provide a valid email address."),

  // Ensure password is provided, not empty, and at least 8 characters long
  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long."),

  body("city")
    .notEmpty()
    .withMessage("city is required."),

  body("address")
    .notEmpty()
    .withMessage("address is required."),
],

  async (req, res) => {
    const errors = validationResult(req);
    console.log(req.body);
    console.log(req.file);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { fullName, email, password, city, address, bio, interests } = req.body;

      const emailExists = await User.findOne({ email: email });
      if (emailExists) {
        return res.status(400).json({ message: "email already exists" });
      }

      let parsedInterests;
      try {
        parsedInterests = interests ? JSON.parse(interests) : [];
      } catch (err) {
        parsedInterests = [];
      }

      let profileImagePayload;

      if (req.file) {
        // Multer‑Cloudinary already returned secure_url and public_id equivalents
        profileImagePayload = {
          url: req.file.path,          // secure Cloudinary URL
          public_id: req.file.filename // Cloudinary public_id
        };
      }

      const newUser = new User({
        fullName,
        email,
        password,
        profileImageURL: profileImagePayload,
        city,
        address,
        bio,
        interests: parsedInterests,
      });
      await newUser.save();
      res.status(201).json({ message: "Signup successful" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "internal server error" });
    }
  });




router.post("/signin", [
  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .bail()
    .isEmail()
    .withMessage("Please provide a valid email address."),


  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long."),

], async (req, res) => {

  const { email, password } = req.body;
  try {
    const { token, userId } = await User.matchPasswordAndGenerateToken(email, password);

    res.status(200).json({ token, userId });

  } catch (error) {

    if (error.message === "user not found" || error.message === "Invalid password") {
      return res.status(400).json({ message: error.message });
    }
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }

})


router.get("/profile", AuthenticateToken, async (req, res) => {


  try {
    const id = req.user._id;
    const user = await User.findById({ _id: id }).select("-password");

    if (user) {
      return res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
});


router.put("/update-profile", AuthenticateToken, upload.single("profileImage"), async (req, res) => {


  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.file) {
      // delete old avatar if it exists
      if (user.profileImageURL?.public_id) {
        try {
          await cloudinary.uploader.destroy(user.profileImageURL.public_id);
        } catch (err) {
          console.warn("Old avatar delete failed:", err.message);
        }
      }

      // set new avatar object
      user.profileImageURL = {
        url: req.file.path,          // Cloudinary secure_url
        public_id: req.file.filename // Cloudinary public_id
      };
    }

    const {
      fullName,
      city,
      address,
      bio,
      interests,         // expect JSON string from frontend
    } = req.body;

    if (fullName !== undefined) user.fullName = fullName;
    if (city !== undefined) user.city = city;
    if (address !== undefined) user.address = address;
    if (bio !== undefined) user.bio = bio;
    if (interests !== undefined) {
      try {
        user.interests = JSON.parse(interests);
      } catch {
        user.interests = [];
      }
    }

    const updatedUser = await user.save();
    res.status(200).json(
      updatedUser.toObject({
        versionKey: false, transform: (_, d) => {
          delete d.password;
          return d;
        }
      })
    );
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }

});

router.delete("/delete-profile", AuthenticateToken, async (req, res) => {


  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.profileImageURL?.public_id) {
      try {
        await cloudinary.uploader.destroy(user.profileImageURL.public_id);
      } catch (err) {
        console.warn("Avatar delete failed:", err.message);
      }
    }

    const books = await Book.find({ owner: user._id });
    for (const book of books) {
      if (book.coverImageURL?.public_id) {
        try {
          await cloudinary.uploader.destroy(book.coverImageURL.public_id);
        } catch (err) {
          console.warn(`Cover delete failed for ${book._id}:`, err.message);
        }
      }
    }
    await Book.deleteMany({ owner: user._id });


    await user.deleteOne();

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }

});

router.get("/MyListings", AuthenticateToken, async (req, res) => {

  try {
    const userId = req.user._id;
    const books = await Book.find({ owner: userId });

    if (books.length === 0) {
      return res.status(404).json({ message: "you have not listed any books" });
    }
    res.status(200).json(books);
  } catch (error) {
    console.error("Error fetching the listed books:", error);
    res.status(500).json({ message: "internal server error" });
  }

});


module.exports = router;