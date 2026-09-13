import {
  insertTask,
  findAllTasks,
  findTaskById,
  updateTaskById,
  deleteTaskById,
} from "../database/queries/taskQueries.js";

export async function createTask(
  title: string,
  description?: string
) {
  return await insertTask(title, description);
}

export async function getAllTasks() {
  return await findAllTasks();
}

export async function getTaskById(id: number) {
  return await findTaskById(id);
}

export async function updateTask(
  id: number,
  title?: string,
  description?: string,
  completed?: boolean
) {
  return await updateTaskById(
    id,
    title,
    description,
    completed
  );
}

export async function deleteTask(id: number) {
  return await deleteTaskById(id);
}