<template>
  <div @contextmenu.prevent.stop="handleContextMenu">
    <div :class="['flex items-center py-1 px-2 rounded cursor-pointer hover:bg-gray-100 transition-colors', isSelected ? 'bg-blue-50 text-blue-600' : 'text-gray-700']" :style="{ paddingLeft: `${level * 16 + 8}px` }" @click="handleClick">
      <button v-if="node.isFolder && hasChildren" class="mr-1 p-0.5 hover:bg-gray-200 rounded" @click.stop="$emit('toggle', node.id)">
        <ChevronDown v-if="isExpanded" class="h-3 w-3" />
        <ChevronRight v-else class="h-3 w-3" />
      </button>

      <FolderOpen v-if="node.isFolder && isExpanded" class="h-4 w-4 mr-2 text-blue-500" />
      <Folder v-else-if="node.isFolder" class="h-4 w-4 mr-2 text-blue-500" />

      <span class="text-sm truncate">{{ node.name }}</span>
    </div>

    <div v-if="node.isFolder && isExpanded && node.children">
      <!-- 一个单文件组件可以通过它的文件名被其自己所引用。例如：名为 FooBar.vue 的组件可以在其模板中用 <FooBar/> 引用它自己 -->
      <TreeNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :level="level + 1"
        :expanded-folders="expandedFolders"
        :selected-folder="selectedFolder"
        @toggle="$emit('toggle', $event)"
        @select="$emit('select', $event)"
        @contextmenu="(file, event) => $emit('contextmenu', file, event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ChevronDown, ChevronRight, Folder, FolderOpen } from 'lucide-vue-next';
import type { FileTreeDto } from '@/services/api/file/types';

// Props 定义
const props = defineProps<{
  node: FileTreeDto;
  level: number;
  expandedFolders: Set<number>;
  selectedFolder: number | null;
}>();

// Emits 定义
const emit = defineEmits<{
  (e: 'toggle', folderId: number): void;
  (e: 'select', folderId: number): void;
  (e: 'contextmenu', file: FileTreeDto, event: MouseEvent): void;
}>();

const isExpanded = computed((): boolean => props.expandedFolders.has(props.node.id));
const isSelected = computed((): boolean => props.selectedFolder === props.node.id);
const hasChildren = computed((): boolean => Boolean(props.node.children?.length));

const handleClick = (): void => {
  if (props.node.isFolder) {
    emit('select', props.node.id);
    if (hasChildren.value) {
      emit('toggle', props.node.id);
    }
  }
};
const handleContextMenu = (event: MouseEvent): void => {
  emit('contextmenu', props.node, event);
};
</script>
