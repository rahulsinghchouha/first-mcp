import { pool } from "../connection.js";

export interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: Date;
  updated_at: Date;
}

export async function insertTask(
  title: string,
  description?: string
): Promise<Task> {
  const result = await pool.query<Task>(
    `
    INSERT INTO tasks (title, description)
    VALUES ($1, $2)
    RETURNING *;
    `,
    [title, description ?? null]
  );

  const task = result.rows[0];
  if (!task) {
    throw new Error("Task insert returned no row");
  }

  return task;
}

export async function findAllTasks(): Promise<Task[]> {
  const result = await pool.query<Task>(
    `
    SELECT *
    FROM tasks
    ORDER BY created_at DESC;
    `
  );

  return result.rows;
}

export async function findTaskById(
  id: number
): Promise<Task | null> {
  const result = await pool.query<Task>(
    `
    SELECT *
    FROM tasks
    WHERE id = $1;
    `,
    [id]
  );

  return result.rows[0] ?? null;
}

export async function updateTaskById(
  id: number,
  title?: string,
  description?: string,
  completed?: boolean
): Promise<Task | null> {
  const result = await pool.query<Task>(
    `
    UPDATE tasks
    SET
      title = COALESCE($2, title),
      description = COALESCE($3, description),
      completed = COALESCE($4, completed),
      updated_at = NOW()
    WHERE id = $1
    RETURNING *;
    `,
    [
      id,
      title ?? null,
      description ?? null,
      completed ?? null,
    ]
  );

  return result.rows[0] ?? null;
}

export async function deleteTaskById(
  id: number
): Promise<Task | null> {
  const result = await pool.query<Task>(
    `
    DELETE FROM tasks
    WHERE id = $1
    RETURNING *;
    `,
    [id]
  );

  return result.rows[0] ?? null;
}
