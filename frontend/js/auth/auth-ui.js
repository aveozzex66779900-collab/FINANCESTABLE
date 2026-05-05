function showAuthError(message) {

  const errorBox =
    document.getElementById("authError");

  if (!errorBox) {

    alert(message);
    return;

  }

  errorBox.innerText = message;

  errorBox.style.display = "block";

}

function clearAuthError() {

  const errorBox =
    document.getElementById("authError");

  if (!errorBox) return;

  errorBox.innerText = "";

  errorBox.style.display = "none";

}

function showAuthSuccess(message) {

  const successBox =
    document.getElementById("authSuccess");

  if (!successBox) {

    alert(message);
    return;

  }

  successBox.innerText = message;

  successBox.style.display = "block";

}

function togglePassword(inputId) {

  const input =
    document.getElementById(inputId);

  if (!input) return;

  input.type =
    input.type === "password"
      ? "text"
      : "password";

}

function startButtonLoading(buttonId) {

  const btn =
    document.getElementById(buttonId);

  if (!btn) return;

  btn.disabled = true;

  btn.innerText = "Loading...";

}

function stopButtonLoading(
  buttonId,
  originalText
) {

  const btn =
    document.getElementById(buttonId);

  if (!btn) return;

  btn.disabled = false;

  btn.innerText = originalText;

}