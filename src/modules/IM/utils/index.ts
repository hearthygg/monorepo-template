import type { Message, User } from '../types';

/**
 * 格式化时间显示
 * @param timestamp 时间戳
 * @returns 格式化后的时间字符串
 */
export const formatTime = (timestamp: Date): string => {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();

  if (diff < 60000) return '刚刚';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`;

  return timestamp.toLocaleDateString();
};

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @returns 格式化后的文件大小
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * 生成唯一ID
 * @returns 唯一ID字符串
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param wait 等待时间
 * @returns 防抖后的函数
 */
export const debounce = <T extends (...args: any[]) => any>(func: T, wait: number): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * 节流函数
 * @param func 要节流的函数
 * @param limit 限制时间
 * @returns 节流后的函数
 */
export const throttle = <T extends (...args: any[]) => any>(func: T, limit: number): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * 获取用户头像
 * @param user 用户对象
 * @returns 头像URL
 */
export const getUserAvatar = (user: User): string => {
  return user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`;
};

/**
 * 检查消息是否已读
 * @param message 消息对象
 * @param currentUserId 当前用户ID
 * @returns 是否已读
 */
export const isMessageRead = (message: Message, currentUserId: string): boolean => {
  // 这里可以根据实际业务逻辑实现已读状态检查
  return message.senderId !== currentUserId;
};

/**
 * 获取消息预览文本
 * @param message 消息对象
 * @param maxLength 最大长度
 * @returns 预览文本
 */
export const getMessagePreview = (message: Message, maxLength: number = 50): string => {
  if (message.type === 'text') {
    return message.content.length > maxLength ? message.content.substring(0, maxLength) + '...' : message.content;
  }

  switch (message.type) {
    case 'image':
      return '[图片]';
    case 'file':
      return '[文件]';
    default:
      return '[未知类型]';
  }
};

/**
 * 验证消息内容
 * @param content 消息内容
 * @returns 是否有效
 */
export const validateMessage = (content: string): boolean => {
  return content.trim().length > 0 && content.trim().length <= 1000;
};

/**
 * 获取在线用户数量
 * @param users 用户列表
 * @returns 在线用户数量
 */
export const getOnlineUserCount = (users: User[]): number => {
  return users.filter(user => user.isOnline).length;
};

/**
 * 获取未读消息总数
 * @param users 用户列表
 * @returns 未读消息总数
 */
export const getTotalUnreadCount = (users: User[]): number => {
  return users.reduce((total, user) => total + user.unreadCount, 0);
};

/**
 * 排序用户列表（在线用户优先，然后按姓名排序）
 * @param users 用户列表
 * @returns 排序后的用户列表
 */
export const sortUsers = (users: User[]): User[] => {
  return [...users].sort((a, b) => {
    // 在线用户优先
    if (a.isOnline && !b.isOnline) return -1;
    if (!a.isOnline && b.isOnline) return 1;

    // 然后按姓名排序
    return a.name.localeCompare(b.name);
  });
};

/**
 * 过滤消息列表
 * @param messages 消息列表
 * @param userId1 用户1 ID
 * @param userId2 用户2 ID
 * @returns 过滤后的消息列表
 */
export const filterMessages = (messages: Message[], userId1: string, userId2: string): Message[] => {
  return messages.filter(msg => (msg.senderId === userId1 && msg.receiverId === userId2) || (msg.senderId === userId2 && msg.receiverId === userId1)).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
};
