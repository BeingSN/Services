// db/migrations.js
const { Pool } = require("pg");

class DatabaseMigrations {
  constructor(pool) {
    this.pool = pool;
  }

  async runMigrations() {
    console.log("🔄 Starting database migrations...");

    try {
      // Create migrations tracking table first
      await this.createMigrationsTable();

      // Run all migrations in order
      await this.migration001_createUsersTable();
      await this.migration002_createPostsTable();
      await this.migration003_insertSampleData();

      console.log("✅ All database migrations completed successfully!");
    } catch (error) {
      console.error("❌ Migration failed:", error);
      throw error;
    }
  }

  async createMigrationsTable() {
    const client = await this.pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS migrations (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) UNIQUE NOT NULL,
          executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log("📋 Migrations tracking table ready");
    } finally {
      client.release();
    }
  }

  async hasMigrationRun(migrationName) {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        "SELECT 1 FROM migrations WHERE name = $1",
        [migrationName]
      );
      return result.rows.length > 0;
    } finally {
      client.release();
    }
  }

  async markMigrationComplete(migrationName) {
    const client = await this.pool.connect();
    try {
      await client.query(
        "INSERT INTO migrations (name) VALUES ($1) ON CONFLICT (name) DO NOTHING",
        [migrationName]
      );
    } finally {
      client.release();
    }
  }

  async migration001_createUsersTable() {
    const migrationName = "001_create_users_table";

    if (await this.hasMigrationRun(migrationName)) {
      console.log(`⏭️  Skipping ${migrationName} - already executed`);
      return;
    }

    console.log(`🔧 Running ${migrationName}...`);
    const client = await this.pool.connect();

    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create index for better performance
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
      `);

      await this.markMigrationComplete(migrationName);
      console.log(`✅ ${migrationName} completed`);
    } finally {
      client.release();
    }
  }

  async migration002_createPostsTable() {
    const migrationName = "002_create_posts_table";

    if (await this.hasMigrationRun(migrationName)) {
      console.log(`⏭️  Skipping ${migrationName} - already executed`);
      return;
    }

    console.log(`🔧 Running ${migrationName}...`);
    const client = await this.pool.connect();

    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS posts (
          id SERIAL PRIMARY KEY,
          title VARCHAR(200) NOT NULL,
          content TEXT,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create index for better performance
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id)
      `);

      await this.markMigrationComplete(migrationName);
      console.log(`✅ ${migrationName} completed`);
    } finally {
      client.release();
    }
  }

  async migration003_insertSampleData() {
    const migrationName = "003_insert_sample_data";

    if (await this.hasMigrationRun(migrationName)) {
      console.log(`⏭️  Skipping ${migrationName} - already executed`);
      return;
    }

    console.log(`🔧 Running ${migrationName}...`);
    const client = await this.pool.connect();

    try {
      // Insert sample users
      await client.query(`
        INSERT INTO users (name, email) VALUES 
          ('John Doe', 'john@example.com'),
          ('Jane Smith', 'jane@example.com'),
          ('Bob Johnson', 'bob@example.com'),
          ('Alice Wilson', 'alice@example.com'),
          ('Charlie Brown', 'charlie@example.com')
        ON CONFLICT (email) DO NOTHING
      `);

      // Insert sample posts
      await client.query(`
        INSERT INTO posts (title, content, user_id) VALUES 
          ('Welcome to Our Platform', 'This is the first post welcoming everyone to our platform!', 1),
          ('Tips for Getting Started', 'Here are some helpful tips to get you started with our application.', 2),
          ('Community Guidelines', 'Please read these important community guidelines.', 1),
          ('Feature Update', 'We have released some exciting new features!', 3),
          ('Hello World', 'My first post on this platform.', 4)
        ON CONFLICT DO NOTHING
      `);

      await this.markMigrationComplete(migrationName);
      console.log(`✅ ${migrationName} completed`);
    } finally {
      client.release();
    }
  }

  // Method to add new migrations easily
  async addNewMigration(migrationName, migrationFunction) {
    if (await this.hasMigrationRun(migrationName)) {
      console.log(`⏭️  Skipping ${migrationName} - already executed`);
      return;
    }

    console.log(`🔧 Running ${migrationName}...`);
    await migrationFunction();
    await this.markMigrationComplete(migrationName);
    console.log(`✅ ${migrationName} completed`);
  }
}

module.exports = DatabaseMigrations;
