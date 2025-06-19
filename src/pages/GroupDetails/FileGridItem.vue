<template>
  <div class="h-full group" @contextmenu.prevent.stop="handleContextMenu">
    <div class="h-full cursor-pointer hover:shadow-md transition-all duration-300 bg-white rounded-lg border border-gray-200 relative">
      <!-- 选择框 -->
      <div class="absolute top-2 left-2 z-10">
        <input
          type="checkbox"
          :checked="isSelected"
          class="opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded border-gray-300"
          @change="(e: Event) => emit('select', file.id, (e.target as HTMLInputElement).checked)"
          @click.stop
        />
      </div>

      <!-- 收藏按钮 -->
      <!-- <div class="absolute top-2 right-2 z-10">
        <button class="p-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white rounded">
          <Star :class="['h-4 w-4', file.isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400']" />
        </button>
      </div> -->

      <div class="p-4 flex flex-col h-full" @click="$emit('click', file)">
        <!-- 文件图标 -->
        <div class="flex justify-center mb-3">
          <component :is="getFileIcon()" class="h-12 w-12" />
        </div>

        <!-- 文件信息 -->
        <div class="flex-1 space-y-2">
          <h4 class="text-sm font-medium text-gray-900 text-center truncate" :title="file.name">
            {{ file.name }}
          </h4>
          <div class="text-xs text-gray-500 text-center space-y-1">
            <div class="truncate">{{ teamName }}</div>
            <div>{{ file.updatedAt }}</div>
            <div v-if="file.size">{{ formatFileSize(file.size) }}</div>
          </div>
        </div>

        <!-- 底部信息 -->
        <div class="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div class="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
            <span class="text-xs font-medium">{{ file.owner.nickname?.substring(0, 2).toUpperCase() }}</span>
          </div>

          <button class="p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-200 rounded">
            <MoreHorizontal class="h-4 w-4" />
          </button>
        </div>
      </div>
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
  (e: 'contextmenu', file: FileTreeDto, event: MouseEvent): void;
}>();

const getFileIcon = (): typeof File => {
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
    day: 'numeric'
  }).format(date);
};

const handleContextMenu = (e: MouseEvent): void => {
  emit('contextmenu', props.file, e);
};
</script>
