
import {
  createContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';

import type {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
} from '../types/task';

interface TasksContextValue {
  tasks: Task[];
  lastCreatedTaskId: string | null;
  clearLastCreatedTaskId: () => void;
  createTask: (input: CreateTaskInput) => void;
  updateTask: (id: string, input: UpdateTaskInput) => void;
  removeTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  getTaskById: (id: string) => Task | undefined;
}

export const TasksContext = createContext<
  TasksContextValue | undefined
>(undefined);

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Подготовить лабораторную работу №1',
    subject: 'React Native',
    priority: 'high',
    status: 'active',
    createdAt: '2026-09-01T10:00:00.000Z',
  },
  {
    id: '2',
    title: 'Повторить TypeScript',
    subject: 'Программирование',
    priority: 'medium',
    status: 'completed',
    createdAt: '2026-09-02T10:00:00.000Z',
  },
  {
    id: '3',
    title: 'Прочитать главу учебника',
    subject: 'Базы данных',
    priority: 'low',
    status: 'active',
    createdAt: '2026-09-03T10:00:00.000Z',
  },
  {
    id: '4',
    title: 'Подготовиться к тесту',
    subject: 'Математика',
    priority: 'high',
    status: 'active',
    createdAt: '2026-09-04T10:00:00.000Z',
  },
];

export function TasksProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  // ID последней созданной задачи
  const [lastCreatedTaskId, setLastCreatedTaskId] =
    useState<string | null>(null);

  const createTask = (input: CreateTaskInput) => {
    const newTask: Task = {
      ...input,
      id: String(Date.now()),
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    setTasks((currentTasks) => [newTask, ...currentTasks]);
    setLastCreatedTaskId(newTask.id);
  };

 const clearLastCreatedTaskId = useCallback(() => {
  setLastCreatedTaskId(null);
}, []);

  const updateTask = (id: string, input: UpdateTaskInput) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? { ...task, ...input }
          : task
      )
    );
  };

  const removeTask = (id: string) => {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== id)
    );
  };

  const toggleTaskStatus = (id: string) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status:
                task.status === 'active'
                  ? 'completed'
                  : 'active',
            }
          : task
      )
    );
  };

  const getTaskById = (id: string) => {
    return tasks.find((task) => task.id === id);
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        lastCreatedTaskId,
        clearLastCreatedTaskId,
        createTask,
        updateTask,
        removeTask,
        toggleTaskStatus,
        getTaskById,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}
