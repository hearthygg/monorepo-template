<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
    <div class="absolute inset-0" @click="$emit('update:modelValue', false)"></div>
    <div class="relative bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden" @click.stop>
      <!-- 头部 -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <div class="flex items-center gap-3">
          <Icon :icon="getIconNameByFile(fileInfo?.ext || '')" class="h-8 w-8 text-blue-500" />
          <div>
            <h2 class="text-xl font-semibold text-gray-900">文件属性</h2>
            <p class="text-sm text-gray-500">{{ fileInfo?.name }}</p>
          </div>
        </div>
        <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors" @click="$emit('update:modelValue', false)">
          <X class="h-5 w-5" />
        </button>
      </div>

      <!-- 内容 -->
      <div class="p-4 overflow-y-auto max-h-[calc(90vh-140px)]">
        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>

        <div v-else-if="fileInfo" class="space-y-6">
          <!-- 基本信息 -->
          <div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <File class="h-5 w-5 mr-2 text-blue-500" />
              基本信息
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700">名称</label>
                  <p class="mt-1 text-sm text-gray-900">{{ fileInfo.name }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">类型</label>
                  <p class="mt-1 text-sm text-gray-900">
                    {{ fileInfo.isFolder ? '文件夹' : getFileTypeText(fileInfo.ext) }}
                  </p>
                </div>
                <div v-if="!fileInfo.isFolder && fileInfo.size !== null">
                  <label class="block text-sm font-medium text-gray-700">大小</label>
                  <p class="mt-1 text-sm text-gray-900">{{ formatFileSize(fileInfo.size) }}</p>
                </div>
                <div v-if="fileInfo.isFolder && fileInfo.totalSize !== null">
                  <label class="block text-sm font-medium text-gray-700">总大小</label>
                  <p class="mt-1 text-sm text-gray-900">{{ formatFileSize(fileInfo.totalSize) }}</p>
                </div>
              </div>
              <div class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700">创建时间</label>
                  <p class="mt-1 text-sm text-gray-900">{{ formatDate(fileInfo.createdAt) }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">修改时间</label>
                  <p class="mt-1 text-sm text-gray-900">{{ formatDate(fileInfo.updatedAt) }}</p>
                </div>
                <div v-if="fileInfo.isFolder">
                  <label class="block text-sm font-medium text-gray-700">包含项目</label>
                  <p class="mt-1 text-sm text-gray-900">{{ fileInfo.folderCount || 0 }} 个文件夹，{{ fileInfo.fileCount || 0 }} 个文件</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 位置信息 -->
          <div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Folder class="h-5 w-5 mr-2 text-green-500" />
              位置信息
            </h3>
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-700">所属团队</label>
                <p class="mt-1 text-sm text-gray-900">{{ fileInfo.team.name }}</p>
              </div>
              <div v-if="fileInfo.parent">
                <label class="block text-sm font-medium text-gray-700">父文件夹</label>
                <p class="mt-1 text-sm text-gray-900">{{ fileInfo.parent.name }}</p>
              </div>
              <div v-if="!fileInfo.isFolder && fileInfo.accessUrl">
                <label class="block text-sm font-medium text-gray-700">访问链接</label>
                <div class="mt-1 flex items-center gap-2">
                  <input :value="fileInfo.accessUrl" readonly class="flex-1 text-sm text-gray-900 bg-white border border-gray-300 rounded px-3 py-2" />
                  <button class="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors" @click="copyToClipboard(fileInfo.accessUrl)">复制</button>
                </div>
              </div>
            </div>
          </div>

          <!-- 权限信息 -->
          <div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Shield class="h-5 w-5 mr-2 text-purple-500" />
              权限信息
            </h3>
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-700">所有者</label>
                <div class="mt-1 flex items-center gap-3">
                  <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <img v-if="fileInfo.owner.avatar" :src="fileInfo.owner.avatar" :alt="fileInfo.owner.nickname || ''" class="h-8 w-8 rounded-full object-cover" />
                    <span v-else class="text-sm font-medium">
                      {{ (fileInfo.owner.nickname || '用户').substring(0, 2).toUpperCase() }}
                    </span>
                  </div>
                  <span class="text-sm text-gray-900">{{ fileInfo.owner.nickname || '未知用户' }}</span>
                  <span v-if="fileInfo.isOwner" class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"> 当前用户 </span>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">当前权限</label>
                <div class="mt-1">
                  <span :class="getPermissionTagClass(fileInfo.permission)">
                    {{ getPermissionText(fileInfo.permission) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12">
          <AlertCircle class="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">无法加载文件信息</h3>
          <p class="text-gray-500">请稍后重试</p>
        </div>
      </div>

      <!-- 底部 -->
      <div class="flex justify-end gap-3 p-4 border-t border-gray-200">
        <button class="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors" @click="$emit('update:modelValue', false)">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { X, AlertCircle, File, Folder, FileText, Image, FileSpreadsheet, FileCode, Shield } from 'lucide-vue-next';
import { getFileInfoApi } from '@/services/api/file';
import type { FileInfoDto } from '@/services/api/file/types';
import { ElMessage } from 'element-plus';
import { formatFileSize, formatDate } from '@/utils/file';
import { getIconNameByFile } from '@/utils/file-icon-map';
import { Icon } from '@iconify/vue';

const props = defineProps<{
  modelValue: boolean;
  fileId: number | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const visible = computed(() => props.modelValue);
const loading = ref(false);
const fileInfo = ref<FileInfoDto | null>(null);

// 监听文件ID变化，加载文件信息
watch(
  () => props.fileId,
  async newFileId => {
    if (newFileId && visible.value) {
      await loadFileInfo(newFileId);
    }
  }
);

// 监听模态框显示状态
watch(visible, async newVisible => {
  if (newVisible && props.fileId) {
    await loadFileInfo(props.fileId);
  } else {
    fileInfo.value = null;
  }
});

const loadFileInfo = async (fileId: number) => {
  try {
    loading.value = true;
    const response = await getFileInfoApi(fileId);
    fileInfo.value = response.data;
  } catch (error) {
    console.error('加载文件信息失败:', error);
    ElMessage.error('加载文件信息失败');
  } finally {
    loading.value = false;
  }
};

const getFileIcon = () => {
  if (!fileInfo.value) return File;

  if (fileInfo.value.isFolder) {
    return Folder;
  }

  switch (fileInfo.value.ext) {
    case 'doc':
    case 'docx':
    case 'pdf':
    case 'txt':
      return FileText;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'svg':
      return Image;
    case 'xls':
    case 'xlsx':
    case 'csv':
      return FileSpreadsheet;
    case 'js':
    case 'ts':
    case 'vue':
    case 'html':
    case 'css':
    case 'json':
      return FileCode;
    default:
      return File;
  }
};

const getFileTypeText = (ext: string | null) => {
  if (!ext) return '未知类型';

  const typeMap: Record<string, string> = {
    doc: 'Word文档',
    docx: 'Word文档',
    pdf: 'PDF文档',
    txt: '文本文件',
    jpg: 'JPEG图片',
    jpeg: 'JPEG图片',
    png: 'PNG图片',
    gif: 'GIF图片',
    svg: 'SVG图片',
    xls: 'Excel表格',
    xlsx: 'Excel表格',
    csv: 'CSV文件',
    js: 'JavaScript文件',
    ts: 'TypeScript文件',
    vue: 'Vue文件',
    html: 'HTML文件',
    css: 'CSS文件',
    json: 'JSON文件'
  };

  return typeMap[ext.toLowerCase()] || `${ext.toUpperCase()}文件`;
};

const getPermissionText = (permission: number): string => {
  const permissionMap: Record<number, string> = {
    0: '无权限',
    1: '查看',
    2: '编辑',
    3: '删除',
    4: '管理'
  };
  return permissionMap[permission] || '未知权限';
};

const getPermissionTagClass = (permission: number): string => {
  const baseClasses = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium';
  const permissionMap: Record<number, string> = {
    0: 'bg-gray-100 text-gray-700 border border-gray-300',
    1: 'bg-blue-100 text-blue-700 border border-blue-300',
    2: 'bg-green-100 text-green-700 border border-green-300',
    3: 'bg-orange-100 text-orange-700 border border-orange-300',
    4: 'bg-purple-100 text-purple-700 border border-purple-300'
  };
  return `${baseClasses} ${permissionMap[permission] || permissionMap[0]}`;
};

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    ElMessage.success('链接已复制到剪贴板');
  } catch (error) {
    console.error('复制失败:', error);
    ElMessage.error('复制失败');
  }
};
</script>
