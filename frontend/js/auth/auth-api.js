console.log("AUTH API LOADED ✅");

async function authPost(url, data) {

  try {

    const res = await fetch(
      `${API}${url}`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(data)
      }
    );

    return await res.json();

  } catch (err) {

    console.error(
      "AUTH POST ERROR:",
      err
    );

    return {
      success: false,
      message:
        "Backend not reachable"
    };
  }
}

window.authPost = authPost;