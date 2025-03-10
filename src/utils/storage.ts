// 设置本地存储
export const setLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// 获取本地存储
export const getLocalStorage = (key: string) => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};

// 移除本地存储
export const removeLocalStorage = (key: string) => {
  localStorage.removeItem(key);
};
