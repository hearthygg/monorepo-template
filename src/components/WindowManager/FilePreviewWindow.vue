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
      <ImagePreview v-if="SUPPORTED_FILE_TYPES.IMAGE.includes(file.ext || '')" :file="file" class="h-full" />

      <!-- 视频预览 - 使用新的VideoPreview组件 -->
      <VideoPreview v-else-if="SUPPORTED_FILE_TYPES.VIDEO.includes(file.ext || '')" :file="file" class="h-full" />

      <!-- 音频预览 -->
      <div v-else-if="SUPPORTED_FILE_TYPES.AUDIO.includes(file.ext || '')" class="h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
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
      <div v-else-if="SUPPORTED_FILE_TYPES.CODE.includes(file.ext || '') || SUPPORTED_FILE_TYPES.MARKDOWN.includes(file.ext || '') || SUPPORTED_FILE_TYPES.TEXT.includes(file.ext || '')" class="w-full h-full flex flex-col">
        <!-- Markdown 编辑/预览切换，仅在md文件时显示 -->
        <div v-if="SUPPORTED_FILE_TYPES.MARKDOWN.includes(file.ext || '')" class="flex text-white items-center px-4 py-2 bg-[#1E1E1E]">
          <button :class="['mr-2', !isMdPreview ? 'font-bold text-blue-600' : '']" @click="isMdPreview = false">编辑</button>
          <button :class="[isMdPreview ? 'font-bold text-blue-600' : '']" @click="isMdPreview = true">预览</button>
        </div>
        <!-- 编辑模式 -->
        <div v-if="SUPPORTED_FILE_TYPES.MARKDOWN.includes(file.ext || '') ? !isMdPreview : true" class="w-full h-full flex flex-col">
          <MonacoEditor v-model="fileContent" :read-only="!isEditable" :file-ext="file.ext" class="flex-1" @save="saveFileContent" />
          <div class="h-8 flex items-center px-4 text-xs text-white bg-[#1E1E1E]">
            <span v-if="isSaving">保存中...</span>
            <span v-else-if="saveError" class="text-red-500">保存失败</span>
            <span v-else-if="!isDirty">已自动保存</span>
            <span v-else>有未保存更改</span>
          </div>
        </div>
        <!-- 预览模式，仅md文件 -->
        <div v-if="SUPPORTED_FILE_TYPES.MARKDOWN.includes(file.ext || '') && isMdPreview" class="markdown-preview p-6 prose prose-invert max-w-none overflow-auto bg-[#1E1E1E] text-gray-100" v-html="renderedHtml"></div>
      </div>

      <!-- PDF预览 - 使用新的PDFPreview组件 -->
      <PDFPreview v-else-if="file.ext === 'pdf'" :file="file" class="h-full" />

      <!-- 协作超级文档 -->
      <TiptapCollaborate v-else-if="file.ext === 'sdoc'" :is-editable="isEditable" :file="file" class="h-full" />

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
import { computed, ref, watch } from 'vue';
import type { FileTreeDto } from '@/services/api/file/types';
import { ElMessage } from 'element-plus';
import ImagePreview from './ImagePreview.vue';
import VideoPreview from './VideoPreview.vue';
import PDFPreview from './PDFPreview.vue';
import { Icon } from '@iconify/vue';
import { getIconNameByFile } from '@/utils/file-icon-map';
import { getFileContentApi, saveFileContentApi } from '@/services/api/file';
import MonacoEditor from '@/modules/monacoEditor/MonacoEditor.vue';
import { FilePermissionLevel } from '@/constants/enum';
import { debounce } from '@/utils/common';
import { formatFileSize } from '@/utils/file';
import { SUPPORTED_FILE_TYPES } from '@/constants/file-type';
import type { WindowState } from '@/types/window';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import TiptapCollaborate from '@/modules/tiptapCollaborate/index.vue';

interface Props {
  file: FileTreeDto;
  type: WindowState['type'];
}

const props = defineProps<Props>();
const fileContent = ref('');
const isSaving = ref(false);
const saveError = ref(false);
const isDirty = ref(false);
const isInitialized = ref(false);
const isMdPreview = ref(false); // Markdown 预览模式

const isEditable = computed(() => props.file.permission >= FilePermissionLevel.EDIT && props.type === 'edit');

// 渲染后的HTML
const renderedHtml = computed(() => {
  try {
    const parsed = marked.parse(fileContent.value || '') as string;
    return DOMPurify.sanitize(parsed);
  } catch {
    return '<p style="color:red">Markdown 渲染失败</p>';
  }
});

watch(
  () => props.file,
  async newVal => {
    // 可编辑文件获取具体内容
    if (newVal.isEditable) {
      // 重置状态
      isInitialized.value = false;
      isDirty.value = false;

      // 获取具体内容
      const content = await getFileContentApi(newVal.id);
      fileContent.value = content.data.content;

      // 延迟标记为已初始化，确保MonacoEditor已经完成初始化
      setTimeout(() => {
        isInitialized.value = true;
      }, 100);
    }
  },
  {
    immediate: true,
    deep: true
  }
);

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

// 自动保存（防抖）
const autoSave = debounce(async () => {
  if (!isDirty.value || !isEditable.value) return;
  isSaving.value = true;
  saveError.value = false;
  try {
    await saveFileContentApi(props.file.id, fileContent.value);
    isSaving.value = false;
    isDirty.value = false;
    console.log('自动保存成功');
  } catch {
    isSaving.value = false;
    saveError.value = true;
    ElMessage.error('自动保存失败，请检查网络或稍后重试');
  }
}, 1500);

// 手动保存（如Ctrl+S）
const saveFileContent = async () => {
  if (!isEditable.value) return;
  isSaving.value = true;
  saveError.value = false;
  try {
    await saveFileContentApi(props.file.id, fileContent.value);
    isSaving.value = false;
    isDirty.value = false;
    ElMessage.success('保存成功');
  } catch {
    isSaving.value = false;
    saveError.value = true;
    ElMessage.error('保存失败，请检查网络或稍后重试');
  }
};

// 监听内容变化
watch(fileContent, () => {
  // 只有在已初始化后才触发自动保存，避免首次加载时触发
  if (!isInitialized.value) return;
  console.log('内容变化', isDirty.value);
  isDirty.value = true;
  autoSave();
});
</script>
