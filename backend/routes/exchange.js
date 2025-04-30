const express = require("express");
const User = require("../models/User");
const Book = require("../models/Book");
const Exchange = require("../models/Exchange");
const router = express.Router();
const { AuthenticateToken } = require("./userAuth");
const { sendMail } = require("../services/mail");

router.post("/exchange-request/:bookId", AuthenticateToken, async (req, res) => {

    try {
        const requester = req.user._id;
        const { bookId } = req.params;
        const requestedBook = bookId;
        const book = await Book.findById(requestedBook)        
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        const owner = book.owner

        if (owner.toString() === requester.toString()) {
            return res.status(400).json({ message: "you cannot request your book" });
        }
        const existingExchange = await Exchange.findOne({ requester, requestedBook, status: "Pending" });
        if (existingExchange) {
            return res.status(400).json({ message: "You have already requested this exchange" });
        }

        const newExchange = new Exchange({
            requester, requestedBook, owner
        });
        await newExchange.save();



        res.status(201).json({ message: "Exchange requested successfully" });
    } catch (error) {
        console.error("Error reuesting exchange:", error);
        res.status(500).json({ message: "internal server error" });
    }
});


router.post("/request/:bookId", AuthenticateToken, async (req, res) => {
    try {
        const requester = req.user._id;
        const requesterObj = await User.findById(requester).select('fullName')

        const { bookId } = req.params;
        const { offeredBookId, message } = req.body;

        const requestedBook = await Book.findById(bookId).populate("owner", "fullName email");
        if (!requestedBook) {
            return res.status(404).json({ message: "Requested book not found" });
        }

        const owner = requestedBook.owner;
        if (owner.toString() === requester.toString()) {
            return res.status(400).json({ message: "You can't request your own book" });
        }

        // Prevent duplicate requests
        const existingRequest = await Exchange.findOne({
            requester,
            requestedBook: bookId,
            status: "Pending",
        });

        if (existingRequest) {
            return res.status(409).json({ message: "Request already exists" });
        }

        const newRequest = new Exchange({
            requester,
            owner,
            requestedBook: bookId,
            offeredBook: offeredBookId || undefined,
            message,
        });

        await newRequest.save();

        await sendMail({
            to: owner.email,
            subject: 'Book Exchange Request recieved',
            content: `<body><h1>Book Exchange Request from ${requesterObj.fullName} for the book ${requestedBook.title}</h1>
            <p>${message}</p>
            </body>
        `
        })

        res.status(201).json({ message: "Exchange request sent", exchange: newRequest });
    } catch (error) {
        console.error("Exchange request error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
router.get("/recieved-requests", AuthenticateToken, async (req, res) => {

    try {
        const owner = req.user._id;

        const recievedRequests = await Exchange.find({ owner: owner }).populate("requester", "fullName email").populate("requestedBook", "title authors coverImageURL");


        res.status(200).json(recievedRequests);
    } catch (error) {
        console.error("Error fetching received requests:", error);
        res.status(500).json({ message: "internal server error" });
    }
});

router.get("/sent-requests", AuthenticateToken, async (req, res) => {

    try {
        const requester = req.user._id;

        const sentRequests = await Exchange.find({ requester: requester }).populate("owner", "fullName email").populate("requestedBook", "title authors coverImageURL");


        res.status(200).json(sentRequests);
    } catch (error) {
        console.error("Error fetching sent requests:", error);
        res.status(500).json({ message: "internal server error" });
    }
});

router.put("/accept/:exchangeId", AuthenticateToken, async (req, res) => {

    try {
        const owner = req.user._id;
        const { exchangeId } = req.params;

        const exchangeRequest = await Exchange.findById(exchangeId);


        if (!exchangeRequest) {
            return res.status(404).json({ message: "Exchange request not found" });
        }
        if (owner.toString() !== exchangeRequest.owner.toString()) {
            return res.status(403).json({ message: "Unauthorized: You can only accept requests for your books" });
        }

        await Exchange.findByIdAndUpdate(exchangeId, { status: "Accepted" });


        res.status(200).json({ message: "Exchange request accepted" });
    } catch (error) {
        console.error("Error accepting request:", error);
        res.status(500).json({ message: "internal server error" });
    }
});

router.put("/reject/:ExchangeId", AuthenticateToken, async (req, res) => {

    try {
        const owner = req.user._id;
        const { ExchangeId } = req.params;

        const exchangeRequest = await Exchange.findById(ExchangeId);


        if (!exchangeRequest) {
            return res.status(404).json({ message: "Exchange request not found" });
        }
        if (owner.toString() !== exchangeRequest.owner.toString()) {
            return res.status(403).json({ message: "Unauthorized: You can only reject requests for your books" });
        }

        await Exchange.findByIdAndUpdate(ExchangeId, { status: "Rejected" });


        res.status(200).json({ message: "Exchange request rejected " });
    } catch (error) {
        console.error("Error accepting request:", error);
        res.status(500).json({ message: "internal server error" });
    }
});

router.delete("/cancel/:ExchangeId", AuthenticateToken, async (req, res) => {

    try {
        const requester = req.user._id;
        const { ExchangeId } = req.params;

        const exchangeRequest = await Exchange.findById(ExchangeId);


        if (!exchangeRequest) {
            return res.status(404).json({ message: "Exchange request not found" });
        }
        if (requester.toString() !== exchangeRequest.requester.toString()) {
            return res.status(403).json({ message: "Unauthorized: You can only cancel requests  your exchange requests" });
        }

        await Exchange.findByIdAndDelete(ExchangeId);


        res.status(200).json({ message: "Exchange request cancelled" });
    } catch (error) {
        console.error("Error cancelling request:", error);
        res.status(500).json({ message: "internal server error" });
    }
});


module.exports = router;