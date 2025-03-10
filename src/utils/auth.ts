// 获取 token
export const getToken = () => {
  return localStorage.getItem('token')
}

// 设置 token
export const setToken = (token: string) => {
  localStorage.setItem('token', token)
}

// 移除 token
export const removeToken = () => {
  localStorage.removeItem('token')
}

// 检查用户权限
export const hasPermission = (requiredRole: string, userRoles: string[]) => {
  return userRoles.includes(requiredRole)
}