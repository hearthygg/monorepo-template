<template>
  <ContextMenu :items="menuItems" :x="x" :y="y" :visible="visible" @close="$emit('close')" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Eye, Download, Share2, Star, StarOff, Edit3, Copy, Scissors, Trash2, FolderPlus, FileText, Upload, Info, Lock, Unlock, Archive, RefreshCw, History, Tag, Palette, User } from 'lucide-vue-next';
import ContextMenu from './ContextMenu.vue';
import type { MenuItem, FileContextMenuProps } from '@/types/contextMenu';
import { FilePermissionLevel } from '@/constants/enum';
import type { FileTreeDto } from '@/services/api/file/types';

const props = defineProps<
  FileContextMenuProps & {
    x: number;
    y: number;
    visible: boolean;
  }
>();

const emit = defineEmits<{
  close: [];
  action: [action: string, file: FileTreeDto];
}>();

// 计算菜单项
const menuItems = computed<MenuItem[]>(() => {
  const { selectedFile, permission } = props;

  const items: MenuItem[] = [];
  if (!selectedFile || !permission || selectedFile.id === 0) return items;
  // 预览权限
  if (permission >= FilePermissionLevel.VIEW) {
    // 打开/预览操作放在最前面
    if (selectedFile.isFolder) {
      items.push({
        id: 'open',
        label: '打开',
        icon: Eye,
        shortcut: 'Enter',
        action: () => emit('action', 'open', selectedFile)
      });
    } else {
      items.push({
        id: 'preview',
        label: '预览',
        icon: Eye,
        shortcut: 'Space',
        action: () => emit('action', 'preview', selectedFile)
      });
    }

    // 下载和分享等基础操作
    items.push(
      {
        id: 'download',
        label: '下载',
        icon: Download,
        shortcut: 'Ctrl+D',
        action: () => emit('action', 'download', selectedFile)
      },
      {
        id: 'share',
        label: '分享',
        icon: Share2,
        shortcut: 'Ctrl+Shift+S',
        action: () => emit('action', 'share', selectedFile)
      }
    );
  }

  // 添加基础操作和编辑操作之间的分隔线
  if (permission >= FilePermissionLevel.EDIT) {
    items.push({ id: 'sep1', separator: true } as MenuItem);
  }

  // 编辑权限
  if (permission >= FilePermissionLevel.EDIT) {
    if (selectedFile.isFolder) {
      items.push(
        {
          id: 'createFolder',
          label: '新建文件夹',
          icon: FolderPlus,
          shortcut: 'Enter',
          action: () => emit('action', 'createFolder', selectedFile)
        },
        {
          id: 'uploadFile',
          label: '上传文件',
          icon: Upload,
          shortcut: 'Enter',
          action: () => emit('action', 'uploadFile', selectedFile)
        }
      );
    } else {
      items.push({
        id: 'edit',
        label: '编辑',
        icon: Edit3,
        shortcut: 'Ctrl+E',
        action: () => emit('action', 'edit', selectedFile)
      });
    }

    items.push({
      id: 'rename',
      label: '重命名',
      icon: Edit3,
      shortcut: 'F2',
      action: () => emit('action', 'rename', selectedFile)
    });
  }

  // 添加编辑操作和删除操作之间的分隔线
  if (permission >= FilePermissionLevel.DELETE) {
    items.push({ id: 'sep2', separator: true } as MenuItem);
  }

  // 删除权限
  if (permission >= FilePermissionLevel.DELETE) {
    items.push({
      id: 'delete',
      label: '删除',
      icon: Trash2,
      shortcut: 'Delete',
      action: () => emit('action', 'delete', selectedFile)
    });
  }

  // 添加删除操作和管理操作之间的分隔线
  if (selectedFile.isOwner) {
    items.push({ id: 'sep3', separator: true } as MenuItem);
  }

  // 所有者特权
  if (selectedFile.isOwner) {
    items.push(
      {
        id: 'permission',
        label: '权限设置',
        icon: Lock,
        shortcut: 'Ctrl+Shift+P',
        action: () => emit('action', 'permission', selectedFile)
      },
      {
        id: 'transfer',
        label: '转让所有权',
        icon: User,
        shortcut: 'Ctrl+Shift+T',
        action: () => emit('action', 'transfer', selectedFile)
      }
    );
  }

  // 添加管理操作和属性之间的分隔线
  if (permission >= FilePermissionLevel.VIEW) {
    items.push({ id: 'sep4', separator: true } as MenuItem);
  }

  // 属性始终放在最后
  if (permission >= FilePermissionLevel.VIEW) {
    items.push({
      id: 'properties',
      label: '属性',
      icon: Info,
      shortcut: 'Alt+Enter',
      action: () => emit('action', 'properties', selectedFile)
    });
  }

  return items;
});
</script>
