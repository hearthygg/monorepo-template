<template>
  <el-dialog v-model="dialogVisible" title="创建文件夹" width="600px" :close-on-click-modal="false" @close="handleClose">
    <div class="mb-2">
      <BreadcrumbNav :is-trigger="false" :items="items" />
    </div>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="文件夹名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入文件夹名称" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" :loading="loading" @click="handleSubmit">创建</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import type { CreateFolderDto } from '@/services/api/file/types';
import BreadcrumbNav from './BreadcrumbNav.vue';

const props = defineProps<{
  modelValue: boolean;
  teamId: number;
  parentId?: number;
  items: any;
}>();

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
