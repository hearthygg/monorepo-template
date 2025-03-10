import axios from 'axios';

// 创建一个 Axios 实例
const http = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000
});

// 请求拦截器
http.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    return Promise.reject(error);
  }
);

export default http;
