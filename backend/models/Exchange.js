const { Schema, model } = require("mongoose");

const exchangeSchema = new Schema({
  requester: { type: Schema.Types.ObjectId, ref: "User", required: true },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  requestedBook: { type: Schema.Types.ObjectId, ref: "Book", required: true },
  offeredBook: { type: Schema.Types.ObjectId, ref: "Book" }, // Optional if exchange is one-way
  status: { 
    type: String, 
    enum: ["Pending", "Accepted", "Rejected", "Cancelled", "Completed"],
    default: "Pending"
  },
  message:{ type:String},
}, { timestamps: true });

const Exchange = model("Exchange", exchangeSchema);

module.exports = Exchange;
