"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const adminUsers_1 = __importDefault(require("./adminUsers"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const User_1 = __importDefault(require("./models/User"));
const transaction_1 = __importDefault(require("./models/transaction"));
const ai_support_1 = __importDefault(require("./routes/ai-support"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const logger_1 = require("./utils/logger");
const prom_client_1 = __importDefault(require("prom-client"));
const ledger_1 = require("./models/ledger");
const dashboardTransactions_1 = __importDefault(require("./dashboardTransactions"));
const ai_premium_1 = __importDefault(require("./routes/ai-premium"));
const auth_routes_1 = __importDefault(require("./auth/auth.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express_1.default.json());
// ===============================
// ADMIN USER MANAGEMENT ROUTES
// SAFE ISOLATED FEATURE
// ===============================
// temporary isolated storage
let adminUsers = [];
// GET USERS
app.get("/api/admin/users", (req, res) => {
    try {
        res.json(adminUsers);
    }
    catch (error) {
        console.error("LOAD USERS ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Failed to load users"
        });
    }
});
// ADD USER
app.post("/api/admin/add-user", (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Missing email or password"
            });
        }
        const newUser = {
            id: Date.now(),
            email,
            password,
            role: "user",
            createdAt: new Date().toISOString()
        };
        adminUsers.push(newUser);
        console.log("NEW USER ADDED:", newUser.email);
        res.json({
            success: true,
            user: newUser
        });
    }
    catch (error) {
        console.error("ADD USER ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});
// DELETE USER
app.post("/api/admin/delete-user", (req, res) => {
    try {
        const { id } = req.body;
        adminUsers =
            adminUsers.filter(user => user.id != id);
        res.json({
            success: true
        });
    }
    catch (error) {
        console.error("DELETE USER ERROR:", error);
        res.status(500).json({
            success: false
        });
    }
});
app.use("/admin", adminUsers_1.default);
app.use("/", dashboardTransactions_1.default);
app.use("/api/premium-ai", ai_premium_1.default);
app.use("/api/auth", auth_routes_1.default);
app.use("/api/ai-support", ai_support_1.default);
function normalizeWallet(user) {
    if (!user.wallet || typeof user.wallet === "number") {
        user.wallet = { balance: user.wallet || 0 };
    }
}
app.use(express_1.default.urlencoded({ extended: true }));
// ✅ ADD THIS ABOVE ROUTES
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "No token"
            });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        console.error("AUTH ERROR:", err);
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
};
app.get("/metrics-prometheus", async (req, res) => {
    res.set("Content-Type", prom_client_1.default.register.contentType);
    res.end(await prom_client_1.default.register.metrics());
});
let requestCount = 0;
app.use((req, res, next) => {
    requestCount++;
    next();
});
app.get("/metrics", (req, res) => {
    res.json({
        totalRequests: requestCount
    });
});
app.get("/health", async (req, res) => {
    res.json({
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date(),
        memory: process.memoryUsage()
    });
});
app.use((0, morgan_1.default)("combined", {
    stream: {
        write: (message) => logger_1.logger.info(message.trim())
    }
}));
// ===============================
// DASHBOARD TRANSACTIONS API
// SAFE VERSION
// DOES NOT BREAK OLD FEATURES
// ===============================
app.get("/api/dashboard/transactions", async (req, res) => {
    try {
        const transactions = await transaction_1.default.find()
            .sort({ createdAt: -1 })
            .limit(50);
        res.json({
            success: true,
            transactions: transactions || []
        });
    }
    catch (err) {
        console.error("DASHBOARD TRANSACTIONS ERROR:", err);
        res.status(500).json({
            success: false,
            transactions: [],
            message: "Failed to load transactions"
        });
    }
});
app.get("/api/user", async (req, res) => {
    try {
        res.json({
            success: true,
            user: {
                name: "admin",
                email: "admin@gmail.com",
                role: "admin"
            }
        });
    }
    catch (error) {
        console.error("USER API ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Failed to load user"
        });
    }
});
function detectFraud(userId, amount, history) {
    let riskScore = 0;
    if (amount > 10000)
        riskScore += 40;
    if (history.length > 5)
        riskScore += 30;
    const same = history.filter(tx => tx.amount === amount);
    if (same.length > 2)
        riskScore += 20;
    if (history.length === 0)
        riskScore += 10;
    return {
        fraud: riskScore > 50,
        riskScore
    };
}
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_KEY);
mongoose_1.default.connect(process.env.MONGO_URI)
    .then(() => {
    console.log("MongoDB Connected ✅");
    app.listen(5000, () => {
        console.log("🚀 Server running on localhost 5000");
    });
})
    .catch(err => console.log("DB Error ❌", err));
// 💾 Transaction Model (ADD HERE)
/* TEST */
app.get("/test", (req, res) => {
    res.json({ msg: "Backend working" });
});
app.post("/api/add-bank", async (req, res) => {
    try {
        const { email, upiId, accountNumber, ifsc, bankName } = req.body;
        await User_1.default.findOneAndUpdate({ email: email }, {
            bank: {
                upiId,
                accountNumber,
                ifsc,
                bankName
            }
        });
        res.json({ success: true });
    }
    catch (err) {
        console.error("BANK ERROR:", err);
        res.status(500).json({ success: false });
    }
});
/* PAYMENTS */
app.post("/pay-upi", async (req, res) => {
    try {
        const { email, amount } = req.body;
        if (!email || !amount) {
            return res.json({ success: false, message: "Missing data" });
        }
        // 🕒 Save as pending
        const tx = await transaction_1.default.create({
            email,
            amount,
            method: "UPI",
            type: "upi",
            status: "pending"
        });
        // ⚡ Simulate gateway webhook (DEV ONLY)
        setTimeout(async () => {
            await fetch(`${process.env.BASE_URL || "http://localhost:5000"}/api/webhook/payment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    amount,
                    type: "upi",
                    status: "success"
                })
            });
        }, 2000);
        res.json({
            success: true,
            message: "Payment initiated"
        });
    }
    catch (err) {
        res.status(500).json({ success: false });
    }
});
app.get("/admin/payments", (req, res) => {
    res.json([{ amount: 100, status: "success" }]);
});
// 🔐 NEW LOGIN ROUTE (API STYLE)
// ================= LOGIN =================
app.post("/crypto-address", async (req, res) => {
    const { type, amount } = req.body;
    // 🔥 Dummy wallet generator (replace later with real API)
    const wallet = {
        BTC: "bc1qexamplebitcoinaddress123",
        ETH: "0xexampleethereumaddress123",
        USDT: "Texampleusdtaddress123"
    };
    res.json({
        address: wallet[type] || "Unknown",
        amount
    });
});
/* DOWNLOAD TRANSACTIONS CSV */
app.get("/transactions/download", async (req, res) => {
    try {
        const transactions = await transaction_1.default.find();
        let csv = "User,Amount,Method,Status,Date\n";
        transactions.forEach((t) => {
            csv += `${t.userId},${t.amount},${t.method},${t.status},${t.createdAt}\n`;
        });
        const filePath = path_1.default.join(__dirname, "transactions.csv");
        fs_1.default.writeFileSync(filePath, csv);
        res.download(filePath, "transactions.csv");
    }
    catch (err) {
        console.log("❌ CSV ERROR:", err);
        res.status(500).json({ message: "Download failed" });
    }
});
console.log("✅ B2B ROUTE LOADED");
app.post("/api/b2b/pay", async (req, res) => {
    try {
        const { email, amount, currency, userId } = req.body;
        // ✅ validation
        if (!email || !amount) {
            return res.status(400).json({
                success: false,
                message: "Missing fields"
            });
        }
        // ✅ create transaction
        const tx = await transaction_1.default.create({
            userId: userId || "guest",
            email,
            amount,
            status: "success",
            method: "B2B",
            type: "enterprise",
            paymentId: "B2B-" + Date.now(),
            currency: currency || "INR"
        });
        console.log("✅ B2B PAYMENT:", tx);
        res.json({
            success: true,
            message: "B2B payment success",
            transaction: tx
        });
    }
    catch (error) {
        console.error("B2B PAYMENT ERROR:", error);
        res.status(500).json({
            success: false,
            message: "B2B payment failed",
            error: error.message
        });
    }
});
app.post("/crypto", authMiddleware, async (req, res) => {
    try {
        const { type, amount } = req.body;
        const tx = await transaction_1.default.create({
            amount,
            type,
            userId: req.user.id,
            method: "CRYPTO",
            status: "success"
        });
        res.json({
            success: true,
            message: "Crypto payment successful",
            data: tx
        });
    }
    catch {
        res.status(500).json({ success: false });
    }
});
app.post("/api/pay", async (req, res) => {
    try {
        const { email, amount } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }
        normalizeWallet(user);
        if (user.wallet.balance < amount) {
            return res.json({
                success: false,
                message: "Insufficient balance"
            });
        }
        // ✅ deduct
        user.wallet.balance -= Number(amount);
        await user.save();
        // ✅ save transaction
        await transaction_1.default.create({
            email,
            amount,
            method: "PAYMENT",
            status: "success"
        });
        res.json({ success: true });
    }
    catch (err) {
        console.error("❌ PAY ERROR:", err);
        res.json({ success: false });
    }
});
app.post("/admin/block-user", async (req, res) => {
    try {
        const { id } = req.body;
        await User_1.default.findByIdAndUpdate(id, { isBlocked: true }, { new: true });
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ success: false });
    }
});
app.post("/webhook/payment", async (req, res) => {
    try {
        const event = req.body;
        const email = event.email;
        const amount = event.amount;
        // ✅ prevent duplicate
        const exists = await transaction_1.default.findOne({
            paymentId: event.id
        });
        if (exists) {
            return res.json({ ok: true });
        }
        // 💰 credit wallet
        await User_1.default.findOneAndUpdate({ email: email }, { $inc: { "wallet.balance": amount } });
        // 📊 save transaction
        await transaction_1.default.create({
            email,
            amount,
            method: "TOPUP",
            status: "success",
            paymentId: "txn_" + Date.now()
        });
        res.json({ received: true });
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Error");
    }
});
app.post("/api/user/update-profile", async (req, res) => {
    try {
        const { email, upiId, accountNumber, ifsc, bankName } = req.body;
        await User_1.default.findOneAndUpdate({ email }, {
            $set: {
                "bank.upiId": upiId,
                "bank.accountNumber": accountNumber,
                "bank.ifsc": ifsc,
                "bank.bankName": bankName
            }
        });
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ success: false });
    }
});
app.get("/api/user/profile", async (req, res) => {
    try {
        const email = req.query.email;
        const user = await User_1.default.findOne({
            email: String(email)
        });
        res.json(user);
    }
    catch (err) {
        res.status(500).json({ success: false });
    }
});
app.get("/transactions", authMiddleware, async (req, res) => {
    const data = await transaction_1.default.find({
        userId: String(req.user.id)
    });
    res.json(data);
});
// 🔥 GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
    console.error("❌ GLOBAL ERROR:", err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});
app.get("/admin/analytics", async (req, res) => {
    try {
        const totalUsers = await User_1.default.countDocuments();
        const transactions = await transaction_1.default.find();
        const totalTransactions = transactions.length;
        const totalRevenue = transactions
            .filter(t => t.status === "success")
            .reduce((sum, t) => sum + (t.amount || 0), 0);
        const successCount = transactions.filter(t => t.status === "success").length;
        const successRate = totalTransactions
            ? ((successCount / totalTransactions) * 100).toFixed(2)
            : 0;
        res.json({
            success: true,
            data: {
                totalUsers,
                totalTransactions,
                totalRevenue,
                successRate
            }
        });
    }
    catch (err) {
        res.status(500).json({ success: false });
    }
});
app.get("/api/balance", async (req, res) => {
    const email = req.query.email;
    const last = await ledger_1.Ledger.findOne({ email: String(email) }).sort({ createdAt: -1 });
    res.json({
        balance: last ? last.balance : 0
    });
});
app.get("/api/ledger", async (req, res) => {
    const email = req.query.email;
    const data = await ledger_1.Ledger.find({ email: String(email) }).sort({ createdAt: -1 });
    res.json(data);
});
app.post("/api/add-money", async (req, res) => {
    const { email, amount } = req.body;
    const last = await ledger_1.Ledger.findOne({ email }).sort({ createdAt: -1 });
    const prevBalance = last ? last.balance : 0;
    const newBalance = prevBalance + amount;
    await ledger_1.Ledger.create({
        email,
        amount,
        type: "CREDIT",
        category: "TOPUP",
        balance: newBalance
    });
    res.json({ success: true, balance: newBalance });
});
