import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { useAuth } from '../../auth/AuthContext';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from '../../api/task';

import type {
  CreateTaskInput,
  UpdateTaskInput,
} from '../../types/task';

export const taskKeys = {
  all: (userId: string) => ['tasks', userId] as const,

  detail: (userId: string, taskId: string) =>
    ['tasks', userId, taskId] as const,
};

export function useTasksQuery() {
  const { user, accessToken } = useAuth();

  return useQuery({
    queryKey: taskKeys.all(user?.id ?? ''),
    queryFn: () => getTasks(accessToken!),
    enabled: Boolean(user && accessToken),
  });
}

export function useTaskQuery(taskId: string) {
  const { user, accessToken } = useAuth();

  return useQuery({
    queryKey: taskKeys.detail(user?.id ?? '', taskId),
    queryFn: () => getTaskById(taskId, accessToken!),
    enabled: Boolean(user && accessToken && taskId),
  });
}

export function useCreateTask() {
  const { user, accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTaskInput) => {
      if (!accessToken) {
        throw new Error('Необходимо авторизоваться.');
      }

      return createTask(input, accessToken);
    },

    onSuccess: () => {
      if (user) {
        queryClient.invalidateQueries({
          queryKey: taskKeys.all(user.id),
        });
      }
    },
  });
}

export function useUpdateTask(taskId: string) {
  const { user, accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateTaskInput) => {
      if (!accessToken) {
        throw new Error('Необходимо авторизоваться.');
      }

      return updateTask(taskId, input, accessToken);
    },

    onSuccess: () => {
      if (!user) return;

      queryClient.invalidateQueries({
        queryKey: taskKeys.all(user.id),
      });

      queryClient.invalidateQueries({
        queryKey: taskKeys.detail(user.id, taskId),
      });
    },
  });
}

export function useDeleteTask() {
  const { user, accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => {
      if (!accessToken) {
        throw new Error('Необходимо авторизоваться.');
      }

      return deleteTask(taskId, accessToken);
    },

    onSuccess: (_data, taskId) => {
      if (!user) return;

      queryClient.invalidateQueries({
        queryKey: taskKeys.all(user.id),
      });

      queryClient.removeQueries({
        queryKey: taskKeys.detail(user.id, taskId),
      });
    },
  });
}

export function useChangeTaskStatus() {
  const { user, accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: 'active' | 'completed';
    }) => {
      if (!accessToken) {
        throw new Error('Необходимо авторизоваться.');
      }

      return updateTask(id, { status }, accessToken);
    },

    onSuccess: (_data, variables) => {
      if (!user) return;

      queryClient.invalidateQueries({
        queryKey: taskKeys.all(user.id),
      });

      queryClient.invalidateQueries({
        queryKey: taskKeys.detail(user.id, variables.id),
      });
    },
  });
}