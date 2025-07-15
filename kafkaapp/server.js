const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const { kafka } = require("./client");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(express.json());
app.use(express.static("public"));

// Kafka Producer
let producer;

// Initialize Kafka Producer
async function initProducer() {
  producer = kafka.producer();
  await producer.connect();
  console.log("✅ Kafka Producer connected");
}

// Initialize Kafka Consumer
async function initConsumer() {
  const consumer = kafka.consumer({ groupId: "websocket-group" });
  await consumer.connect();
  console.log("✅ Kafka Consumer connected");

  await consumer.subscribe({ topics: ["rider-updates"], fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const messageData = {
        topic,
        partition,
        offset: message.offset,
        key: message.key?.toString(),
        value: message.value.toString(),
        timestamp: new Date().toISOString(),
      };

      console.log(`📨 Message received from Kafka:`, messageData);

      // Broadcast to all connected WebSocket clients
      io.emit("kafka-message", messageData);
    },
  });
}

// WebSocket connection handling
io.on("connection", (socket) => {
  console.log(`🔗 Client connected: ${socket.id}`);

  // Send welcome message
  socket.emit("status", {
    message: "Connected to Kafka-WebSocket server",
    clientId: socket.id,
    timestamp: new Date().toISOString(),
  });

  // Handle client disconnect
  socket.on("disconnect", () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });

  // Handle custom events from client
  socket.on("request-status", () => {
    socket.emit("status", {
      message: "Server is running",
      connectedClients: io.engine.clientsCount,
      timestamp: new Date().toISOString(),
    });
  });
});

// REST API Routes

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    connectedClients: io.engine.clientsCount,
  });
});

// Send message via API
app.post("/api/send-message", async (req, res) => {
  try {
    const { topic = "rider-updates", key, value } = req.body;

    if (!value) {
      return res.status(400).json({ error: "Message value is required" });
    }

    const message = {
      key: key || `key-${Date.now()}`,
      value: typeof value === "string" ? value : JSON.stringify(value),
    };

    await producer.send({
      topic,
      messages: [message],
    });

    res.json({
      success: true,
      message: "Message sent to Kafka",
      data: { topic, ...message },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error sending message:", error);
    res.status(500).json({
      error: "Failed to send message",
      details: error.message,
    });
  }
});

// Get all topics
app.get("/api/topics", async (req, res) => {
  try {
    const admin = kafka.admin();
    await admin.connect();
    const topics = await admin.listTopics();
    await admin.disconnect();

    res.json({ topics });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve the demo client page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Error handling
process.on("unhandledRejection", (error) => {
  console.error("❌ Unhandled rejection:", error);
});

process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down server...");
  if (producer) {
    await producer.disconnect();
  }
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});

// Start server
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await initProducer();
    await initConsumer();

    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📡 WebSocket server ready for connections`);
      console.log(`🔄 Kafka consumer listening for messages`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
