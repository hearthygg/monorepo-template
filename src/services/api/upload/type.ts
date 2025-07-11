/**
 * 上传文件返回值
 */
export interface UploadResponseDto {
  /**
   * 文件描述
   */
  description?: string;
  /**
   * 文件名
   */
  fileName: string;
  /**
   * 文件类型
   */
  mimeType: string;
  /**
   * 业务场景
   */
  scene: string;
  /**
   * 文件大小（字节）
   */
  size: number;
  /**
   * 文件访问URL
   */
  url: string;
}
