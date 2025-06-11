import type { AxiosPromise } from 'axios';
import type { CreateTeamDto, InvitationValidateResultDto, InviteResultDto, SendJoinTeamInvitationDto, TeamListDto } from './types';
import http from '../../http';

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
