"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ledger = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ledgerSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Transaction"
    }
}, {
    timestamps: true
});
exports.Ledger = mongoose_1.default.model("Ledger", ledgerSchema);
