"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../models/User"));
const router = express_1.default.Router();
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("LOGIN INPUT:", email, password);
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.json({ success: false });
        }
        if (user.password !== password) {
            return res.json({ success: false });
        }
        return res.json({
            success: true,
            role: {
                type: String,
                default: "user"
            }
        });
    }
    catch (err) {
        console.log("LOGIN ERROR:", err);
        res.json({ success: false });
    }
});
exports.default = router;
