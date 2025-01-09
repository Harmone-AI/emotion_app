import { apiRequest } from '@/libs/api';

export const generateGoals = async (feeling: string): Promise<void> => {
  return await apiRequest<any>({
    method: 'POST',
    url: 'word2tasklist',
    data: {
      user_input: feeling,
      user_id: 1,
    },
  });
};
