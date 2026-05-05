



console.log(
  "SIGNUP JS LOADED ✅"
);

window.signupRunning = false;

document
.addEventListener(
  "DOMContentLoaded",
  () => {

    const btn =
      document.getElementById(
        "signupBtn"
      );

    if (!btn) {

      console.error(
        "signupBtn not found"
      );

      return;
    }

    btn.onclick = signup;

  }
);

async function signup() {

  if (
    window.signupRunning
  ) return;

  window.signupRunning = true;

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

    console.log({
      name,
      email
    });

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

  finally {

    window.signupRunning =
      false;

  }

}