/**
 * 团队列表
 */
export interface TeamListDto {
  /**
   * 团队头像
   */
  avatar?: string;
  /**
   * 创建时间
   */
  createdAt: Date;
  /**
   * 团队描述
   */
  description: string;
  /**
   * 团队ID
   */
  id: number;
  /**
   * 团队名称
   */
  name: string;
  /**
   * 创建者ID
   */
  ownerId: number;
  /**
   * 成员数量
   */
  memberCount: number;
  /**
   * 文件数量
   */
  fileCount: number;
}

/**
 * 创建团队
 */
export interface CreateTeamDto {
  /**
   * 团队头像
   */
  avatar?: string;
  /**
   * 团队空间的描述信息
   */
  description: string;
  /**
   * 团队空间名称
   */
  name: string;
}

/**
 * 发送加入团队邀请
 */
export interface SendJoinTeamInvitationDto {
  /**
   * 邮箱地址（邮箱邀请时必填）
   */
  email?: string;
  /**
   * 用户ID（站内邀请时必填）
   */
  userId?: number;
  /**
   * 邀请有效期（小时）
   */
  expiresInHours: number;
  /**
   * 最大提醒次数
   */
  maxReminders: number;
  /**
   * 提醒间隔（小时）
   */
  reminderInterval: number;
  /**
   * 是否发送提醒
   */
  sendReminder: boolean;
  /**
   * 邀请来源
   */
  source: Source;
  /**
   * 邀请类型
   */
  type: InviteType;
  /**
   * 邀请权限
   */
  permission: FilePermissionLevel;
}

/**
 * 邀请来源
 */
export enum Source {
  Batch = 'batch',
  External = 'external',
  Internal = 'internal'
}

/**
 * 邀请类型
 */
export enum InviteType {
  Email = 'email',
  Link = 'link',
  Userid = 'user_id'
}

/**
 * 团队空间权限
 */
export enum FilePermissionLevel {
  /** 没权限 */
  NONE = 0,
  /** 可查看 */
  VIEW = 1,
  /** 可编辑 */
  EDIT = 2,
  /** 可删除 */
  DELETE = 3
}

/**
 * 发送加入团队邀请返回结果
 */
export interface InviteResultDto {
  /**
   * 过期时间
   */
  expiresAt: Date;
  /**
   * 邀请码
   */
  inviteCode: string;
  /**
   * 邀请链接
   */
  inviteLink?: string;
}

/**
 * 校验邀请码有效性并返回邀请详情
 */
export interface InvitationValidateResultDto {
  /**
   * 邀请过期时间
   */
  expiresAt: Date;
  /**
   * 邀请人头像
   */
  inviterAvatar: string;
  /**
   * 邀请人邮箱
   */
  inviterEmail: string;
  /**
   * 邀请人姓名
   */
  inviterName: string;
  /**
   * 邀请角色
   */
  inviteRole: string;
  /**
   * 团队成员数
   */
  memberCount: number;
  /**
   * 团队头像
   */
  teamAvatar: string;
  /**
   * 团队创建时间
   */
  teamCreatedAt: Date;
  /**
   * 团队描述
   */
  teamDescription: string;
  /**
   * 团队ID
   */
  teamId: number;
  /**
   * 团队名称
   */
  teamName: string;
  /**
   * 邀请权限
   */
  permission: FilePermissionLevel;
}
