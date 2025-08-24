require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const rideRoutes = require("./routes/ride.routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", rideRoutes);

module.exports = app;
