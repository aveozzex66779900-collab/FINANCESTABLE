


import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,

  email: {
    type: String,
    unique: true
  },

  password: String,

  wallet: {
    balance: { type: Number, default: 0 }
  },

  bank: {
    accountNumber: String,
    ifsc: String
  },

  // 🔥 ADD THIS
  role: {
    type: String,
    default: "user"
  }

}, { timestamps: true });

export default mongoose.model("User", userSchema);