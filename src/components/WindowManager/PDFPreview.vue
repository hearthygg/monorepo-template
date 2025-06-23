<template>
  <div class="pdf-preview-container h-full flex bg-gray-200 relative">
    <!-- 缩略图侧边栏 -->
    <aside class="thumbnail-sidebar bg-gray-800 text-white flex-shrink-0 overflow-y-auto transition-all duration-300 absolute lg:relative z-10 h-full" :class="isSidebarOpen ? 'w-48' : 'w-0'">
      <div class="p-2 space-y-2">
        <div
          v-for="pageNumber in pdfInfo.pageCount"
          :key="pageNumber"
          class="thumbnail-item relative cursor-pointer border-2 rounded"
          :class="currentPage === pageNumber ? 'border-blue-500' : 'border-transparent hover:border-gray-500'"
          @click="gotoPage(pageNumber)"
        >
          <canvas :id="`thumbnail-${pageNumber}`" class="w-full h-auto"></canvas>
          <div class="absolute bottom-1 right-1 bg-black bg-opacity-60 text-white text-xs px-1.5 py-0.5 rounded">
            {{ pageNumber }}
          </div>
        </div>
      </div>
    </aside>

    <!-- 主预览区域 -->
    <div class="main-content flex-1 flex flex-col relative">
      <!-- 侧边栏切换按钮 -->
      <div class="sidebar-toggle absolute top-1/2 -left-3 z-20 transform -translate-y-1/2" :title="isSidebarOpen ? '收起侧边栏' : '展开侧边栏'" @click="toggleSidebar">
        <ChevronRightIcon class="h-6 w-6 text-gray-600 bg-white p-1 rounded-full shadow-md cursor-pointer transition-transform duration-300" :class="{ 'rotate-180': isSidebarOpen }" />
      </div>

      <!-- 工具栏 -->
      <div class="toolbar bg-gray-50 px-4 py-2 flex items-center justify-between border-b border-gray-200 flex-shrink-0">
        <div class="flex items-center gap-3">
          <Icon :icon="getIconNameByFile(file.ext || '')" class="h-5 w-5 text-red-600" />
          <div>
            <div class="font-medium text-sm">{{ file.name }}</div>
            <div class="text-xs text-gray-500">
              {{ formatFileSize(file.size || 0) }} • {{ formatDate(new Date(file.createdAt)) }}
              <span v-if="pdfInfo.pageCount"> • {{ pdfInfo.pageCount }} 页 </span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <!-- 页面导航 -->
          <div class="flex items-center gap-1 bg-white rounded border border-gray-200 px-2 py-1">
            <button :disabled="currentPage <= 1" class="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed" title="上一页" @click="previousPage">
              <ChevronLeftIcon class="h-4 w-4" />
            </button>
            <span class="text-xs text-gray-600 min-w-[60px] text-center"> {{ currentPage }} / {{ pdfInfo.pageCount || '?' }} </span>
            <button :disabled="currentPage >= (pdfInfo.pageCount || 1)" class="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed" title="下一页" @click="nextPage">
              <ChevronRightIcon class="h-4 w-4" />
            </button>
          </div>

          <!-- 缩放控制 -->
          <div class="flex items-center gap-1 bg-white rounded border border-gray-200 px-2 py-1">
            <button class="p-1 hover:bg-gray-100 rounded" title="缩小" @click="zoomOut">
              <ZoomOutIcon class="h-4 w-4" />
            </button>
            <span class="text-xs text-gray-600 min-w-[40px] text-center">{{ Math.round(scale * 100) }}%</span>
            <button class="p-1 hover:bg-gray-100 rounded" title="放大" @click="zoomIn">
              <ZoomInIcon class="h-4 w-4" />
            </button>
          </div>

          <!-- 适应页面 -->
          <button class="p-1 hover:bg-gray-200 rounded" title="适应页面" @click="fitToPage">
            <MaximizeIcon class="h-4 w-4" />
          </button>

          <!-- 全屏 -->
          <!-- <button
            @click="toggleFullscreen"
            class="p-1 hover:bg-gray-200 rounded"
            title="全屏"
          >
            <FullscreenIcon class="h-4 w-4" />
          </button>
           -->
          <!-- 下载 -->
          <button class="p-1 hover:bg-gray-200 rounded" title="下载" @click="downloadFile">
            <DownloadIcon class="h-4 w-4" />
          </button>
        </div>
      </div>

      <!-- PDF预览区域 -->
      <div ref="pdfViewer" class="pdf-viewer flex-1 relative bg-gray-100 overflow-auto">
        <div ref="pdfContainer" class="w-full h-full flex items-center justify-center" @wheel="handleWheel">
          <!-- 加载状态 -->
          <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
            <div class="text-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-2"></div>
              <div class="text-sm text-gray-600">加载中...</div>
            </div>
          </div>

          <!-- 错误状态 -->
          <div v-if="error" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
            <div class="text-center">
              <AlertCircleIcon class="h-12 w-12 text-red-500 mx-auto mb-2" />
              <div class="text-sm text-gray-600 mb-2">PDF加载失败</div>
              <button class="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700" @click="retryLoad">重试</button>
            </div>
          </div>

          <!-- PDF页面 -->
          <canvas v-if="!loading && !error" ref="pdfCanvas" class="shadow-lg" :style="{ transform: `scale(${scale})` }"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, shallowRef } from 'vue';
import {
  FileText as FileTextIcon,
  Download as DownloadIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Maximize as MaximizeIcon,
  Fullscreen as FullscreenIcon,
  AlertCircle as AlertCircleIcon,
  PanelLeft as SidebarIcon
} from 'lucide-vue-next';
import type { FileTreeDto } from '@/services/api/file/types';
import { ElMessage } from 'element-plus';
import * as pdfjsLib from 'pdfjs-dist';
import { formatFileSize, formatDate } from '@/utils/file';
import { Icon } from '@iconify/vue';
import { getIconNameByFile } from '@/utils/file-icon-map';

// 设置PDF.js worker路径
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

interface Props {
  file: FileTreeDto;
}

const props = defineProps<Props>();

// 响应式状态
const pdfContainer = ref<HTMLDivElement>();
const pdfCanvas = ref<HTMLCanvasElement>();
const loading = ref(true);
const error = ref(false);
const currentPage = ref(1);
const scale = ref(1.0);
const isComponentMounted = ref(true);
const isInitializing = ref(false);
const isSidebarOpen = ref(true);

// PDF信息
const pdfInfo = ref({
  pageCount: 0,
  title: '',
  author: '',
  subject: ''
});

// PDF文档和页面
const pdfDoc = shallowRef<any>(null);
const currentPageObj = shallowRef<any>(null);

// 渲染控制
const currentRenderTask = shallowRef<any>(null);
const isRendering = ref(false);
let wheelTimeout: number | null = null;

// 初始化PDF
const initPDF = async () => {
  if (!isComponentMounted.value || !props.file.path || isInitializing.value) {
    return;
  }

  isInitializing.value = true;
  loading.value = true;
  error.value = false;

  try {
    // 加载PDF文档
    const loadingTask = pdfjsLib.getDocument(props.file.path);
    pdfDoc.value = await loadingTask.promise;

    if (!isComponentMounted.value) {
      isInitializing.value = false;
      return;
    }

    // 获取PDF信息
    pdfInfo.value = {
      pageCount: pdfDoc.value.numPages,
      title: pdfDoc.value.info?.Title || '',
      author: pdfDoc.value.info?.Author || '',
      subject: pdfDoc.value.info?.Subject || ''
    };

    // 等待DOM更新后再加载页面
    await nextTick();
    await loadPage(1);
    await renderThumbnails();

    loading.value = false;
    isInitializing.value = false;

    // 强制适应页面以确保初始渲染正确
    await nextTick();
    if (isComponentMounted.value) {
      await fitToPage();
    }
  } catch (e) {
    console.error('Error loading PDF:', e);
    if (isComponentMounted.value) {
      loading.value = false;
      error.value = true;
    }
    isInitializing.value = false;
  }
};

// 加载指定页面
const loadPage = async (pageNum: number) => {
  if (!pdfDoc.value || !isComponentMounted.value) return;
  if (isRendering.value) return;

  try {
    isRendering.value = true;

    // 取消之前的渲染任务
    if (currentRenderTask.value && !currentRenderTask.value.destroyed) {
      currentRenderTask.value.cancel();
    }

    // 获取页面
    const page = await pdfDoc.value.getPage(pageNum);
    currentPageObj.value = page;

    if (!isComponentMounted.value || !pdfCanvas.value) return;

    const canvas = pdfCanvas.value;
    const context = canvas.getContext('2d');

    if (!context) return;

    // 计算缩放比例以适应容器 (仅在首次加载时)
    const container = pdfContainer.value;
    if (container && pageNum === 1 && scale.value === 1.0) {
      const containerWidth = container.clientWidth - 40; // 留出边距
      const containerHeight = container.clientHeight - 40;

      const viewport = page.getViewport({ scale: 1 });
      const scaleX = containerWidth / viewport.width;
      const scaleY = containerHeight / viewport.height;
      const fitScale = Math.min(scaleX, scaleY, 2); // 最大缩放2倍

      if (fitScale > 0) {
        scale.value = fitScale;
      }
    }

    // 渲染页面
    const dpr = window.devicePixelRatio || 1;
    const viewport = page.getViewport({ scale: scale.value });

    canvas.width = Math.floor(viewport.width * dpr);
    canvas.height = Math.floor(viewport.height * dpr);
    canvas.style.width = `${Math.floor(viewport.width)}px`;
    canvas.style.height = `${Math.floor(viewport.height)}px`;

    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
      enableWebGL: true // 尝试开启WebGL以获得更好的性能
    };

    currentRenderTask.value = page.render(renderContext);
    await currentRenderTask.value.promise;
  } catch (e: any) {
    if (e.name !== 'RenderingCancelledException') {
      console.error('Error loading page:', e);
      if (isComponentMounted.value) {
        error.value = true;
      }
    }
  } finally {
    isRendering.value = false;
  }
};

// 重试加载
const retryLoad = async () => {
  if (!isComponentMounted.value || isInitializing.value) return;

  await initPDF();
};

// 页面导航
const previousPage = async () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    await loadPage(currentPage.value);
  }
};

const nextPage = async () => {
  if (currentPage.value < (pdfInfo.value.pageCount || 1)) {
    currentPage.value++;
    await loadPage(currentPage.value);
  }
};

// 缩放控制
const zoomIn = async () => {
  if (isRendering.value) return;
  scale.value = Math.min(scale.value * 1.2, 3);
  await loadPage(currentPage.value);
};

const zoomOut = async () => {
  if (isRendering.value) return;
  scale.value = Math.max(scale.value / 1.2, 0.5);
  await loadPage(currentPage.value);
};

// 适应页面
const fitToPage = async () => {
  if (!pdfContainer.value || !currentPageObj.value || isRendering.value) return;

  const container = pdfContainer.value;
  const containerWidth = container.clientWidth - 40;
  const containerHeight = container.clientHeight - 40;

  const viewport = currentPageObj.value.getViewport({ scale: 1 });
  const scaleX = containerWidth / viewport.width;
  const scaleY = containerHeight / viewport.height;
  const fitScale = Math.min(scaleX, scaleY, 2);

  scale.value = fitScale;
  await loadPage(currentPage.value);
};

// 鼠标滚轮缩放 - 添加防抖
const handleWheel = async (event: WheelEvent) => {
  event.preventDefault();

  // 清除之前的定时器
  if (wheelTimeout) {
    clearTimeout(wheelTimeout);
  }

  // 设置新的定时器，防抖处理
  wheelTimeout = window.setTimeout(async () => {
    if (isRendering.value) return;

    const delta = event.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.5, Math.min(3, scale.value * delta));

    if (Math.abs(newScale - scale.value) > 0.01) {
      scale.value = newScale;
      await loadPage(currentPage.value);
    }
  }, 100); // 100ms防抖
};

// 全屏预览
const toggleFullscreen = () => {
  if (!pdfContainer.value) return;

  try {
    if (!document.fullscreenElement) {
      pdfContainer.value.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  } catch (e) {
    console.error('Error toggling fullscreen:', e);
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
    case 'ArrowLeft':
      event.preventDefault();
      previousPage();
      break;
    case 'ArrowRight':
      event.preventDefault();
      nextPage();
      break;
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
      fitToPage();
      break;
    case 'f':
    case 'F':
      event.preventDefault();
      toggleFullscreen();
      break;
  }
};

// 渲染所有缩略图
const renderThumbnails = async () => {
  if (!pdfDoc.value) return;
  for (let i = 1; i <= pdfInfo.value.pageCount; i++) {
    if (!isComponentMounted.value) return;
    const page = await pdfDoc.value.getPage(i);
    const canvas = document.getElementById(`thumbnail-${i}`) as HTMLCanvasElement;
    if (canvas) {
      const context = canvas.getContext('2d')!;
      const viewport = page.getViewport({ scale: 0.2 }); // 使用较小的比例尺
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      page.render({ canvasContext: context, viewport });
    }
  }
};

// 跳转到指定页面
const gotoPage = async (pageNum: number) => {
  if (currentPage.value !== pageNum) {
    currentPage.value = pageNum;
    await loadPage(pageNum);
  }
};

// 切换侧边栏
const toggleSidebar = async () => {
  isSidebarOpen.value = !isSidebarOpen.value;
  await nextTick();
  await fitToPage();
};

onMounted(async () => {
  isComponentMounted.value = true;
  document.addEventListener('keydown', handleKeydown);

  // 等待DOM完全渲染后再初始化PDF
  await nextTick();
  // 再等待一帧确保容器尺寸已计算
  await new Promise(resolve => requestAnimationFrame(resolve));
  await initPDF();
});

onUnmounted(() => {
  isComponentMounted.value = false;
  document.removeEventListener('keydown', handleKeydown);

  // 清理渲染任务
  if (currentRenderTask.value && !currentRenderTask.value.destroyed) {
    currentRenderTask.value.cancel();
  }

  // 清理定时器
  if (wheelTimeout) {
    clearTimeout(wheelTimeout);
  }
});
</script>

<style scoped>
.pdf-preview-container {
  display: flex;
}

.main-content {
  display: flex;
  flex-direction: column;
}

.pdf-preview-container {
  user-select: none;
}

.pdf-viewer {
  cursor: default;
}

/* 自定义滚动条 */
.pdf-viewer::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.pdf-viewer::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.pdf-viewer::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.pdf-viewer::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.thumbnail-sidebar {
  scrollbar-width: thin;
  scrollbar-color: #4a5568 #2d3748;
}
.thumbnail-sidebar::-webkit-scrollbar {
  width: 8px;
}
.thumbnail-sidebar::-webkit-scrollbar-track {
  background: #2d3748;
}
.thumbnail-sidebar::-webkit-scrollbar-thumb {
  background-color: #4a5568;
  border-radius: 4px;
}
</style>
