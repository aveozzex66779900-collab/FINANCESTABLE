console.log("AUTH API LOADED ✅");

async function authPost(url, data) {

  try {

    const response = await fetch(
      `${API}${url}`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(data)
      }
    );

    return await response.json();

  } catch (error) {

    console.error(
      "AUTH API ERROR:",
      error
    );

    return {
      success: false,
      message:
        "Backend not reachable"
    };
  }
}

window.authPost = authPost;


/* =========================
   LOGIN FUNCTION
========================= */

async function login() {

  try {

    const email =
      document.getElementById("email").value;

    const password =
      document.getElementById("password").value;

    console.log(
      "LOGIN ATTEMPT:",
      email
    );

    if (!email || !password) {

      alert("Please enter email and password");

      return;
    }

    // Demo local login
    localStorage.setItem(
      "financestable_user",
      JSON.stringify({
        email,
        loggedIn: true
      })
    );

    alert("Login successful ✅");

    window.location.href =
      "./dashboard.html";

  } catch (error) {

    console.error(
      "LOGIN ERROR:",
      error
    );

    alert("Login failed");
  }
}

/* GLOBAL ACCESS */
window.login = login;