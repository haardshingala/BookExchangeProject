const mongoose = require("mongoose");


const connectToMongoDB = async ()=>{
    try {
        await mongoose.connect(`${process.env.URI}`);
        console.log("database connected");
    } catch (error) {
        console.log(error);
    }
};

connectToMongoDB();