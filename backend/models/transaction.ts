import mongoose from "mongoose";


const transactionSchema = new mongoose.Schema({
  userId: String,
  email: String,        // ✅ use ONLY this
  amount: Number,
  status: String,
  method: String,
  type: String,
  paymentId: String
}, { timestamps: true });


export default mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);