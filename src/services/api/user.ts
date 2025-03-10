import http from '../http'

// 获取用户列表
export const getUsers = () => {
  return http.get('/users')
}

// 获取用户详情
export const getUserById = (id: string) => {
  return http.get(`/users/${id}`)
}

// 更新用户信息
export const updateUser = (id: string, data: any) => {
  return http.put(`/users/${id}`, data)
}

// 删除用户
export const deleteUser = (id: string) => {
  return http.delete(`/users/${id}`)
}