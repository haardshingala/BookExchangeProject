const { Schema, model } = require("mongoose");

const bookSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    authors: [{
        type: String,
        required: true,
    }],
    description: {
        type: String,
        required: true,
    },
    genres: [{
        type: String,
        required: true,
    }],

    condition: {
        type: String,
        enum: ["New", "Like New", "Very Good", "Good", "Fair"],
        required: true,    
    },
    coverImageURL: {
        type: {
            url: { type: String, required: true },
            public_id: { type: String, required: true },
        },
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    available: {
        type: Boolean,
        required: true,
        default: true,
    },
    language: {
        type: String,
        enum: ["English", "Hindi", "Gujarati"],
        required: true,
    },


}, { timestamps: true });

const Book = model("Book", bookSchema);

module.exports = Book;