console.log("✅ AUTH SAFE LOADED");

const API =
  "http://localhost:5000";



// =======================
// SIGNUP
// =======================

async function signupSafe() {

  try {

    const name =
      document.getElementById("signup-name")?.value?.trim();

    const email =
      document.getElementById("signup-email")?.value?.trim();

    const password =
      document.getElementById("signup-password")?.value;



    console.log("🚀 Signup Data:", {
      name,
      email
    });



    if (!name || !email || !password) {

      alert("Fill all fields");

      return;
    }



    const response = await fetch(

      `${API}/api/auth/signup`,

      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          name,
          email,
          password
        })
      }

    );



    const data =
      await response.json();



    console.log("✅ Signup Response:", data);



    if (!data.success) {

      alert(data.message || "Signup failed");

      return;
    }



    // save token
    localStorage.setItem(
      "token",
      data.token
    );



    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );



    alert("Signup success");



    window.location.href =
      "./dashboard.html";

  }

  catch (err) {

    console.error(
      "❌ SIGNUP ERROR:",
      err
    );

    alert("Signup crashed");

  }

}



// =======================
// LOGIN
// =======================

async function loginSafe() {

  try {

    const email =
      document.getElementById("login-email")?.value?.trim();

    const password =
      document.getElementById("login-password")?.value;



    console.log("🚀 Login Data:", {
      email
    });



    if (!email || !password) {

      alert("Fill all fields");

      return;
    }



    const response = await fetch(

      `${API}/api/auth/login`,

      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          email,
          password
        })
      }

    );



    const data =
      await response.json();



    console.log("✅ Login Response:", data);



    if (!data.success) {

      alert(data.message || "Login failed");

      return;
    }



    // save token
    localStorage.setItem(
      "token",
      data.token
    );



    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );



    alert("Login success");



    window.location.href =
      "./dashboard.html";

  }

  catch (err) {

    console.error(
      "❌ LOGIN ERROR:",
      err
    );

    alert("Login crashed");

  }

}

window.signupSafe = signupSafe;
window.loginSafe = loginSafe;