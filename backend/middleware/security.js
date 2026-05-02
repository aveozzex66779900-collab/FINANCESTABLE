"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSecurity = void 0;
const axios_1 = __importDefault(require("axios"));
const checkSecurity = async (req, res, next) => {
    try {
        const { amount, device, typingSpeed } = req.body;
        const response = await axios_1.default.post("http://localhost:8000/risk", {
            amount,
            newDevice: false,
            hour: new Date().getHours(),
            typingSpeed
        });
        const risk = response.data.riskScore;
        if (response.data.requireOTP) {
            return res.json({
                success: false,
                message: "🔐 OTP required",
                risk
            });
        }
        next();
    }
    catch (err) {
        console.log("Security error:", err);
        next(); // don't break existing system
    }
};
exports.checkSecurity = checkSecurity;
