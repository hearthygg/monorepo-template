import { ref, nextTick } from 'vue';
import type { FileTreeDto } from '@/services/api/file/types';
import type { FilePermissionLevel } from '@/constants/enum';

export function useContextMenu() {
  const contextMenu = ref({
    visible: false,
    x: 0,
    y: 0,
    selectedFile: null as FileTreeDto | null,
    permission: null as FilePermissionLevel | null
  });

  const showContextMenu = async (event: MouseEvent, file: FileTreeDto, permission: FilePermissionLevel) => {
    event.preventDefault();

    contextMenu.value = {
      visible: true,
      x: event.clientX,
      y: event.clientY,
      selectedFile: file,
      permission: permission
    };

    // 确保菜单在下一帧显示，避免位置计算错误
    await nextTick();
  };

  const hideContextMenu = () => {
    contextMenu.value.visible = false;
  };

  const handleContextMenuAction = async (action: string, file: FileTreeDto) => {
    console.log(`执行操作: ${action}`, file);

    // 这里可以根据不同的操作执行相应的逻辑
    switch (action) {
      case 'open':
        console.log('打开文件/文件夹');
        break;
      case 'preview':
        console.log('预览文件');
        break;
      case 'download':
        console.log('下载文件');
        break;
      case 'share':
        console.log('分享文件');
        break;
      case 'star':
        console.log('收藏文件');
        break;
      case 'unstar':
        console.log('取消收藏');
        break;
      case 'copy':
        console.log('复制文件');
        break;
      case 'cut':
        console.log('剪切文件');
        break;
      case 'rename':
        console.log('重命名文件');
        break;
      case 'delete':
        console.log('删除文件');
        break;
      case 'properties':
        console.log('查看属性');
        break;
      default:
        console.log(`未知操作: ${action}`);
    }

    hideContextMenu();
  };

  return {
    contextMenu,
    showContextMenu,
    hideContextMenu,
    handleContextMenuAction
  };
}
