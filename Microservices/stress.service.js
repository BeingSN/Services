const express = require("express");

const app = express();

const morgan = require("morgan");

app.use(morgan("dev"));

app.get("/stressTest", (req, res) => {
  for (let i = 0; i < 10000000; i++) {} // just a delay
  res.send("Hello world");
});

app.listen(3002, () => {
  console.log("stress service is running on port 3002 ");
});
