<template>
  <!-- 列表模式 -->
  <div
    v-if="viewMode === 'list'"
    class="group flex items-center gap-4 p-3 rounded-lg cursor-pointer border border-transparent hover:border-gray-200 hover:bg-blue-50/20 transition-all"
    @contextmenu.prevent.stop="handleContextMenu"
    @click="handleClick"
    @dblclick="handleDoubleClick"
  >
    <!-- 选择框 -->
    <div class="flex items-center">
      <input type="checkbox" :checked="isSelected" class="opacity-0 group-hover:opacity-100 transition-opacity rounded border-gray-300" @change="(e: Event) => emit('select', file.id, (e.target as HTMLInputElement).checked)" @click.stop />
    </div>

    <!-- 文件图标 -->
    <div class="flex-shrink-0">
      <Icon :icon="fileIcon" class="h-6 w-6" />
    </div>

    <!-- 文件信息 -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2">
        <!-- 重命名输入框 -->
        <input
          v-if="isRenaming"
          ref="renameInput"
          v-model="renameValue"
          class="text-sm font-medium text-gray-900 bg-white border border-blue-500 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
          @blur="handleRenameBlur"
          @keydown="handleRenameKeydown"
          @click.stop
        />
        <!-- 正常显示文件名 -->
        <h4 v-else class="text-sm font-medium text-gray-900 truncate">{{ file.name }}</h4>
        <span v-if="file.isFolder" class="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"> 文件夹 </span>
      </div>
      <div class="flex items-center mt-1 text-xs text-gray-500 gap-2">
        <span class="truncate">{{ teamName }}</span>
        <span>•</span>
        <span>{{ file.updatedAt }}</span>
        <span v-if="file.size">•</span>
        <span v-if="file.size">{{ formatFileSize(file.size) }}</span>
      </div>
    </div>

    <!-- 更新者头像 -->
    <div class="flex-shrink-0">
      <div class="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
        <span class="text-xs font-medium">{{ file.owner.nickname?.substring(0, 2).toUpperCase() }}</span>
      </div>
    </div>

    <!-- 操作菜单 -->
    <div class="flex-shrink-0">
      <button class="p-1 hover:bg-gray-200 rounded transition-colors" @click.stop="handleMoreClick">
        <MoreHorizontal class="h-4 w-4" />
      </button>
    </div>
  </div>

  <!-- 网格模式 -->
  <div v-else class="h-full group">
    <div class="h-full cursor-pointer hover:shadow-md transition-all duration-300 bg-white rounded-lg border border-gray-200 relative">
      <!-- 选择框 -->
      <div class="absolute top-2 left-2 z-10">
        <input
          type="checkbox"
          :checked="isSelected"
          class="opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded border-gray-300"
          @change="(e: Event) => emit('select', file.id, (e.target as HTMLInputElement).checked)"
          @click.stop
        />
      </div>

      <div class="p-4 flex flex-col h-full" @click="handleClick" @dblclick="handleDoubleClick">
        <!-- 文件图标 -->
        <div class="flex justify-center mb-3">
          <Icon :icon="fileIcon" class="h-12 w-12" />
        </div>

        <!-- 文件信息 -->
        <div class="flex-1 space-y-2">
          <!-- 重命名输入框 -->
          <input
            v-if="isRenaming"
            ref="renameInput"
            v-model="renameValue"
            class="text-sm font-medium text-gray-900 text-center bg-white border border-blue-500 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
            @blur="handleRenameBlur"
            @keydown="handleRenameKeydown"
            @click.stop
          />
          <!-- 正常显示文件名 -->
          <h4 v-else class="text-sm font-medium text-gray-900 text-center truncate" :title="file.name">
            {{ file.name }}
          </h4>
          <div class="text-xs text-gray-500 text-center space-y-1">
            <div class="truncate">{{ teamName }}</div>
            <div>{{ file.updatedAt }}</div>
            <div v-if="file.size">{{ formatFileSize(file.size) }}</div>
          </div>
        </div>

        <!-- 底部信息 -->
        <div class="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div class="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
            <span class="text-xs font-medium">{{ file.owner.nickname?.substring(0, 2).toUpperCase() }}</span>
          </div>

          <button class="p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-200 rounded">
            <MoreHorizontal class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick, watch } from 'vue';
import type { FileTreeDto } from '@/services/api/file/types';
import { MoreHorizontal } from 'lucide-vue-next';
import { Icon } from '@iconify/vue';
import { getIconNameByFile } from '@/utils/file-icon-map';
import { formatFileSize } from '@/utils/file';

// Props 定义
const props = defineProps<{
  file: FileTreeDto;
  teamName: string;
  isSelected: boolean;
  viewMode: 'list' | 'grid';
  renamingId?: number | null;
}>();

// Emits 定义
const emit = defineEmits<{
  (e: 'select', fileId: number, checked: boolean): void;
  (e: 'click', file: FileTreeDto): void;
  (e: 'contextmenu', file: FileTreeDto, event: MouseEvent, type: string): void;
  (e: 'startRename', nodeId: number): void;
  (e: 'finishRename', nodeId: number, newName: string): void;
  (e: 'cancelRename', nodeId: number): void;
}>();

const isRenaming = computed((): boolean => props.renamingId === props.file.id);

// 重命名相关
const renameValue = ref(props.file.name);
const renameInput = ref<HTMLInputElement>();

// 监听重命名状态变化
watch(isRenaming, async newValue => {
  if (newValue) {
    // 开始重命名时，设置输入框的值并聚焦
    renameValue.value = props.file.name;
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

const fileIcon = computed(() => {
  if (props.file.isFolder) {
    return getIconNameByFile('folder');
  }
  return getIconNameByFile(props.file.ext || '');
});

const handleClick = (): void => {
  if (!isRenaming.value) {
    emit('click', props.file);
  }
};

const handleDoubleClick = (): void => {
  // 双击开始重命名
  emit('startRename', props.file.id);
};

const handleMoreClick = (): void => {
  console.log('more click');
};

const handleContextMenu = (e: MouseEvent): void => {
  emit('contextmenu', props.file, e, 'list');
};

const handleRenameBlur = (): void => {
  // 失去焦点时保存重命名
  if (isRenaming.value) {
    const newName = renameValue.value.trim();
    if (newName && newName !== props.file.name) {
      emit('finishRename', props.file.id, newName);
    } else {
      emit('cancelRename', props.file.id);
    }
  }
};

const handleRenameKeydown = (event: KeyboardEvent): void => {
  if (!isRenaming.value) return;

  if (event.key === 'Enter') {
    // 按Enter保存重命名
    const newName = renameValue.value.trim();
    if (newName && newName !== props.file.name) {
      emit('finishRename', props.file.id, newName);
    } else {
      emit('cancelRename', props.file.id);
    }
  } else if (event.key === 'Escape') {
    // 按Esc取消重命名
    emit('cancelRename', props.file.id);
  }
};
</script>
