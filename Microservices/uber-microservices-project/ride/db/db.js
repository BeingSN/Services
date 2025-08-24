const mongoose = require("mongoose");

const connect = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.error(
        "❌ MongoDB connection error: MONGO_URI is not defined in .env"
      );
      throw new Error("MONGO_URI is not defined in .env");
    }

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
};

module.exports = connect;
