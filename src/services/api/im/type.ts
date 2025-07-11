import type { ChatMemberRole, ChatRoomType, MessageType } from '@/constants/enum';
import type { UserBaseInfo } from '@/types/user';

/**
 * 聊天室列表
 */
export interface ChatRoomResponseDto {
  /**
   * 创建时间
   */
  createdAt: Date;
  /**
   * 聊天室ID
   */
  id: string;
  /**
   * 是否静音
   */
  isMuted?: boolean;
  /**
   * 最新消息内容
   */
  lastMessage?: ChatRoomBaseMessage;
  /**
   * 私聊成员信息（仅私聊时返回）
   */
  members?: ChatMemberResponseDto[];
  /**
   * 最后读取时间
   */
  lastReadAt?: Date;
  /**
   * 聊天室名称
   */
  name: string;
  /**
   * 团队ID
   */
  teamId?: number;
  /**
   * 团队名称
   */
  teamName?: string;
  /**
   * 聊天室类型
   */
  type: ChatRoomType;
  /**
   * 未读消息数量
   */
  unreadCount?: number;
  /**
   * 更新时间
   */
  updatedAt: Date;
}

export interface ChatRoomQueryDto {
  /**
   * 是否有未读消息
   */
  hasUnread?: boolean;
  /**
   * 是否包含私聊成员信息（会影响性能，仅在需要时使用）
   */
  includeMembers?: boolean;
  /**
   * 是否静音
   */
  isMuted?: boolean;
  /**
   * 限制返回数量
   */
  limit?: number;
  /**
   * 搜索关键词
   */
  search?: string;
  /**
   * 团队ID过滤
   */
  teamId?: number;
  /**
   * 聊天室类型过滤
   */
  type?: ChatRoomType;
}

/**
 * 聊天室消息
 */
export interface ChatRoomBaseMessage {
  /**
   * 消息ID
   */
  id: string;
  /**
   * 消息内容
   */
  content: string;
  /**
   * 消息类型
   */
  type: MessageType;
  /**
   * 发送者ID
   */
  senderId: number;
  /**
   * 发送者名称
   */
  senderName: string;
  /**
   * 创建时间
   */
  createdAt: string;
}

/**
 * 聊天室详情
 */
export interface ChatRoomDetailResponseDto extends ChatRoomResponseDto {
  /**
   * 成员总数
   */
  memberCount: number;
  /**
   * 聊天室成员列表
   */
  members: ChatMemberResponseDto[];
}

/**
 * 聊天室成员
 */
export interface ChatMemberResponseDto {
  /**
   * 成员表主键ID
   */
  id: string;
  /**
   * 加入时间
   */
  joinedAt: Date;
  /**
   * 成员角色
   */
  role: ChatMemberRole;
  /**
   * 用户信息
   */
  user?: UserBaseInfo;
  /**
   * 用户ID
   */
  userId: number;
}

export interface ChatRoomMessageQueryDto {
  /**
   * 获取此时间之前的消息（毫秒时间戳）
   */
  before?: string;
  /**
   * 消息数量限制
   */
  limit?: number;
}

/**
 * 聊天室消息
 */
export interface ChatRoomMessageResponseDto {
  /**
   * @用户ID列表
   */
  atUserIds?: string[];
  /**
   * 聊天室ID
   */
  chatRoomId: string;
  /**
   * 消息内容
   */
  content: string;
  /**
   * 创建时间
   */
  createdAt: string;
  /**
   * 额外信息
   */
  extra?: Record<string, any>;
  /**
   * 消息ID
   */
  id: string;
  /**
   * 回复的消息ID
   */
  replyToId?: string;
  /**
   * 是否已撤销
   */
  revoked: boolean;
  /**
   * 发送者ID
   */
  senderId: number;
  /**
   * 消息类型
   */
  type: MessageType;
  /**
   * 发送者名称
   */
  senderNickname?: string;
  /**
   * 发送者头像
   */
  senderAvatar?: string;
}
