import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/", async (req, res) => {

  try {

    const { message } = req.body;

    if (!message) {

      return res.status(400).json({
        success: false,
        message: "Message required"
      });
    }

    const response = await axios.post(

      "https://api.openai.com/v1/chat/completions",

      {
        model: "gpt-4.1-mini",

        messages: [
          {
            role: "system",
            content:
              "You are FinanceStable AI support assistant."
          },

          {
            role: "user",
            content: message
          }
        ]
      },

      {
        headers: {

          Authorization:
            `Bearer ${process.env.OPENAI_API_KEY}`,

          "Content-Type":
            "application/json"
        }
      }
    );

    res.json({
      success: true,
      reply:
        response.data.choices[0]
          .message.content
    });

  } catch (error: any) {

    console.error(
      "AI SUPPORT ERROR:",
      error.response?.data || error
    );

    res.status(500).json({
      success: false,
      message: "AI support failed"
    });
  }
});

export default router;