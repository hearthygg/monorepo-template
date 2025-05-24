<template>
  <div class="h-full">
    <div class="h-full cursor-pointer hover:shadow-md transition-all duration-300 group relative border border-gray-200 rounded-lg bg-white" @click="$emit('click')">
      <!-- 选择框 -->
      <div class="absolute top-2 left-2 z-10">
        <input type="checkbox" :checked="isSelected" class="opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded border-gray-300 text-blue-600 focus:ring-blue-500" @change="handleSelect" @click.stop />
      </div>

      <!-- 收藏按钮 -->
      <div class="absolute top-2 right-2 z-10">
        <button class="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white rounded-md flex items-center justify-center" @click.stop="handleStar">
          <StarIcon :class="['h-4 w-4', starred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400']" />
        </button>
      </div>

      <div class="p-4 flex flex-col h-full">
        <!-- 文件图标 -->
        <div class="flex justify-center mb-3">
          <component :is="getFileIcon()" :class="getIconClass()" />
        </div>

        <!-- 文件信息 -->
        <div class="flex-1 space-y-2">
          <h4 class="text-sm font-medium text-gray-900 text-center truncate" :title="name">
            {{ name }}
          </h4>
          <div class="text-xs text-gray-500 text-center space-y-1">
            <div class="truncate">{{ teamName }}</div>
            <div>{{ formatDate(updatedAt) }}</div>
            <div v-if="size">{{ formatFileSize(size) }}</div>
          </div>
        </div>

        <!-- 底部信息 -->
        <div class="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div class="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
            <img v-if="updatedBy.avatarUrl" :src="updatedBy.avatarUrl" :alt="updatedBy.name" class="h-6 w-6 rounded-full object-cover" />
            <span v-else class="text-xs font-medium text-gray-600">
              {{ updatedBy.name.substring(0, 2).toUpperCase() }}
            </span>
          </div>

          <div class="relative">
            <button class="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-gray-100 rounded" @click.stop="showDropdown = !showDropdown">
              <MoreHorizontalIcon class="h-4 w-4" />
            </button>

            <div v-if="showDropdown" class="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10" @click.stop>
              <div class="py-1">
                <button v-if="type !== 'folder'" class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" @click="handleAction('preview')">
                  <EyeIcon class="mr-2 h-4 w-4" />
                  预览
                </button>
                <button class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" @click="handleAction('download')">
                  <DownloadIcon class="mr-2 h-4 w-4" />
                  下载
                </button>
                <button v-if="permissions.canShare" class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" @click="handleAction('share')">
                  <Share2Icon class="mr-2 h-4 w-4" />
                  分享
                </button>
                <hr class="my-1" />
                <button v-if="permissions.canEdit" class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" @click="handleAction('rename')">
                  <Edit3Icon class="mr-2 h-4 w-4" />
                  重命名
                </button>
                <button v-if="permissions.canDelete" class="flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-100" @click="handleAction('delete')">
                  <Trash2Icon class="mr-2 h-4 w-4" />
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  FileText as FileTextIcon,
  Image as ImageIcon,
  FileSpreadsheet as FileSpreadsheetIcon,
  FileCode as FileCodeIcon,
  File as FileIcon,
  Folder as FolderIcon,
  MoreHorizontal as MoreHorizontalIcon,
  Star as StarIcon,
  Download as DownloadIcon,
  Share2 as Share2Icon,
  Trash2 as Trash2Icon,
  Edit3 as Edit3Icon,
  Eye as EyeIcon
} from 'lucide-vue-next';

interface Props {
  id: string;
  name: string;
  type: 'folder' | 'doc' | 'image' | 'spreadsheet' | 'code' | 'other';
  size?: number;
  teamName: string;
  updatedAt: Date;
  updatedBy: {
    name: string;
    avatarUrl?: string;
  };
  isStarred?: boolean;
  isSelected?: boolean;
  permissions: {
    canEdit: boolean;
    canDelete: boolean;
    canShare: boolean;
  };
}

const props = withDefaults(defineProps<Props>(), {
  isStarred: false,
  isSelected: false,
  size: 0
});

const emit = defineEmits<{
  click: [];
  select: [selected: boolean];
  star: [];
  preview: [];
  download: [];
  share: [];
  rename: [];
  delete: [];
}>();

const starred = ref(props.isStarred);
const showDropdown = ref(false);

const getFileIcon = () => {
  switch (props.type) {
    case 'folder':
      return FolderIcon;
    case 'doc':
      return FileTextIcon;
    case 'image':
      return ImageIcon;
    case 'spreadsheet':
      return FileSpreadsheetIcon;
    case 'code':
      return FileCodeIcon;
    default:
      return FileIcon;
  }
};

const getIconClass = () => {
  const baseClass = 'h-12 w-12';
  switch (props.type) {
    case 'folder':
      return `${baseClass} text-blue-500`;
    case 'doc':
      return `${baseClass} text-blue-500`;
    case 'image':
      return `${baseClass} text-green-500`;
    case 'spreadsheet':
      return `${baseClass} text-emerald-500`;
    case 'code':
      return `${baseClass} text-purple-500`;
    default:
      return `${baseClass} text-gray-500`;
  }
};

const formatFileSize = (bytes?: number) => {
  if (!bytes || props.type === 'folder') return '';
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric'
  });
};

const handleStar = () => {
  starred.value = !starred.value;
  emit('star');
};

const handleSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('select', target.checked);
};

const handleAction = (action: string) => {
  showDropdown.value = false;
  switch (action) {
    case 'preview':
      emit('preview');
      break;
    case 'download':
      emit('download');
      break;
    case 'share':
      emit('share');
      break;
    case 'rename':
      emit('rename');
      break;
    case 'delete':
      emit('delete');
      break;
  }
};

// 点击外部关闭下拉菜单
document.addEventListener('click', () => {
  showDropdown.value = false;
});
</script>
