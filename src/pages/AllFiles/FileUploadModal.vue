<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
    <div class="absolute inset-0" @click="$emit('close')"></div>

    <div class="relative bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] flex flex-col" @click.stop>
      <!-- 头部 -->
      <div class="flex justify-between items-center p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">上传文件</h2>
        <button class="p-2 hover:bg-gray-100 rounded-md" @click="$emit('close')">
          <XIcon class="h-4 w-4" />
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
          <UploadIcon class="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p class="text-lg font-medium text-gray-900 mb-2">拖拽文件到此处上传</p>
          <p class="text-sm text-gray-500 mb-4">或者点击下方按钮选择文件</p>
          <button class="px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50" @click="$refs.fileInput?.click()">选择文件</button>
          <input ref="fileInput" type="file" multiple class="hidden" @change="handleFileSelect" />
        </div>

        <!-- 文件列表 -->
        <div v-if="uploadFiles.length > 0" class="mt-6 space-y-3">
          <h3 class="text-sm font-medium text-gray-900">待上传文件</h3>
          <div class="space-y-2 max-h-60 overflow-y-auto">
            <div v-for="(uploadFile, index) in uploadFiles" :key="index" class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <component :is="getStatusIcon(uploadFile.status)" :class="getStatusIconClass(uploadFile.status)" />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ uploadFile.file.name }}</p>
                <p class="text-xs text-gray-500">{{ formatFileSize(uploadFile.file.size) }}</p>
                <div v-if="uploadFile.status === 'uploading'" class="mt-1">
                  <div class="w-full bg-gray-200 rounded-full h-1">
                    <div class="bg-blue-500 h-1 rounded-full transition-all duration-300" :style="{ width: `${uploadFile.progress}%` }"></div>
                  </div>
                </div>
                <p v-if="uploadFile.error" class="text-xs text-red-500 mt-1">{{ uploadFile.error }}</p>
              </div>
              <button v-if="uploadFile.status === 'pending'" class="h-8 w-8 flex items-center justify-center hover:bg-gray-200 rounded" @click="removeFile(index)">
                <XIcon class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部操作 -->
      <div class="flex justify-end gap-2 p-6 border-t border-gray-200">
        <button :disabled="isUploading" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50" @click="$emit('close')">取消</button>
        <button :disabled="!canUpload || isUploading" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center" @click="startUpload">
          <Loader2Icon v-if="isUploading" class="mr-2 h-4 w-4 animate-spin" />
          {{ isUploading ? '上传中...' : `上传 ${pendingFilesCount} 个文件` }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { X as XIcon, Upload as UploadIcon, File as FileIcon, CheckCircle as CheckCircleIcon, AlertCircle as AlertCircleIcon, Loader2 as Loader2Icon } from 'lucide-vue-next';

interface Props {
  isOpen: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  close: [];
  upload: [files: File[]];
}>();

interface UploadFile {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

const uploadFiles = ref<UploadFile[]>([]);
const isDragging = ref(false);
const fileInput = ref<HTMLInputElement>();

const canUpload = computed(() => uploadFiles.value.some(f => f.status === 'pending'));
const isUploading = computed(() => uploadFiles.value.some(f => f.status === 'uploading'));
const pendingFilesCount = computed(() => uploadFiles.value.filter(f => f.status === 'pending').length);

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    addFiles(target.files);
  }
};

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  isDragging.value = false;
  if (e.dataTransfer?.files) {
    addFiles(e.dataTransfer.files);
  }
};

const handleDragOver = (e: DragEvent) => {
  e.preventDefault();
  isDragging.value = true;
};

const handleDragLeave = (e: DragEvent) => {
  e.preventDefault();
  isDragging.value = false;
};

const addFiles = (files: FileList) => {
  const newFiles: UploadFile[] = Array.from(files).map(file => ({
    file,
    progress: 0,
    status: 'pending'
  }));
  uploadFiles.value.push(...newFiles);
};

const removeFile = (index: number) => {
  uploadFiles.value.splice(index, 1);
};

const startUpload = async () => {
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
  } catch (error) {
    console.error('Upload failed:', error);
  }
};

const formatFileSize = (bytes: number) => {
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'uploading':
      return Loader2Icon;
    case 'success':
      return CheckCircleIcon;
    case 'error':
      return AlertCircleIcon;
    default:
      return FileIcon;
  }
};

const getStatusIconClass = (status: string) => {
  const baseClass = 'h-4 w-4';
  switch (status) {
    case 'uploading':
      return `${baseClass} animate-spin text-blue-500`;
    case 'success':
      return `${baseClass} text-green-500`;
    case 'error':
      return `${baseClass} text-red-500`;
    default:
      return `${baseClass} text-gray-500`;
  }
};
</script>
