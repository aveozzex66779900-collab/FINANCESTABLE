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