<template>
  <div v-show="isShow" ref="windowRef" class="resizable-window" :class="windowClasses" :style="windowStyles" @mousedown="handleWindowClick">
    <!-- 窗口标题栏 -->
    <div class="window-title-bar" @mousedown="startDrag" @dblclick="toggleMaximize">
      <div class="window-title">
        <Icon v-if="icon" :icon="icon" class="h-5 w-5 mr-2 text-blue-500" />
        {{ title }}
      </div>
      <div class="window-controls">
        <button class="window-control-btn minimize" title="最小化" @click="isShow = false">
          <MinusIcon class="h-4 w-4" />
        </button>
        <button class="window-control-btn maximize" :title="windowData.isFullscreen ? '还原' : '最大化'" @click="toggleMaximize">
          <component :is="windowData.isFullscreen ? CopyIcon : SquareIcon" class="h-4 w-4" />
        </button>
        <button class="window-control-btn close" title="关闭" @click="isShow = false">
          <XIcon class="h-4 w-4" />
        </button>
      </div>
    </div>

    <!-- 窗口内容 -->
    <div class="window-content">
      <slot />
    </div>

    <!-- 调整大小手柄 -->
    <div v-if="!windowData.isFullscreen" class="resize-handles">
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
import { ref, computed, onUnmounted, reactive } from 'vue';
import { Minus as MinusIcon, X as XIcon, Square as SquareIcon, Copy as CopyIcon } from 'lucide-vue-next';
import { Icon } from '@iconify/vue';

interface Props {
  title?: string;
  icon?: string;
  modelValue: boolean;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  icon: '',
  modelValue: false,
  position: () => ({ x: 100, y: 100 }),
  size: () => ({ width: 800, height: 600 })
});
const emit = defineEmits(['update:modelValue']);
const isShow = computed({
  get: () => props.modelValue,
  set: value => {
    emit('update:modelValue', value);
  }
});

const windowRef = ref<HTMLElement>();

// 拖拽状态
const isDragging = ref(false);
const isResizing = ref(false);
const resizeDirection = ref('');
const dragStart = ref({ x: 0, y: 0, windowX: 0, windowY: 0 });
const resizeStart = ref({ x: 0, y: 0, width: 0, height: 0, windowX: 0, windowY: 0 });
const focusZindex = ref(1002);
const normalZindex = ref(1000);
const windowData = reactive({
  position: props.position,
  size: props.size,
  isFullscreen: false,
  zIndex: normalZindex.value
});
// 窗口样式
const windowStyles = computed(() => {
  const { position, size, isFullscreen } = windowData;

  if (isFullscreen) {
    return {
      left: '0px',
      top: '0px',
      width: '100vw',
      height: '100vh',
      zIndex: windowData.zIndex
    };
  }

  return {
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: `${size.width}px`,
    height: `${size.height}px`,
    zIndex: windowData.zIndex
  };
});

// 窗口类名
const windowClasses = computed(() => ['window', `window-${windowData.isFullscreen ? 'fullscreen' : 'normal'}`, { 'window-focused': isShow }]);

// 处理窗口点击
const handleWindowClick = () => {
  isShow.value = true;
};

// 切换最大化
const toggleMaximize = () => {
  windowData.isFullscreen = !windowData.isFullscreen;
  windowData.zIndex = windowData.isFullscreen ? focusZindex.value : normalZindex.value;
};

// 开始拖拽
const startDrag = (e: MouseEvent) => {
  if (windowData.isFullscreen) return;

  isDragging.value = true;
  dragStart.value = {
    x: e.clientX,
    y: e.clientY,
    windowX: windowData.position.x,
    windowY: windowData.position.y
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

  const newX = Math.max(0, Math.min(window.innerWidth - windowData.size.width, dragStart.value.windowX + deltaX));
  const newY = Math.max(0, Math.min(window.innerHeight - windowData.size.height, dragStart.value.windowY + deltaY));

  windowData.position.x = newX;
  windowData.position.y = newY;
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
    width: windowData.size.width,
    height: windowData.size.height,
    windowX: windowData.position.x,
    windowY: windowData.position.y
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

  windowData.position.x = newX;
  windowData.position.y = newY;
  windowData.size.width = newWidth;
  windowData.size.height = newHeight;
};

// 停止调整大小
const stopResize = () => {
  isResizing.value = false;
  resizeDirection.value = '';
  document.removeEventListener('mousemove', handleResize);
  document.removeEventListener('mouseup', stopResize);
};

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
  border: 1px solid #e0e3e7;
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
  height: 45px;
  background: #f5f7fa; /* 主色调浅色或可用rgba(33,150,243,0.08) */
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  border-bottom: 1px solid #e0e3e7;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  cursor: move;
  user-select: none;
}

.window-title {
  color: #1976d2; /* 主色调 */
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.window-controls {
  display: flex;
  gap: 8px;
}

.window-control-btn {
  width: 30px;
  height: 30px;
  border-radius: 4px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: transparent;
  color: #606266;
  transition:
    background 0.2s,
    color 0.2s;
}

.window-control-btn:hover {
  background: #e3f2fd;
  color: #1976d2;
}

.window-control-btn.minimize {
  color: #000;
}

.window-control-btn.minimize:hover {
  background: #e3f2fd;
}

.window-control-btn.maximize {
  color: #000;
}

.window-control-btn.maximize:hover {
  background: #e3f2fd;
}

.window-control-btn.close {
  color: #000;
}

.window-control-btn.close:hover {
  background: rgba(255, 59, 48, 0.08);
  color: #ff3b30;
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
