<template>
  <Teleport to="body">
    <div v-if="visible && items.length > 0" class="fixed inset-0 z-50" @click="handleBackdropClick" @contextmenu.prevent>
      <div ref="menuRef" class="absolute bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-48 max-w-64" :style="menuStyle" @click.stop>
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
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue';
import { ChevronRight } from 'lucide-vue-next';
import type { MenuItem, ContextMenuProps } from '@/types/contextMenu';

const props = defineProps<ContextMenuProps>();
const emit = defineEmits<{
  close: [];
}>();

const menuRef = ref<HTMLElement>();
const hoveredIndex = ref<number>(-1);

// 计算菜单位置
const menuStyle = computed(() => {
  const style: Record<string, string> = {
    left: `${props.x}px`,
    top: `${props.y}px`
  };

  // 防止菜单超出屏幕边界
  if (typeof window !== 'undefined') {
    const menuWidth = 200; // 估算菜单宽度
    const menuHeight = props.items.length * 40; // 估算菜单高度

    if (props.x + menuWidth > window.innerWidth) {
      style.left = `${props.x - menuWidth}px`;
    }

    if (props.y + menuHeight > window.innerHeight) {
      style.top = `${props.y - menuHeight}px`;
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
