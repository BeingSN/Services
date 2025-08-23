const express = require("express");
const app = express();
const userRoutes = require("./routes/user.routes");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/", userRoutes);

module.exports = app;
