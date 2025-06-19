<template>
  <el-dialog v-model="visible" width="1050px" :close-on-click-modal="false" @closed="handleClose">
    <template #title>
      <div class="flex items-center gap-2">
        <component :is="getFileIcon()" class="h-6 w-6" />
        <span>{{ file.name }} - 权限设置</span>
      </div>
    </template>
    <div class="space-y-4">
      <!-- 权限列表 -->
      <div v-for="item in permissionList" :key="item.userId" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div class="flex items-center space-x-3">
          <el-avatar :size="32" :src="item.avatar || ''" />
          <div>
            <div class="font-medium">{{ item.nickname }}</div>
            <div class="text-xs text-gray-500">
              <span v-if="item.isOwner" class="text-yellow-500">所有者</span>
              <span v-else>
                {{ item.permissionSource === 'inherited' ? `继承自上级` : item.permissionSource === 'team' ? '团队默认' : '直接设置' }}
              </span>
            </div>
          </div>
        </div>

        <!-- 非所有者才显示权限选择器 -->
        <div v-if="!item.isOwner">
          <PermissionSelector v-model="permissions[item.userId]" size="sm" layout="horizontal" />
        </div>
      </div>

      <!-- 传播选项 -->
      <el-checkbox v-model="shouldPropagate" class="mt-4"> 应用到所有子文件夹 </el-checkbox>
    </div>

    <template #footer>
      <div class="flex justify-end space-x-2">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" :loading="loading" @click="handleConfirm"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import PermissionSelector from '@/components/business/PermissionSelector.vue';
import { getFilePermissionListApi, updateFilePermissionApi } from '@/services/api/file';
import { File, Folder, FileText, FileSpreadsheet, FileCode, ImageIcon } from 'lucide-vue-next';
import type { FilePermissionListItemDto, FileTreeDto, UpdatePermissionsDto } from '@/services/api/file/types';

const props = defineProps<{
  modelValue: boolean;
  file: FileTreeDto;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  success: [];
}>();

const visible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => {
    emit('update:modelValue', value);
  }
});
watch(visible, (value: boolean) => {
  console.log('updatePermissionModal', value);
  if (value) loadPermissions();
});
const loading = ref(false);
const permissionList = ref<FilePermissionListItemDto[]>([]);
const permissions = ref<Record<number, number>>({});
const shouldPropagate = ref(false);

// 加载权限列表
const loadPermissions = async () => {
  try {
    const { data } = await getFilePermissionListApi(props.file.id);
    permissionList.value = data;
    // 初始化权限数据
    permissions.value = data.reduce(
      (acc, item) => {
        acc[item.userId] = item.permission;
        return acc;
      },
      {} as Record<number, number>
    );
  } catch (error) {
    ElMessage.error('获取权限列表失败');
  }
};

// 确认更新
const handleConfirm = async () => {
  try {
    loading.value = true;
    const updateData: UpdatePermissionsDto = {
      permissions: Object.entries(permissions.value).map(([userId, permission]) => ({
        userId: Number(userId),
        permission
      })),
      shouldPropagate: shouldPropagate.value
    };

    await updateFilePermissionApi(props.file.id, updateData);
    ElMessage.success('更新权限成功');
    emit('success');
    visible.value = false;
  } catch (error) {
    ElMessage.error('更新权限失败');
  } finally {
    loading.value = false;
  }
};
const getFileIcon = (): typeof File => {
  if (props.file.isFolder) {
    return Folder;
  }
  switch (props.file.ext) {
    case 'doc':
      return FileText;
    case 'image':
      return ImageIcon;
    case 'spreadsheet':
      return FileSpreadsheet;
    case 'code':
      return FileCode;
    default:
      return File;
  }
};

// 关闭弹窗时重置数据
const handleClose = () => {
  permissions.value = {};
  shouldPropagate.value = false;
};
</script>
