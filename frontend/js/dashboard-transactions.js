console.log("✅ DASHBOARD TRANSACTIONS MODULE LOADED");

async function loadDashboardTransactions() {

  try {

    const response = await fetch(
      "http://localhost:5000/dashboard/transactions"
    );

    const data = await response.json();

    console.log("TRANSACTION RESPONSE:", data);

    const table =
      document.getElementById("transactionsTable") ||
      document.querySelector("#transactionsTableBody");

    if (!table) {
      console.error("❌ transactionsTable not found");
      return;
    }

    table.innerHTML = "";

    if (!data.transactions || !data.transactions.length) {

      table.innerHTML = `
        <tr>
          <td colspan="5">No Transactions Found</td>
        </tr>
      `;

      return;
    }

    data.transactions.forEach((tx) => {

      table.innerHTML += `
        <tr>
          <td>${tx.email || "-"}</td>
          <td>${tx.amount || 0}</td>
          <td>${tx.type || "payment"}</td>
          <td>${tx.status || "success"}</td>
          <td>${new Date(tx.createdAt).toLocaleString()}</td>
        </tr>
      `;
    });

  } catch (err) {

    console.error(
      "❌ DASHBOARD TRANSACTIONS LOAD ERROR:",
      err
    );
  }
}

window.addEventListener("DOMContentLoaded", () => {
  loadDashboardTransactions();
});