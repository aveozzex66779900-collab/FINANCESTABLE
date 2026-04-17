
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";
import fs from "fs";
import path from "path";
import { audit } from "./middleware/audit";
import { errorHandler } from "./middleware/error";
import { addToQueue, processQueue } from "./services/queue";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { checkSecurity } from "./middleware/security";
import { log } from "./middleware/logger";
import User from "./models/User";



import authRoutes from "./routes/auth";
import aiRoutes from "./routes/ai";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/transactions", async (req, res) => {

  try {
    const email = req.query.email;

    const transactions = await Transaction.find({ email });

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

const port = 5000
app.use(express.json());
app.use("/", authRoutes);

app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

app.use(helmet());

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

log("Server started");
log("Payment request received");
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self' http://127.0.0.1:5500 http://localhost:5500 data: blob:; img-src * data: blob:; media-src * data: blob:;"
  );
  next();
});


function detectFraud(userId: string, amount: number, history: any[]) {

  let riskScore = 0;

  if (amount > 10000) riskScore += 40;
  if (history.length > 5) riskScore += 30;

  const same = history.filter(tx => tx.amount === amount);
  if (same.length > 2) riskScore += 20;

  if (history.length === 0) riskScore += 10;

  return {
    fraud: riskScore > 50,
    riskScore
  };
}
const Stripe = require("stripe");
const stripe = new Stripe("sk_test_xxxxxxxxx");

// ✅ FIX CORS PROPERLY (IMPORTANT)
app.use(cors({
  origin: "http://127.0.0.1:5500",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));








mongoose.connect(
  "mongodb+srv://admin:admin123@cluster0.geok0a5.mongodb.net/FINANCESTABLE"
)
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log("DB Error ❌", err));

  // ✅ START SERVER ONLY AFTER DB CONNECTS
  app.listen(5000, () => {
    console.log("🚀 Server running on http://localhost:5000");
  });






// ✅ NEW routes (ADD ONLY)
app.use("/api/auth", authRoutes);
app.use("/api", aiRoutes);

// ✅ User Model
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: { type: String, default: "user" }
});




// 💾 Transaction Model (ADD HERE)

const transactionSchema = new mongoose.Schema({
  email: String,
  amount: Number,
  method: String, // UPI / CRYPTO
  type: String,   // BTC / ETH / UPI
  status: String,
  date: {
    type: Date,
    default: Date.now
  }
});
const Transaction = mongoose.model("Transaction", transactionSchema);
/* TEST */
app.get("/test", (req, res) => {
  res.json({ msg: "Backend working" });
});

app.post("/signup", async (req, res) => {
  try {
    console.log("Signup API HIT", req.body);

    const user = new User(req.body);
    await user.save();

    console.log("User saved ✅");

    res.json({ success: true });
  } catch (err) {
    console.log("Signup Error ❌", err);
    res.json({ success: false });
  }
});




  
/* PAYMENTS */




app.post("/pay-upi", (req, res) => {
  try {
    // ✅ req is available HERE
    const { amount, userId } = req.body;

    addToQueue({
      type: "PAYMENT",
      amount,
      userId
    });

    audit(userId, "UPI_PAYMENT");

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
app.get("/pay-upi", (req, res) => {
  res.json({
    success: true,
    message: "UPI Payment Success ✅"
  });
});



/* ADMIN */
app.get("/admin/users", (req, res) => {
  res.json([{ email: "test@gmail.com" }]);
});

app.get("/admin/payments", (req, res) => {
  res.json([{ amount: 100, status: "success" }]);
});






app.get("/admin/users", async (req, res) => {
  const users = await User.find();   // ✅ FIX
  res.json(users);
});




app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("LOGIN INPUT:", email, password);

    const user = await User.findOne({ email });

    console.log("FOUND USER:", user);

    if (!user) {
      return res.json({ success: false });
    }

    if (user.password !== password) {
      return res.json({ success: false });
    }

    res.json({
      success: true,
      role: user.role
    });

  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.json({ success: false });
  }
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
    const transactions = await Transaction.find();

    let csv = "User,Amount,Method,Status,Date\n";

    transactions.forEach((t: any) => {
      csv += `${t.userId},${t.amount},${t.method},${t.status},${t.createdAt}\n`;
    });

    const filePath = path.join(__dirname, "transactions.csv");
    fs.writeFileSync(filePath, csv);

    res.download(filePath, "transactions.csv");

  } catch (err) {
    console.log("❌ CSV ERROR:", err);
    res.status(500).json({ message: "Download failed" });
  }
});

app.post("/b2b-pay", async (req, res) => {
  try {
    const { email, amount, currency } = req.body;

    if (!email || !amount) {
      return res.json({ success: false });
    }

    console.log(`🏦 B2B Payment → ${email} | ${amount} ${currency}`);

    // Simulate FX conversion
    let converted = amount;
    if (currency === "USD") converted = amount * 83;
    if (currency === "EUR") converted = amount * 90;

    // Save transaction (optional)
    // await Transaction.create({ email, amount, currency, converted });

    return res.json({
      success: true,
      convertedAmount: converted
    });

  } catch (err) {
    res.json({ success: false });
  }
});

// ✅ CREATE DB TEST ROUTE
app.get("/create-db", async (req, res) => {
  try {
    const user = new User({
      name: "Shanu",
      email: "test@test.com",
      password: "123456"
    });

    await user.save();

    res.send("Database Created ✅");
  } catch (err) {
    console.log(err);
    res.send("Error ❌");
  }
});





// 💰 SAVE TRANSACTION API
app.post("/api/transaction", async (req, res) => {
  try {
    const { email, amount, status } = req.body;

    const transaction = {
      email,
      amount,
      status,
      date: new Date()
    };

    // create collection if not exists
    const db = mongoose.connection.db;

    await db.collection("transactions").insertOne(transaction);

    res.json({ success: true });

  } catch (err) {
    console.error("Transaction error:", err);
    res.status(500).json({ error: "Failed to save transaction" });
  }
});

app.get("/api/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});
app.post("/crypto", async (req, res) => {
  try {
    const { type, amount, email } = req.body;

    const tx = await Transaction.create({
      email,
      amount,
      method: "CRYPTO", // 🔥 REQUIRED
      type,
      status: "success"
    });

    res.json({
      success: true,
      message: "Crypto payment successful",
      data: tx
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});

app.get("/create-admin", async (req, res) => {
  const user = await User.create({
    email: "admin@gmail.com",
    password: "123456",
    role: "admin"
  });

  res.json(user);
});

app.get("/admin/users", async (req, res) => {
  const users = await User.find();   // ✅ FIX
  res.json(users);
});

app.post("/admin/add-user", async (req, res) => {
  try {
    console.log("👉 BODY:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      console.log("❌ Missing email or password");
      return res.json({ success: false, message: "Missing fields" });
    }

    const existing = await User.findOne({ email });

    if (existing) {
      console.log("❌ User already exists");
      return res.json({ success: false, message: "User exists" });
    }

    const newUser = new User({
      email,
      password,
      role: "user"
    });

    await newUser.save();

    console.log("✅ USER SAVED");

    res.json({ success: true });

  } catch (err) {
    console.error("🔥 FULL ERROR:", err);
    res.status(500).json({ success: false });
  }
});
app.post("/admin/block-user", async (req, res) => {
  try {
    const { id } = req.body;

    await User.findByIdAndUpdate(id, { isBlocked: true });

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});
app.post("/admin/delete-user", async (req, res) => {
  try {
    const { id } = req.body;

    await User.findByIdAndDelete(id);

    res.json({ success: true });

  } catch {
    res.status(500).json({ success: false });
  }
});



















