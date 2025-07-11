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
 * 聊天室类型
 */
export enum ChatRoomType {
  /** 频道 */
  Channel = 'channel',
  /** 群组 */
  Group = 'group',
  /** 私聊 */
  Private = 'private'
}

/**
 * 消息类型枚举
 */
export enum MessageType {
  /** 文本消息 */
  TEXT = 'text',
  /** 图片消息 */
  IMAGE = 'image',
  /** 文件消息 */
  FILE = 'file',
  /** 系统消息 */
  SYSTEM = 'system'
}

/**
 * 聊天室成员角色枚举
 */
export enum ChatMemberRole {
  /** 所有者 - 拥有最高权限，可删除聊天室 */
  OWNER = 'owner',
  /** 管理员 - 可管理成员和消息 */
  ADMIN = 'admin',
  /** 成员 - 普通成员 */
  MEMBER = 'member'
}

/**
 * 在线状态
 */
export enum OnlineStatusEnum {
  /** 在线 */
  ONLINE = 'online',
  /** 离线 */
  OFFLINE = 'offline',
  /** 离开 */
  AWAY = 'away',
  /** 忙碌 */
  BUSY = 'busy'
}

export enum UploadScene {
  /** 聊天图片 */
  CHAT_IMAGE = 'chat_image',
  /** 用户头像 */
  USER_AVATAR = 'user_avatar',
  /** 团队logo */
  TEAM_LOGO = 'team_logo',
  /** 文档文件 */
  DOCUMENT = 'document',
  /** 通用文件 */
  GENERAL = 'general'
}
