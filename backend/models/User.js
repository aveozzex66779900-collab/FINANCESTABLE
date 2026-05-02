"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
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
exports.default = mongoose_1.default.model("User", userSchema);
