console.log("🛡 AI SAFE MODULE LOADED");





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
      `${API}/api/premium-ai/fraud-check`,
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