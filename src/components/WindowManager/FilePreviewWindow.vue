<template>
  <div class="file-preview-window h-full flex flex-col">
    <!-- 文件信息栏 -->
    <!-- <div class="file-info bg-gray-50 px-4 py-2 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <component :is="getFileIcon(file.ext || '')" class="h-5 w-5" :class="getFileIconColor(file.ext || '')" />
        <div>
          <div class="font-medium text-sm">{{ file.name }}</div>
          <div class="text-xs text-gray-500">{{ formatFileSize(file.size || 0) }} • {{ formatDate(new Date(file.createdAt)) }}</div>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="downloadFile"
          class="p-1 hover:bg-gray-200 rounded"
          title="下载"
        >
          <DownloadIcon class="h-4 w-4" />
        </button>
      </div>
    </div> -->

    <!-- 文件内容区域 -->
    <div class="file-content flex-1 overflow-auto">
      <!-- 图片预览 - 使用新的ImagePreview组件 -->
      <ImagePreview v-if="isImageFile" :file="file" class="h-full" />

      <!-- 视频预览 - 使用新的VideoPreview组件 -->
      <VideoPreview v-else-if="isVideoFile" :file="file" class="h-full" />

      <!-- 音频预览 -->
      <div v-else-if="file.ext === 'mp3' || file.ext === 'wav' || file.ext === 'ogg' || file.ext === 'm4a' || file.ext === 'aac'" class="h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
        <div class="mb-8">
          <Icon :icon="getIconNameByFile(file.ext || '')" class="h-16 w-16 text-purple-600" />
        </div>
        <audio :src="file.path" controls class="w-80">您的浏览器不支持音频播放。</audio>
        <div class="mt-4 text-center">
          <div class="font-medium text-gray-800">{{ file.name }}</div>
          <div class="text-sm text-gray-600">{{ formatFileSize(file.size || 0) }}</div>
        </div>
      </div>

      <!-- 文本/代码预览 -->
      <div v-else-if="file.ext === 'js' || file.ext === 'ts'" class="h-full">
        <div class="p-4 h-full">
          <pre class="bg-gray-900 text-green-400 p-4 rounded-lg h-full overflow-auto text-sm font-mono">{{ getFileContent(file) }}</pre>
        </div>
      </div>

      <!-- PDF预览 - 使用新的PDFPreview组件 -->
      <PDFPreview v-else-if="file.ext === 'pdf'" :file="file" class="h-full" />

      <!-- 其他文件类型 -->
      <div v-else class="h-full flex items-center justify-center bg-gray-50">
        <div class="text-center">
          <Icon :icon="getIconNameByFile(file.ext || '')" class="h-16 w-16 mx-auto mb-4" />
          <div class="font-medium text-gray-800 mb-2">{{ file.name }}</div>
          <div class="text-sm text-gray-600 mb-4">无法预览此文件类型</div>
          <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" @click="downloadFile">下载文件</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { FileText as FileTextIcon, Image as ImageIcon, Video as VideoIcon, Music as MusicIcon, File as FileIcon } from 'lucide-vue-next';
import type { FileTreeDto } from '@/services/api/file/types';
import { ElMessage } from 'element-plus';
import ImagePreview from './ImagePreview.vue';
import VideoPreview from './VideoPreview.vue';
import PDFPreview from './PDFPreview.vue';
import { Icon } from '@iconify/vue';
import { getIconNameByFile } from '@/utils/file-icon-map';

interface Props {
  file: FileTreeDto;
}

const props = defineProps<Props>();

// 判断是否为图片文件
const isImageFile = computed(() => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'ico'];
  return imageExtensions.includes(props.file.ext || '');
});

// 判断是否为视频文件
const isVideoFile = computed(() => {
  const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', 'm4v'];
  return videoExtensions.includes(props.file.ext || '');
});

// 获取文件图标
const getFileIcon = (type: string) => {
  switch (type) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'bmp':
    case 'webp':
      return ImageIcon;
    case 'mp4':
    case 'avi':
    case 'mov':
    case 'wmv':
    case 'flv':
    case 'webm':
    case 'mkv':
    case 'm4v':
      return VideoIcon;
    case 'mp3':
    case 'wav':
    case 'ogg':
    case 'm4a':
    case 'aac':
      return MusicIcon;
    case 'js':
    case 'ts':
      return FileTextIcon;
    case 'pdf':
      return FileIcon;
    default:
      return FileIcon;
  }
};

// 获取文件图标颜色
const getFileIconColor = (type: string) => {
  switch (type) {
    case 'png':
    case 'jpeg':
    case 'gif':
    case 'bmp':
    case 'webp':
      return 'text-green-600';
    case 'mp4':
    case 'avi':
    case 'mov':
    case 'wmv':
    case 'flv':
    case 'webm':
    case 'mkv':
    case 'm4v':
      return 'text-purple-600';
    case 'mp3':
    case 'wav':
    case 'ogg':
    case 'm4a':
    case 'aac':
      return 'text-blue-600';
    case 'js':
    case 'ts':
      return 'text-orange-600';
    case 'pdf':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// 格式化日期
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 下载文件
const downloadFile = () => {
  if (!props.file.path) {
    ElMessage.error('文件路径不存在');
    return;
  }
  const link = document.createElement('a');
  link.href = props.file.path;
  link.download = props.file.name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// 获取文件内容（模拟）
const getFileContent = (file: FileTreeDto) => {
  // 这里可以添加实际的文本文件读取逻辑
  return `// ${file.name}\n// 文件大小: ${formatFileSize(file.size || 0)}\n// 创建时间: ${formatDate(new Date(file.createdAt))}\n\n// 这里是文件内容预览...`;
};
</script>
