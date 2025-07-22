/**
 * 协作文档信息
 */
export interface CollaborativeDocumentInfoDto {
  /**
   * 自动保存间隔（毫秒）
   */
  autoSaveInterval: number;
  /**
   * 是否启用协作
   */
  collaborationEnabled: boolean;
  /**
   * 创建时间
   */
  createdAt: Date;
  /**
   * Yjs文档ID
   */
  documentId: string;
  /**
   * 文件ID
   */
  fileId: number;
  /**
   * 协作文档ID
   */
  id: number;
  /**
   * 是否活跃
   */
  isActive: boolean;
  /**
   * 最后活动时间
   */
  lastActivity: Date;
  /**
   * 最后修改者ID
   */
  lastModifiedById?: number;
  /**
   * 最后修改者姓名
   */
  lastModifiedByName?: string;
  /**
   * 最大用户数
   */
  maxUsers: number;
  /**
   * 当前在线用户数
   */
  onlineUsersCount: number;
  /**
   * 是否只读模式
   */
  readOnly: boolean;
  /**
   * 文档标题
   */
  title: string;
  /**
   * 更新时间
   */
  updatedAt: Date;
  /**
   * 文档版本号
   */
  version: number;
}

/**
 * 协作文档内容
 */
export interface CollaborativeDocumentContentDto {
  /**
   * Yjs文档ID
   */
  documentId: string;
  /**
   * HTML内容
   */
  htmlContent: string;
  /**
   * 文档ID
   */
  id: number;
  /**
   * JSON内容
   */
  jsonContent: string;
  /**
   * 最后修改时间
   */
  lastModified: Date;
  /**
   * 文档版本号
   */
  version: number;
}
