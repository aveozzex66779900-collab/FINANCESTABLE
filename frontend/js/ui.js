function showToast(message, type = "success") {
  const toast = document.createElement("div");

  toast.innerText = message;
  toast.className = `toast ${type}`;

  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 10);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}