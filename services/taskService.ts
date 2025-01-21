import { api } from '../lib/api';
import {
  Task,
  TaskList,
  TaskStatus,
  TASK_STATUS,
  Word2TaskListResponse,
  Word2TaskListRequest,
  TaskListItem,
  CompleteTaskResponse,
} from '../types/task';

export const taskService = {
  /**
   * 将用户输入转换为任务列表
   * @param input 用户输入的文字
   * @param userId 用户ID
   * @returns 任务列表响应
   */
  async word2TaskList(
    input: string,
    userId: number
  ): Promise<Word2TaskListResponse> {
    const response = await api.post<Word2TaskListResponse>(
      '/api/word2tasklist/',
      {
        user_input: input,
        user_id: userId,
      }
    );
    return response;
  },

  async getCurrentTaskList(taskId: number): Promise<TaskList> {
    const response = await api.get<TaskList>(`/api/current_tasklist/${taskId}`);
    return response;
  },

  async addTask(
    content: string,
    listId: number,
    userId: number
  ): Promise<Task> {
    const response = await api.post<Task>('/api/add_task/', {
      content,
      list_id: listId,
      user_id: userId,
    });
    return response;
  },

  // Function to fetch user task lists
  async fetchUserTaskLists(userId: number): Promise<TaskListItem[]> {
    const response = await api.get<TaskListItem[]>(
      `/api/user/${userId}/task_lists`
    );
    return response;
  },

  // Function to complete a task
  async completeTask(taskId: number): Promise<CompleteTaskResponse> {
    const response = await api.post<CompleteTaskResponse>(`/api/complete_task/${taskId}`);
    return response;
  },
};
