// server.js
require("dotenv").config(); // <-- load env first

const app = require("./app");
const connectDB = require("./db/db");
const rabbitMq = require("./service/rabbit");
const PORT = process.env.PORT || 3002;

const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ Captain MongoDB connected successfully");

    await rabbitMq.connect();
    console.log("✅ Connected to RabbitMQ");

    app.listen(PORT, () => {
      console.log(`🚀 captain service is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
  }
};

startServer();
