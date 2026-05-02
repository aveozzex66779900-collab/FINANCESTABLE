"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const transactionSchema = new mongoose_1.default.Schema({
    userId: String,
    email: String, // ✅ use ONLY this
    amount: Number,
    status: String,
    method: String,
    type: String,
    paymentId: String
}, { timestamps: true });
exports.default = mongoose_1.default.models.Transaction || mongoose_1.default.model("Transaction", transactionSchema);
