import type { OnlineStatusEnum } from '@/constants/enum';

// 团队成员在线状态
export interface TeamMemberOnlineStatus {
  // 成员ID
  id: number;
  // 成员昵称
  nickname: string;
  // 成员头像
  avatar: string;
  // 成员在线状态
  onlineStatus: OnlineStatusEnum;
}
