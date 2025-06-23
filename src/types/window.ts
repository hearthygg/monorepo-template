export interface WindowState {
  id: string;
  title: string;
  type: 'file-preview' | 'folder' | 'settings';
  status: 'normal' | 'maximized' | 'minimized';
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  data?: any;
  icon?: string;
}

export interface FilePreviewData {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'pdf' | 'doc' | 'code' | 'text' | 'other';
  url: string;
  size?: number;
  lastModified?: Date;
}

export interface WindowManagerState {
  windows: WindowState[];
  activeWindowId: string | null;
  nextZIndex: number;
}
