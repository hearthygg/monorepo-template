import http from '@/services/http';
import type { AxiosPromise } from 'axios';
import type { CreateFolderDto, FileInfoDto, FilePermissionListItemDto, FileTreeDto, UpdatePermissionsDto, UploadOptions } from './types';

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

// 2. 封装上传文件方法
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

// 获取文件/文件夹的权限列表
export const getFilePermissionListApi = (fileId: number): AxiosPromise<FilePermissionListItemDto[]> => {
  return http({
    url: `/files/${fileId}/permissions`,
    method: 'get'
  });
};

// 更新文件/文件夹权限
export const updateFilePermissionApi = (fileId: number, data: UpdatePermissionsDto) => {
  return http({
    url: `/files/${fileId}/permissions`,
    method: 'put',
    data
  });
};

// 删除文件/文件夹
export const deleteFileApi = (fileId: number) => {
  return http({
    url: `/files/${fileId}`,
    method: 'delete'
  });
};

// 重命名文件/文件夹
export const renameFileApi = (fileId: number, renameFileDto: { name: string }) => {
  return http({
    url: `/files/${fileId}/rename`,
    method: 'patch',
    data: renameFileDto
  });
};

// 查看文件/文件夹属性
export const getFileInfoApi = (fileId: number): AxiosPromise<FileInfoDto> => {
  return http({
    url: `/files/${fileId}/info`,
    method: 'get'
  });
};

// 下载文件
export const downloadFileApi = (fileId: number, filename?: string): AxiosPromise<Blob> => {
  return http({
    url: `/files/${fileId}/download`,
    method: 'get',
    responseType: 'blob',
    params: {
      filename
    }
  });
};

// 批量下载文件
export const downloadMultipleFilesApi = (fileIds: number[]): AxiosPromise<Blob> => {
  return http({
    url: '/files/download/multiple',
    method: 'post',
    data: { fileIds },
    responseType: 'blob'
  });
};
