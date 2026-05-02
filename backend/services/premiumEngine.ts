export function generatePremiumAdvice(
  income: number,
  expenses: number
) {
  const savings = income - expenses;

  let riskLevel = "Low";
  let advice = [];
  let score = 90;

  // =========================
  // SAVINGS ANALYSIS
  // =========================

  if (savings < 0) {
    riskLevel = "Critical";
    score = 20;

    advice.push(
      "Your expenses exceed income.",
      "Reduce non-essential spending immediately.",
      "Build emergency reserve.",
      "Avoid high-risk investments."
    );
  }

  else if (savings < income * 0.2) {
    riskLevel = "Medium";
    score = 55;

    advice.push(
      "Savings ratio is below optimal.",
      "Reduce monthly liabilities.",
      "Increase cash reserve.",
      "Focus on stable assets."
    );
  }

  else {
    riskLevel = "Low";
    score = 92;

    advice.push(
      "Financial condition is healthy.",
      "Maintain diversified portfolio.",
      "Increase long-term investments.",
      "Continue controlled spending."
    );
  }

  // =========================
  // AI PORTFOLIO
  // =========================

  let portfolio = {
    stocks: "40%",
    crypto: "20%",
    gold: "15%",
    bonds: "25%"
  };

  if (riskLevel === "Critical") {
    portfolio = {
      stocks: "15%",
      crypto: "0%",
      gold: "35%",
      bonds: "50%"
    };
  }

  return {
    success: true,
    score,
    riskLevel,
    savings,
    portfolio,
    advice
  };
}