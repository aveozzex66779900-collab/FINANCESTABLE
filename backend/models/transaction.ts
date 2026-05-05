import mongoose from "mongoose";

const TransactionSchema =
  new mongoose.Schema({

    userId: {
      type: String
    },

    email: {
      type: String
    },

    amount: {
      type: Number,
      default: 0
    },

    type: {
      type: String,
      default: "payment"
    },

    status: {
      type: String,
      default: "success"
    },

    method: {
      type: String,
      default: "wallet"
    }

  }, {
    timestamps: true
  });

const Transaction =
  mongoose.models.Transaction ||

  mongoose.model(
    "Transaction",
    TransactionSchema
  );

export default Transaction;