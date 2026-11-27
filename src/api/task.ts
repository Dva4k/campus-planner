import { apiRequest } from './client';
import type {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
} from '../types/task';

interface TasksResponse {
  items: Task[];
}

interface TaskResponse {
  item: Task;
}

export async function getTasks(token: string): Promise<Task[]> {
  const response = await apiRequest<TasksResponse>(
    '/tasks',
    token,
  );

  return response.items;
}

export async function getTaskById(
  id: string,
  token: string,
): Promise<Task> {
  const response = await apiRequest<TaskResponse>(
    `/tasks/${encodeURIComponent(id)}`,
    token,
  );

  return response.item;
}

export async function createTask(
  input: CreateTaskInput,
  token: string,
): Promise<Task> {
  const response = await apiRequest<TaskResponse>(
    '/tasks',
    token,
    {
      method: 'POST',
      body: JSON.stringify(input),
    },
  );

  return response.item;
}

export async function updateTask(
  id: string,
  input: UpdateTaskInput,
  token: string,
): Promise<Task> {
  const response = await apiRequest<TaskResponse>(
    `/tasks/${encodeURIComponent(id)}`,
    token,
    {
      method: 'PATCH',
      body: JSON.stringify(input),
    },
  );

  return response.item;
}

export async function deleteTask(
  id: string,
  token: string,
): Promise<void> {
  await apiRequest<void>(
    `/tasks/${encodeURIComponent(id)}`,
    token,
    {
      method: 'DELETE',
    },
  );
}