
import mongoose from "mongoose";

const ledgerSchema = new mongoose.Schema(
  {


  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false 
  },


    email: {
      type: String,
      required: true,
      index: true
    },

    amount: {
      type: Number,
      required: true
    },

    // DEBIT = money spent
    // CREDIT = money added
    type: {
      type: String,
      enum: ["DEBIT", "CREDIT"],
      required: true
    },

    // Example: UPI, CRYPTO, CARD
    category: {
      type: String,
      default: "GENERAL"
    },

    // running balance after transaction
    balance: {
      type: Number,
      required: true
    },

    // link to transaction
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction"
    }
  },
  {
    timestamps: true
  }
);

export const Ledger = mongoose.model("Ledger", ledgerSchema);