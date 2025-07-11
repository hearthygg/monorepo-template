// 聊天室相关接口
import http from '@/services/http';
import type { AxiosPromise } from 'axios';
import type { ChatRoomDetailResponseDto, ChatRoomMessageQueryDto, ChatRoomMessageResponseDto, ChatRoomQueryDto, ChatRoomResponseDto } from './type';
import { ChatMemberRole } from '@/constants/enum';

// 获取用户的所有聊天室列表
export const getChatRoomListApi = (userId: number, query: ChatRoomQueryDto): AxiosPromise<ChatRoomResponseDto[]> => {
  return http({
    url: `/chat/user/${userId}/rooms`,
    method: 'get',
    params: query
  });
};

// 获取聊天室信息（包括成员列表）
export const getChatRoomInfoApi = (roomId: string): AxiosPromise<ChatRoomDetailResponseDto> => {
  return http({
    url: `/chat/room/${roomId}`,
    method: 'get'
  });
};

// 获取聊天室消息历史，支持分页和时间范围
export const getChatRoomMessagesApi = (roomId: string, query: ChatRoomMessageQueryDto): AxiosPromise<ChatRoomMessageResponseDto[]> => {
  return http({
    url: `/chat/room/${roomId}/messages`,
    method: 'get',
    params: query
  });
};

// 批量添加聊天室成员
export const batchAddChatRoomMembersApi = (roomId: string, userIds: number[]) => {
  return http({
    url: `/chat/room/${roomId}/members/batch`,
    method: 'post',
    data: {
      userIds,
      role: ChatMemberRole.MEMBER
    }
  });
};

// 创建私聊
export const createPrivateChatRoomApi = (userId1: number, userId2: number): AxiosPromise<ChatRoomResponseDto> => {
  return http({
    url: `/chat/private`,
    method: 'post',
    data: {
      userId1: userId1,
      userId2: userId2
    }
  });
};

// 移除聊天室成员
export const removeChatRoomMemberApi = (roomId: string, userId: number) => {
  return http({
    url: `/chat/room/${roomId}/member/${userId}`,
    method: 'delete'
  });
};

// 删除聊天室
export const deleteChatRoomApi = (roomId: string) => {
  return http({
    url: `/chat/room/${roomId}`,
    method: 'delete'
  });
};
