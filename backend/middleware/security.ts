import axios from "axios";

export const checkSecurity = async (req: any, res: any, next: any) => {
  try {
    const { amount, device, typingSpeed } = req.body;

    const response = await axios.post("http://localhost:8000/risk", {
      amount,
      newDevice: false,
      hour: new Date().getHours(),
      typingSpeed
    });

    const risk = response.data.riskScore;

    if (response.data.requireOTP) {
      return res.json({
        success: false,
        message: "🔐 OTP required",
        risk
      });
    }

    next();

  } catch (err) {
    console.log("Security error:", err);
    next(); // don't break existing system
  }
};