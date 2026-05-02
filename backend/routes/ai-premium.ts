import express from "express";

import { generatePremiumAdvice }
from "../services/premiumEngine";

import { detectFraud }
from "../services/fraudEngine";

const router = express.Router();


// ============================
// PREMIUM AI ADVICE
// ============================

router.post(
  "/advice",
  async (req, res) => {

    try {

      const {
        income,
        expenses
      } = req.body;

      const result =
        generatePremiumAdvice(
          Number(income),
          Number(expenses)
        );

      res.json(result);

    } catch (error) {

      console.log(
        "PREMIUM AI ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message: "AI advice failed"
      });
    }
  }
);


// ============================
// FRAUD DETECTION
// ============================

router.post(
  "/fraud-check",
  async (req, res) => {

    try {

      const {
        amount
      } = req.body;

      const result =
        detectFraud(
          Number(amount)
        );

      res.json(result);

    } catch (error) {

      console.log(
        "FRAUD ENGINE ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Fraud check failed"
      });
    }
  }
);

export default router;