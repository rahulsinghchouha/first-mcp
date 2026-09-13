import { pool } from "./connection.js";

export async function initializeDatabaseSchema(): Promise<void> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id BIGSERIAL PRIMARY KEY,

        title VARCHAR(255) NOT NULL,

        description TEXT,

        completed BOOLEAN NOT NULL DEFAULT FALSE,

        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_tasks_completed
      ON tasks(completed);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_tasks_created_at
      ON tasks(created_at DESC);
    `);

    await client.query("COMMIT");

    console.log("Database schema initialized successfully");
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Database schema initialization failed");

    throw error;
  } finally {
    client.release();
  }
}