export const TASK_STATUS = {
  COMPLETED: 1,
  IN_PROGRESS: 0,
} as const;

export type TaskStatus = (typeof TASK_STATUS)[keyof typeof TASK_STATUS];

export interface Task {
  content: string;
  task_id: number;
  list_id: number;
  user_id: number;
  status: TaskStatus;
  created_at: string;
}

export interface TaskList {
  id: number;
  user_id: number;
  status: number;
  created_at: string;
  tasks: Task[];
}

export interface Word2TaskListResponse {
  start_message: string;
  task_list: TaskList;
}

export interface Word2TaskListRequest {
  user_input: string;
  user_id: number;
}

export interface TaskListItem {
  id: number;
  title: string | null;
  created_at: string;
  status: number;
}

export interface CompleteTaskResponse {
  content: string;
  task_id: number;
  list_id: number;
  user_id: number;
  status: number;
  created_at: string;
}

export interface TaskDetail {
  id: string;
  title: string;
  completed: boolean;
  time: string;
  icon: any;
}
