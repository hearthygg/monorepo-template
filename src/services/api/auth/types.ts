// 登录接口参数类型
export interface LoginDto {
  /**用户名 */
  username: string;
  /**密码 */
  password: string;
}

export interface RegisterDto {
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
  /** 邮箱 */
  email: string;
  /** 昵称 */
  nickname?: string;
}

export interface UserInfoDto {
  /** 用户ID */
  id: number;
  /** 用户名 */
  username: string;
  /** 邮箱 */
  email: string;
  /** 昵称 */
  nickname?: string;
  /** 头像URL */
  avatar?: string;
  /** 用户状态 */
  status: string;
}
