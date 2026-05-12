"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = signup;
exports.login = login;
const auth_model_1 = __importDefault(require("./auth.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_utils_1 = require("./auth.utils");
async function signup(req, res) {
    try {
        const { name, email, password } = req.body;
        if (!name ||
            !email ||
            !password) {
            return res.status(400).json({
                success: false,
                message: "Missing fields"
            });
        }
        const existing = await auth_model_1.default.findOne({
            email
        });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }
        const hashed = await bcryptjs_1.default.hash(password, 10);
        const user = await auth_model_1.default.create({
            name,
            email,
            password: hashed,
            wallet: {
                balance: 0
            }
        });
        return res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    }
    catch (err) {
        console.error("❌ SIGNUP FULL ERROR:");
        console.error(err);
        return res.status(500).json({
            success: false,
            message: err?.message ||
                "Signup failed",
            stack: err?.stack,
            name: err?.name
        });
    }
}
async function login(req, res) {
    try {
        const { email, password } = req.body;
        const user = await auth_model_1.default.findOne({
            email
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        const valid = await (0, auth_utils_1.comparePassword)(password, user.password);
        if (!valid) {
            return res.status(401).json({
                success: false,
                message: "Wrong password"
            });
        }
        return res.json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || "Login failed"
        });
    }
}
