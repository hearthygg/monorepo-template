import axios from 'axios';
import { ElMessage } from 'element-plus';

// 创建一个 Axios 实例
const httpClient = axios.create({
  baseURL: import.meta.env.VITE_GLOB_API_URL, // 替换为你的 API 基础 URL
  timeout: 10000 // 请求超时时间
});

// 请求拦截器
httpClient.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    // 比如添加 token 到 headers
    const token = localStorage.getItem(import.meta.env.VITE_ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 响应拦截器
httpClient.interceptors.response.use(
  response => {
    const data = response.data;
    if (data.code === 200) {
      return data;
    } else {
      ElMessage.error(data.message || '请求失败');
      return Promise.reject(data.message);
    }
  },
  error => {
    // 对响应错误做些什么
    if (error.response) {
      // 服务器返回的错误响应
      switch (error.response.status) {
        case 401:
          // 未授权，处理逻辑
          break;
        case 403:
          // 禁止访问，处理逻辑
          break;
        case 404:
          // 资源未找到，处理逻辑
          break;
        default:
          // 其他错误，处理逻辑
          break;
      }
    }
    return Promise.reject(error);
  }
);

export default httpClient;
