<template>
  <el-dialog v-model="dialogVisible" class="custom-dialog" title="创建文件夹" width="600px" :close-on-click-modal="false" @close="handleClose">
    <div class="mb-2">
      <BreadcrumbNav :is-trigger="false" :items="breadcrumbItems" />
    </div>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="文件夹名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入文件夹名称" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="flex justify-end space-x-2">
        <el-button @click="handleClose"><X class="mr-1 w-4 h-4" />取消</el-button>
        <el-button type="primary" :loading="loading" @click="handleSubmit"><Check class="mr-1 w-4 h-4" />创建</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import type { CreateFolderDto } from '@/services/api/file/types';
import BreadcrumbNav from './BreadcrumbNav.vue';
import { Check, X } from 'lucide-vue-next';
import type { BreadcrumbItem } from '@/types/file';
import type { FileTreeDto } from '@/services/api/file/types';

const props = defineProps<{
  modelValue: boolean;
  teamId: number;
  parentId: number;
  fileTree: FileTreeDto[];
  teamName: string;
}>();
// 计算属性 面包屑导航文件路径
const breadcrumbItems = computed((): BreadcrumbItem[] => {
  const findPath = (nodes: FileTreeDto[], targetId: number, path: FileTreeDto[] = []): FileTreeDto[] | null => {
    for (const node of nodes) {
      const newPath = [...path, node];
      if (node.id === targetId) return newPath;
      if (node.children) {
        const found = findPath(node.children, targetId, newPath);
        if (found) return found;
      }
    }
    return null;
  };

  const path = findPath(props.fileTree, props.parentId);
  if (path) {
    return path.map(node => ({
      id: node.id,
      name: node.name === '团队文件' ? props.teamName : node.name,
      type: node.id === 0 ? 'home' : 'folder'
    }));
  }

  return [{ id: 0, name: props.teamName, type: 'home' }];
});
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'close'): void;
  (e: 'create', data: CreateFolderDto): void;
}>();

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
});

const formRef = ref<FormInstance>();
const loading = ref(false);

const form = reactive<CreateFolderDto>({
  name: '',
  teamId: props.teamId,
  parentId: props.parentId
});

const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入文件夹名称', trigger: 'blur' },
    { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
  ]
});

const handleClose = () => {
  form.name = '';
  dialogVisible.value = false;
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(valid => {
    if (valid) {
      loading.value = true;
      emit('create', { ...form });
      loading.value = false;
      handleClose();
    }
  });
};
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
