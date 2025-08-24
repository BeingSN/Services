const express = require("express");
const morgan = require("morgan");

const app = express();

// Morgan middleware
app.use(morgan("dev"));

app.get("/", (req, res) => {
  for (let i = 0; i < 10000000; i++) {} // just a delay
  res.send("Hello world");
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
