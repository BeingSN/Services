const express = require("express");
const path = require("path");
const { Pool } = require("pg");
const cors = require("cors");
const DatabaseMigrations = require("./db/migrations");

const app = express();
const PORT = process.env.PORT || 5000;

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "pracdb",
  user: process.env.DB_USER || "pracuser",
  password: process.env.DB_PASSWORD || "pracpassword",
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// Create PostgreSQL connection pool
const pool = new Pool(dbConfig);

// Initialize migrations
const migrations = new DatabaseMigrations(pool);

// Database connection and migration function
const initializeDatabase = async () => {
  let retries = 5;

  while (retries > 0) {
    try {
      console.log("🔗 Attempting to connect to database...");
      const client = await pool.connect();
      const result = await client.query("SELECT NOW()");
      console.log("✅ Database connected successfully at:", result.rows[0].now);
      client.release();

      // Run migrations after successful connection
      await migrations.runMigrations();

      return true;
    } catch (err) {
      console.error(`❌ Database connection failed: ${err.message}`);
      retries--;

      if (retries > 0) {
        console.log(`🔄 Retrying in 5 seconds... (${retries} attempts left)`);
        await new Promise((resolve) => setTimeout(resolve, 5000));
      } else {
        console.error(
          "💥 Failed to connect to database after multiple attempts"
        );
        throw err;
      }
    }
  }
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get("/api/health", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      "SELECT NOW() as time, version() as version"
    );
    client.release();

    res.json({
      status: "healthy",
      database: "connected",
      timestamp: result.rows[0].time,
      postgres_version: result.rows[0].version,
    });
  } catch (err) {
    res.status(500).json({
      status: "unhealthy",
      database: "disconnected",
      error: err.message,
    });
  }
});

// Sample API routes
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from server!" });
});

// Get all users
app.get("/api/users", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM users ORDER BY id");
    client.release();

    res.json({
      success: true,
      users: result.rows,
    });
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// Get all posts with user information
app.get("/api/posts", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(`
      SELECT 
        p.id, 
        p.title, 
        p.content, 
        p.created_at,
        u.name as author_name,
        u.email as author_email
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `);
    client.release();

    res.json({
      success: true,
      posts: result.rows,
    });
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// Create user route
app.post("/api/users", async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      error: "Name and email are required",
    });
  }

  try {
    const client = await pool.connect();
    const result = await client.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [name, email]
    );
    client.release();

    res.status(201).json({
      success: true,
      user: result.rows[0],
    });
  } catch (err) {
    console.error("Database insert error:", err);

    if (err.code === "23505") {
      // Unique violation
      res.status(409).json({
        success: false,
        error: "Email already exists",
      });
    } else {
      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }
});

// Create post route
app.post("/api/posts", async (req, res) => {
  const { title, content, user_id } = req.body;

  if (!title || !user_id) {
    return res.status(400).json({
      success: false,
      error: "Title and user_id are required",
    });
  }

  try {
    const client = await pool.connect();
    const result = await client.query(
      "INSERT INTO posts (title, content, user_id) VALUES ($1, $2, $3) RETURNING *",
      [title, content, user_id]
    );
    client.release();

    res.status(201).json({
      success: true,
      post: result.rows[0],
    });
  } catch (err) {
    console.error("Database insert error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// Handle specific API routes instead of using wildcards
app.use("/api", (req, res) => {
  res.status(404).json({ error: "API route not found" });
});

// Serve static files
const staticPath = path.join(__dirname, "../client/build");
app.use(express.static(staticPath));

// Handle React routing - use a more specific approach
app.get(["/", "/home", "/about", "/contact"], (req, res) => {
  res.sendFile(path.join(staticPath, "index.html"));
});

// Fallback for any other routes
app.use((req, res) => {
  // Check if it's requesting a file (has extension)
  if (path.extname(req.path)) {
    res.status(404).send("File not found");
  } else {
    // Assume it's a React route
    res.sendFile(path.join(staticPath, "index.html"));
  }
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Received SIGINT. Closing database connections...");
  await pool.end();
  console.log("Database connections closed.");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Received SIGTERM. Closing database connections...");
  await pool.end();
  console.log("Database connections closed.");
  process.exit(0);
});

// Start server with database initialization
const startServer = async () => {
  try {
    // Initialize database and run migrations
    await initializeDatabase();

    // Start the server
    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
      console.log("🚀 All systems ready!");
    });
  } catch (error) {
    console.error("💥 Failed to start server:", error);
    process.exit(1);
  }
};

// Start the application
startServer();
