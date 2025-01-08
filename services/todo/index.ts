import { apiRequest } from '@/libs/api';
import { Todo } from './type';

export const fetchTodos = async (): Promise<Todo[]> => {
  return await apiRequest<Todo[]>({
    method: 'GET',
    url: '/todos',
  });
};

export const addTodo = async (todo: Omit<Todo, 'id'>): Promise<Todo> => {
  return await apiRequest({
    method: 'POST',
    url: '/todos',
    data: todo,
  });
};
