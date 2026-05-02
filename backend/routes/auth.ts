

import express from "express";
import User from "../models/User";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("LOGIN INPUT:", email, password);

    const user = await User.findOne({ email });

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

  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.json({ success: false });
  }
});

export default router;