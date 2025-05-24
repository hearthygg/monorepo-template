<template>
  <nav class="flex items-center space-x-1 text-sm text-gray-600">
    <div v-for="(item, index) in items" :key="item.id" class="flex items-center">
      <ChevronRightIcon v-if="index > 0" class="h-4 w-4 mx-1 text-gray-400" />
      <button
        :disabled="index === items.length - 1"
        :class="['flex items-center h-8 px-2 rounded hover:bg-gray-100 transition-colors', index === items.length - 1 ? 'text-gray-900 font-medium cursor-default' : 'text-gray-600 hover:text-gray-900']"
        @click="$emit('navigate', item.id)"
      >
        <component :is="getIcon(item.type)" class="h-4 w-4" />
        <span class="ml-1">{{ item.name }}</span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ChevronRight as ChevronRightIcon, Home as HomeIcon, Folder as FolderIcon } from 'lucide-vue-next';

interface BreadcrumbItem {
  id: string;
  name: string;
  type: 'home' | 'team' | 'folder';
}

interface Props {
  items: BreadcrumbItem[];
}

defineProps<Props>();

const emit = defineEmits<{
  navigate: [id: string];
}>();

const getIcon = (type: string) => {
  switch (type) {
    case 'home':
      return HomeIcon;
    case 'team':
      return FolderIcon;
    case 'folder':
      return FolderIcon;
    default:
      return FolderIcon;
  }
};
</script>
