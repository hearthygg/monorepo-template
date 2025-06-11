import http from '@/services/http';
import type { AxiosPromise } from 'axios';
import type { CreateFolderDto } from './types';

// 在团队空间中创建文件夹
export const createFolderApi = (data: CreateFolderDto): AxiosPromise<any> => {
  return http({
    url: `/files/folder`,
    method: 'post',
    data
  });
};

// 查询当前用户在某个团队下的文件树
export const getFileTreeApi = (teamId: number): AxiosPromise<any> => {
  return http({
    url: `/files/tree`,
    method: 'get',
    params: {
      teamId
    }
  });
};
