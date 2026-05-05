console.log(
  "SIGNUP JS LOADED ✅"
);

document
.addEventListener(
  "DOMContentLoaded",
  () => {

    const signupBtn =
      document.getElementById(
        "signupBtn"
      );

    if (!signupBtn) {

      console.error(
        "signupBtn not found"
      );

      return;
    }

    signupBtn
    .addEventListener(
      "click",
      signup
    );

  }
);

async function signup() {

  try {

    const name =
      document
      .getElementById(
        "name"
      )
      ?.value;

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

    const res =
      await fetch(

        `${API}/api/auth/signup`,

        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            name,
            email,
            password

          })

        }

      );

    const data =
      await res.json();

    console.log(data);

    if (data.success) {

      alert(
        "Signup success ✅"
      );

      window.location.href =
        "./login.html";

    }

    else {

      alert(
        data.message ||
        "Signup failed"
      );

    }

  }

  catch (err) {

    console.error(err);

    alert(
      "Signup error"
    );

  }

}