const cors = require("cors");
const WebSocket = require("ws");
const express = require("express");

let finnihubdata = {};

function connectSocket() {
  let socket = new WebSocket("wss://ws.finnhub.io?token=btunjb748v6q25697fng");

  function subscribe(symbol) {
    return JSON.stringify({ type: "subscribe", symbol });
  }

  // Connection opened -> Subscribe
  socket.addEventListener("open", function (event) {
    // cryptos - hitbtc
    socket.send(subscribe("HITBTC:BTCUSD"));
    socket.send(subscribe("HITBTC:ETHUSD"));
    socket.send(subscribe("HITBTC:TRXUSD"));
    socket.send(subscribe("HITBTC:XRPUSD"));
    socket.send(subscribe("HITBTC:ZECUSD"));
    socket.send(subscribe("HITBTC:LTCUSD"));
    socket.send(subscribe("HITBTC:NEOUSD"));
    socket.send(subscribe("HITBTC:ADAUSD"));
    socket.send(subscribe("HITBTC:ONTUSD"));
    socket.send(subscribe("HITBTC:OMGUSD"));
    socket.send(subscribe("HITBTC:BNBUSD"));
    socket.send(subscribe("HITBTC:XLMUSD"));
    socket.send(subscribe("HITBTC:EOSUSD"));
    socket.send(subscribe("HITBTC:DASHUSD"));
    socket.send(subscribe("HITBTC:QTUMUSD"));
    socket.send(subscribe("HITBTC:IOTAUSD"));

    // cryptos - binance
    // socket.send(subscribe("BINANCE:BTCUSDT"));
    // socket.send(subscribe("BINANCE:ETHUSDT"));
    // socket.send(subscribe("BINANCE:TRXUSDT"));
    // socket.send(subscribe("BINANCE:XRPUSDT"));
    // socket.send(subscribe("BINANCE:ZECUSDT"));
    // socket.send(subscribe("BINANCE:LTCUSDT"));
    // socket.send(subscribe("BINANCE:NEOUSDT"));
    // socket.send(subscribe("BINANCE:ADAUSDT"));
    // socket.send(subscribe("BINANCE:ONTUSDT"));
    // socket.send(subscribe("BINANCE:OMGUSDT"));
    // socket.send(subscribe("BINANCE:BNBUSDT"));
    // socket.send(subscribe("BINANCE:XLMUSDT"));
    // socket.send(subscribe("BINANCE:EOSUSDT"));
    // socket.send(subscribe("BINANCE:DASHUSDT"));
    // socket.send(subscribe("BINANCE:QTUMUSDT"));
    // socket.send(subscribe("BINANCE:IOTAUSDT"));

    // stocks
    socket.send(subscribe("AAPL"));
    socket.send(subscribe("AMZN"));
    socket.send(subscribe("MSFT"));

    socket.send(subscribe("FB"));
    socket.send(subscribe("AMD"));
    socket.send(subscribe("TSLA"));
    socket.send(subscribe("NVDA"));
    socket.send(subscribe("ZM"));
    socket.send(subscribe("NLFX"));
    socket.send(subscribe("TWTR"));
    socket.send(subscribe("PYPL"));
    socket.send(subscribe("GOOGL"));
    socket.send(subscribe("V"));
    socket.send(subscribe("MA"));
    socket.send(subscribe("NKE"));
    socket.send(subscribe("ADBE"));

    // forex - aud
    socket.send(subscribe("OANDA:AUD_USD"));
    socket.send(subscribe("OANDA:AUD_JPY"));
    socket.send(subscribe("OANDA:AUD_CHF"));
    socket.send(subscribe("OANDA:AUD_CAD"));

    // forex - eur
    socket.send(subscribe("OANDA:EUR_USD"));
    socket.send(subscribe("OANDA:EUR_JPY"));
    socket.send(subscribe("OANDA:EUR_CHF"));
    socket.send(subscribe("OANDA:EUR_CAD"));

    //   forex - gbp
    socket.send(subscribe("OANDA:GBP_USD"));
    socket.send(subscribe("OANDA:GBP_JPY"));
    socket.send(subscribe("OANDA:GBP_CHF"));
    socket.send(subscribe("OANDA:GBP_CAD"));

    // forex - usd
    socket.send(subscribe("OANDA:USD_JPY"));
    socket.send(subscribe("OANDA:NZD_CHF"));
    socket.send(subscribe("OANDA:USD_CAD"));
    socket.send(subscribe("OANDA:NZD_CAD"));
  });

  // Listen for messages
  socket.addEventListener("message", function ({ data }) {
    data = JSON.parse(data);

    if (data.type == "trade") {
      const { s } = data.data[0];

      if (s.startsWith("BINANCE")) {
        const symbol = s.substring(8, s.length);
        finnihubdata[symbol] = data.data[0].p;
        console.log(symbol, data.data[0].p);
      } else if (s.startsWith("OANDA")) {
        const symbol = s.substring(6, s.length).replace("_", "");
        finnihubdata[symbol] = data.data[0].p;
        console.log(symbol, data.data[0].p);
      } else if (s.startsWith("HITBTC")) {
        const symbol = s.substring(7, s.length) + "T";
        finnihubdata[symbol] = data.data[0].p;
      } else {
        finnihubdata[s] = data.data[0].p;
        console.log(s, data.data[0].p);
      }
    }
  });

  // disconnect
  socket.addEventListener("close", () => {
    console.log("connection closed");
    setTimeout(() => {
      connectSocket();
    }, 3000);
  });

  // error
  socket.addEventListener("error", (e) => {
    console.log("error occured ", e);
  });
}

connectSocket();

const app = express();

app.use(cors());

app.get("*", (request, response) => {
  return response.json(finnihubdata);
});

app.listen(process.env.PORT || 1027, () => {
  console.log("server running");
});
