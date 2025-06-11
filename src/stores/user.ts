import { getProfileApi, loginApi, logoutApi } from '@/services';
import type { LoginDto, UserInfoDto } from '@/services/types';
import { ElMessage } from 'element-plus';
import { defineStore } from 'pinia';
import { ref } from 'vue';

// 用户信息存储
export const useUserStore = defineStore('user', () => {
  // 用户信息
  const userInfo = ref<UserInfoDto | null>(null);
  // token
  const token = ref<string | null>(null);

  // 设置用户信息
  const setUserInfo = (info: UserInfoDto) => {
    userInfo.value = info;
    // 持久化存储
    localStorage.setItem('userInfo', JSON.stringify(info));
  };

  // 设置token
  const setToken = (newToken: string) => {
    token.value = newToken;
    localStorage.setItem(import.meta.env.VITE_ACCESS_TOKEN, newToken);
  };

  // 清除用户信息
  const clearUserInfo = () => {
    userInfo.value = null;
    localStorage.removeItem('userInfo');
  };

  // 清除token
  const clearToken = () => {
    token.value = null;
    localStorage.removeItem(import.meta.env.VITE_ACCESS_TOKEN);
  };

  // 初始化状态（从localStorage恢复）
  const initState = () => {
    const storedUserInfo = localStorage.getItem('userInfo');
    const storedToken = localStorage.getItem(import.meta.env.VITE_ACCESS_TOKEN);

    if (storedUserInfo) {
      userInfo.value = JSON.parse(storedUserInfo);
    }
    if (storedToken) {
      token.value = storedToken;
    }
  };

  // 登录
  const login = async (data: LoginDto) => {
    try {
      const tokenResponse = await loginApi(data);
      setToken(tokenResponse.data.access_token);
      const { data: userInfo } = await getProfileApi();
      setUserInfo(userInfo);
    } catch (error) {
      clearUserInfo();
      clearToken();
      throw error;
    }
  };

  // 登出
  const logout = async () => {
    try {
      await logoutApi();
      clearUserInfo();
      clearToken();
      ElMessage.success('退出登录成功');
    } catch (error) {
      clearUserInfo();
      clearToken();
      throw error;
    }
  };

  return {
    userInfo,
    token,
    initState,
    logout,
    login,
    clearUserInfo,
    clearToken
  };
});
