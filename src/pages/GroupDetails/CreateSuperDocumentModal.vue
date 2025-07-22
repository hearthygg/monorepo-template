<template>
  <el-dialog v-model="dialogVisible" class="custom-dialog" title="新建超级文档" width="600px" :close-on-click-modal="false" @close="handleClose">
    <div class="mb-2">
      <BreadcrumbNav :is-trigger="false" :items="breadcrumbItems" />
    </div>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="文档标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入文档标题" />
      </el-form-item>
      <el-form-item label="文档描述" prop="description">
        <el-input v-model="form.description" type="textarea" :rows="2" placeholder="可选" />
      </el-form-item>
      <el-form-item label="文件类型" prop="extension">
        <el-select v-model="form.extension" placeholder="请选择类型">
          <el-option label="富文本文档(.doc)" value="doc" />
          <el-option label="Markdown(.md)" value="md" />
          <el-option label="纯文本(.txt)" value="txt" />
        </el-select>
      </el-form-item>
      <el-form-item label="启用协作">
        <el-switch v-model="form.collaborationEnabled" />
        <span class="ml-2 text-xs text-gray-500">允许多人同时编辑</span>
      </el-form-item>
      <el-form-item v-if="form.collaborationEnabled" label="最大用户数" prop="maxUsers">
        <el-input-number v-model="form.maxUsers" :min="2" :max="50" />
        <span class="ml-2 text-xs text-gray-500">2-50</span>
      </el-form-item>
      <el-form-item label="自动保存间隔" prop="autoSaveInterval">
        <el-input-number v-model="form.autoSaveInterval" :min="1000" :max="60000" :step="1000" />
        <span class="ml-2 text-xs text-gray-500">毫秒（1-60秒）</span>
      </el-form-item>
      <el-form-item label="初始内容" prop="initialContent">
        <el-input v-model="form.initialContent" type="textarea" :rows="4" placeholder="可选" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">创建</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import BreadcrumbNav from './BreadcrumbNav.vue';
import type { BreadcrumbItem } from '@/types/file';
import { Extension, type CreateSuperDocumentDto, type FileTreeDto } from '@/services/api/file/types';

const props = defineProps<{
  modelValue: boolean;
  teamId: number;
  parentId: number;
  fileTree: FileTreeDto[];
  teamName: string;
}>();
const emit = defineEmits(['update:modelValue', 'confirm']);
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
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
});

const formRef = ref<FormInstance>();
const loading = ref(false);
const form = reactive<CreateSuperDocumentDto>({
  teamId: props.teamId,
  parentId: props.parentId,
  title: '',
  description: '',
  extension: Extension.Sdoc,
  collaborationEnabled: true,
  maxUsers: 10,
  autoSaveInterval: 5000,
  initialContent: ''
});
const rules: FormRules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  maxUsers: [{ type: 'number', min: 2, max: 50, message: '2-50', trigger: 'blur' }],
  autoSaveInterval: [{ type: 'number', min: 1000, max: 60000, message: '1-60秒', trigger: 'blur' }]
};

function handleClose() {
  dialogVisible.value = false;
}
function handleSubmit() {
  formRef.value?.validate(valid => {
    if (valid) {
      loading.value = true;
      form.parentId = props.parentId;
      form.teamId = props.teamId;
      emit('confirm', { ...form });
      loading.value = false;
      handleClose();
    }
  });
}
</script>
