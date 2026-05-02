console.log("ADMIN USERS MODULE LOADED ✅");

async function isolatedLoadUsers() {

  try {

    const response = await fetch(
      "http://localhost:5000/admin/users"
    );

    const data = await response.json();

    console.log("USERS RESPONSE:", data);

    const table = document.getElementById(
      "isolatedUsersTable"
    );

    if (!table) {
      console.log("TABLE NOT FOUND");
      return;
    }

    table.innerHTML = "";

    if (!data.users || data.users.length === 0) {

      table.innerHTML = `
        <tr>
          <td colspan="4">
            No Users Found
          </td>
        </tr>
      `;

      return;
    }

    data.users.forEach((user) => {

      table.innerHTML += `
        <tr>
          <td>${user.email || "-"}</td>
          <td>${user.role || "user"}</td>
          <td>${user.upi || "-"}</td>
          <td>
            <button class="action-btn">
              View
            </button>
          </td>
        </tr>
      `;

    });

  } catch (error) {

    console.log(
      "ISOLATED USERS ERROR:",
      error
    );

  }

}

window.addEventListener("load", () => {

  isolatedLoadUsers();

});