async function signup() {

  try {

    const name =
      document.getElementById("name").value.trim();

    const email =
      document.getElementById("email").value.trim();

    const password =
      document.getElementById("password").value;

    if (
      !name ||
      !email ||
      !password
    ) {

      alert("Fill all fields");

      return;
    }

    const data =
      await authPost(
        "signup",
        {
          name,
          email,
          password
        }
      );

    console.log(data);

    if (data.success) {

      alert("Signup success ✅");

      window.location.href =
        "login.html";

    } else {

      alert(
        data.message ||
        "Signup failed"
      );

    }

  } catch (err) {

    console.error(err);

    alert("Server error");

  }

}