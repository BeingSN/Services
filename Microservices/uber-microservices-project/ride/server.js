const app = require("./app");
const connectDB = require("./db/db");
const rabbitMq = require("./service/rabbit");
const PORT = process.env.PORT || 3003;

const startServer = async () => {
  try {
    // Connect Mongo
    await connectDB();
    console.log("✅ Ride MongoDB connected Successfully");

    // Connect RabbitMQ
    await rabbitMq.connect();
    console.log("✅ Connected to RabbitMQ");

    // Start Express
    app.listen(PORT, () => {
      console.log(`🚀 Ride service is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
  }
};

startServer();
