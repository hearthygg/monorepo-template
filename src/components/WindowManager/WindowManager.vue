<template>
  <div class="window-manager">
    <!-- 窗口容器 -->
    <div class="windows-container">
      <ResizableWindow
        v-for="window in windowManager.windows"
        :key="window.id"
        :window="window"
        @close="closeWindow"
        @minimize="minimizeWindow"
        @maximize="maximizeWindow"
        @restore="restoreWindow"
        @focus="focusWindow"
        @update-position="updateWindowPosition"
        @update-size="updateWindowSize"
      >
        <FilePreviewWindow :type="window.type" :file="window.data" />
      </ResizableWindow>
    </div>

    <!-- 底部任务栏 -->
    <TaskBar :minimized-windows="windowManager.windows" @change-window-status="changeWindowStatus" />
  </div>
</template>

<script setup lang="ts">
// import { computed } from 'vue';
import { useWindowManager } from '@/composables/useWindowManager';
import ResizableWindow from './ResizableWindow.vue';
import FilePreviewWindow from './FilePreviewWindow.vue';
import TaskBar from './TaskBar.vue';

const { windowManager, closeWindow, minimizeWindow, maximizeWindow, restoreWindow, focusWindow, updateWindowPosition, updateWindowSize, changeWindowStatus } = useWindowManager();

// // 可见窗口（非最小化）
// const visibleWindows = computed(() => windowManager.windows.filter(w => w.status !== 'minimized'));

// // 最小化窗口
// const minimizedWindows = computed(() => windowManager.windows.filter(w => w.status === 'minimized'));
</script>

<style scoped>
.window-manager {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1000;
}

.windows-container {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
