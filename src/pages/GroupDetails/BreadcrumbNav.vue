<template>
  <nav class="flex items-center space-x-1 text-sm text-gray-600">
    <div v-for="(item, index) in items" :key="item.id" class="flex items-center">
      <ChevronRight v-if="index > 0" class="h-4 w-4 mx-1 text-gray-400" />
      <button
        :class="['h-8 px-2 rounded flex items-center transition-colors', index === items.length - 1 ? 'text-gray-900 font-medium cursor-default' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100']"
        :disabled="index === items.length - 1"
        @click="$emit('navigate', item.id)"
      >
        <Home v-if="item.type === 'home'" class="h-4 w-4" />
        <Folder v-else-if="item.type === 'folder'" class="h-4 w-4 text-gray-500" />
        <span class="ml-1">{{ item.name }}</span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ChevronRight, Home, Folder } from 'lucide-vue-next';

defineProps<{
  items: {
    id: string;
    name: string;
    type: 'home' | 'folder';
  }[];
}>();

defineEmits(['navigate']);
</script>
