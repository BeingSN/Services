// app.js
const express = require("express");
const app = express();
const captainRoutes = require("./routes/captain.routes");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/", captainRoutes);

module.exports = app;
