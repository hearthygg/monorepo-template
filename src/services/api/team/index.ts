import type { AxiosPromise } from 'axios';
import type { CheckCreateRoomPermissionResultDto, CreateCustomChatRoomDto, CreateTeamDto, InvitationValidateResultDto, InviteResultDto, SendJoinTeamInvitationDto, TeamListDto, TeamMembersOnlineStatusDto } from './types';
import http from '../../http';
import type { ChatRoomType } from '@/constants/enum';

// 获取最近的团队
export const getRecentTeamsApi = (): AxiosPromise<TeamListDto[]> => {
  return http({
    url: '/teams',
    method: 'get'
  });
};

// 创建团队
export const createTeamApi = (data: CreateTeamDto) => {
  return http({
    url: '/teams',
    method: 'post',
    data
  });
};

// 发送加入团队邀请
export const sendJoinTeamInvitationApi = (teamId: number, data: SendJoinTeamInvitationDto): AxiosPromise<InviteResultDto> => {
  return http({
    url: `/teams/${teamId}/invite`,
    method: 'post',
    data
  });
};

// 接受邀请
export const acceptInvitationApi = (inviteCode: string): AxiosPromise<void> => {
  return http({
    url: `/teams/join/${inviteCode}`,
    method: 'post'
  });
};

// 拒绝邀请
export const rejectInvitationApi = (inviteCode: string): AxiosPromise<void> => {
  return http({
    url: `/teams/reject/${inviteCode}`,
    method: 'post'
  });
};

// 校验邀请码有效性并返回邀请详情
export const checkInvitationApi = (inviteCode: string): AxiosPromise<InvitationValidateResultDto> => {
  return http({
    url: '/teams/invitation/validate',
    method: 'get',
    params: {
      inviteCode
    }
  });
};

// 创建团队默认聊天室
export const createTeamDefaultChatRoomApi = (teamId: number) => {
  return http({
    url: `/teams/${teamId}/chat-room/default`,
    method: 'post'
  });
};

// 创建团队自定义聊天室
export const createTeamCustomChatRoomApi = (teamId: number, data: CreateCustomChatRoomDto) => {
  return http({
    url: `/teams/${teamId}/chat-room`,
    method: 'post',
    data
  });
};

// 检查是否有当前团队下创建自定义聊天室权限
export const checkCreateRoomPermissionApi = (teamId: number, type: ChatRoomType): AxiosPromise<CheckCreateRoomPermissionResultDto> => {
  return http({
    url: `/teams/${teamId}/chat-room/check-permission`,
    method: 'post',
    data: {
      type
    }
  });
};

// 获取团队下成员的在线状态
export const getTeamMemberOnlineStatusApi = (teamId: number): AxiosPromise<TeamMembersOnlineStatusDto> => {
  return http({
    url: `/teams/${teamId}/members/online-status`,
    params: {
      id: teamId
    },
    method: 'get'
  });
};
