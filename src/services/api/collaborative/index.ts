import type { AxiosPromise } from 'axios';
import type { CollaborativeDocumentContentDto, CollaborativeDocumentInfoDto } from './types';
import http from '../../http';

// 获取协作文档信息
export const getCollaborativeInfoApi = (fileId: number): AxiosPromise<CollaborativeDocumentInfoDto> => {
  return http({
    url: `/collaborative-documents/${fileId}`,
    method: 'get'
  });
};

// 获取协作文档内容
export const getCollaborativeContentApi = (fileId: number): AxiosPromise<CollaborativeDocumentContentDto> => {
  return http({
    url: `/collaborative-documents/${fileId}/content`,
    method: 'get'
  });
};
