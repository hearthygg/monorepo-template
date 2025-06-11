<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';
import { createTeamApi } from '@/services';
import type { CreateTeamDto } from '@/services/types';

interface Props {
  modelValue: boolean;
  title?: string;
  width?: string | number;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'success', data: any): void;
  (e: 'error', error: any): void;
}

withDefaults(defineProps<Props>(), {
  title: '创建团队空间',
  width: '500px'
});

const emit = defineEmits<Emits>();

// 表单数据
const form = reactive<CreateTeamDto>({
  name: '',
  description: '',
  avatar: ''
});

// 表单校验规则
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入团队名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入团队描述', trigger: 'blur' },
    { max: 200, message: '描述不能超过200个字符', trigger: 'blur' }
  ]
});

// 表单引用
const formRef = ref<FormInstance>();
// 加载状态
const loading = ref(false);

// 关闭弹窗
const handleClose = () => {
  emit('update:modelValue', false);
  // 重置表单
  formRef.value?.resetFields();
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    // 表单验证
    await formRef.value.validate();

    // 设置加载状态
    loading.value = true;

    // 调用创建团队接口
    const { data } = await createTeamApi(form);

    // 触发成功事件
    emit('success', data);

    // 关闭弹窗
    handleClose();

    // 显示成功提示
    ElMessage.success('创建成功');
  } catch (error) {
    // 触发错误事件
    emit('error', error);

    // 显示错误提示
    ElMessage.error('创建失败，请重试');
  } finally {
    // 清除加载状态
    loading.value = false;
  }
};
</script>

<template>
  <el-dialog :model-value="modelValue" :title="title" :width="width" :close-on-click-modal="false" @update:model-value="val => emit('update:modelValue', val)" @close="handleClose">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent>
      <el-form-item label="团队名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入团队名称" :maxlength="20" show-word-limit />
      </el-form-item>

      <el-form-item label="团队描述" prop="description">
        <el-input v-model="form.description" type="textarea" :rows="4" placeholder="请输入团队描述" :maxlength="200" show-word-limit />
      </el-form-item>

      <!-- <el-form-item label="团队头像" prop="avatar">
        <el-upload
          class="avatar-uploader"
          action="/api/upload"
          :show-file-list="false"
          :on-success="(res) => form.avatar = res.url"
          :before-upload="(file) => {
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
              ElMessage.error('只能上传图片文件！');
            }
            return isImage;
          }"
        >
          <img v-if="form.avatar" :src="form.avatar" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item> -->
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" :loading="loading" @click="handleSubmit"> 创建 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.avatar-uploader {
  :deep(.el-upload) {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);

    &:hover {
      border-color: var(--el-color-primary);
    }
  }
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
  object-fit: cover;
}
</style>
