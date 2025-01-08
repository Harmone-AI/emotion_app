import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 数据在后台自动刷新前的时间
      staleTime: 1000 * 60 * 5, // 5 minutes
      // 请求失败时的重试次数
      retry: 2,
    },
    mutations: {
      // 错误的时候
      onError() {},
    },
  },
});
