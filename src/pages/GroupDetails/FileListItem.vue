<template>
  <div class="group flex items-center gap-4 p-3 rounded-lg cursor-pointer border border-transparent hover:border-gray-200 hover:bg-blue-50/20 transition-all" @click="emit('click', file)">
    <!-- 选择框 -->
    <div class="flex items-center">
      <input type="checkbox" :checked="isSelected" class="opacity-0 group-hover:opacity-100 transition-opacity rounded border-gray-300" @change="(e: Event) => emit('select', file.id, (e.target as HTMLInputElement).checked)" @click.stop />
    </div>

    <!-- 文件图标 -->
    <div class="flex-shrink-0">
      <component :is="getFileIcon()" class="h-8 w-8" />
    </div>

    <!-- 文件信息 -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2">
        <h4 class="text-sm font-medium text-gray-900 truncate">{{ file.name }}</h4>
        <span v-if="file.isFolder" class="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"> 文件夹 </span>
      </div>
      <div class="flex items-center mt-1 text-xs text-gray-500 gap-2">
        <span class="truncate">{{ teamName }}</span>
        <span>•</span>
        <span>{{ file.updatedAt }}</span>
        <span v-if="file.size">•</span>
        <span v-if="file.size">{{ formatFileSize(file.size) }}</span>
      </div>
    </div>

    <!-- 更新者头像 -->
    <div class="flex-shrink-0">
      <div class="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
        <span class="text-xs font-medium">{{ file.owner.nickname?.substring(0, 2).toUpperCase() }}</span>
      </div>
    </div>

    <!-- 收藏按钮 -->
    <!-- <div class="flex-shrink-0">
      <button class="p-1 hover:bg-gray-200 rounded transition-colors">
        <Star :class="['h-4 w-4', file.isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400']" />
      </button>
    </div> -->

    <!-- 操作菜单 -->
    <div class="flex-shrink-0">
      <button class="p-1 hover:bg-gray-200 rounded transition-colors">
        <MoreHorizontal class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FileTreeDto } from '@/services/api/file/types';
import { FileText, ImageIcon, FileSpreadsheet, FileCode, File, Folder, Star, MoreHorizontal } from 'lucide-vue-next';

// 类型定义
type FileType = 'folder' | 'doc' | 'image' | 'spreadsheet' | 'code';

interface User {
  name: string;
}

interface FileItem {
  id: string;
  name: string;
  type: FileType;
  size?: number;
  updatedAt: Date;
  updatedBy: User;
  isStarred: boolean;
}

// Props 定义
const props = defineProps<{
  file: FileTreeDto;
  teamName: string;
  isSelected: boolean;
}>();

// Emits 定义
const emit = defineEmits<{
  (e: 'select', fileId: number, checked: boolean): void;
  (e: 'click', file: FileTreeDto): void;
}>();

const getFileIcon = (): typeof File => {
  // const iconClass = "text-blue-500"
  if (props.file.isFolder) {
    return Folder;
  }
  switch (props.file.ext) {
    case 'doc':
      return FileText;
    case 'image':
      return ImageIcon;
    case 'spreadsheet':
      return FileSpreadsheet;
    case 'code':
      return FileCode;
    default:
      return File;
  }
};

const formatFileSize = (bytes: number): string => {
  if (!bytes || props.file.isFolder) return '';
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};
</script>
