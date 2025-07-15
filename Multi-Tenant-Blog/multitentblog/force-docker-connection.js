import { Client } from "pg";

async function forceDockerConnection() {
  // Get the Docker container IP
  console.log("Checking Docker container details...");

  // Test connection using Docker container IP instead of localhost
  const client = new Client({
    host: "127.0.0.1", // Explicitly use 127.0.0.1 instead of localhost
    port: 5433, // Use port 5433 to match your DATABASE_URL
    database: "postgres",
    user: "postgres",
    password: "postgres",
    // Add connection timeout
    connectionTimeoutMillis: 5000,
  });

  try {
    console.log("Attempting connection to 127.0.0.1:5433...");
    await client.connect();
    console.log("✅ Connected successfully!");

    // Check what user we're connected as
    const userResult = await client.query(
      "SELECT current_user, current_database()"
    );
    console.log("Connected as user:", userResult.rows[0].current_user);
    console.log("Connected to database:", userResult.rows[0].current_database);

    // List all roles
    const rolesResult = await client.query(
      "SELECT rolname, rolcanlogin FROM pg_roles ORDER BY rolname"
    );
    console.log("Available roles:", rolesResult.rows);

    await client.end();
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
    console.error("Error details:", error);
  }
}

// Also test what happens when we try different connection methods
async function testAlternativeConnections() {
  console.log("\n--- Testing alternative connection methods ---");

  // Test 1: Try connecting to different databases
  const databases = ["postgres", "template1"];

  for (const db of databases) {
    console.log(`\nTrying database: ${db} on port 5433`);
    const client = new Client({
      host: "127.0.0.1",
      port: 5433, // Use port 5433
      database: db,
      user: "postgres",
      password: "postgres",
    });

    try {
      await client.connect();
      console.log(`✅ Connected to ${db}!`);
      await client.end();
      break; // If we succeed, we found a working database
    } catch (error) {
      console.error(`❌ Failed to connect to ${db}:`, error.message);
    }
  }
}

forceDockerConnection();
testAlternativeConnections();
