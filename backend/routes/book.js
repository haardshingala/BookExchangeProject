const express = require("express");
const User = require("../models/User");
const Book = require("../models/Book");
const router = express.Router();
const { AuthenticateToken } = require("./userAuth");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
// const upload = require("../middleware/upload");
const { upload, cloudinary } = require("../utils/cloudinary");





router.post("/add-book", AuthenticateToken, upload.single("coverImage"), [
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
            parsedAuthors = JSON.parse(authors);   // always a JSON string
            parsedGenres = JSON.parse(genres);

        } catch (err) {
            return res.status(400).json({ message: "Invalid format for authors or genres" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Book cover image is required." });
        }

        const coverImageURL = {
            url: req.file.path,          // secure Cloudinary URL
            public_id: req.file.filename // Cloudinary public_id
        };

        const newBook = new Book({
            title, authors: parsedAuthors, description, genres: parsedGenres, condition, coverImageURL, owner, language
        });
        await newBook.save();
        res.status(201).json({ message: "Book added successfully" });
    } catch (error) {
        console.error("Error adding the  book:", error);

        res.status(500).json({ message: "internal server error" });
    }
});

router.put(
    "/update-book/:bookId",
    AuthenticateToken,
    upload.single("coverImage"),                // <-- accept optional new image
    async (req, res) => {
        try {
            const { bookId } = req.params;

            /* 1. Find book and auth check */
            const book = await Book.findById(bookId);
            if (!book) return res.status(404).json({ message: "Book not found" });
            if (String(book.owner) !== String(req.user._id)) {               // or uploadedBy
                return res.status(403).json({ message: "Unauthorized" });
            }

            /* 2. Build update object */
            const update = {};

            // Text fields (they come as strings from FormData)
            const {
                title,
                description,
                condition,
                language,
                authors,
                genres,
            } = req.body;

            if (title !== undefined) update.title = title;
            if (description !== undefined) update.description = description;
            if (condition !== undefined) update.condition = condition;
            if (language !== undefined) update.language = language;

            // Arrays arrive as JSON strings → parse safely
            if (authors !== undefined) {
                try { update.authors = JSON.parse(authors); } catch { update.authors = []; }
            }
            if (genres !== undefined) {
                try { update.genres = JSON.parse(genres); } catch { update.genres = []; }
            }

            /* 3. If a new cover image was uploaded, replace Cloudinary asset */
            if (req.file) {
                // Delete old cover
                if (book.coverImageURL?.public_id) {
                    try {
                        await cloudinary.uploader.destroy(book.coverImageURL.public_id);
                    } catch (err) {
                        console.warn("Old cover delete failed:", err.message);
                    }
                }
                // Assign new cover
                update.coverImageURL = {
                    url: req.file.path,          // secure_url
                    public_id: req.file.filename // public_id
                };
            }

            /* 4. Update in DB */
            const updatedBook = await Book.findByIdAndUpdate(
                bookId,
                update,
                { new: true, runValidators: true }
            );

            res.status(200).json(updatedBook);
        } catch (err) {
            console.error("Error updating book:", err);
            res.status(500).json({ message: "Internal server error" });
        }
    }
);


router.delete("/delete-book/:bookId", AuthenticateToken, async (req, res) => {
    try {
        const { bookId } = req.params;

        /* 1. Find the book */
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: "Book does not exist" });
        }

        /* 2. Auth check */
        if (String(book.owner) !== String(req.user._id)) {      // or uploadedBy
            return res.status(403).json({ message: "Unauthorized to delete this book" });
        }

        /* 3. Delete cover image from Cloudinary, if any */
        if (book.coverImageURL?.public_id) {
            try {
                await cloudinary.uploader.destroy(book.coverImageURL.public_id);
            } catch (err) {
                console.warn(`Cloudinary delete failed for ${bookId}:`, err.message);
            }
        }

        /* 4. Remove the book document */
        await book.deleteOne();      // or Book.findByIdAndDelete(bookId)

        /* 5. Respond */
        res.sendStatus(204);         // success, no body
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