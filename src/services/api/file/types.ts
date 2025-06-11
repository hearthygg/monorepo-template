/**
 * 创建文件夹
 */
export interface CreateFolderDto {
  /**
   * 文件夹名称
   */
  name: string;
  /**
   * 父文件夹ID
   */
  parentId?: number;
  /**
   * 团队ID
   */
  teamId: number;
}
