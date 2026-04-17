import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  method: {
    type: String, // UPI / CRYPTO
    required: true
  },
  status: {
    type: String,
    default: "success"
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;