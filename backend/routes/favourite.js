const express = require("express");
const User = require("../models/User");
const Book = require("../models/Book");
const router = express.Router();
const { AuthenticateToken } = require("./userAuth");

router.put("/add-favourite/:bookId", AuthenticateToken ,async (req, res)=>{
    try {
        const {bookId} = req.params;
        const id = req.user._id;
        
        const book = await Book.findById(bookId);
       
        if(!book){
            return res.status(404).json({message:"Book not found"});
        }
        const user = await User.findById(id);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }

        if (user.favouriteBooks.includes(bookId)) {
            return res.status(200).json({message:"Book is already in favourites"});
        }
        
        await User.findByIdAndUpdate(id,{$addToSet:{favouriteBooks:bookId}});
        return res.status(200).json({message:"Book added to favourites"});

    } catch (error) {
        console.error("Error adding a book to favourite ", error);
    res.status(500).json({message:"Internal server error"});
    }
})


router.delete("/remove-favourite/:bookId",AuthenticateToken, async (req,res)=>{
    try {
        const {bookId} = req.params;
        const id = req.user._id;

        const book = await Book.findById(bookId);
        if(!book){
            return res.status(404).json({message:"Book does not exist"});
        }
    
        const user = await User.findById(id);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }

        if(!user.favouriteBooks.includes(bookId)){
            return res.status(200).json({message:"Book is already removed from favorites"});
        }
        await User.findByIdAndUpdate(id,{$pull :{favouriteBooks:bookId}});
        res.status(200).json({message:"Book removed from favourites successfully"});

    } catch (error) {
        console.error("Error removing  book from favourite:", error);
    res.status(500).json({message:"Internal server error"});
    }
});


router.get("/get-all-favourite-books", AuthenticateToken,async (req,res)=>{
    try {
        const id = req.user._id;
        const books = await Book.find({
            owner:id,
        }).populate("owner", "fullName profileImageURL favouriteBooks").sort({ createdAt: -1 });
        const user = await User.findById(id).populate("favouriteBooks");
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        const favBooks = books.filter((book)=>{
            return book.owner.favouriteBooks.includes(book._id);
        })
       
        return res.status(200).json(favBooks);
    } catch (error) {
        console.error("Error fetching books from favourites:", error);
    res.status(500).json({message:"Internal server error"});
    }
});

module.exports = router;