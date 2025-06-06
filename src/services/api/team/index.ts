import type { AxiosPromise } from 'axios';
import type { TeamListDto } from './types';
import http from '../../http';
// 获取最近的团队
export const getRecentTeamsApi = (): AxiosPromise<TeamListDto[]> => {
  return http({
    url: '/teams',
    method: 'get'
  });
};
