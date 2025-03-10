import http from '../http';

// 登录
export const login = (username: string, password: string) => {
  return http.post('/auth/login', { username, password });
};

// 注册
export const register = (username: string, password: string) => {
  return http.post('/auth/register', { username, password });
};

// 获取当前用户信息
export const getCurrentUser = () => {
  return http.get('/auth/me');
};
