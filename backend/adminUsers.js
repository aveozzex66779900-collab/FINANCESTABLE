"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("./models/User"));
const router = express_1.default.Router();
/* GET ALL USERS */
router.get("/users", async (req, res) => {
    try {
        const users = await User_1.default.find().select("email role upi createdAt");
        res.json({
            success: true,
            users
        });
    }
    catch (error) {
        console.log("ADMIN USERS ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
exports.default = router;
