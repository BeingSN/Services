import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

async function quickTest() {
  console.log("DATABASE_URL:", process.env.DATABASE_URL);

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log("✅ Connected to PostgreSQL!");

    // Check if any tables exist
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `);

    console.log("Tables in database:", result.rows);

    if (result.rows.length === 0) {
      console.log(
        "⚠️  No tables found! You need to run 'npm run db:push' first."
      );
    } else {
      // Check the blogs table structure
      const blogsInfo = await client.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'blogs' AND table_schema = 'public';
      `);
      console.log("Blogs table columns:", blogsInfo.rows);
    }
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
  } finally {
    await client.end();
  }
}

quickTest();
