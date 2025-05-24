<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
    <div class="absolute inset-0" @click="$emit('close')"></div>

    <div class="relative bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] flex flex-col" @click.stop>
      <!-- 头部 -->
      <div class="flex justify-between items-center p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">上传文件</h2>
        <button class="p-2 hover:bg-gray-100 rounded-md" @click="closeModal">
          <X class="h-4 w-4" />
        </button>
      </div>

      <!-- 内容区域 -->
      <div class="flex-1 p-6 overflow-y-auto">
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
          <button class="px-4 py-2 border border-blue-500 text-blue-600 hover:bg-blue-50 rounded-md transition-colors">选择文件</button>
          <input ref="fileInput" type="file" multiple class="hidden" @change="handleFileSelect" />
        </div>

        <!-- 文件列表 -->
        <div v-if="uploadFiles.length > 0" class="mt-6 space-y-3">
          <h3 class="text-sm font-medium text-gray-900">待上传文件</h3>
          <div class="space-y-2 max-h-60 overflow-y-auto">
            <div v-for="(uploadFile, index) in uploadFiles" :key="index" class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
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
      <div class="flex justify-end gap-2 p-6 border-t border-gray-200">
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
  (e: 'upload', files: File[]): void;
  (e: 'close'): void;
}>();

// 响应式状态
const uploadFiles = ref<UploadFile[]>([]);
const isDragging = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

// 计算属性
const isUploading = computed((): boolean => uploadFiles.value.some(f => f.status === 'uploading'));
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

const startUpload = async (): Promise<void> => {
  const filesToUpload = uploadFiles.value.filter(f => f.status === 'pending');

  for (let i = 0; i < filesToUpload.length; i++) {
    const fileIndex = uploadFiles.value.findIndex(f => f === filesToUpload[i]);

    // 更新状态为上传中
    uploadFiles.value[fileIndex].status = 'uploading';

    try {
      // 模拟上传进度
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        uploadFiles.value[fileIndex].progress = progress;
      }

      // 标记为成功
      uploadFiles.value[fileIndex].status = 'success';
    } catch (error) {
      // 标记为失败
      uploadFiles.value[fileIndex].status = 'error';
      uploadFiles.value[fileIndex].error = '上传失败';
    }
  }

  // 调用父组件的上传函数
  try {
    await emit(
      'upload',
      filesToUpload.map(f => f.file)
    );
    emit('close');
  } catch (error) {
    console.error('Upload failed:', error);
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
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

const closeModal = (): void => {
  emit('close');
};
</script>
