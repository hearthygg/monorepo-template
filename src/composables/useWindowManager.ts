import { reactive, computed } from 'vue';
import type { WindowState, WindowManagerState } from '@/types/window';
import type { FileTreeDto } from '@/services/api/file/types';

const windowManager = reactive<WindowManagerState>({
  windows: [] as WindowState[],
  activeWindowId: null,
  nextZIndex: 1000
});

export function useWindowManager() {
  const createWindow = (type: WindowState['type'], title: string, data: FileTreeDto, options?: Partial<Pick<WindowState, 'position' | 'size'>>): string => {
    const id = data.id.toString();

    const defaultSize = {
      width: Math.min(800, window.innerWidth - 100),
      height: Math.min(600, window.innerHeight - 100)
    };

    const defaultPosition = {
      x: Math.max(50, (window.innerWidth - defaultSize.width) / 2 + Math.random() * 50),
      y: Math.max(50, (window.innerHeight - defaultSize.height) / 2 + Math.random() * 50)
    };

    const newWindow: WindowState = {
      id,
      title,
      type,
      status: 'normal',
      position: options?.position || defaultPosition,
      size: options?.size || defaultSize,
      zIndex: windowManager.nextZIndex++,
      data,
      icon: getWindowIcon(type)
    };

    windowManager.windows.push(newWindow);
    windowManager.activeWindowId = id;

    return id;
  };

  const closeWindow = (id: string) => {
    const index = windowManager.windows.findIndex(w => w.id === id);
    if (index !== -1) {
      windowManager.windows.splice(index, 1);
      if (windowManager.activeWindowId === id) {
        windowManager.activeWindowId = windowManager.windows.length > 0 ? windowManager.windows[windowManager.windows.length - 1].id : null;
      }
    }
  };

  const minimizeWindow = (id: string) => {
    const window = windowManager.windows.find(w => w.id === id);
    if (window) {
      window.status = 'minimized';
      console.log(window, '最小化');
    }
  };

  const maximizeWindow = (id: string) => {
    const window = windowManager.windows.find(w => w.id === id);
    if (window) {
      window.status = window.status === 'maximized' ? 'normal' : 'maximized';
    }
  };
  const changeWindowStatus = (id: string) => {
    const window = windowManager.windows.find(w => w.id === id);
    if (window) {
      if (window.status === 'minimized') {
        restoreWindow(id);
      } else {
        minimizeWindow(id);
      }
    }
  };
  const restoreWindow = (id: string) => {
    const window = windowManager.windows.find(w => w.id === id);
    if (window) {
      window.status = 'normal';
      windowManager.activeWindowId = id;
      window.zIndex = windowManager.nextZIndex++;
    }
  };

  const focusWindow = (id: string) => {
    const window = windowManager.windows.find(w => w.id === id);
    if (window && window.status !== 'minimized') {
      windowManager.activeWindowId = id;
      window.zIndex = windowManager.nextZIndex++;
    }
  };

  const updateWindowPosition = (id: string, position: { x: number; y: number }) => {
    const window = windowManager.windows.find(w => w.id === id);
    if (window) {
      window.position = position;
    }
  };

  const updateWindowSize = (id: string, size: { width: number; height: number }) => {
    const window = windowManager.windows.find(w => w.id === id);
    if (window) {
      window.size = size;
    }
  };

  const openFileWindow = (file: FileTreeDto, type: WindowState['type'] = 'view', options?: Partial<Pick<WindowState, 'position' | 'size'>>) => {
    // 检查是否已经打开了相同文件
    const existingWindow = windowManager.windows.find(w => w.data?.id === file.id);

    if (existingWindow) {
      if (existingWindow.status === 'minimized') {
        restoreWindow(existingWindow.id);
      } else {
        focusWindow(existingWindow.id);
      }
      return existingWindow.id;
    }

    return createWindow(type, file.name, file, options);
  };

  const getWindowIcon = (type: WindowState['type']): string => {
    switch (type) {
      case 'view':
        return '📄';
      case 'edit':
        return '📁';
      default:
        return '🪟';
    }
  };

  const visibleWindows = computed(() => windowManager.windows.filter(w => w.status !== 'minimized'));

  const minimizedWindows = computed(() => windowManager.windows.filter(w => w.status === 'minimized'));

  return {
    windowManager,
    visibleWindows,
    minimizedWindows,
    createWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    focusWindow,
    updateWindowPosition,
    updateWindowSize,
    openFileWindow,
    changeWindowStatus
  };
}
