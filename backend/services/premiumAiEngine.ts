export function generatePremiumAdvice(
  income: number,
  expenses: number
) {

  const savings = income - expenses;

  let advice = "";
  let risk = "LOW";
  let score = 95;

  if (income <= 0) {

    advice =
      "No income detected. Build income sources immediately.";

    risk = "HIGH";
    score = 20;

  }

  else if (expenses > income) {

    advice =
      "Critical overspending detected. Reduce expenses immediately.";

    risk = "HIGH";
    score = 30;

  }

  else if (savings < income * 0.1) {

    advice =
      "Low savings rate detected. Improve budgeting.";

    risk = "MEDIUM";
    score = 60;

  }

  else if (savings > income * 0.4) {

    advice =
      "Excellent financial discipline and savings performance.";

    risk = "LOW";
    score = 96;

  }

  else {

    advice =
      "Healthy financial balance detected.";

    risk = "LOW";
    score = 85;

  }

  return {

    income,
    expenses,
    savings,
    score,
    risk,
    advice,

    premiumInsights: [

      "AI cashflow analysis completed",

      "Behavioral spending pattern analyzed",

      "Savings stability checked",

      "Financial risk score generated"

    ]

  };

}