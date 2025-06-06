/**
 * 团队列表
 */
export interface TeamListDto {
  /**
   * 团队头像
   */
  avatar?: string;
  /**
   * 创建时间
   */
  createdAt: Date;
  /**
   * 团队描述
   */
  description: string;
  /**
   * 团队ID
   */
  id: number;
  /**
   * 团队名称
   */
  name: string;
  /**
   * 创建者ID
   */
  ownerId: number;
  /**
   * 成员数量
   */
  memberCount: number;
  /**
   * 文件数量
   */
  fileCount: number;
}
