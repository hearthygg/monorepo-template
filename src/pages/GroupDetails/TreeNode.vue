<template>
  <div @contextmenu.prevent.stop="handleContextMenu">
    <div
      :class="['flex items-center py-1 px-2 rounded cursor-pointer hover:bg-gray-100 transition-colors', isSelected ? 'bg-blue-50 text-blue-600' : 'text-gray-700']"
      :style="{ paddingLeft: `${level * 16 + 8}px` }"
      @click="handleClick"
      @dblclick="handleDoubleClick"
    >
      <button v-if="node.isFolder" class="mr-1 p-0.5 hover:bg-gray-200 rounded" @click.stop="$emit('toggle', node.id)">
        <ChevronDown v-if="isExpanded" class="h-3 w-3" />
        <ChevronRight v-else class="h-3 w-3" />
      </button>

      <FolderOpen v-if="node.isFolder && isExpanded" class="h-4 w-4 mr-2 text-blue-500" />
      <Folder v-else-if="node.isFolder" class="h-4 w-4 mr-2 text-blue-500" />

      <!-- 重命名输入框 -->
      <input
        v-if="isRenaming"
        ref="renameInput"
        v-model="renameValue"
        class="flex-1 text-sm bg-white border border-blue-500 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
        @blur="handleRenameBlur"
        @keydown="handleRenameKeydown"
        @click.stop
      />
      <!-- 正常显示文件名 -->
      <span v-else class="text-sm truncate">{{ node.name }}</span>
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
        :renaming-id="renamingId"
        @toggle="$emit('toggle', $event)"
        @select="$emit('select', $event)"
        @contextmenu="(file, event) => $emit('contextmenu', file, event, 'tree')"
        @start-rename="$emit('startRename', $event)"
        @finish-rename="(nodeId, newName) => $emit('finishRename', nodeId, newName)"
        @cancel-rename="$emit('cancelRename', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick, watch } from 'vue';
import { ChevronDown, ChevronRight, Folder, FolderOpen } from 'lucide-vue-next';
import type { FileTreeDto } from '@/services/api/file/types';

// Props 定义
const props = defineProps<{
  node: FileTreeDto;
  level: number;
  expandedFolders: Set<number>;
  selectedFolder: number | null;
  renamingId?: number | null;
}>();

// Emits 定义
const emit = defineEmits<{
  (e: 'toggle', folderId: number): void;
  (e: 'select', folderId: number): void;
  (e: 'contextmenu', file: FileTreeDto, event: MouseEvent, type: string): void;
  (e: 'startRename', nodeId: number): void;
  (e: 'finishRename', nodeId: number, newName: string): void;
  (e: 'cancelRename', nodeId: number): void;
}>();

const isExpanded = computed((): boolean => props.expandedFolders.has(props.node.id));
const isSelected = computed((): boolean => props.selectedFolder === props.node.id);
const hasChildren = computed((): boolean => Boolean(props.node.children?.length));
const isRenaming = computed((): boolean => props.renamingId === props.node.id);

// 重命名相关
const renameValue = ref(props.node.name);
const renameInput = ref<HTMLInputElement>();

// 监听重命名状态变化
watch(isRenaming, async newValue => {
  if (newValue) {
    // 开始重命名时，设置输入框的值并聚焦
    renameValue.value = props.node.name;
    // 使用双重nextTick确保DOM完全更新
    await nextTick();
    await nextTick();
    if (renameInput.value) {
      renameInput.value.focus();
      // 选中文件名（不包括扩展名）
      const lastDotIndex = renameValue.value.lastIndexOf('.');
      if (lastDotIndex > 0) {
        renameInput.value.setSelectionRange(0, lastDotIndex);
      } else {
        renameInput.value.select();
      }
    }
  }
});

const handleClick = (): void => {
  if (props.node.isFolder) {
    emit('select', props.node.id);
    if (hasChildren.value) {
      emit('toggle', props.node.id);
    }
  }
};

const handleDoubleClick = (): void => {
  // 双击开始重命名
  // emit('startRename', props.node.id);
};

const handleContextMenu = (event: MouseEvent): void => {
  emit('contextmenu', props.node, event, 'tree');
};

const handleRenameBlur = (): void => {
  // 失去焦点时保存重命名
  if (isRenaming.value) {
    const newName = renameValue.value.trim();
    if (newName && newName !== props.node.name) {
      emit('finishRename', props.node.id, newName);
    } else {
      emit('cancelRename', props.node.id);
    }
  }
};

const handleRenameKeydown = (event: KeyboardEvent): void => {
  if (!isRenaming.value) return;

  if (event.key === 'Enter') {
    // 按Enter保存重命名
    const newName = renameValue.value.trim();
    if (newName && newName !== props.node.name) {
      emit('finishRename', props.node.id, newName);
    } else {
      emit('cancelRename', props.node.id);
    }
  } else if (event.key === 'Escape') {
    // 按Esc取消重命名
    emit('cancelRename', props.node.id);
  }
};
</script>
