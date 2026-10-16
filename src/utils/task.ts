import type { Task, TaskPriority, TaskStatus } from '../types/task';

export function countTasksByStatus(
  tasks: Task[],
  status: TaskStatus
): number {
  return tasks.filter((task) => task.status === status).length;
}

export function sortTasksByPriority(tasks: Task[]): Task[] {
  const priorityOrder: Record<TaskPriority, number> = {
    high: 1,
    medium: 2,
    low: 3,
  };

  return [...tasks].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );
}

export function filterTasksByStatus(
  tasks: Task[],
  status: TaskStatus | 'all'
): Task[] {
  if (status === 'all') {
    return tasks;
  }

  return tasks.filter((task) => task.status === status);
}

export function isTaskOverdue(task: Task): boolean {
  if (!task.dueDate || task.status === 'completed') {
    return false;
  }

  const dueDate = new Date(task.dueDate);
  const today = new Date();

  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  return dueDate < today;
}

export function filterTasks(
  tasks: Task[],
  searchText: string
): Task[] {
  const query = searchText.trim().toLowerCase();

  if (!query) {
    return tasks;
  }

  return tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(query) ||
      task.subject.toLowerCase().includes(query)
  );
}