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
