<template>
  <div class="image-preview-container h-full flex flex-col">
    <!-- 工具栏 -->
    <div class="toolbar px-4 py-2 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <Icon :icon="getIconNameByFile(file.ext || '')" class="h-5 w-5 text-green-600" />
        <div>
          <div class="font-medium text-sm">{{ file.name }}</div>
          <div class="text-xs text-gray-500">
            {{ formatFileSize(file.size || 0) }} • {{ formatDate(new Date(file.createdAt)) }}
            <span v-if="imageInfo.width && imageInfo.height"> • {{ imageInfo.width }}×{{ imageInfo.height }} </span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <!-- 缩放控制 -->
        <div class="flex items-center gap-1 bg-white rounded border border-gray-200 px-2 py-1">
          <button class="p-1 hover:bg-gray-100 rounded" title="缩小" @click="zoomOut">
            <ZoomOutIcon class="h-4 w-4" />
          </button>
          <span class="text-xs text-gray-600 min-w-[40px] text-center">{{ Math.round(zoomLevel * 100) }}%</span>
          <button class="p-1 hover:bg-gray-100 rounded" title="放大" @click="zoomIn">
            <ZoomInIcon class="h-4 w-4" />
          </button>
        </div>

        <!-- 旋转控制 -->
        <button class="p-1 hover:bg-gray-200 rounded" title="向左旋转" @click="rotateLeft">
          <RotateCcwIcon class="h-4 w-4" />
        </button>
        <button class="p-1 hover:bg-gray-200 rounded" title="向右旋转" @click="rotateRight">
          <RotateCwIcon class="h-4 w-4" />
        </button>

        <!-- 重置 -->
        <button class="p-1 hover:bg-gray-200 rounded" title="重置视图" @click="resetView">
          <RefreshCwIcon class="h-4 w-4" />
        </button>

        <!-- 全屏预览 -->
        <!-- <button
          @click="openFullscreen"
          class="p-1 hover:bg-gray-200 rounded"
          title="全屏预览"
        >
          <MaximizeIcon class="h-4 w-4" />
        </button> -->

        <!-- 下载 -->
        <button class="p-1 hover:bg-gray-200 rounded" title="下载" @click="downloadFile">
          <DownloadIcon class="h-4 w-4" />
        </button>
      </div>
    </div>

    <!-- 图片预览区域 -->
    <div class="image-viewer flex-1 relative overflow-hidden">
      <div ref="imageContainer" class="w-full h-full flex items-center justify-center" @wheel="handleWheel" @mousedown="startPan" @mousemove="pan" @mouseup="stopPan" @mouseleave="stopPan">
        <img ref="imageElement" :src="file.path" :alt="file.name" class="transition-transform duration-200 ease-out" :style="imageStyle" @load="onImageLoad" @error="onImageError" />
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
        <div class="text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <div class="text-sm text-gray-600">加载中...</div>
        </div>
      </div>

      <!-- 错误状态 -->
      <div v-if="error" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
        <div class="text-center">
          <AlertCircleIcon class="h-12 w-12 text-red-500 mx-auto mb-2" />
          <div class="text-sm text-gray-600 mb-2">图片加载失败</div>
          <button class="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700" @click="retryLoad">重试</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import {
  Image as ImageIcon,
  Download as DownloadIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  RotateCcw as RotateCcwIcon,
  RotateCw as RotateCwIcon,
  RefreshCw as RefreshCwIcon,
  Maximize as MaximizeIcon,
  AlertCircle as AlertCircleIcon
} from 'lucide-vue-next';
import type { FileTreeDto } from '@/services/api/file/types';
import { ElMessage } from 'element-plus';
import { formatFileSize, formatDate } from '@/utils/file';
import { Icon } from '@iconify/vue';
import { getIconNameByFile } from '@/utils/file-icon-map';

interface Props {
  file: FileTreeDto;
}

const props = defineProps<Props>();

// 响应式状态
const imageElement = ref<HTMLImageElement>();
const imageContainer = ref<HTMLDivElement>();
const loading = ref(true);
const error = ref(false);
const zoomLevel = ref(1);
const rotation = ref(0);
const isPanning = ref(false);
const panStart = ref({ x: 0, y: 0 });
const panOffset = ref({ x: 0, y: 0 });
const isComponentMounted = ref(true);

// 图片信息
const imageInfo = ref({
  width: 0,
  height: 0,
  naturalWidth: 0,
  naturalHeight: 0
});

// 计算图片样式
const imageStyle = computed(() => ({
  transform: `translate(${panOffset.value.x}px, ${panOffset.value.y}px) scale(${zoomLevel.value}) rotate(${rotation.value}deg)`,
  cursor: isPanning.value ? 'grabbing' : zoomLevel.value > 1 ? 'grab' : 'default'
}));

// 图片加载完成
const onImageLoad = () => {
  if (!isComponentMounted.value) return;

  loading.value = false;
  error.value = false;

  if (imageElement.value) {
    const img = imageElement.value;
    imageInfo.value = {
      width: img.width,
      height: img.height,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight
    };
  }

  resetView();
};

// 图片加载错误
const onImageError = () => {
  if (!isComponentMounted.value) return;

  loading.value = false;
  error.value = true;
};

// 重试加载
const retryLoad = async () => {
  if (!isComponentMounted.value) return;

  loading.value = true;
  error.value = false;

  try {
    await nextTick();
    if (imageElement.value && props.file.path) {
      imageElement.value.src = props.file.path;
    }
  } catch (e) {
    console.error('Error retrying image load:', e);
    if (isComponentMounted.value) {
      loading.value = false;
      error.value = true;
    }
  }
};

// 缩放控制
const zoomIn = () => {
  zoomLevel.value = Math.min(zoomLevel.value * 1.2, 5);
};

const zoomOut = () => {
  zoomLevel.value = Math.max(zoomLevel.value / 1.2, 0.1);
};

// 旋转控制
const rotateLeft = () => {
  rotation.value = (rotation.value - 90) % 360;
};

const rotateRight = () => {
  rotation.value = (rotation.value + 90) % 360;
};

// 重置视图
const resetView = () => {
  zoomLevel.value = 1;
  rotation.value = 0;
  panOffset.value = { x: 0, y: 0 };
};

// 鼠标滚轮缩放
const handleWheel = (event: WheelEvent) => {
  if (!isComponentMounted.value) return;

  event.preventDefault();
  const delta = event.deltaY > 0 ? 0.9 : 1.1;
  zoomLevel.value = Math.max(0.1, Math.min(5, zoomLevel.value * delta));
};

// 拖拽平移 - 修复后的逻辑
const startPan = (event: MouseEvent) => {
  if (!isComponentMounted.value) return;

  // 只有在缩放级别大于1时才允许拖拽
  if (zoomLevel.value > 1) {
    event.preventDefault();
    isPanning.value = true;
    panStart.value = { x: event.clientX, y: event.clientY };
  }
};

const pan = (event: MouseEvent) => {
  if (!isComponentMounted.value) return;

  if (isPanning.value) {
    event.preventDefault();
    const deltaX = event.clientX - panStart.value.x;
    const deltaY = event.clientY - panStart.value.y;

    // 更新平移偏移量
    panOffset.value = {
      x: panOffset.value.x + deltaX,
      y: panOffset.value.y + deltaY
    };

    // 更新起始位置
    panStart.value = { x: event.clientX, y: event.clientY };
  }
};

const stopPan = () => {
  if (!isComponentMounted.value) return;
  isPanning.value = false;
};

// 全屏预览
const openFullscreen = () => {
  if (!isComponentMounted.value || !imageElement.value) return;

  try {
    // 创建全屏预览
    const fullscreenDiv = document.createElement('div');
    fullscreenDiv.className = 'fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center';
    fullscreenDiv.style.cursor = 'pointer';

    const img = document.createElement('img');
    img.src = props.file.path || '';
    img.alt = props.file.name;
    img.className = 'max-w-full max-h-full object-contain';

    fullscreenDiv.appendChild(img);
    document.body.appendChild(fullscreenDiv);

    // 点击关闭
    const closeFullscreen = () => {
      if (document.body.contains(fullscreenDiv)) {
        document.body.removeChild(fullscreenDiv);
      }
      document.removeEventListener('keydown', handleFullscreenKeydown);
    };

    fullscreenDiv.addEventListener('click', closeFullscreen);

    // ESC键关闭
    const handleFullscreenKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeFullscreen();
      }
    };

    document.addEventListener('keydown', handleFullscreenKeydown);
  } catch (e) {
    console.error('Error opening fullscreen:', e);
  }
};

// 下载文件
const downloadFile = () => {
  if (!props.file.path) {
    ElMessage.error('文件路径不存在');
    return;
  }

  try {
    const link = document.createElement('a');
    link.href = props.file.path;
    link.download = props.file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    ElMessage.success('开始下载文件');
  } catch (e) {
    console.error('Error downloading file:', e);
    ElMessage.error('下载失败');
  }
};

// 键盘快捷键
const handleKeydown = (event: KeyboardEvent) => {
  if (!isComponentMounted.value) return;

  switch (event.key) {
    case '+':
    case '=':
      event.preventDefault();
      zoomIn();
      break;
    case '-':
      event.preventDefault();
      zoomOut();
      break;
    case '0':
      event.preventDefault();
      resetView();
      break;
    case 'ArrowLeft':
      event.preventDefault();
      rotateLeft();
      break;
    case 'ArrowRight':
      event.preventDefault();
      rotateRight();
      break;
  }
};

onMounted(() => {
  isComponentMounted.value = true;
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  isComponentMounted.value = false;
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.image-preview-container {
  user-select: none;
}

.image-viewer {
  cursor: default;
}

.image-viewer:active {
  cursor: grabbing;
}

/* 自定义滚动条 */
.image-viewer::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.image-viewer::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.image-viewer::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.image-viewer::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
