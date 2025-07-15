import "dotenv/config";
import { Client } from "pg";

async function debugConnection() {
  console.log("DATABASE_URL from env:", process.env.DATABASE_URL);

  // Test 1: Using connection string
  console.log("\n--- Test 1: Using connection string ---");
  const client1 = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client1.connect();
    console.log("✅ Connection string worked!");
    await client1.end();
  } catch (error) {
    console.error("❌ Connection string failed:", error.message);
  }

  // Test 2: Using individual parameters
  console.log("\n--- Test 2: Using individual parameters ---");
  const client2 = new Client({
    host: "localhost",
    port: 5432,
    database: "postgres",
    user: "postgres",
    password: "postgres",
  });

  try {
    await client2.connect();
    console.log("✅ Individual parameters worked!");

    // Test a simple query
    const result = await client2.query("SELECT current_user, version()");
    console.log("Current user:", result.rows[0].current_user);
    console.log(
      "PostgreSQL version:",
      result.rows[0].version.split(" ")[0] +
        " " +
        result.rows[0].version.split(" ")[1]
    );

    await client2.end();
  } catch (error) {
    console.error("❌ Individual parameters failed:", error.message);
  }

  // Test 3: Check what users exist
  console.log("\n--- Test 3: Check existing users ---");
  const client3 = new Client({
    host: "localhost",
    port: 5432,
    database: "postgres",
    user: "postgres",
    password: "postgres",
  });

  try {
    await client3.connect();
    const users = await client3.query("SELECT rolname FROM pg_roles;");
    console.log(
      "Available roles:",
      users.rows.map((row) => row.rolname)
    );
    await client3.end();
  } catch (error) {
    console.error("❌ Could not list users:", error.message);
  }
}

debugConnection();
