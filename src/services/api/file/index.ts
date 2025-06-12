import http from '@/services/http';
import type { AxiosPromise } from 'axios';
import type { CreateFolderDto, FileTreeDto, UploadOptions } from './types';

// 在团队空间中创建文件夹
export const createFolderApi = (data: CreateFolderDto): AxiosPromise<any> => {
  return http({
    url: `/files/folder`,
    method: 'post',
    data
  });
};

// 查询当前用户在某个团队下的文件树
export const getFileTreeApi = (teamId: number): AxiosPromise<FileTreeDto[]> => {
  return http({
    url: `/files/tree`,
    method: 'get',
    params: {
      teamId
    }
  });
};

// 2. 封装上传方法
export const uploadFileApi = (options: UploadOptions): AxiosPromise<any> => {
  const { file, name, teamId, parentId, onProgress } = options;

  // 创建FormData
  const formData = new FormData();
  formData.append('file', file);
  formData.append('teamId', teamId.toString());
  formData.append('name', name);
  if (parentId) {
    formData.append('parentId', parentId.toString());
  }

  // 返回axios请求
  return http({
    url: '/files/upload',
    method: 'post',
    data: formData,
    // 配置上传进度
    onUploadProgress: progressEvent => {
      if (onProgress && progressEvent.total) {
        onProgress({
          loaded: progressEvent.loaded,
          total: progressEvent.total,
          progress: Math.round((progressEvent.loaded / progressEvent.total) * 100)
        });
      }
    },
    // 设置超时时间
    timeout: 30000,
    // 设置请求头
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
