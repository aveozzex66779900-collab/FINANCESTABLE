import express from "express";
import Transaction from "./models/transaction";

const router = express.Router();

/*
  SAFE ISOLATED DASHBOARD TRANSACTIONS
  DOES NOT MODIFY OLD SYSTEM
*/

router.get("/dashboard/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      transactions
    });

  } catch (err: any) {

    console.error("❌ DASHBOARD TRANSACTION ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

export default router;