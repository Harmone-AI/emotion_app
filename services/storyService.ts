import axios from 'axios';
import { Story } from '../types/story';

export const fetchStories = async (userId: number): Promise<Story[]> => {
  try {
    const response = await axios.get(`https://harmone.ai/new/api/user/${userId}/history`);
    return response.data;
  } catch (error) {
    console.error('Error fetching stories:', error);
    return [];
  }
};
