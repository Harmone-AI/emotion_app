import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { taskService, Word2TaskListResponse } from '../services/taskService';

export const QUERY_KEYS = {
  TASKS: 'tasks',
  CURRENT_TASK_LIST: 'currentTaskList',
  USER_TASK_LISTS: 'userTaskLists',
} as const;

export function useWord2TaskList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      input,
      userId,
    }: {
      input: string;
      userId: number;
    }): Promise<Word2TaskListResponse> => {
      return taskService.word2TaskList(input, userId);
    },
    onSuccess: (data) => {
      // 成功后使任务列表缓存失效
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CURRENT_TASK_LIST],
      });
    },
  });
}

export function useCurrentTaskList(userId: number) {
  return useQuery({
    queryKey: [QUERY_KEYS.USER_TASK_LISTS, userId],
    queryFn: () => taskService.fetchUserTaskLists(userId),
  });
}

export function useAddTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      content,
      listId,
      userId,
    }: {
      content: string;
      listId: number;
      userId: number;
    }): Promise<any> => {
      return taskService.addTask(content, listId, userId);
    },
    onSuccess: () => {
      // 成功后使任务列表缓存失效
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CURRENT_TASK_LIST],
      });
      // 刷新用户任务列表
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USER_TASK_LISTS],
      });
    },
  });
}

export function useCurrentTasks(taskId: number, shouldFetch: boolean) {
  return useQuery({
    queryKey: [QUERY_KEYS.CURRENT_TASK_LIST, taskId],
    queryFn: () => taskService.getCurrentTaskList(taskId),
    enabled: !!taskId && shouldFetch,
  });
}

export function useCompleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: number) => taskService.completeTask(taskId),
    onSuccess: () => {
      // 成功后使任务列表缓存失效
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CURRENT_TASK_LIST],
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_TASK_LISTS] });
    },
  });
}
