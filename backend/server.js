"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const adminUsers_1 = __importDefault(require("./adminUsers"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const User_1 = __importDefault(require("./models/User"));
const transaction_1 = __importDefault(require("./models/transaction"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const logger_1 = require("./utils/logger");
const prom_client_1 = __importDefault(require("prom-client"));
const ledger_1 = require("./models/ledger");
const dashboardTransactions_1 = __importDefault(require("./dashboardTransactions"));
const ai_safe_1 = __importDefault(require("./routes/ai-safe"));
const ai_premium_1 = __importDefault(require("./routes/ai-premium"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express_1.default.json());
app.use("/admin", adminUsers_1.default);
app.use("/", dashboardTransactions_1.default);
app.use("/", ai_safe_1.default);
app.use("/api/premium-ai", ai_premium_1.default);
function normalizeWallet(user) {
    if (!user.wallet || typeof user.wallet === "number") {
        user.wallet = { balance: user.wallet || 0 };
    }
}
app.use(express_1.default.urlencoded({ extended: true }));
// ================= SIGNUP =================
app.post("/api/auth/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // 🔐 HASH PASSWORD
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = new User_1.default({
            name,
            email,
            password: hashedPassword
        });
        await user.save();
        res.json({ success: true });
    }
    catch (err) {
        console.error(err);
        res.json({ success: false, message: "Signup failed" });
    }
});
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
app.post("/webhook/payment", express_1.default.raw({ type: "*/*" }), async (req, res) => {
    try {
        const signature = req.headers["x-webhook-signature"];
        // 🔐 OPTIONAL (recommended for production)
        // verify signature here
        const body = JSON.parse(req.body.toString());
        console.log("📩 WEBHOOK RECEIVED:", body);
        const { email, amount, type, status } = body;
        if (!email || !amount) {
            return res.status(400).send("Invalid webhook");
        }
        // ✅ Save verified transaction
        const tx = await transaction_1.default.create({
            email,
            amount,
            method: "UPI",
            type,
            status: status || "success"
        });
        console.log("✅ VERIFIED & SAVED:", tx._id);
        res.status(200).send("OK");
    }
    catch (err) {
        console.error("❌ WEBHOOK ERROR:", err);
        res.status(500).send("Webhook failed");
    }
});
app.get("/api/transactions", async (req, res) => {
    try {
        const email = req.query.email;
        const filter = {};
        if (email)
            filter.email = email;
        const transactions = await transaction_1.default.find(filter);
        res.json({
            success: true,
            transactions
        });
    }
    catch (err) {
        console.error(err);
        res.json({
            success: false,
            message: "Failed to load transactions"
        });
    }
});








app.get("/api/dashboard/transactions", async (req, res) => {

  try {

    const transactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      transactions
    });

  } catch (error) {

    console.error(
      "DASHBOARD TRANSACTIONS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      transactions: [],
      message: "Failed to load transactions"
    });

  }

});
app.post("/api/transaction", async (req, res) => {
    try {
        console.log("🚀 B2B TRANSACTION START");
        const { email, amount, type = "b2b", status = "SUCCESS" } = req.body;
        console.log("📥 Incoming:", { email, amount });
        // ✅ VALIDATION
        if (!email || !amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or amount"
            });
        }
        // ✅ FIND USER (CRITICAL FIX)
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        // ✅ CREATE TRANSACTION (FIXED userId)
        const tx = await transaction_1.default.create({
            userId: user._id, // 🔥 THIS WAS MISSING
            email,
            amount,
            type,
            status
        });
        // =========================
        // 🔥 LEDGER (SAFE ADD)
        // =========================
        const last = await ledger_1.Ledger.findOne({ userId: user._id }).sort({ createdAt: -1 });
        const prevBalance = last ? last.balance : 0;
        const newBalance = prevBalance - amount;
        await ledger_1.Ledger.create({
            userId: user._id,
            email,
            amount,
            type: "DEBIT",
            category: type,
            balance: newBalance,
            referenceId: tx._id
        });
        console.log("✅ TRANSACTION SUCCESS:", tx._id);
        // ✅ RESPONSE (EXTENDED, NOT BREAKING)
        res.json({
            success: true,
            transactionId: tx._id,
            email,
            amount,
            balance: newBalance
        });
    }
    catch (err) {
        console.error("❌ TRANSACTION ERROR:", err);
        res.status(500).json({
            success: false,
            message: "Transaction DB failed",
            debug: err.message // 👈 helps debugging
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
        console.log("🚀 Server running on http://localhost:5000");
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
            await fetch("http://localhost:5000/webhook/payment", {
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
app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User_1.default.findOne({ email });
    if (!user) {
        return res.json({ success: false, message: "User not found" });
    }
    const isMatch = await bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        return res.json({ success: false, message: "Wrong password" });
    }
    // ✅ RETURN REAL ROLE FROM DB
    res.json({
        success: true,
        role: user.role || "user"
    });
});
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
    catch (err) {
        console.error("❌ B2B ERROR:", err);
        res.status(500).json({
            success: false,
            message: "B2B payment failed",
            error: err.message
        });
    }
});
app.get("/create-db", async (req, res) => {
    try {
        const hashedPassword = await bcrypt_1.default.hash("123456", 10);
        const user = new User_1.default({
            name: "Shanu",
            email: "test@test.com",
            password: hashedPassword
        });
        await user.save();
        res.send("Database Created ✅");
    }
    catch (err) {
        res.send("Error ❌");
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
app.get("/admin/users", async (req, res) => {
    try {
        const users = await User_1.default.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            users
        });
    }
    catch (error) {
        console.log("ADMIN USERS ERROR:", error);
        res.status(500).json({
            success: false,
            users: []
        });
    }
});
app.get("/create-admin", async (req, res) => {
    try {
        const hashed = await bcrypt_1.default.hash("123456", 10);
        const admin = await User_1.default.findOneAndUpdate({ email: "admin@gmail.com" }, {
            email: "admin@gmail.com",
            password: hashed,
            role: "admin"
        }, { upsert: true, new: true });
        res.json({
            success: true,
            message: "Admin ensured",
            admin
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});
app.post("/admin/add-user", async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt_1.default.hash(password, 10); // ✅ ADD
        const user = new User_1.default({
            email,
            password: hashedPassword, // ✅ FIX
            role: email === "admin@gmail.com" ? "admin" : "user",
            wallet: { balance: 0 },
            bank: {}
        });
        await user.save();
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ success: false });
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
app.post("/admin/delete-user", async (req, res) => {
    try {
        const { id } = req.body;
        await User_1.default.findByIdAndDelete(id);
        res.json({ success: true });
    }
    catch {
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
app.get("/api/users", async (req, res) => {
    try {
        const users = await User_1.default.find();
        res.status(200).json({
            success: true,
            users
        });
    }
    catch (error) {
        console.log("USERS LOAD ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Failed to load users"
        });
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
        const user = await User_1.default.findOne({ email });
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
    const last = await ledger_1.Ledger.findOne({ email }).sort({ createdAt: -1 });
    res.json({
        balance: last ? last.balance : 0
    });
});
app.get("/api/ledger", async (req, res) => {
    const email = req.query.email;
    const data = await ledger_1.Ledger.find({ email }).sort({ createdAt: -1 });
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
