import express from "express";
import User from "./models/User";

const router = express.Router();

/* GET ALL USERS */
router.get("/users", async (req, res) => {
  try {

    const users = await User.find().select(
      "email role upi createdAt"
    );

    res.json({
      success: true,
      users
    });

  } catch (error: any) {

    console.log("ADMIN USERS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
});

export default router;