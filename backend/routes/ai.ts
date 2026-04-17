import express from "express";
const router = express.Router();

router.get("/ai-security", (req, res) => {
  res.json({
    safe: true,
    message: "AI Security OK ✅"
  });
});

export default router;