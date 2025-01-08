import axios, { AxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
});

export const apiRequest = async <T>(config: AxiosRequestConfig): Promise<T> => {
  const response = await api(config);
  return response.data;
};
