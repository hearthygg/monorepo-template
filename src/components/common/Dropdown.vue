<template>
  <div ref="containerRef" class="dropdown-container">
    <!-- 触发元素 -->
    <div
      ref="triggerRef"
      class="dropdown-trigger"
      :class="triggerClass"
      :tabindex="0"
      role="button"
      :aria-expanded="isVisible"
      :aria-haspopup="true"
      @click="handleTriggerClick"
      @mouseenter="handleTriggerHover"
      @mouseleave="handleTriggerLeave"
      @contextmenu="handleContextMenu"
      @keydown="handleKeydown"
    >
      <slot name="trigger" />
    </div>

    <!-- 下拉菜单 - 使用teleport渲染到body -->
    <Teleport to="body">
      <Transition name="dropdown" @enter="onEnter" @leave="onLeave">
        <div v-show="isVisible" ref="menuRef" class="dropdown-menu" :class="menuClass" :style="menuStyle" @mouseenter="handleMenuHover" @mouseleave="handleMenuLeave" @click="handleMenuClick">
          <slot />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted, watch } from 'vue';

export interface DropdownProps {
  trigger?: 'click' | 'hover' | 'contextmenu' | 'click-hover' | 'click-contextmenu' | 'hover-contextmenu' | 'all';
  placement?: 'bottom' | 'top' | 'left' | 'right' | 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' | 'left-start' | 'left-end' | 'right-start' | 'right-end';
  offset?: number;
  delay?: number;
  disabled?: boolean;
  autoClose?: boolean;
  triggerClass?: string;
  menuClass?: string;
  teleportTo?: string;
}

const props = withDefaults(defineProps<DropdownProps>(), {
  trigger: 'click',
  placement: 'bottom',
  offset: 8,
  delay: 200,
  disabled: false,
  autoClose: true,
  triggerClass: '',
  menuClass: '',
  teleportTo: 'body'
});

const emit = defineEmits<{
  visibleChange: [visible: boolean];
  select: [value: any];
}>();

// 响应式数据
const isVisible = ref(false);
const containerRef = ref<HTMLElement>();
const triggerRef = ref<HTMLElement>();
const menuRef = ref<HTMLElement>();
const hoverTimer = ref<number>();
const menuStyle = ref<Record<string, string>>({});

// 计算属性
const supportsClick = computed(() => ['click', 'click-hover', 'click-contextmenu', 'all'].includes(props.trigger));

const supportsHover = computed(() => ['hover', 'click-hover', 'hover-contextmenu', 'all'].includes(props.trigger));

const supportsContextMenu = computed(() => ['contextmenu', 'click-contextmenu', 'hover-contextmenu', 'all'].includes(props.trigger));

// 事件处理
const handleTriggerClick = (event: MouseEvent) => {
  if (props.disabled || !supportsClick.value) return;

  event.preventDefault();
  event.stopPropagation();

  if (isVisible.value) {
    hide();
  } else {
    show();
  }
};

const handleTriggerHover = () => {
  if (props.disabled || !supportsHover.value) return;

  if (hoverTimer.value) {
    clearTimeout(hoverTimer.value);
  }

  hoverTimer.value = window.setTimeout(() => {
    show();
  }, props.delay);
};

const handleTriggerLeave = () => {
  if (props.disabled || !supportsHover.value) return;

  if (hoverTimer.value) {
    clearTimeout(hoverTimer.value);
  }

  hoverTimer.value = window.setTimeout(() => {
    hide();
  }, props.delay);
};

const handleContextMenu = (event: MouseEvent) => {
  if (props.disabled || !supportsContextMenu.value) return;

  event.preventDefault();
  event.stopPropagation();

  show();
};

const handleMenuHover = () => {
  if (props.disabled || !supportsHover.value) return;

  if (hoverTimer.value) {
    clearTimeout(hoverTimer.value);
  }
};

const handleMenuLeave = () => {
  if (props.disabled || !supportsHover.value) return;

  if (hoverTimer.value) {
    clearTimeout(hoverTimer.value);
  }

  hoverTimer.value = window.setTimeout(() => {
    hide();
  }, props.delay);
};

const handleMenuClick = (event: Event) => {
  const target = event.target as HTMLElement;
  const menuItem = target.closest('.dropdown-item');

  if (menuItem && !menuItem.classList.contains('disabled')) {
    const value = menuItem.getAttribute('data-value');
    emit('select', value);

    if (props.autoClose) {
      hide();
    }
  }
};

const handleKeydown = (event: KeyboardEvent) => {
  if (props.disabled) return;

  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault();
      if (isVisible.value) {
        hide();
      } else {
        show();
      }
      break;
    case 'Escape':
      if (isVisible.value) {
        hide();
      }
      break;
  }
};

// 显示/隐藏逻辑
const show = async () => {
  if (isVisible.value || props.disabled) return;

  isVisible.value = true;
  emit('visibleChange', true);

  await nextTick();
  updatePosition();
};

const hide = () => {
  if (!isVisible.value) return;

  isVisible.value = false;
  emit('visibleChange', false);

  if (hoverTimer.value) {
    clearTimeout(hoverTimer.value);
  }
};

// 位置计算 - 修改为相对于视口定位
const updatePosition = () => {
  if (!triggerRef.value || !menuRef.value) return;

  // 获取触发元素相对于视口的位置
  const triggerRect = triggerRef.value.getBoundingClientRect();
  const menuRect = menuRef.value.getBoundingClientRect();

  let top = 0;
  let left = 0;

  switch (props.placement) {
    case 'bottom':
      top = triggerRect.bottom + props.offset;
      left = triggerRect.left + (triggerRect.width - menuRect.width) / 2;
      break;
    case 'bottom-start':
      top = triggerRect.bottom + props.offset;
      left = triggerRect.left;
      break;
    case 'bottom-end':
      top = triggerRect.bottom + props.offset;
      left = triggerRect.right - menuRect.width;
      break;
    case 'top':
      top = triggerRect.top - menuRect.height - props.offset;
      left = triggerRect.left + (triggerRect.width - menuRect.width) / 2;
      break;
    case 'top-start':
      top = triggerRect.top - menuRect.height - props.offset;
      left = triggerRect.left;
      break;
    case 'top-end':
      top = triggerRect.top - menuRect.height - props.offset;
      left = triggerRect.right - menuRect.width;
      break;
    case 'left':
      top = triggerRect.top + (triggerRect.height - menuRect.height) / 2;
      left = triggerRect.left - menuRect.width - props.offset;
      break;
    case 'left-start':
      top = triggerRect.top;
      left = triggerRect.left - menuRect.width - props.offset;
      break;
    case 'left-end':
      top = triggerRect.bottom - menuRect.height;
      left = triggerRect.left - menuRect.width - props.offset;
      break;
    case 'right':
      top = triggerRect.top + (triggerRect.height - menuRect.height) / 2;
      left = triggerRect.right + props.offset;
      break;
    case 'right-start':
      top = triggerRect.top;
      left = triggerRect.right + props.offset;
      break;
    case 'right-end':
      top = triggerRect.bottom - menuRect.height;
      left = triggerRect.right + props.offset;
      break;
  }

  // 边界检测和调整
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  if (left + menuRect.width > viewportWidth) {
    left = viewportWidth - menuRect.width - 8;
  }
  if (left < 8) {
    left = 8;
  }
  if (top + menuRect.height > viewportHeight) {
    top = viewportHeight - menuRect.height - 8;
  }
  if (top < 8) {
    top = 8;
  }

  menuStyle.value = {
    position: 'fixed',
    top: `${top}px`,
    left: `${left}px`,
    zIndex: '9999'
  };
};

// 动画处理
const onEnter = (el: Element) => {
  const menu = el as HTMLElement;
  menu.style.opacity = '0';
  menu.style.transform = 'scale(0.95) translateY(-8px)';

  requestAnimationFrame(() => {
    menu.style.transition = 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)';
    menu.style.opacity = '1';
    menu.style.transform = 'scale(1) translateY(0)';
  });
};

const onLeave = (el: Element) => {
  const menu = el as HTMLElement;
  menu.style.transition = 'all 0.1s cubic-bezier(0.4, 0, 0.2, 1)';
  menu.style.opacity = '0';
  menu.style.transform = 'scale(0.95) translateY(-8px)';
};

// 点击外部关闭
const handleClickOutside = (event: Event) => {
  const target = event.target as Node;

  // 检查点击是否在触发元素或菜单内部
  const isInTrigger = containerRef.value?.contains(target);
  const isInMenu = menuRef.value?.contains(target);

  if (!isInTrigger && !isInMenu) {
    hide();
  }
};

// 窗口大小变化时重新定位
const handleResize = () => {
  if (isVisible.value) {
    updatePosition();
  }
};

// 生命周期
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('resize', handleResize);

  if (hoverTimer.value) {
    clearTimeout(hoverTimer.value);
  }
});

// 监听禁用状态变化
watch(
  () => props.disabled,
  disabled => {
    if (disabled && isVisible.value) {
      hide();
    }
  }
);

// 暴露方法
defineExpose({
  show,
  hide,
  toggle: () => (isVisible.value ? hide() : show())
});
</script>

<style scoped>
.dropdown-container {
  position: relative;
  display: inline-block;
}

.dropdown-trigger {
  cursor: pointer;
  user-select: none;
  outline: none;
}

.dropdown-trigger:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
  border-radius: 4px;
}

.dropdown-menu {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  padding: 6px;
  min-width: 145px;
  max-width: 320px;
  overflow: hidden;
}

/* 动画 */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-8px);
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .dropdown-menu {
    background: #1f2937;
    border-color: #374151;
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.3),
      0 4px 6px -2px rgba(0, 0, 0, 0.2);
  }
}
</style>
