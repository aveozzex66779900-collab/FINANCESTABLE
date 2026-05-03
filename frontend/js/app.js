console.log("APP JS LOADED ✅");

// 🔴 Catch ALL hidden JS errors
window.onerror = function (msg, url, line, col, error) {
  console.error("❌ GLOBAL ERROR:", { msg, url, line, col, error });
};

window.onunhandledrejection = function (event) {
  console.error("❌ PROMISE ERROR:", event.reason);
};










// ================= UI HELPERS (ADD AT TOP) =================

function showLoading() {
  const loader = document.createElement("div");
  loader.id = "aiLoader";

  loader.style.position = "fixed";
  loader.style.top = "50%";
  loader.style.left = "50%";
  loader.style.transform = "translate(-50%, -50%)";
  loader.style.background = "#0f172a";
  loader.style.color = "#22c55e";
  loader.style.padding = "20px";
  loader.style.borderRadius = "10px";
  loader.style.fontSize = "16px";
  loader.style.zIndex = "9999";

  loader.innerHTML = "🤖 AI analyzing...";
  document.body.appendChild(loader);
}

function hideLoading() {
  const loader = document.getElementById("aiLoader");
  if (loader) loader.remove();
}

function showSuccessModal(message) {
  const modal = document.createElement("div");

  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.background = "rgba(0,0,0,0.6)";
  modal.style.display = "flex";
  modal.style.alignItems = "center";
  modal.style.justifyContent = "center";
  modal.style.zIndex = "9999";

  modal.innerHTML = `
    <div style="
      background: linear-gradient(135deg, #0f172a, #1e293b);
      padding: 30px;
      border-radius: 20px;
      text-align: center;
      color: white;
      width: 300px;
      animation: scaleIn 0.3s ease;
    ">
      <div style="font-size: 40px;">✅</div>
      <h2>Success</h2>
      <p>${message}</p>
      <button onclick="this.closest('div').parentElement.remove()"
        style="margin-top:15px;padding:10px 20px;border:none;border-radius:8px;background:#22c55e;color:black;">
        Done
      </button>
    </div>
  `;

  document.body.appendChild(modal);
}




// 🔐 LOGIN FUNCTION






  



window.login = async function () {
  try {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    console.log("🔐 Attempt login:", email);

    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    // ✅ handle invalid JSON safely
    let data;
    try {
      data = await res.json();
    } catch (err) {
      console.error("❌ Invalid JSON response");
      alert("Server error. Try again.");
      return;
    }

    console.log("📦 Login response:", data);

    // ✅ success flow
    
    
    if (data.success) {
  const role = data.role || "user";
  localStorage.setItem("email", email);


    
  localStorage.setItem("userId", data.userId);

  alert("Login success ✅");

  if (role === "admin") {
    window.location.href = "/frontend/admin.html";
  } else {
    
    window.location.href = "/dashboard.html";
  }
}
    
    else {
      alert(data.message || "Wrong email or password ❌");
    }

  } catch (err) {
    console.error("❌ Login error:", err);
    alert("Network error. Backend not reachable.");
  }
};











  
// 🆕 SIGNUP FUNCTION











  window.signup = async function () {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  console.log("🚀 Sending:", { name, email, password }); // ADD THIS

  const res = await fetch(`${API}/api/auth/signup`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name,
    email,
    password
  })
});
  const data = await res.json();

  console.log("📩 RESPONSE:", data); // ADD THIS

  if (data.success) {
    document.getElementById("msg").innerText = "Signup success ✅";
    window.location.href = "login.html";
  } else {
    document.getElementById("msg").innerText =
      data.message || "Signup failed ❌";
  }
}






async function loadUsers() {

  try {

    const response = await fetch(`${API}/api/user`);

    
    


    const data = await response.json();

const users = data.users || [];
    const table = document.getElementById("usersTable");

    if (!table) return;

    table.innerHTML = "";

    users.reverse().forEach((user) => {

      table.innerHTML += `
        <tr>
          <td>${user.email}</td>
          <td>${user.role || "user"}</td>
          <td>${user.upi || "-"}</td>

          <td>
            <button>View</button>
          </td>
        </tr>
      `;

    });

  } catch (err) {

    console.error("Load users error:", err);

  }

}




/* ================= UPI PAYMENT ================= */










window.payUPI = async function () {
  try {
    // ✅ Get logged-in user email
    const email = localStorage.getItem("email");

    if (!email) {
      alert("❌ Please login first");
      window.location.href = "login.html";
      return;
    }

    // ✅ Get inputs
    const upiInput = document.getElementById("upiId");
    const amountInput = document.getElementById("amount");

    if (!upiInput || !amountInput) {
      alert("❌ Input fields missing");
      return;
    }

    const upi = upiInput.value.trim();
    const amount = Number(amountInput.value.trim());

    console.log("💳 PAY UPI:", { email, upi, amount });

    // ✅ Validation
    if (!upi || !amount || amount <= 0) {
      alert("❌ Enter valid UPI & amount");
      return;
    }

    // ✅ API call
    const res = await fetch(`${API}/api/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,        // 🔥 FIXED (was using UPI before)
        amount: amount,
        type: "UPI",
        status: "success"
      })
    });

    const result = await res.json();

    console.log("📩 RESPONSE:", result);

    // ✅ Proper error handling
    if (!res.ok || !result.success) {
      throw new Error(result.message || "Payment failed");
    }

    // ✅ Success UI
    playSuccessSound();   // 🔊 ADD THIS
alert("Payment Success ✅");

    // 🔥 Clear inputs
    upiInput.value = "";
    amountInput.value = "";

    // 🔄 Refresh transactions
    await loadTransactions();

  } catch (err) {
    console.error("❌ PAY ERROR:", err);
    alert(err.message || "Payment failed");
  }
}
async function payCard() {
  try {
    const cardAmountInput = document.getElementById("cardAmount");

    // ✅ get logged-in user
    const email = localStorage.getItem("email");

    // 🚨 must login
    if (!email) {
      alert("Please login first ❌");
      window.location.href = "login.html";
      return;
    }

    const amount = cardAmountInput?.value.trim();

    // ✅ validation
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert("Enter valid amount ❌");
      return;
    }

    console.log("💳 CARD PAYMENT:", { email, amount });

    const res = await fetch(`${API}/api/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,          // ✅ FIXED (no manual input)
        amount: Number(amount),
        type: "CARD",          // unified type
        status: "success"
      })
    });

    const data = await res.json();

    console.log("✅ CARD RESPONSE:", data);

    if (data.success) {
      alert("Card Payment Success 💳");

      // ✅ clear input
      cardAmountInput.value = "";

      // ✅ reload transactions
      loadTransactions();

    } else {
      alert(data.message || "Card payment failed ❌");
    }

  } catch (err) {
    console.error("❌ CARD ERROR:", err);
    alert("Server error ❌");
  }
}









async function payCrypto() {
  try {
    const type = document.getElementById("cryptoType").value;
    const amountInput = document.getElementById("cryptoAmount");

    // ✅ get logged-in user
    const email = localStorage.getItem("email");

    // 🚨 must login
    if (!email) {
      alert("Please login first ❌");
      window.location.href = "login.html";
      return;
    }

    const amount = amountInput?.value.trim();

    // ✅ validation
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert("Enter valid crypto amount ❌");
      return;
    }
    



    





    console.log("🚀 CRYPTO PAYMENT:", { email, type, amount });

    const res = await fetch(`${API}/api/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,            // ✅ FIXED (no crypto_user)
        amount: Number(amount),
        type: type,              // BTC / ETH / etc.
        status: "success"
      })
    });

    const data = await res.json();

    console.log("✅ CRYPTO RESPONSE:", data);

    if (data.success) {
      alert("Crypto Payment Success 🚀");








      window.location.href =
  `payment-success.html?type=Crypto Payment&amount=${amount}`;


      // ✅ clear input
      amountInput.value = "";

      // ✅ reload transactions
      loadTransactions();

    } else {
      alert(data.message || "Crypto payment failed ❌");
    }

  } catch (err) {
    console.error("❌ CRYPTO ERROR:", err);
    alert("Server error ❌");
  }
}
/* ================= GET PAYMENTS ================= */
async function getPayments(){
  try {
    const res = await fetch(API + "/payments");
    const data = await res.json();

    console.log("Payments:", data);

    updateUI(data);

  } catch(err){
    console.error(err);
  }
}

/* ================= UPDATE UI ================= */
function updateUI(data){
  const container = document.getElementById("payments");

  if(!container) return;

  container.innerHTML = "";

  data.forEach(p => {
    container.innerHTML += `
      <div class="card">
        <p>💰 ${p.amount || 100}</p>
        <p>Status: ${p.status || "success"}</p>
      </div>
    `;
  });
}

/* ================= ADMIN PANEL ================= */
async function loadAdmin(){
  try {
    const role = localStorage.getItem("role");

    if(role !== "admin"){
      alert("Access Denied ❌");
      window.location.href = "login.html";
      return;
    }

    const res = await fetch(API + "/admin/users");
    const users = await res.json();

    const container = document.getElementById("adminData");

    if(container){
      container.innerHTML = users.map(u => `
        <div class="card">
          <p>${u.email}</p>
          <p>${u.role}</p>
        </div>
      `).join("");
    }

  } catch(err){
    console.error(err);
  }
}








/* ================= CRYPTO FEATURE ================= */
async function generateCrypto(){
  try {
    const res = await fetch(API + "/crypto");
    const data = await res.json();

    alert("Crypto Generated 🚀");

  } catch(err){
    console.error(err);
  }
}

/* ================= TRANSACTIONS ================= */
 





window.loadTransactions = async function () {

  try {

    const email = localStorage.getItem("email");

    const res = await fetch(`${API}/api/transactions?email=${email}`
    );

    const data = await res.json();

    console.log("TRANSACTIONS:", data);

    // ✅ SAFE fallback
    const transactions = data.transactions || data || [];

    const txList =
      document.getElementById("txList");

    const revenue =
      document.getElementById("revenue");

    const payments =
      document.getElementById("payments");

    if (txList) {
      txList.innerHTML = "";
    }

    let total = 0;

    transactions.forEach((tx) => {

      total += Number(tx.amount || 0);

      if (txList) {

        txList.innerHTML += `
          <li>
            💸 ${tx.email}
            - ₹${tx.amount}
            - ${tx.status || "success"}
          </li>
        `;
      }

    });

    if (revenue) {
      revenue.innerText = total;
    }

    if (payments) {
      payments.innerText = transactions.length;
    }

  } catch (err) {

    console.error(err);

    alert("Failed to load transactions");

  }

};




























async function loadUsers() {

  try {

    const response = await fetch(`${API}/api/user`);

    const data = await response.json();

    const users = data.users || [];

    const table = document.getElementById("usersTable");

    if (!table) return;

    table.innerHTML = "";

    users.reverse().forEach((user) => {

      table.innerHTML += `
        <tr>
          <td>${user.email}</td>
          <td>${user.role || "user"}</td>
          <td>${user.upi || "-"}</td>
          <td>
            <button>View</button>
          </td>
        </tr>
      `;

    });

  } catch (err) {

    console.error("Load users error:", err);

  }

}






window.addEventListener("DOMContentLoaded", () => {

  loadTransactions();

  loadUsers();// loadUsers();

});

/* ================= B2B PAYMENT ================= */





























window.sendB2B = async function () {

  try {

    const email =
      document.getElementById("b2bEmail")?.value;

    const amount =
      document.getElementById("b2bAmount")?.value;

    const currency =
      document.getElementById("b2bCurrency")?.value || "INR";

    const userId =
      localStorage.getItem("userId");

    if (!email || !amount) {
      alert("Fill all fields");
      return;
    }

    const response = await fetch(`${API}/api/b2b/pay`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId,
          email,
          amount,
          currency
        })
      }
    );

    const data = await response.json();

    console.log("B2B RESPONSE:", data);

    if (data.success) {

      alert("B2B Payment Success ✅");



    





      
      window.location.href =
  `payment-success.html?type=B2B Payment&amount=${amount}`;



      loadTransactions();

    } else {

      alert(data.message || "Payment failed");

    }

  } catch (err) {

    console.error(err);

    alert("Failed to load");

  }

};

/* ================= AI ADVICE ================= */












async function getAdvice(data) {
  try {
    console.log("🤖 Sending AI advice request...");

    const res = await fetch(`${API}/api/ai/advice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    // ✅ SAFE RESPONSE
    const text = await res.text();

    let result;

    try {
      result = JSON.parse(text);
    } catch (err) {
      console.error("❌ Invalid JSON:", text);
      throw new Error("Server returned invalid JSON");
    }

    console.log("✅ AI Advice Result:", result);

    return result;

  } catch (err) {
    console.error("❌ AI Advice Error:", err);

    return {
      success: false,
      message: err.message
    };
  }
}




async function runAISecurity(){
  const status = document.getElementById("aiStatus");

  try{
    const res = await fetch(`${API}/api/ai-security`);
    const data = await res.json();

    console.log("AI RESPONSE:", data);

    if(status){
      status.innerText = data.safe
        ? "✅ Safe Login"
        : "⚠️ High Risk";
    }

    return data.safe ? "low" : "high";

  }catch(err){
    console.error(err);
    if(status) status.innerText = "❌ AI failed";
    return "low";
  }
}

async function biometricLogin(){
  if(!window.PublicKeyCredential){
    alert("⚠️ Biometric not supported on this device");
    return;
  }

  if(location.hostname !== "localhost"){
    alert("⚠️ Use localhost for biometric");
    return;
  }

  try{
    const publicKey = {
      challenge: new Uint8Array(32),
      rp: { name: "FinTech App" },
      user: {
        id: new Uint8Array(16),
        name: "user@example.com",
        displayName: "User"
      },
      pubKeyCredParams: [{ type: "public-key", alg: -7 }]
    };

    await navigator.credentials.create({ publicKey });// navigator.credentials.get(...)

    alert("✅ Biometric Auth Success");

  }catch(err){
    console.error(err);
    alert("❌ Biometric failed");
  }
}



async function adminLogin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  console.log("LOGIN RESPONSE:", data);

  if (data.success && data.role === "admin") {
    window.location.href = "admin.html";
  } else {
    document.getElementById("msg").innerText = "Access Denied ❌";
  }
}








async function addUser() {
  const email = document.getElementById("newEmail").value;
  const password = document.getElementById("newPassword").value;

  const res = await fetch(`${API}/api/admin/add-user`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.success) {
    alert("User Added ✅");
    loadUsers(); // 🔥 THIS LINE
  } else {
    alert(data.message || "Error ❌");
  }
}





async function deleteUser(id) {
  if (!confirm("Delete this user?")) return;

  try {
    const res = await fetch(`${API}/api/admin/delete-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id })
    });

    const data = await res.json();

    if (data.success) {
      alert("User Deleted ✅");
      loadUsers(); // 🔥 refresh table
    } else {
      alert("Delete Failed ❌");
    }

  } catch (err) {
    console.error(err);
    alert("Server Error ❌");
  }
}
// AUTO LOAD ADMIN USERS
if (window.location.pathname.includes("admin.html")) {
  loadUsers();// loadUsers();
}

window.addEventListener("load", () => {
  if (
    window.location.pathname.includes("dashboard.html") ||
    window.location.pathname.includes("pay.html")
  ) {
    loadTransactions();
  }
});




  
// ✅ GENERATE CRYPTO ADDRESS
function generateAddress() {
  const address = "CRYPTO_" + Math.random().toString(36).substring(2, 10);
  document.getElementById("cryptoAddress").innerText = address;
}

// ✅ DOWNLOAD CSV
function downloadCSV() {
  const list = document.querySelectorAll("#userList div");

  let csv = "Method,Amount,Status\n";

  list.forEach(item => {
    const text = item.innerText.split("|");
    csv += `${text[0]},${text[1]},${text[2]}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "transactions.csv";
  a.click();
}

if (window.location.pathname.includes("admin.html")) {
  loadUsers();// loadUsers();
}




















function openQR() {
  window.location.href = "qr-pay.html";
}

function showAdviceUI(advice) {
  let box = document.getElementById("aiAdviceBox");

  if (!box) {
    box = document.createElement("div");
    box.id = "aiAdviceBox";

    box.style.position = "fixed";
    box.style.bottom = "20px";
    box.style.right = "20px";
    box.style.width = "320px";
    box.style.background = "#0f172a";
    box.style.color = "#fff";
    box.style.padding = "20px";
    box.style.borderRadius = "12px";
    box.style.boxShadow = "0 10px 30px rgba(0,0,0,0.4)";
    box.style.zIndex = "9999";
    box.style.fontSize = "14px";
    box.style.lineHeight = "1.6";

    document.body.appendChild(box);
  }

  box.innerHTML = `
    <h3 style="color:#22c55e; margin-bottom:10px;">🤖 AI Advisor</h3>
    <pre style="white-space:pre-wrap;">${advice}</pre>
    <button onclick="this.parentElement.remove()" 
      style="margin-top:10px; padding:6px 12px; border:none; border-radius:6px; background:#22c55e; color:#000;">
      Close
    </button>
  `;
}



async function saveBank() {
  const email = localStorage.getItem("email");

  const res = await fetchfetch(`${API}/api/add-bank`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      upiId: document.getElementById("upi").value,
      accountNumber: document.getElementById("acc").value,
      ifsc: document.getElementById("ifsc").value,
      bankName: document.getElementById("bankName").value
    })
  });

  const data = await res.json();

  if (data.success) {
    alert("Bank Added ✅");
  }
}





async function loadBalance() {
  const email = localStorage.getItem("email");

  const res = await fetch(`${API}/api/user?email=${email}`);
  const data = await res.json();

  document.getElementById("balance").innerText =
    "₹" + (data.wallet?.balance || 0);
}

function openSmartHub() {
  window.location.href = "smart-hub.html";
}




async function loadAdminAnalytics() {
  try {
    const res = await fetch(`${API}/api/admin/analytics`);
    const result = await res.json();

    if (!result.success) throw new Error("Failed");

    const data = result.data;

    document.getElementById("totalUsers").innerText = data.totalUsers;
    document.getElementById("totalTx").innerText = data.totalTransactions;
    document.getElementById("revenue").innerText = "₹" + data.totalRevenue;
    document.getElementById("successRate").innerText = data.successRate + "%";

  } catch (err) {
    console.error("Analytics error", err);
  }
}








document.addEventListener("DOMContentLoaded", () => {
  const signupBtn = document.getElementById("signupBtn");

  if (signupBtn) {
    signupBtn.addEventListener("click", () => {
      console.log("Signup button clicked ✅");
      signup();
    });
  }
});




function playSuccessSound() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(800, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.2);

  gain.gain.setValueAtTime(0.2, ctx.currentTime);

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.3);
}









