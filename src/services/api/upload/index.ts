import type { UploadScene } from '@/constants/enum';
import http from '@/services/http';
import type { AxiosPromise } from 'axios';
import type { UploadResponseDto } from './type';

// 通用上传图片接口
export const uploadImageApi = (file: File, scene: UploadScene): AxiosPromise<UploadResponseDto> => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('scene', scene);
  return http({
    url: '/upload/image',
    method: 'post',
    data: formData
  });
};
