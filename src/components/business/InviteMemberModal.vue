<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';
import type { SendJoinTeamInvitationDto } from '@/services/types';
import { InviteType, Source } from '@/services/types';
import { sendJoinTeamInvitationApi } from '@/services';
import PermissionSelector from './PermissionSelector.vue';
import { CopyDocument } from '@element-plus/icons-vue';
import { FilePermissionLevel } from '@/constants/enum';
interface Props {
  modelValue: boolean;
  title?: string;
  width?: string | number;
  teamId: number;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'success', data: any): void;
  (e: 'error', error: any): void;
}

const props = withDefaults(defineProps<Props>(), {
  title: '邀请成员',
  width: '500px'
});
const emit = defineEmits<Emits>();

const inviteTypeOptions = [
  { label: '邮箱邀请', value: InviteType.Email },
  { label: '链接邀请', value: InviteType.Link },
  { label: '站内邀请', value: InviteType.Userid }
];
const sourceOptions = [
  { label: '站内', value: Source.Internal },
  { label: '外部', value: Source.External }
];

const form = reactive<SendJoinTeamInvitationDto>({
  email: undefined,
  expiresInHours: 24,
  maxReminders: 3,
  reminderInterval: 24,
  sendReminder: true,
  source: Source.Internal,
  type: InviteType.Link,
  userId: undefined,
  permission: FilePermissionLevel.VIEW
});

const rules = reactive<FormRules>({
  email: [
    {
      validator: (_: any, value: string, callback: any) => {
        if (form.type === InviteType.Email && !value) {
          callback(new Error('请输入成员邮箱'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    },
    {
      type: 'email',
      message: '邮箱格式不正确',
      trigger: 'blur'
    }
  ],
  userId: [
    {
      validator: (_: any, value: any, callback: any) => {
        if (form.type === InviteType.Userid && !value) {
          callback(new Error('请选择用户'));
        } else {
          callback();
        }
      },
      trigger: 'change'
    }
  ],
  expiresInHours: [
    { required: true, message: '请输入有效期', trigger: 'blur' },
    { type: 'number', min: 1, max: 168, message: '1-168小时', trigger: 'blur' }
  ],
  maxReminders: [
    { required: true, message: '请输入最大提醒次数', trigger: 'blur' },
    { type: 'number', min: 0, max: 10, message: '0-10次', trigger: 'blur' }
  ],
  reminderInterval: [
    { required: true, message: '请输入提醒间隔', trigger: 'blur' },
    { type: 'number', min: 1, max: 168, message: '1-168小时', trigger: 'blur' }
  ]
});

const formRef = ref<FormInstance>();
const loading = ref(false);
const inviteLink = ref('');

watch(
  () => form.type,
  val => {
    if (val === InviteType.Email) {
      form.userId = undefined;
    } else if (val === InviteType.Link) {
      form.email = undefined;
      form.userId = undefined;
    } else {
      form.email = undefined;
    }
  }
);

const handleClose = () => {
  emit('update:modelValue', false);
  formRef.value?.resetFields();
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  try {
    await formRef.value.validate();
    loading.value = true;
    const { data } = await sendJoinTeamInvitationApi(props.teamId, form);
    emit('success', data);
    if (form.type === InviteType.Link && data?.inviteLink) {
      const inviteCode = data.inviteCode; // 假设后端返回字段名为 inviteCode
      const inviteUrl = `${window.location.origin}/#/invite/operate?code=${inviteCode}`;
      inviteLink.value = inviteUrl;
      ElMessage.success('邀请链接已生成，请复制并发送给成员');
    } else {
      handleClose();
      ElMessage.success('邀请发送成功');
    }
  } catch (error) {
    emit('error', error);
  } finally {
    loading.value = false;
  }
};

const handleCopy = async () => {
  if (!inviteLink.value) return;
  try {
    await navigator.clipboard.writeText(inviteLink.value);
    ElMessage.success('复制成功');
  } catch {
    ElMessage.error('复制失败，请手动复制');
  }
};
</script>

<template>
  <el-dialog :model-value="modelValue" :title="title" :width="width" :close-on-click-modal="false" @update:model-value="val => emit('update:modelValue', val)" @close="handleClose">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" style="padding-right: 8px" @submit.prevent>
      <el-divider content-position="left">基础信息</el-divider>
      <el-form-item label="邀请类型" prop="type">
        <el-select v-model="form.type" placeholder="请选择邀请类型">
          <el-option v-for="item in inviteTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.type === InviteType.Email" label="成员邮箱" prop="email">
        <el-input v-model="form.email" placeholder="请输入成员邮箱" />
      </el-form-item>
      <el-form-item v-if="form.type === InviteType.Userid" label="用户ID" prop="userId">
        <el-input v-model="form.userId" placeholder="请输入用户ID" />
        <!-- 实际项目可用下拉/搜索用户组件替换 -->
      </el-form-item>
      <el-form-item label="邀请权限" prop="permission">
        <PermissionSelector v-model="form.permission" mode="cascade" size="md" layout="grid" :show-description="true" :disabled="false" />
      </el-form-item>
      <el-form-item label="邀请来源" prop="source">
        <el-select v-model="form.source" placeholder="请选择邀请来源">
          <el-option v-for="item in sourceOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-divider content-position="left">提醒设置</el-divider>
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="有效期(小时)" prop="expiresInHours">
            <el-input-number v-model="form.expiresInHours" :min="1" :max="168" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="最大提醒次数" prop="maxReminders">
            <el-input-number v-model="form.maxReminders" :min="0" :max="10" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="提醒间隔(小时)" prop="reminderInterval">
            <el-input-number v-model="form.reminderInterval" :min="1" :max="168" style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="是否发送提醒" prop="sendReminder">
        <el-switch v-model="form.sendReminder" />
      </el-form-item>
      <el-form-item v-if="form.type === InviteType.Link && inviteLink" label="邀请链接">
        <el-input v-model="inviteLink" readonly>
          <template #append>
            <el-button type="primary" @click="handleCopy">
              <el-icon :size="18" color="#409efc"><CopyDocument /></el-icon>
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" :loading="loading" @click="handleSubmit">确定</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<style scoped>
.dialog-footer {
  text-align: right;
  margin-top: 16px;
}
.permission-group {
  width: 100%;
}
.permission-option {
  width: 100%;
  margin-bottom: 8px;
  height: auto;
  padding: 12px;
  border-radius: 4px;
}
.permission-option :deep(.el-radio-button__inner) {
  width: 100%;
  height: auto;
  padding: 0;
  border: none;
  background: transparent;
}
.permission-option :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background: var(--el-color-primary-light-9);
  border-color: var(--el-color-primary);
  box-shadow: none;
}
.permission-option :deep(.el-radio-button__inner:hover) {
  background: var(--el-color-primary-light-9);
}
</style>
