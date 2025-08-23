const app = require("./app");
const connectDB = require("./db/db");
const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    await connectDB(); // ⬅ wait for DB connection here
    app.listen(PORT, () => {
      console.log(`🚀 User service is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
  }
};

startServer();
