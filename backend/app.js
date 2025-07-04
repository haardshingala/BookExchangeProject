const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
require("./connection");
const userRoute = require("./routes/user");
const bookRoute = require("./routes/book");
const favouriteRoute = require("./routes/favourite");
const ExchangeRoute = require("./routes/exchange")
const app = express();
const cors = require("cors");



app.use(cors());


app.use(express.json());

app.use("/user",userRoute);

app.use("/book", bookRoute);
app.use("/user",favouriteRoute);
app.use("/user",ExchangeRoute);

app.use("/", (req, res,next)=>{
    res.send("welcome to book exchange platform");
    next();
    })

app.use((err, req, res, next) => {
  console.error(err);
  const isProd = process.env.NODE_ENV === "production";
  res.status(500).json(
    isProd
      ? { message: "Internal server error" }
      : { message: err.message, stack: err.stack, type: err.name }
  );
});

app.listen(process.env.PORT ,()=>{
console.log(`server started at port ${process.env.PORT}`)
});
// 2m3cvg4gnzmAZbg8

// 