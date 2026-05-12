async function askAI() {

  try {

    const input =
      document.getElementById("question");

    const message = input.value;

    const response = await fetch(
      `${API}/api/ai-support`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({
          message
        })
      }
    );

    const data =
      await response.json();

    alert(
      data.reply ||
      "No response"
    );

  } catch (error) {

    console.error(
      "AI SUPPORT ERROR:",
      error
    );

    alert(
      "AI support unavailable"
    );
  }
}

window.askAI = askAI;