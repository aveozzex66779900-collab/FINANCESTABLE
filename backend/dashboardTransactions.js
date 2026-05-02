"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transaction_1 = __importDefault(require("./models/transaction"));
const router = express_1.default.Router();
/*
  SAFE ISOLATED DASHBOARD TRANSACTIONS
  DOES NOT MODIFY OLD SYSTEM
*/
router.get("/dashboard/transactions", async (req, res) => {
    try {
        const transactions = await transaction_1.default.find()
            .sort({ createdAt: -1 })
            .limit(50);
        res.json({
            success: true,
            transactions
        });
    }
    catch (err) {
        console.error("❌ DASHBOARD TRANSACTION ERROR:", err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});
exports.default = router;
