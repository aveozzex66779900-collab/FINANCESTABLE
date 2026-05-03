const ws = new WebSocket(
  "ws://localhost:5000"
);

ws.onmessage = (event)=>{

  const data =
  JSON.parse(event.data);

  if(data.type==="MARKET"){

    document.getElementById(
      "btcPrice"
    ).innerHTML =

    `BTC Price:
    $${data.btc.price}`;
  }
};

async function buyCoin(){

  const amount =
  document.getElementById(
    "buyAmount"
  ).value;

  const res = await fetch(`${API}/api/exchange/buy`,

    {

      method:"POST",

      headers:{
        "Content-Type":
        "application/json"
      },

      body:JSON.stringify({
        amount
      })
    }
  );

  const data =
  await res.json();

  alert("Trade Executed ✅");
}