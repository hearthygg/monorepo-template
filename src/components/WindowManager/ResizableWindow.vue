<template>
  <div ref="windowRef" class="resizable-window" :class="windowClasses" :style="windowStyles" @mousedown="handleWindowClick">
    <!-- 窗口标题栏 -->
    <div ref="titleBarRef" class="window-title-bar" @mousedown="startDrag" @dblclick="toggleMaximize">
      <div class="window-title">
        <Icon :icon="getIconNameByFile(window.data.ext || '')" class="h-5 w-5 mr-2" />
        {{ window.data.name }}
      </div>
      <div class="window-controls">
        <button class="window-control-btn minimize" title="最小化" @click="$emit('minimize', window.id)">
          <MinusIcon class="h-3 w-3" />
        </button>
        <button class="window-control-btn maximize" :title="window.status === 'maximized' ? '还原' : '最大化'" @click="toggleMaximize">
          <component :is="window.status === 'maximized' ? CopyIcon : SquareIcon" class="h-3 w-3" />
        </button>
        <button class="window-control-btn close" title="关闭" @click="$emit('close', window.id)">
          <XIcon class="h-3 w-3" />
        </button>
      </div>
    </div>

    <!-- 窗口内容 -->
    <div class="window-content">
      <slot />
    </div>

    <!-- 调整大小手柄 -->
    <div v-if="window.status === 'normal'" class="resize-handles">
      <!-- 边缘手柄 -->
      <div class="resize-handle resize-n" @mousedown="startResize('n', $event)"></div>
      <div class="resize-handle resize-s" @mousedown="startResize('s', $event)"></div>
      <div class="resize-handle resize-w" @mousedown="startResize('w', $event)"></div>
      <div class="resize-handle resize-e" @mousedown="startResize('e', $event)"></div>

      <!-- 角落手柄 -->
      <div class="resize-handle resize-nw" @mousedown="startResize('nw', $event)"></div>
      <div class="resize-handle resize-ne" @mousedown="startResize('ne', $event)"></div>
      <div class="resize-handle resize-sw" @mousedown="startResize('sw', $event)"></div>
      <div class="resize-handle resize-se" @mousedown="startResize('se', $event)"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Minus as MinusIcon, X as XIcon, Square as SquareIcon, Copy as CopyIcon, FileText, Image, Video, Music, File } from 'lucide-vue-next';
import type { WindowState } from '@/types/window';
import { useWindowManager } from '@/composables/useWindowManager';
import { Icon } from '@iconify/vue';
import { getIconNameByFile } from '@/utils/file-icon-map';
const { windowManager } = useWindowManager();
interface Props {
  window: WindowState;
}

interface Emits {
  (e: 'close', id: string): void;
  (e: 'minimize', id: string): void;
  (e: 'maximize', id: string): void;
  (e: 'restore', id: string): void;
  (e: 'focus', id: string): void;
  (e: 'update-position', id: string, position: { x: number; y: number }): void;
  (e: 'update-size', id: string, size: { width: number; height: number }): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const windowRef = ref<HTMLElement>();
const titleBarRef = ref<HTMLElement>();

// 拖拽状态
const isDragging = ref(false);
const isResizing = ref(false);
const resizeDirection = ref('');
const dragStart = ref({ x: 0, y: 0, windowX: 0, windowY: 0 });
const resizeStart = ref({ x: 0, y: 0, width: 0, height: 0, windowX: 0, windowY: 0 });

// 窗口样式
const windowStyles = computed(() => {
  const { position, size, status } = props.window;

  if (status === 'maximized') {
    return {
      left: '0px',
      top: '0px',
      width: '100vw',
      height: '100vh',
      zIndex: props.window.zIndex
    };
  }

  return {
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: `${size.width}px`,
    height: `${size.height}px`,
    zIndex: props.window.zIndex
  };
});

// 窗口类名
const windowClasses = computed(() => ['window', `window-${props.window.status}`, { 'window-focused': props.window.id === windowManager.activeWindowId }]);

// 获取文件图标
const getFileIcon = (type: string) => {
  switch (type) {
    case 'image':
      return Image;
    case 'video':
      return Video;
    case 'audio':
      return Music;
    case 'text':
    case 'code':
      return FileText;
    default:
      return File;
  }
};

// 处理窗口点击
const handleWindowClick = () => {
  emit('focus', props.window.id);
};

// 切换最大化
const toggleMaximize = () => {
  if (props.window.status === 'maximized') {
    emit('restore', props.window.id);
  } else {
    emit('maximize', props.window.id);
  }
};

// 开始拖拽
const startDrag = (e: MouseEvent) => {
  if (props.window.status === 'maximized') return;

  isDragging.value = true;
  dragStart.value = {
    x: e.clientX,
    y: e.clientY,
    windowX: props.window.position.x,
    windowY: props.window.position.y
  };

  document.addEventListener('mousemove', handleDrag);
  document.addEventListener('mouseup', stopDrag);
  e.preventDefault();
};

// 处理拖拽
const handleDrag = (e: MouseEvent) => {
  if (!isDragging.value) return;

  const deltaX = e.clientX - dragStart.value.x;
  const deltaY = e.clientY - dragStart.value.y;

  const newX = Math.max(0, Math.min(window.innerWidth - props.window.size.width, dragStart.value.windowX + deltaX));
  const newY = Math.max(0, Math.min(window.innerHeight - props.window.size.height, dragStart.value.windowY + deltaY));

  emit('update-position', props.window.id, { x: newX, y: newY });
};

// 停止拖拽
const stopDrag = () => {
  isDragging.value = false;
  document.removeEventListener('mousemove', handleDrag);
  document.removeEventListener('mouseup', stopDrag);
};

// 开始调整大小
const startResize = (direction: string, e: MouseEvent) => {
  isResizing.value = true;
  resizeDirection.value = direction;

  resizeStart.value = {
    x: e.clientX,
    y: e.clientY,
    width: props.window.size.width,
    height: props.window.size.height,
    windowX: props.window.position.x,
    windowY: props.window.position.y
  };

  document.addEventListener('mousemove', handleResize);
  document.addEventListener('mouseup', stopResize);
  e.preventDefault();
};

// 处理调整大小
const handleResize = (e: MouseEvent) => {
  if (!isResizing.value) return;

  const deltaX = e.clientX - resizeStart.value.x;
  const deltaY = e.clientY - resizeStart.value.y;

  let newWidth = resizeStart.value.width;
  let newHeight = resizeStart.value.height;
  let newX = resizeStart.value.windowX;
  let newY = resizeStart.value.windowY;

  const direction = resizeDirection.value;

  // 处理不同方向的调整
  if (direction.includes('e')) {
    newWidth = Math.max(300, resizeStart.value.width + deltaX);
  }
  if (direction.includes('w')) {
    newWidth = Math.max(300, resizeStart.value.width - deltaX);
    newX = resizeStart.value.windowX + (resizeStart.value.width - newWidth);
  }
  if (direction.includes('s')) {
    newHeight = Math.max(200, resizeStart.value.height + deltaY);
  }
  if (direction.includes('n')) {
    newHeight = Math.max(200, resizeStart.value.height - deltaY);
    newY = resizeStart.value.windowY + (resizeStart.value.height - newHeight);
  }

  // 确保窗口不超出屏幕
  newX = Math.max(0, Math.min(window.innerWidth - newWidth, newX));
  newY = Math.max(0, Math.min(window.innerHeight - newHeight, newY));

  emit('update-position', props.window.id, { x: newX, y: newY });
  emit('update-size', props.window.id, { width: newWidth, height: newHeight });
};

// 停止调整大小
const stopResize = () => {
  isResizing.value = false;
  resizeDirection.value = '';
  document.removeEventListener('mousemove', handleResize);
  document.removeEventListener('mouseup', stopResize);
};

onMounted(() => {
  // 确保窗口在屏幕内
  if (windowRef.value) {
    const rect = windowRef.value.getBoundingClientRect();
    if (rect.right > window.innerWidth || rect.bottom > window.innerHeight) {
      const newX = Math.max(0, Math.min(window.innerWidth - props.window.size.width, props.window.position.x));
      const newY = Math.max(0, Math.min(window.innerHeight - props.window.size.height, props.window.position.y));
      emit('update-position', props.window.id, { x: newX, y: newY });
    }
  }
});

onUnmounted(() => {
  document.removeEventListener('mousemove', handleDrag);
  document.removeEventListener('mouseup', stopDrag);
  document.removeEventListener('mousemove', handleResize);
  document.removeEventListener('mouseup', stopResize);
});
</script>

<style scoped>
.resizable-window {
  position: absolute;
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  pointer-events: auto;
  transition: box-shadow 0.2s ease;
}

.window-focused {
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

.window-maximized {
  border-radius: 0 !important;
}

.window-minimized {
  display: none;
}

.window-title-bar {
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  cursor: move;
  user-select: none;
}

.window-title {
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.window-controls {
  display: flex;
  gap: 8px;
}

.window-control-btn {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.window-control-btn.minimize {
  color: #fff;
}

.window-control-btn.minimize:hover {
  background: #bdcce3;
}

.window-control-btn.maximize {
  color: #fff;
}

.window-control-btn.maximize:hover {
  background: #bdcce3;
}

.window-control-btn.close {
  background: rgba(255, 59, 48, 0.8);
  color: white;
}

.window-control-btn.close:hover {
  background: rgba(255, 59, 48, 1);
}

.window-content {
  height: calc(100% - 40px);
  overflow: hidden;
}

/* 调整大小手柄 */
.resize-handles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.resize-handle {
  position: absolute;
  pointer-events: auto;
}

.resize-n {
  top: 0;
  left: 8px;
  right: 8px;
  height: 4px;
  cursor: n-resize;
}

.resize-s {
  bottom: 0;
  left: 8px;
  right: 8px;
  height: 4px;
  cursor: s-resize;
}

.resize-w {
  left: 0;
  top: 8px;
  bottom: 8px;
  width: 4px;
  cursor: w-resize;
}

.resize-e {
  right: 0;
  top: 8px;
  bottom: 8px;
  width: 4px;
  cursor: e-resize;
}

.resize-nw {
  top: 0;
  left: 0;
  width: 8px;
  height: 8px;
  cursor: nw-resize;
}

.resize-ne {
  top: 0;
  right: 0;
  width: 8px;
  height: 8px;
  cursor: ne-resize;
}

.resize-sw {
  bottom: 0;
  left: 0;
  width: 8px;
  height: 8px;
  cursor: sw-resize;
}

.resize-se {
  bottom: 0;
  right: 0;
  width: 8px;
  height: 8px;
  cursor: se-resize;
}
</style>
