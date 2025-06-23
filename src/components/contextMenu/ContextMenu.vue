<template>
  <Teleport to="body">
    <div v-if="visible && items.length > 0" class="fixed inset-0 z-50" @click="handleBackdropClick" @contextmenu.prevent>
      <div ref="menuRef" class="absolute bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-48 max-w-64" :style="style" @click.stop>
        <template v-for="(item, index) in items" :key="item.id || index">
          <!-- 分割线 -->
          <div v-if="item.separator" class="h-px bg-gray-200 my-1" />

          <!-- 菜单项 -->
          <div v-else-if="!item.hidden" class="relative" @mouseenter="handleItemHover(item, index)" @mouseleave="handleItemLeave">
            <button
              class="w-full flex items-center px-3 py-2 text-sm text-left hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              :class="{
                'text-red-600 hover:bg-red-50': item.danger,
                'text-gray-900': !item.danger
              }"
              :disabled="item.disabled"
              @click="handleItemClick(item)"
            >
              <!-- 图标 -->
              <component :is="item.icon" v-if="item.icon" class="h-4 w-4 mr-3 flex-shrink-0" />

              <!-- 标签 -->
              <span class="flex-1 truncate">{{ item.label }}</span>

              <!-- 快捷键 -->
              <span v-if="item.shortcut" class="text-xs text-gray-400 ml-2 flex-shrink-0">
                {{ item.shortcut }}
              </span>

              <!-- 子菜单箭头 -->
              <ChevronRight v-if="item.children && item.children.length > 0" class="h-4 w-4 ml-2 flex-shrink-0" />
            </button>

            <!-- 子菜单 -->
            <div v-if="item.children && item.children.length > 0 && hoveredIndex === index" class="absolute left-full top-0 ml-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-48">
              <template v-for="(child, childIndex) in item.children" :key="child.id || childIndex">
                <div v-if="child.separator" class="h-px bg-gray-200 my-1" />
                <button
                  v-else-if="!child.hidden"
                  class="w-full flex items-center px-3 py-2 text-sm text-left hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  :class="{
                    'text-red-600 hover:bg-red-50': child.danger,
                    'text-gray-900': !child.danger
                  }"
                  :disabled="child.disabled"
                  @click="handleItemClick(child)"
                >
                  <component :is="child.icon" v-if="child.icon" class="h-4 w-4 mr-3 flex-shrink-0" />
                  <span class="flex-1 truncate">{{ child.label }}</span>
                  <span v-if="child.shortcut" class="text-xs text-gray-400 ml-2 flex-shrink-0">
                    {{ child.shortcut }}
                  </span>
                </button>
              </template>
            </div>
          </div>
        </template>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted, watch } from 'vue';
import { ChevronRight } from 'lucide-vue-next';
import type { MenuItem, ContextMenuProps } from '@/types/contextMenu';

const props = defineProps<ContextMenuProps>();
const emit = defineEmits<{
  close: [];
}>();

const menuRef = ref<HTMLDivElement | null>(null);
const hoveredIndex = ref<number>(-1);
const menuHeight = ref(0);

// 监听菜单显示，然后获取其高度
watch(
  () => props.visible,
  async newValue => {
    if (newValue) {
      await nextTick();
      if (menuRef.value) {
        menuHeight.value = menuRef.value.offsetHeight;
      }
    }
  }
);

const style = computed(() => {
  const { x, y } = props;
  const style: { top: string; left: string } = {
    top: `${y}px`,
    left: `${x}px`
  };

  if (typeof window !== 'undefined' && menuRef.value) {
    const menuWidth = menuRef.value.offsetWidth || 200; // 使用实际宽度或估算
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // 水平方向处理
    if (x + menuWidth > viewportWidth) {
      style.left = `${x - menuWidth}px`;
    }

    // 垂直方向智能处理
    const spaceBelow = viewportHeight - y;
    const spaceAbove = y;

    if (spaceBelow < menuHeight.value) {
      if (spaceAbove > menuHeight.value) {
        // 上方空间足够，则在上方显示
        style.top = `${y - menuHeight.value}px`;
      } else {
        // 两边都不够，则贴近底部边缘显示
        style.top = `${viewportHeight - menuHeight.value - 5}px`; // 减5px留出边距
      }
    }
  }

  return style;
});

// 处理菜单项点击
const handleItemClick = async (item: MenuItem) => {
  if (item.disabled || !item.action) return;

  try {
    await item.action();
  } catch (error) {
    console.error('Menu item action failed:', error);
  } finally {
    emit('close');
  }
};

// 处理背景点击
const handleBackdropClick = () => {
  emit('close');
};

// 处理菜单项悬停
const handleItemHover = (item: MenuItem, index: number) => {
  if (item.children && item.children.length > 0) {
    hoveredIndex.value = index;
  }
};

// 处理菜单项离开
const handleItemLeave = () => {
  // 延迟清除悬停状态，避免子菜单闪烁
  setTimeout(() => {
    hoveredIndex.value = -1;
  }, 100);
};

// 键盘事件处理
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    emit('close');
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);

  // 聚焦菜单以支持键盘导航
  nextTick(() => {
    menuRef.value?.focus();
  });
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>
