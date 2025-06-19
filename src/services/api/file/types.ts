import type { FilePermissionLevel } from '@/constants/enum';

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

/**
 * 文件/文件夹树形结构
 */
export interface FileTreeDto {
  /**
   * 子文件/文件夹
   */
  children?: FileTreeDto[];
  /**
   * 文件/文件夹创建时间
   */
  createdAt: string;
  /**
   * 文件扩展名
   */
  ext?: string;
  /**
   * 文件ID
   */
  id: number;
  /**
   * 是否是文件夹
   */
  isFolder: boolean;
  /**
   * 是否是文件所有者
   */
  isOwner: boolean;
  /**
   * 文件/文件夹名称
   */
  name: string;
  /**
   * 文件/文件夹创建者
   */
  owner: FileTreeOwnerDto;
  /**
   * 父文件夹ID
   */
  parentId?: number;
  /**
   * 文件路径
   */
  path?: string;
  /**
   * 文件大小
   */
  size?: number;
  /**
   * 文件/文件夹更新时间
   */
  updatedAt: string;
  /**
   * 文件/文件夹权限
   */
  permission: FilePermissionLevel;
}

/**
 * 文件/文件夹创建者
 */
export interface FileTreeOwnerDto {
  /**
   * 用户头像
   */
  avatar?: string;
  /**
   * 用户ID
   */
  id: number;
  /**
   * 用户昵称
   */
  nickname?: string;
}

interface UploadFileDto {
  /**
   * 文件名
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

interface UploadProgressEvent {
  loaded: number;
  total: number;
  progress: number;
}

export interface UploadOptions extends UploadFileDto {
  file: File;
  onProgress?: (event: UploadProgressEvent) => void;
}

/**
 * 文件/文件夹权限列表项
 */
export interface FilePermissionListItemDto {
  /**
   * 用户头像URL
   */
  avatar: null | string;
  /**
   * 继承自哪个文件/文件夹ID，仅当permissionSource为inherited时有值
   */
  inheritedFrom: number | null;
  /**
   * 用户是否为文件/文件夹所有者
   */
  isOwner: boolean;
  /**
   * 用户昵称
   */
  nickname: null | string;
  permission: FilePermissionLevel;
  permissionSource: PermissionSource;
  /**
   * 用户ID
   */
  userId: number;
}

/**
 * PermissionSource，权限来源：direct(直接设置)、inherited(继承)、team(团队默认)
 */
export enum PermissionSource {
  Direct = 'direct',
  Inherited = 'inherited',
  Team = 'team'
}

/**
 * 更新文件/文件夹权限
 */
export interface UpdatePermissionsDto {
  /**
   * 用户权限列表
   */
  permissions: UserPermissionDto[];
  /**
   * 是否传播到子文件/文件夹
   */
  shouldPropagate: boolean;
}

/**
 * UserPermissionDto
 */
export interface UserPermissionDto {
  permission: number;
  /**
   * 用户ID
   */
  userId: number;
}
