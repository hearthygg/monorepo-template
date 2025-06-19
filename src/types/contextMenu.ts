import type { FilePermissionLevel } from '@/constants/enum';
import type { FileTreeDto } from '@/services/api/file/types';

export interface MenuItem {
  id: string;
  label: string;
  icon?: any;
  shortcut?: string;
  disabled?: boolean;
  hidden?: boolean;
  danger?: boolean;
  separator?: boolean;
  children?: MenuItem[];
  action?: () => void | Promise<void>;
}

export interface ContextMenuProps {
  items: MenuItem[];
  x: number;
  y: number;
  visible: boolean;
  onClose: () => void;
}

export interface FileContextMenuProps {
  selectedFile: FileTreeDto | null;
  permission: FilePermissionLevel | null;
  onAction: (action: string, file: FileTreeDto) => void;
}

export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  fileType?: 'doc' | 'image' | 'video' | 'audio' | 'archive' | 'code' | 'other';
  size?: number;
  isStarred?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  canShare?: boolean;
}

export interface FilePermissions {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canShare: boolean;
  canManage: boolean;
}
