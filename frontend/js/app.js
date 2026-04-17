console.log("APP JS LOADED ✅");

// 🔴 Catch ALL hidden JS errors
window.onerror = function (msg, url, line, col, error) {
  console.error("❌ GLOBAL ERROR:", { msg, url, line, col, error });
};

window.onunhandledrejection = function (event) {
  console.error("❌ PROMISE ERROR:", event.reason);
};
/* ================= LOGIN ================= */
   




async function loginUser(email, password) {
  try {
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    console.log("LOGIN RESPONSE:", data);

    if (data.success) {
      localStorage.setItem("role", data.role);
      localStorage.setItem("email", email);

      alert("Login Success ✅");

      if (data.role === "admin") {
        window.location.href = "admin.html";
      } else {
        window.location.href = "dashboard.html";
      }

    } else {
      alert("Access Denied ❌");
    }

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    alert("Server Error ❌");
  }
}
/* ================= SIGNUP ================= */
async function signup(){
  const msg = document.getElementById("msg");

  try{
    const res = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: document.getElementById("name")?.value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
      })
    });

    const data = await res.json();

    if(data.success){
      alert("Signup Success ✅");
      window.location = "login.html";
    } else {
      msg.innerText = data.message || "Signup failed";
    }

  }catch(err){
    console.error(err);
    msg.innerText = "Server error ❌";
  }
}
/* ================= UPI PAYMENT ================= */





async function payUPI() {
  const upi = document.getElementById("upiId").value;
  const amount = document.getElementById("amount").value;

  if (!upi || !amount) {
    alert("Enter UPI ID and Amount");
    return;
  }

  alert("Payment Processing...");

  try {
    const res = await fetch("http://localhost:5000/api/transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      
      


body: JSON.stringify({
  email: localStorage.getItem("email"),
  amount: amount,
  method: "UPI",        // ✅ ADD
  status: "success"     // ✅ ADD
})
    });

    const data = await res.json();

    if (data.success) {
      alert("Payment Success ✅");
      
    }

  } catch (err) {
    console.error("Error:", err);
  }
}

window.payUPI = payUPI;

/* ================= CARD PAYMENT ================= */
async function payCard(){
  try {
    const res = await fetch(API + "/pay-card", {
      method: "POST"
    });

    const data = await res.json();

    alert("Card Payment Success 💳");
    window.location.href = "success.html";

  } catch(err){
    console.error(err);
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







async function loadUsers() {
  const res = await fetch("http://localhost:5000/admin/users");
  const users = await res.json();

  console.log("USERS:", users);

  const list = document.getElementById("userList");

  if (!list) {
    console.error("❌ userList not found in HTML");
    return;
  }

  list.innerHTML = "";

  users.forEach(u => {
    list.innerHTML += `
      <div style="border:1px solid #444; margin:5px; padding:8px;">
        <p><b>${u.email}</b></p>
        <p>Role: ${u.role || "user"}</p>
      </div>
    `;
  });
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
async function loadTransactions() {
  console.log("🚀 loadTransactions START");

  try {
    const email = localStorage.getItem("email");

    console.log("📧 EMAIL FROM STORAGE:", email);

    if (!email) {
      console.warn("⚠️ No email found in localStorage");
      return;
    }

    const url = `http://localhost:5000/api/transactions?email=${email}`;
    console.log("🌐 FETCH URL:", url);

    const res = await fetch(url);

    console.log("📡 RESPONSE STATUS:", res.status);

    if (!res.ok) {
      console.error("❌ API FAILED:", res.status);
      return;
    }

    const data = await res.json();

    console.log("📦 DATA RECEIVED:", data);

    if (!Array.isArray(data)) {
      console.error("❌ DATA NOT ARRAY:", data);
      return;
    }

    const list = document.getElementById("userList");

    console.log("📦 DOM ELEMENT:", list);

    if (!list) {
      console.error("❌ userList NOT FOUND in HTML");
      return;
    }

    list.innerHTML = "";

    if (data.length === 0) {
      list.innerHTML = "<p>No transactions found</p>";
      console.warn("⚠️ No transactions");
      return;
    }

    data.forEach((tx, index) => {
      console.log(`➡️ TX ${index}:`, tx);

      const div = document.createElement("div");
      div.style.border = "1px solid #444";
      div.style.margin = "5px";
      div.style.padding = "5px";

      div.innerText =
        `${tx.email} | ₹${tx.amount} | ${tx.status || "success"}`;

      list.appendChild(div);
    });

    console.log("✅ UI UPDATED SUCCESSFULLY");

  } catch (err) {
    console.error("🔥 LOAD TX CRASH:", err);
  }
}











  



  
/* ================= B2B PAYMENT ================= */
async function sendB2B(){
  try {
    const res = await fetch(API + "/b2b", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        company: "Client A",
        amount: 5000
      })
    });

    const data = await res.json();

    alert("B2B Payment Sent ✅");

  } catch(err){
    console.error(err);
  }
}

/* ================= AI ADVICE ================= */
async function getAdvice(){
  try {
    const res = await fetch(API + "/ai-advice");
    const data = await res.json();

    alert(data.advice || "Invest wisely 📊");

  } catch(err){
    console.error(err);
  }
}






async function runAISecurity(){
  const status = document.getElementById("aiStatus");

  try{
    const res = await fetch("http://localhost:5000/api/ai-security");
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
async function runAISecurity(){
  const status = document.getElementById("aiStatus");

  try{
    const res = await fetch("http://localhost:5000/ai-security");
    const data = await res.json();

    if(status){
      status.innerText = data.risk === "low"
        ? "✅ Safe Login"
        : "⚠️ High Risk";
    }

    return data.risk;

  }catch{
    if(status) status.innerText = "❌ AI failed";
    return "low";
  }
}

















async function payCrypto() {
  const crypto = document.getElementById("cryptoType")?.value;
  const amount = document.getElementById("cryptoAmount")?.value;
  const email = localStorage.getItem("email");

  console.log("CRYPTO:", crypto);
  console.log("AMOUNT:", amount);

  if (!crypto || crypto === "") {
    alert("Select crypto ❌");
    return;
  }

  if (!amount || amount <= 0) {
    alert("Enter valid amount ❌");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        amount,
        type: crypto,
        status: "success"
      })
    });

    const data = await res.json();

    console.log("CRYPTO PAYMENT RESPONSE:", data);

    alert("Crypto Payment Success ✅");

    loadTransactions(); // 🔥 refresh UI

  } catch (err) {
    console.error(err);
    alert("Payment Failed ❌");
  }
}
async function adminLogin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("http://localhost:5000/login", {
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
async function loadUsers() {
  const res = await fetch("http://localhost:5000/admin/users");
  const users = await res.json();

  
  const list = document.getElementById("userList");

if (!list) return; // ✅ prevent crash

list.innerHTML = "";
  users.forEach(u => {
    list.innerHTML += `
      <div>
        ${u.email} (${u.role}) 
        ${u.isBlocked ? "🚫 BLOCKED" : ""}
        
        <button onclick="blockUser('${u._id}')">Block</button>
        <button onclick="unblockUser('${u._id}')">Unblock</button>
        <button onclick="deleteUser('${u._id}')">Delete</button>
      </div>
    `;
  });
}


async function addUser() {
  const email = document.getElementById("newEmail").value;
  const password = document.getElementById("newPassword").value;

  const res = await fetch("http://localhost:5000/admin/add-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  console.log("ADD USER RESPONSE:", data);

  if (data.success) {
    alert("✅ User Added");
    loadUsers();
  } else {
    alert("❌ " + (data.message || "Failed"));
  }
}
async function blockUser(id) {
  await fetch("http://localhost:5000/admin/block-user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  });

  loadUsers();
}

async function unblockUser(id) {
  await fetch("http://localhost:5000/admin/unblock-user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  });

  loadUsers();
}

async function deleteUser(id) {
  await fetch("http://localhost:5000/admin/delete-user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  });

  loadUsers();
}



// AUTO LOAD ADMIN USERS
if (window.location.pathname.includes("admin.html")) {
  loadUsers();
}

window.addEventListener("load", () => {
  if (
    window.location.pathname.includes("dashboard.html") ||
    window.location.pathname.includes("pay.html")
  ) {
    loadTransactions();
  }
});
window.addEventListener("load", () => {
  loadTransactions();
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
  loadUsers();
}