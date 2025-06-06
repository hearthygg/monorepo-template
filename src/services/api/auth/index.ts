import type { AxiosPromise } from 'axios';
import type { LoginDto, RegisterDto, UserInfoDto } from './types';
import http from '../../http';
// 登录
export const loginApi = (data: LoginDto): AxiosPromise<{ access_token: string }> => {
  return http({
    url: '/auth/login',
    method: 'post',
    data
  });
};

// 注册
export const registerApi = (data: RegisterDto) => {
  return http({
    url: '/auth/login',
    method: 'post',
    data
  });
};

// 获取当前用户信息
export const getProfileApi = (): AxiosPromise<UserInfoDto> => {
  return http({
    url: '/auth/profile',
    method: 'get'
  });
};

// 退出登录
export const logoutApi = () => {
  return http({
    url: '/auth/logout',
    method: 'post'
  });
};
