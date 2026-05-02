"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const premiumEngine_1 = require("../services/premiumEngine");
const fraudEngine_1 = require("../services/fraudEngine");
const router = express_1.default.Router();
// ============================
// PREMIUM AI ADVICE
// ============================
router.post("/advice", async (req, res) => {
    try {
        const { income, expenses } = req.body;
        const result = (0, premiumEngine_1.generatePremiumAdvice)(Number(income), Number(expenses));
        res.json(result);
    }
    catch (error) {
        console.log("PREMIUM AI ERROR:", error);
        res.status(500).json({
            success: false,
            message: "AI advice failed"
        });
    }
});
// ============================
// FRAUD DETECTION
// ============================
router.post("/fraud-check", async (req, res) => {
    try {
        const { amount } = req.body;
        const result = (0, fraudEngine_1.detectFraud)(Number(amount));
        res.json(result);
    }
    catch (error) {
        console.log("FRAUD ENGINE ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Fraud check failed"
        });
    }
});
exports.default = router;
