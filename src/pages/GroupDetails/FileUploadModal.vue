<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
    <div class="absolute inset-0"></div>

    <div class="relative bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] flex flex-col" @click.stop>
      <!-- 头部 -->
      <div class="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">上传文件</h2>
        <button class="p-2 hover:bg-gray-100 rounded-md" @click="closeModal">
          <X class="h-4 w-4" />
        </button>
      </div>
      <div class="ml-2 mt-2">
        <BreadcrumbNav :is-trigger="false" :items="breadcrumbItems" />
      </div>

      <!-- 内容区域 -->
      <div class="flex-1 p-4">
        <!-- 拖拽上传区域 -->
        <div
          :class="['border-2 border-dashed rounded-lg p-8 text-center transition-colors', isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400']"
          @drop="handleDrop"
          @dragover="handleDragOver"
          @dragleave="handleDragLeave"
        >
          <Upload class="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p class="text-lg font-medium text-gray-900 mb-2">拖拽文件到此处上传</p>
          <p class="text-sm text-gray-500 mb-4">或者点击下方按钮选择文件</p>
          <button class="px-4 py-2 border border-blue-500 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors" @click="fileInput?.click()">选择文件</button>
          <input ref="fileInput" type="file" multiple class="hidden" @change="handleFileSelect" />
        </div>

        <!-- 文件列表 -->
        <div v-if="uploadFiles.length > 0" class="mt-4 space-y-2">
          <h3 class="text-sm font-medium text-gray-900">待上传文件</h3>
          <div class="space-y-2 max-h-60 overflow-y-auto">
            <div v-for="(uploadFile, index) in uploadFiles" :key="index" class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
              <component :is="getStatusIcon(uploadFile.status)" />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ uploadFile.file.name }}</p>
                <p class="text-xs text-gray-500">{{ formatFileSize(uploadFile.file.size) }}</p>
                <div v-if="uploadFile.status === 'uploading'" class="mt-1 w-full bg-gray-200 rounded-full h-1">
                  <div class="bg-blue-600 h-1 rounded-full transition-all duration-300" :style="{ width: `${uploadFile.progress}%` }"></div>
                </div>
                <p v-if="uploadFile.error" class="text-xs text-red-500 mt-1">{{ uploadFile.error }}</p>
              </div>
              <button v-if="uploadFile.status === 'pending'" class="p-1 hover:bg-gray-300 rounded transition-colors" @click="removeFile(index)">
                <X class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部操作 -->
      <div class="flex justify-end gap-2 p-4 border-t border-gray-200">
        <button :disabled="isUploading" class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50" @click="closeModal">取消</button>
        <button :disabled="!canUpload || isUploading" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50 flex items-center" @click="startUpload">
          <Loader2 v-if="isUploading" class="mr-2 h-4 w-4 animate-spin" />
          {{ isUploading ? '上传中...' : `上传 ${uploadFiles.filter(f => f.status === 'pending').length} 个文件` }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { X, Upload, Loader2, File, CheckCircle, AlertCircle } from 'lucide-vue-next';
import { uploadFileApi } from '@/services/api/file';
import { ElMessage } from 'element-plus';
import BreadcrumbNav from './BreadcrumbNav.vue';
import type { BreadcrumbItem } from '@/types/file';
import type { FileTreeDto } from '@/services/api/file/types';

// Props 定义
const props = defineProps<{
  teamId: number;
  folderId: number;
  teamName: string;
  fileTree: FileTreeDto[];
}>();
// 计算属性 面包屑导航文件路径
const breadcrumbItems = computed((): BreadcrumbItem[] => {
  const findPath = (nodes: FileTreeDto[], targetId: number, path: FileTreeDto[] = []): FileTreeDto[] | null => {
    for (const node of nodes) {
      const newPath = [...path, node];
      if (node.id === targetId) return newPath;
      if (node.children) {
        const found = findPath(node.children, targetId, newPath);
        if (found) return found;
      }
    }
    return null;
  };

  const path = findPath(props.fileTree, props.folderId);
  if (path) {
    return path.map(node => ({
      id: node.id,
      name: node.name === '团队文件' ? props.teamName : node.name,
      type: node.id === 0 ? 'home' : 'folder'
    }));
  }

  return [{ id: 0, name: props.teamName, type: 'home' }];
});
// 类型定义
type UploadStatus = 'pending' | 'uploading' | 'success' | 'error';

interface UploadFile {
  file: File;
  progress: number;
  status: UploadStatus;
  error: string | null;
}

// 组件事件定义
const emit = defineEmits<{
  (e: 'success'): void;
  (e: 'close'): void;
}>();

// 响应式状态
const uploadFiles = ref<UploadFile[]>([]);
const isDragging = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

// 计算属性
const isUploading = ref(false);
const canUpload = computed((): boolean => uploadFiles.value.some(f => f.status === 'pending'));

// 事件处理函数
const handleFileSelect = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (files) {
    addFiles(Array.from(files));
  }
};

const handleDrop = (event: DragEvent): void => {
  event.preventDefault();
  isDragging.value = false;
  const files = event.dataTransfer?.files;
  if (files) {
    addFiles(Array.from(files));
  }
};

const handleDragOver = (event: DragEvent): void => {
  event.preventDefault();
  isDragging.value = true;
};

const handleDragLeave = (event: DragEvent): void => {
  event.preventDefault();
  isDragging.value = false;
};

// 文件处理函数
const addFiles = (files: File[]): void => {
  const newFiles: UploadFile[] = files.map(file => ({
    file,
    progress: 0,
    status: 'pending',
    error: null
  }));
  uploadFiles.value.push(...newFiles);
};

const removeFile = (index: number): void => {
  uploadFiles.value.splice(index, 1);
};

// 开始上传
const startUpload = async (): Promise<void> => {
  const filesToUpload = uploadFiles.value.filter(f => f.status === 'pending');
  isUploading.value = true;

  try {
    // 设置最大并发数
    const MAX_CONCURRENT = 3;

    // 将文件分组，每组最多 MAX_CONCURRENT 个文件
    const chunks = [];
    for (let i = 0; i < filesToUpload.length; i += MAX_CONCURRENT) {
      chunks.push(filesToUpload.slice(i, i + MAX_CONCURRENT));
    }

    // 处理每一组文件
    for (const chunk of chunks) {
      const uploadPromises = chunk.map(async file => {
        const fileIndex = uploadFiles.value.findIndex(f => f === file);
        const currentFile = uploadFiles.value[fileIndex];

        // 更新状态为上传中
        currentFile.status = 'uploading';
        console.log('currentFile', currentFile);
        try {
          // 使用封装的上传API
          await uploadFileApi({
            file: currentFile.file,
            teamId: props.teamId,
            parentId: props.folderId === 0 ? undefined : props.folderId,
            name: currentFile.file.name,
            onProgress: event => {
              // 更新进度
              currentFile.progress = event.progress;
            }
          });

          // 标记为成功
          currentFile.status = 'success';
          currentFile.progress = 100;
        } catch (error) {
          // 标记为失败
          currentFile.status = 'error';
          currentFile.error = error instanceof Error ? error.message : '上传失败';
          throw error; // 重新抛出错误，以便 Promise.all 捕获
        }
      });

      // 等待当前组的所有文件上传完成
      await Promise.all(uploadPromises);
    }

    // 检查是否所有文件都上传成功
    const allSuccess = uploadFiles.value.every(f => f.status === 'success');

    if (allSuccess) {
      // 所有文件上传成功，关闭模态框
      emit('success');
      ElMessage.success('所有文件上传成功');
    } else {
      // 有文件上传失败，显示错误信息
      ElMessage.error('部分文件上传失败，请重试');
    }
  } finally {
    isUploading.value = false;
  }
};

const getStatusIcon = (status: UploadStatus) => {
  switch (status) {
    case 'uploading':
      return Loader2;
    case 'success':
      return CheckCircle;
    case 'error':
      return AlertCircle;
    default:
      return File;
  }
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0.0 B';
  // 定义文件大小的单位数组，依次对应：字节（B）、千字节（KB）、兆字节（MB）、吉字节（GB）
  // 数组索引 0 到 3 分别对应 1024^0 到 1024^3 的量级
  const sizes = ['B', 'KB', 'MB', 'GB'];
  // 对数的换底公式：log_a(b) = log_c(b) / log_c(a)
  // Math.log(bytes) / Math.log(1024) 等价于以 1024 为底的对数（即 log₁₀₂₄(bytes)）
  // 计算量级指数i
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  // 计算当前量级下的文件大小，并保留一位小数
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

const closeModal = (): void => {
  emit('close');
};
</script>
