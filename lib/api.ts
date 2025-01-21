import axios, { AxiosError, AxiosRequestConfig } from 'axios';

export const API_BASE_URL = 'https://harmone.ai/new';

// 创建一个自定义的 axios 实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 日志格式化函数
const formatLog = (message: string, data: any) => {
  try {
    const timestamp = new Date().toISOString();
    const formattedData = JSON.stringify(data, null, 2);
    return `[${timestamp}] ${message}\n${formattedData}\n`;
  } catch (error) {
    return `[${new Date().toISOString()}] Error formatting log: ${error}`;
  }
};

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 记录请求信息
    console.log(
      formatLog('🚀 API Request:', {
        url: config.url,
        method: config.method?.toUpperCase(),
        headers: config.headers,
        params: config.params,
        data: config.data,
      })
    );
    return config;
  },
  (error) => {
    console.error(
      formatLog('❌ Request Error:', {
        message: error.message,
        config: error.config,
      })
    );
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    // 记录响应信息
    console.log(
      formatLog('✅ API Response:', {
        url: response.config.url,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data,
        duration: `${
          Date.now() -
          new Date(response.config.headers['Request-Time']).getTime()
        }ms`,
      })
    );
    return response;
  },
  (error: AxiosError) => {
    // 统一处理错误
    if (error.response) {
      // 服务器返回错误状态码
      console.error(
        formatLog('❌ API Error Response:', {
          url: error.config?.url,
          status: error.response.status,
          statusText: error.response.statusText,
          headers: error.response.headers,
          data: error.response.data,
          duration: error.config?.headers
            ? `${
                Date.now() -
                new Date(error.config.headers['Request-Time']).getTime()
              }ms`
            : 'unknown',
        })
      );
    } else if (error.request) {
      // 请求发出但没有收到响应
      console.error(
        formatLog('❌ API No Response:', {
          url: error.config?.url,
          request: error.request,
          message: error.message,
        })
      );
    } else {
      // 请求配置出错
      console.error(
        formatLog('❌ API Request Config Error:', {
          message: error.message,
          stack: error.stack,
        })
      );
    }
    return Promise.reject(error);
  }
);

// 通用的 API 请求函数
export async function apiRequest<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    // 添加请求时间戳
    config.headers = {
      ...config.headers,
      'Request-Time': new Date().toISOString(),
    };
    const response = await apiClient(config);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// 导出常用的请求方法
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    apiRequest<T>({ ...config, method: 'GET', url }),

  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiRequest<T>({ ...config, method: 'POST', url, data }),

  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiRequest<T>({ ...config, method: 'PUT', url, data }),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    apiRequest<T>({ ...config, method: 'DELETE', url }),
};
