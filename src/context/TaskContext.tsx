import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';

import type { Task, TaskPriority } from '../types/task';

interface TaskContextValue {
  tasks: Task[];
  addTask: (
    title: string,
    subject: string,
    priority: TaskPriority
  ) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (
    id: string,
    title: string,
    subject: string,
    priority: TaskPriority
  ) => void;
  getTaskById: (id: string) => Task | undefined;
}

const TaskContext = createContext<TaskContextValue | undefined>(
  undefined
);

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Подготовить лабораторную работу №1',
    subject: 'React Native',
    priority: 'high',
    isCompleted: false,
  },
  {
    id: '2',
    title: 'Повторить TypeScript',
    subject: 'Программирование',
    priority: 'medium',
    isCompleted: true,
  },
  {
    id: '3',
    title: 'Прочитать главу учебника',
    subject: 'Базы данных',
    priority: 'low',
    isCompleted: false,
  },
  {
    id: '4',
    title: 'Подготовиться к тесту',
    subject: 'Математика',
    priority: 'high',
    isCompleted: false,
  },
];

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const addTask = (
    title: string,
    subject: string,
    priority: TaskPriority
  ) => {
    const newTask: Task = {
      id: String(Date.now()),
      title,
      subject,
      priority,
      isCompleted: false,
    };

    setTasks((currentTasks) => [newTask, ...currentTasks]);
  };

  const toggleTask = (id: string) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? { ...task, isCompleted: !task.isCompleted }
          : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== id)
    );
  };

  const updateTask = (
    id: string,
    title: string,
    subject: string,
    priority: TaskPriority
  ) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              title,
              subject,
              priority,
            }
          : task
      )
    );
  };

  const getTaskById = (id: string) => {
    return tasks.find((task) => task.id === id);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        toggleTask,
        deleteTask,
        updateTask,
        getTaskById,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);

  if (!context) {
    throw new Error('useTasks must be used inside TaskProvider');
  }

  return context;
}