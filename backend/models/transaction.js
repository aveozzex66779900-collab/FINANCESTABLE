"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const TransactionSchema = new mongoose_1.default.Schema({
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
const Transaction = mongoose_1.default.models.Transaction ||
    mongoose_1.default.model("Transaction", TransactionSchema);
exports.default = Transaction;
