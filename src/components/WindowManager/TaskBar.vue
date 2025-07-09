<template>
  <div v-if="minimizedWindows.length > 0" ref="taskBarRef" class="task-bar bg-gray-100">
    <div class="task-bar-content">
      <div class="task-items">
        <el-tooltip v-for="window in minimizedWindows" :key="window.id" :content="window.data.name" placement="top"
          ><button class="task-item" @click="$emit('changeWindowStatus', window.id)">
            <Icon :icon="getIconNameByFile(window.data.ext || '')" class="h-8 w-8 flex-shrink-0" /></button
        ></el-tooltip>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import type { WindowState } from '@/types/window';
import { Icon } from '@iconify/vue';
import { getIconNameByFile } from '@/utils/file-icon-map';

interface Props {
  minimizedWindows: WindowState[];
}

interface Emits {
  (e: 'changeWindowStatus', id: string): void;
}

defineProps<Props>();
defineEmits<Emits>();

const taskBarRef = ref<HTMLElement | null>(null);

// 新增：处理滚轮事件
const handleWheelScroll = (event: WheelEvent) => {
  const el = taskBarRef.value;
  if (el) {
    // 仅当存在水平溢出时才处理
    if (el.scrollWidth > el.clientWidth) {
      // 阻止页面的垂直滚动
      event.preventDefault();
      // 将垂直滚动增量应用到水平滚动上
      el.scrollLeft += event.deltaY;
    }
  }
};

onMounted(() => {
  taskBarRef.value?.addEventListener('wheel', handleWheelScroll, { passive: false });
});

onBeforeUnmount(() => {
  taskBarRef.value?.removeEventListener('wheel', handleWheelScroll);
});
</script>

<style scoped lang="scss">
.task-bar {
  position: fixed;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  height: auto;
  // background: rgba(229, 231, 235, 0.6); /* Light grey glass */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px); /* Safari support */
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 18px;
  z-index: 200;
  pointer-events: auto;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease-in-out;
  max-width: 80vw; /* 建议使用 vw 以适应不同屏幕 */
  padding: 6px;

  /* 将滚动功能放在最外层容器 */
  overflow-x: auto;
  /* 恢复隐藏滚动条的样式 */
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.task-bar::-webkit-scrollbar {
  display: none;
}

.task-bar-content {
  display: inline-flex; /* 使用 inline-flex 使其宽度由内容决定 */
  justify-content: center;
  align-items: center;
  height: 100%;
}

.task-items {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 45px;
  padding: 0 4px;
}

.task-item {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  width: 45px;
  height: 45px;
  transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1); /* Bouncy transition */
}

.task-item:hover {
  transform: scale(1.2) translateY(-8px);
}
</style>
