console.log("🛡 AI SAFE MODULE LOADED");


const API_BASE = API;
// =====================================================
// PREMIUM AI ADVICE
// =====================================================

async function getAIAdvice() {

  try {

    const result =
      document.getElementById("aiResult");

    if (result) {
      result.innerHTML = `
        <div class="loading-box">
          Loading AI analysis...
        </div>
      `;
    }

    const response = await fetch(
      `${API_BASE}/api/premium-ai/advice`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          income: 100000,
          expenses: 45000
        })
      }
    );

    const data = await response.json();

    console.log("AI RESPONSE:", data);

    if (!result) return;

    result.innerHTML = `
      <div class="ai-result-box">

        <h3>🧠 Premium AI Analysis</h3>

        <p><strong>Risk:</strong>
        ${data.result.riskLevel}</p>

        <p><strong>Score:</strong>
        ${data.result.score}</p>

        <p><strong>Savings:</strong>
        ₹${data.result.savings}</p>

        <h4>Recommendations:</h4>

        ${data.result.advice.map(item => `
          <p>• ${item}</p>
        `).join("")}

      </div>
    `;

  } catch (error) {

    console.error(error);

    const result =
      document.getElementById("aiResult");

    if (result) {
      result.innerHTML = `
        <div class="error-box">
          Failed to load AI analysis
        </div>
      `;
    }
  }
}

// =====================================================
// FRAUD CHECK
// =====================================================

async function runFraudCheck() {

  try {

    const amountInput =
      document.getElementById("fraudAmount");

    const fraudResult =
      document.getElementById("fraudResult");

    if (!amountInput || !fraudResult) {
      console.error("Fraud elements missing");
      return;
    }

    fraudResult.innerHTML = `
      <div class="loading-box">
        Checking fraud risk...
      </div>
    `;

    const amount =
      Number(amountInput.value || 0);

    const response = await fetch(
      `${API_BASE}/api/premium-ai/fraud-check`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount
        })
      }
    );

    const data = await response.json();

    console.log("FRAUD RESPONSE:", data);

    





    fraudResult.innerHTML = `
<div class="fraud-result-box">

  <h3>🛡 Fraud Detection</h3>

  <p>
    <strong>Risk:</strong>
    ${data.risk}
  </p>

  <p>
    <strong>Score:</strong>
    ${data.score}
  </p>

  <p>
    <strong>Reason:</strong>
    ${data.reason}
  </p>

</div>
`;

  } catch (error) {

    console.error(error);

    const fraudResult =
      document.getElementById("fraudResult");

    if (fraudResult) {
      fraudResult.innerHTML = `
        <div class="error-box">
          Fraud check failed
        </div>
      `;
    }
  }
}

// =====================================================
// GLOBAL EXPORTS
// =====================================================

window.getAIAdvice = getAIAdvice;
window.runFraudCheck = runFraudCheck;

console.log("✅ AI SAFE READY");