import express from "express";

const router = express.Router();

// ==========================================
// AI ADVICE ROUTE
// ==========================================

router.post("/advice", async (req, res) => {
  try {
    const { income, expenses } = req.body;

    const savings = income - expenses;

    let riskLevel = "Low";

    if (expenses > income) {
      riskLevel = "High";
    } else if (expenses > income * 0.7) {
      riskLevel = "Medium";
    }

    const advice = [
      "Maintain diversified portfolio",
      "Increase long-term investments",
      "Track monthly spending",
      "Build emergency savings",
    ];

    return res.json({
      success: true,
      result: {
        score: 92,
        riskLevel,
        savings,
        advice,
      },
    });
  } catch (error) {
    console.error("❌ AI ADVICE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "AI advice failed",
    });
  }
});

// ==========================================
// FRAUD CHECK ROUTE
// ==========================================

router.post("/fraud-check", async (req, res) => {
  try {
    const { amount } = req.body;

    let risk = "Safe";
    let score = 15;
    let reason = "Transaction appears normal";

    if (amount > 50000) {
      risk = "Medium";
      score = 60;
      reason = "Large transaction amount detected";
    }

    if (amount > 100000) {
      risk = "High";
      score = 92;
      reason = "Very high transaction amount";
    }

    return res.json({
      success: true,
      result: {
        risk,
        score,
        reason,
      },
    });
  } catch (error) {
    console.error("❌ FRAUD CHECK ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Fraud check failed",
    });
  }
});

export default router;