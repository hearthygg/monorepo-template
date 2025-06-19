<template>
  <div :class="getLayoutClasses()">
    <div v-for="option in permissionOptions" :key="option.value" class="permission-option" @click="handleOptionClick(option.value)" @mouseenter="hoveredOption = option.value" @mouseleave="hoveredOption = null">
      <div
        :class="[
          'permission-card',
          'cursor-pointer transition-all duration-200 border-2 border-gray-400 rounded-lg',
          {
            'border-blue-500 bg-blue-50': isSelected(option.value),
            'border-blue-200 bg-blue-25': isIncluded(option.value) && mode === 'cascade' && !isSelected(option.value),
            // 'shadow-md': hoveredOption === option.value && !disabled,
            'opacity-50 cursor-not-allowed': disabled,
            'min-w-[200px]': layout === 'horizontal'
            // 'transform scale-105': hoveredOption === option.value && !disabled
          },
          sizeClasses.card
        ]"
      >
        <!-- 选中状态指示器 -->
        <div v-if="isSelected(option.value)" class="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
          <CheckIcon class="h-3 w-3" />
        </div>

        <!-- 级联模式的包含指示器 -->
        <div v-else-if="isIncluded(option.value) && mode === 'cascade'" class="absolute top-2 right-2 bg-blue-200 text-blue-600 rounded-full p-1">
          <CheckIcon class="h-3 w-3" />
        </div>

        <div class="flex items-start gap-3">
          <!-- 图标 -->
          <div :class="['flex-shrink-0 p-2 rounded-lg', isSelected(option.value) ? 'bg-blue-100' : 'bg-gray-100']">
            <component :is="getIconComponent(option.icon)" :class="[sizeClasses.icon, isSelected(option.value) ? 'text-blue-600' : option.color]" />
          </div>

          <!-- 内容 -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <h3 :class="[sizeClasses.title, isSelected(option.value) ? 'text-blue-900' : 'text-gray-900']">
                {{ option.label }}
              </h3>

              <!-- 权限级别徽章 -->
              <span :class="['text-xs px-2 py-1 rounded-full', isSelected(option.value) ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600']"> 级别 {{ option.value }} </span>
            </div>

            <p v-if="showDescription" :class="[sizeClasses.description, isSelected(option.value) ? 'text-blue-700' : 'text-gray-600']">
              {{ option.description }}
            </p>

            <!-- 级联模式的权限说明 -->
            <!-- <p v-if="mode === 'cascade' && isIncluded(option.value) && !isSelected(option.value)" class="text-xs text-blue-600 mt-1">
              包含在当前权限中
            </p> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Lock, Eye, Edit3, Trash2, Check } from 'lucide-vue-next';
import { FilePermissionLevel } from '@/constants/enum';
import type { PermissionOption, PermissionSelectorProps } from '@/types/permissions';

// 图标组件映射
const iconComponents = {
  Lock,
  Eye,
  Edit3,
  Trash2,
  Check: Check
};

// 重命名图标以避免冲突
const CheckIcon = Check;

const props = withDefaults(defineProps<PermissionSelectorProps>(), {
  mode: 'single',
  disabled: false,
  size: 'md',
  layout: 'vertical',
  showDescription: true
});

const emit = defineEmits<{
  'update:modelValue': [value: FilePermissionLevel | FilePermissionLevel[]];
}>();

const hoveredOption = ref<FilePermissionLevel | null>(null);

const permissionOptions: PermissionOption[] = [
  {
    label: '无权限',
    value: FilePermissionLevel.NONE,
    icon: 'Lock',
    description: '仅可查看团队信息',
    color: 'text-gray-500'
  },
  {
    label: '可查看',
    value: FilePermissionLevel.VIEW,
    icon: 'Eye',
    description: '可查看团队文件',
    color: 'text-blue-500'
  },
  {
    label: '可编辑',
    value: FilePermissionLevel.EDIT,
    icon: 'Edit3',
    description: '可编辑团队文件',
    color: 'text-green-500'
  },
  {
    label: '可删除',
    value: FilePermissionLevel.DELETE,
    icon: 'Trash2',
    description: '可删除团队文件',
    color: 'text-red-500'
  }
];

const isSelected = (optionValue: FilePermissionLevel): boolean => {
  if (Array.isArray(props.modelValue)) {
    return props.modelValue.includes(optionValue);
  }
  return props.modelValue === optionValue;
};

const isIncluded = (optionValue: FilePermissionLevel): boolean => {
  if (props.mode === 'cascade' && typeof props.modelValue === 'number') {
    return optionValue <= props.modelValue;
  }
  return isSelected(optionValue);
};

const handleOptionClick = (optionValue: FilePermissionLevel) => {
  if (props.disabled) return;

  if (props.mode === 'multiple') {
    const currentValues = Array.isArray(props.modelValue) ? props.modelValue : [];
    const newValues = currentValues.includes(optionValue) ? currentValues.filter(v => v !== optionValue) : [...currentValues, optionValue];
    emit('update:modelValue', newValues);
  } else {
    emit('update:modelValue', optionValue);
  }
};

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return {
        card: 'p-3',
        icon: 'h-4 w-4',
        title: 'text-sm font-medium',
        description: 'text-xs'
      };
    case 'lg':
      return {
        card: 'p-6',
        icon: 'h-6 w-6',
        title: 'text-lg font-semibold',
        description: 'text-sm'
      };
    default:
      return {
        card: 'p-4',
        icon: 'h-5 w-5',
        title: 'text-base font-medium',
        description: 'text-sm'
      };
  }
});

const getLayoutClasses = (): string => {
  switch (props.layout) {
    case 'horizontal':
      return 'flex flex-row gap-3 overflow-x-auto';
    case 'grid':
      return 'grid grid-cols-2 gap-3';
    default:
      return 'flex flex-col gap-3';
  }
};

const getIconComponent = (iconName: string) => {
  return iconComponents[iconName as keyof typeof iconComponents] || Lock;
};
</script>

<style scoped>
.permission-card {
  position: relative;
  transition: all 0.2s ease-in-out;
}

/* .permission-option:hover .permission-card:not(.opacity-50) {
  transform: scale(1.02);
}

.permission-option:active .permission-card:not(.opacity-50) {
  transform: scale(0.98);
} */

@keyframes scale-in {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

.animate-scale-in {
  animation: scale-in 0.2s ease-out;
}

.bg-blue-25 {
  background-color: rgb(239 246 255);
}
</style>
