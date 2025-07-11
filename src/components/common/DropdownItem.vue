<template>
  <div v-if="!divider" class="dropdown-item" :class="itemClass" :data-value="value" role="menuitem" :tabindex="disabled ? -1 : 0" @click="handleClick" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" @keydown="handleKeydown">
    <div class="dropdown-item-content">
      <div v-if="icon" class="dropdown-item-icon">
        <component :is="icon" class="h-4 w-4" />
      </div>
      <div class="dropdown-item-text">
        <slot />
      </div>
      <div v-if="suffix" class="dropdown-item-suffix">
        <component :is="suffix" class="h-4 w-4" />
      </div>
    </div>
  </div>
  <div v-else class="dropdown-divider" />
</template>

<script setup lang="ts">
import { computed } from 'vue';

export interface DropdownItemProps {
  value?: any;
  disabled?: boolean;
  divider?: boolean;
  icon?: any;
  suffix?: any;
  danger?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<DropdownItemProps>(), {
  disabled: false,
  divider: false,
  danger: false,
  size: 'md'
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const itemClass = computed(() => [
  'dropdown-item',
  {
    disabled: props.disabled,
    danger: props.danger,
    [`size-${props.size}`]: true
  }
]);

const handleClick = (event: MouseEvent) => {
  if (props.disabled || props.divider) return;
  emit('click', event);
};

const handleMouseEnter = () => {
  if (props.disabled || props.divider) return;
};

const handleMouseLeave = () => {
  if (props.disabled || props.divider) return;
};

const handleKeydown = (event: KeyboardEvent) => {
  if (props.disabled || props.divider) return;

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    emit('click', event as any);
  }
};
</script>

<style scoped>
.dropdown-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  user-select: none;
  transition: all 0.15s ease;
  outline: none;
  border: none;
  background: transparent;
  width: 100%;
  text-align: left;
  font-size: 14px;
  line-height: 1.5;
  color: #374151;
  border-radius: 5px;
}

.dropdown-item:hover:not(.disabled) {
  background-color: #f3f4f6;
}

.dropdown-item:focus-visible {
  background-color: #f3f4f6;
  outline: 2px solid #3b82f6;
  outline-offset: -2px;
}

.dropdown-item.disabled {
  cursor: not-allowed;
  opacity: 0.5;
  color: #9ca3af;
}

.dropdown-item.danger {
  color: #dc2626;
}

.dropdown-item.danger:hover:not(.disabled) {
  background-color: #fef2f2;
}

.dropdown-item-content {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 8px;
}

.dropdown-item-icon {
  display: flex;
  align-items: center;
  color: #6b7280;
  flex-shrink: 0;
}

.dropdown-item.danger .dropdown-item-icon {
  color: #dc2626;
}

.dropdown-item-text {
  flex: 1;
  min-width: 0;
}

.dropdown-item-suffix {
  display: flex;
  align-items: center;
  color: #6b7280;
  flex-shrink: 0;
  margin-left: auto;
}

/* 尺寸变体 */
.dropdown-item.size-sm {
  padding: 6px 10px;
  font-size: 13px;
}

.dropdown-item.size-lg {
  padding: 10px 14px;
  font-size: 15px;
}

/* 分割线 */
.dropdown-divider {
  height: 1px;
  background-color: #e5e7eb;
  margin: 4px 0;
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .dropdown-item {
    color: #d1d5db;
  }

  .dropdown-item:hover:not(.disabled) {
    background-color: #374151;
  }

  .dropdown-item:focus-visible {
    background-color: #374151;
  }

  .dropdown-item.disabled {
    color: #6b7280;
  }

  .dropdown-item.danger {
    color: #f87171;
  }

  .dropdown-item.danger:hover:not(.disabled) {
    background-color: #7f1d1d;
  }

  .dropdown-item-icon {
    color: #9ca3af;
  }

  .dropdown-item.danger .dropdown-item-icon {
    color: #f87171;
  }

  .dropdown-item-suffix {
    color: #9ca3af;
  }

  .dropdown-divider {
    background-color: #374151;
  }
}
</style>
