<template>
  <el-dialog class="custom-dialog" :model-value="visible" title="创建聊天室" width="450px" append-to-body @close="handleClose">
    <div>
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">聊天室名称</label>
        <el-input v-model="chatRoomName" placeholder="请输入聊天室名称" clearable maxlength="50" show-word-limit @keyup.enter="handleConfirm" />
      </div>
    </div>
    <template #footer>
      <el-button @click="handleClose">
        <X class="mr-1 w-4 h-4" />
        取消
      </el-button>
      <el-button type="primary" :disabled="!chatRoomName.trim()" @click="handleConfirm">
        <Check class="mr-1 w-4 h-4" />
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { X, Check } from 'lucide-vue-next';

interface Props {
  visible: boolean;
}

interface Emits {
  (e: 'update:visible', value: boolean): void;
  (e: 'confirm', chatRoomName: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const chatRoomName = ref('');

// 监听弹窗显示状态，重置表单
watch(
  () => props.visible,
  newValue => {
    if (newValue) {
      chatRoomName.value = '';
    }
  }
);

const handleClose = () => {
  emit('update:visible', false);
};

const handleConfirm = () => {
  if (chatRoomName.value.trim()) {
    emit('confirm', chatRoomName.value.trim());
    handleClose();
  }
};
</script>

<style scoped>
.custom-dialog :deep(.el-dialog) {
  border-radius: 12px;
  overflow: hidden;
}

.custom-dialog :deep(.el-dialog__header) {
  background: #f8f9fa;
  padding: 20px 24px;
  margin: 0;
  border-bottom: 1px solid #e9ecef;
}

.custom-dialog :deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
  color: #2d3a4a;
}

.custom-dialog :deep(.el-dialog__body) {
  padding: 24px;
}

.custom-dialog :deep(.el-dialog__footer) {
  padding: 16px 24px;
  border-top: 1px solid #e9ecef;
  background: #f8f9fa;
}
</style>
