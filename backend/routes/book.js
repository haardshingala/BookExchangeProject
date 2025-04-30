const express = require("express");
const User = require("../models/User");
const Book = require("../models/Book");
const router = express.Router();
const { AuthenticateToken } = require("./userAuth");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const upload = require("../middleware/upload");




router.post("/add-book",  upload.single("coverImage"),AuthenticateToken, [
    body("title")
        .notEmpty()
        .withMessage("Book title is required."),
    body("authors")
        .notEmpty()
        .withMessage("Authors name is required."),
    body("description")
        .notEmpty()
        .withMessage("Book description is required."),
    body("genres")
        .notEmpty()
        .withMessage("Genres of the book is required."),
    body("condition")
        .notEmpty()
        .withMessage("condition of the book is required."),
   
    body("language")
        .notEmpty()
        .withMessage("Language of the book is required."),

], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {

        const owner = req.user._id;

        const { title, authors, description, genres, condition, language } = req.body;
        let parsedAuthors = [];
        let parsedGenres = [];
    
        try {
          parsedAuthors = typeof authors === "string" ? JSON.parse(authors) : authors;
          parsedGenres = typeof genres === "string" ? JSON.parse(genres) : genres;
        } catch (err) {
          return res.status(400).json({ message: "Invalid format for authors or genres" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Book cover image is required." });
          }
          

        const coverImageURL = req.file
        ? `/uploads/bookCovers/${req.file.filename}`
        : null;

        const newBook = new Book({
            title, authors:parsedAuthors, description, genres:parsedGenres, condition, coverImageURL, owner, language
        });
        await newBook.save();
        res.status(201).json({ message: "Book added successfully" });
    } catch (error) {
        console.error("Error adding the  book:", error);
        res.status(500).json({ message: "internal server error" });
    }
});


router.put("/update-book/:bookId", AuthenticateToken, async (req, res) => {


    try {
        const { bookId } = req.params;

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: "Book does not exist" });
        }

        if (String(book.owner) !== String(req.user._id)) {
            return res.status(403).json({ message: "Unauthorized to update this book" });
        }

        const updatedBookData = req.body;
        const updatedBook = await Book.findByIdAndUpdate(bookId, updatedBookData, {
            new: true,
            runValidators: true,
        })


        res.status(200).json(updatedBook);
    } catch (error) {
        console.error("Error updating book:", error);
        res.status(500).json({ message: "Internal server error" });
    }

});

router.delete("/delete-book/:bookId", AuthenticateToken, async (req, res) => {
    try {
        const { bookId } = req.params;
        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({ message: "Book does not exist" });
        }

        if (String(book.owner) !== String(req.user._id)) {
            return res.status(403).json({ message: "Unauthorized to delete this book" });
        }

        const response = await Book.findByIdAndDelete(bookId);

        if (!response) {
            return res.status(400).json({ message: "Failed to delete the book, try again" });
        }
        res.status(200).json({ message: "Book deleted successfully" });

    } catch (error) {
        console.error("Error deleting book:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});




      

router.get("/get-all-books", async (req, res) => {
    try {
      const { query, genre, recent } = req.query;  // req.query would be an object like { query: "Harry" }
  
      const filters = {};
  
      // Only search by title or authors using regex
      if (query) {
        const regex = new RegExp(query, 'i'); // case-insensitive 
        filters.$or = [
          { title: regex },
          { authors: regex }
        ];
      }
  
      // Apply genre filtering only if selected
      if (genre) {
        filters.genres = genre
      }
  
      // Build the MongoDB query
      let mongoDbQuery = Book.find(filters).populate("owner", "fullName profileImageURL favouriteBooks").sort({ createdAt: -1 });
  
      // Limit to recent 4 if specified
      if (recent === 'true') {
        mongoDbQuery = mongoDbQuery.limit(4);
      }
  
      const books = await mongoDbQuery;
  console.log(books);
      return res.status(200).json(books);
    } catch (error) {
      console.error("Error fetching books:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
router.get("/get-recent-books", async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 }).limit(4);

        if (books.length === 0) {
            return res.status(404).json({ message: "No books found" });
        }
        return res.status(200).json(books);
    } catch (error) {
        console.error("Error fetching book:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/get-book-by-id/:bookId", async (req, res) => {
    try {
        const { bookId } = req.params;

        const book = await Book.findById(bookId);


        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }


        return res.status(200).json(book);
    } catch (error) {
        console.error("Error fetching book:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;