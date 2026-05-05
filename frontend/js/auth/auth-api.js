console.log(
  "AUTH API LOADED ✅"
);

document
.addEventListener(
  "DOMContentLoaded",
  () => {

    const loginBtn =
      document.getElementById(
        "loginBtn"
      );

    if (!loginBtn) {

      console.error(
        "❌ loginBtn not found"
      );

      return;
    }

    loginBtn
    .addEventListener(
      "click",
      loginUser
    );

  }
);

async function loginUser() {

  try {

    const email =
      document
      .getElementById(
        "email"
      )
      ?.value;

    const password =
      document
      .getElementById(
        "password"
      )
      ?.value;

    console.log({
      email,
      password
    });

    const res =
      await fetch(

        `${API}/api/auth/login`,

        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            email,
            password

          })

        }

      );

    const data =
      await res.json();

    console.log(data);

    if (data.success) {

      localStorage.setItem(
        "user",
        JSON.stringify(
          data.user
        )
      );

      alert(
        "Login success ✅"
      );

      window.location.href =
        "./dashboard.html";

    }

    else {

      alert(
        data.message ||
        "Login failed"
      );

    }

  }

  catch (err) {

    console.error(err);

    alert(
      "Login error"
    );

  }

}