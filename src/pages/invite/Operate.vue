<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/stores/user';
import AuthForm from '@/components/business/AuthForm.vue';
import { acceptInvitationApi, rejectInvitationApi, checkInvitationApi } from '@/services/api/team';
import type { InvitationValidateResultDto } from '@/services/api/team/types';
import { FilePermissionLevel } from '@/constants/enum';
import { UserFilled, Message, Check, Close, Loading } from '@element-plus/icons-vue';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const inviteCode = computed(() => (route.query.code as string) || '');
const isLoggedIn = computed(() => !!userStore.token);
const loading = ref(false);
const infoLoading = ref(true);
const result = ref<'pending' | 'accepted' | 'rejected' | 'error'>('pending');
const errorMsg = ref('');
const inviteInfo = ref<InvitationValidateResultDto | null>(null);

const permissionText = computed(() => {
  if (!inviteInfo.value?.permission) return '未知权限';

  const permissionMap = {
    [FilePermissionLevel.NONE]: '没权限',
    [FilePermissionLevel.VIEW]: '可查看',
    [FilePermissionLevel.EDIT]: '可编辑',
    [FilePermissionLevel.DELETE]: '可删除'
  };
  return permissionMap[inviteInfo.value.permission] || '未知权限';
});

// 获取邀请详情
const fetchInviteInfo = async () => {
  if (!inviteCode.value) return;
  infoLoading.value = true;
  try {
    const { data } = await checkInvitationApi(inviteCode.value);
    inviteInfo.value = data;
  } catch (e: any) {
    errorMsg.value = e?.response?.data?.message || '邀请码无效或已过期';
    result.value = 'error';
  } finally {
    infoLoading.value = false;
  }
};

onMounted(fetchInviteInfo);

// 登录/注册成功后自动处理邀请码
const handleAuthSuccess = async () => {
  // if (!inviteCode.value) return;
  // loading.value = true;
  // try {
  //   await acceptInvitationApi(inviteCode.value);
  //   result.value = 'accepted';
  //   ElMessage.success('已成功加入团队！');
  //   setTimeout(() => router.push('/'), 1500);
  // } catch (e: any) {
  //   result.value = 'error';
  //   errorMsg.value = e?.response?.data?.message || '处理邀请失败';
  // } finally {
  //   loading.value = false;
  // }
};

const handleAccept = async () => {
  if (!inviteCode.value) return;
  loading.value = true;
  try {
    await acceptInvitationApi(inviteCode.value);
    result.value = 'accepted';
    ElMessage.success('已成功加入团队！');
    setTimeout(() => router.push('/'), 1500);
  } catch (e: any) {
    result.value = 'error';
    errorMsg.value = e?.response?.data?.message || '处理邀请失败';
  } finally {
    loading.value = false;
  }
};

const handleReject = async () => {
  if (!inviteCode.value) return;
  loading.value = true;
  try {
    await rejectInvitationApi(inviteCode.value);
    result.value = 'rejected';
    ElMessage.success('已拒绝邀请');
    setTimeout(() => router.push('/'), 1500);
  } catch (e: any) {
    result.value = 'error';
    errorMsg.value = e?.response?.data?.message || '处理邀请失败';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="invite-page flex min-h-screen items-center justify-center bg-gray-50">
    <div class="absolute top-4 left-4 flex items-center">
      <img src="@/assets/images/logo.png" alt="ShareFile Logo" class="w-10 h-10 mr-3" />
      <span class="text-2xl font-bold text-blue-700">ShareFile</span>
    </div>
    <div class="invite-container flex bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl animate-fade-in">
      <!-- 左侧：团队与邀请人信息 -->
      <div class="invite-info w-[440px] bg-gray-50 border-r border-gray-200 flex flex-col gap-6 p-8">
        <div v-if="infoLoading" class="flex-1 flex flex-col items-center justify-center">
          <el-icon class="mb-2" size="32"><Loading /></el-icon>
          <div class="text-gray-400">正在加载邀请信息...</div>
        </div>
        <template v-else>
          <div v-if="result === 'error'">
            <div class="flex-1 flex flex-col items-center justify-center">
              <el-result icon="error" title="错误" :sub-title="errorMsg"> </el-result>
            </div>
          </div>
          <div v-else-if="inviteInfo">
            <div class="text-xl font-bold mb-4">{{ inviteInfo.teamName }} 邀请你加入团队</div>
            <!-- 团队卡片 -->
            <div class="team-card bg-white rounded-xl shadow p-6 flex flex-col gap-2 mb-4">
              <div class="flex items-center gap-4 mb-2">
                <img :src="inviteInfo.teamAvatar" class="w-14 h-14 rounded-full border-2 border-white shadow" alt="团队头像" />
                <div>
                  <div class="text-lg font-bold text-gray-900">{{ inviteInfo.teamName }}</div>
                  <div class="text-xs text-gray-400 mt-1">创建于 {{ inviteInfo.teamCreatedAt ? new Date(inviteInfo.teamCreatedAt).toLocaleDateString() : '' }}</div>
                </div>
              </div>
              <div class="text-gray-600 text-sm mb-2 line-clamp-2">{{ inviteInfo.teamDescription }}</div>
              <div class="flex items-center gap-3 text-xs text-gray-400">
                <el-icon size="14"><UserFilled /></el-icon>
                <span>{{ inviteInfo.memberCount }} 名成员</span>
              </div>
            </div>
            <!-- 邀请人卡片 -->
            <div class="inviter-card bg-white rounded-xl shadow p-6 flex items-center gap-4">
              <img :src="inviteInfo.inviterAvatar" class="w-12 h-12 rounded-full border border-gray-200" alt="邀请人头像" />
              <div class="flex-1">
                <div class="font-medium text-gray-800">{{ inviteInfo.inviterName }}</div>
                <div class="text-xs text-gray-500 flex items-center gap-1">
                  <el-icon size="16"><Message /></el-icon>
                  <span>{{ inviteInfo.inviterEmail }}</span>
                </div>
                <div class="text-lg text-blue-500 mt-1">邀请权限：{{ permissionText }}</div>
                <div class="text-xs text-red-500 mt-1">邀请过期时间：{{ inviteInfo.expiresAt ? new Date(inviteInfo.expiresAt).toLocaleDateString() : '' }}</div>
              </div>
            </div>
          </div>
        </template>
      </div>
      <!-- 右侧：登录/注册或操作 -->
      <div class="invite-action flex-1 flex items-center justify-center p-10">
        <div class="w-full max-w-sm">
          <template v-if="!infoLoading && result !== 'error'">
            <div v-if="result === 'pending'">
              <div v-if="!isLoggedIn">
                <div class="mb-4 text-center text-gray-500 font-medium">请登录或注册以处理团队邀请</div>
                <AuthForm @login-success="handleAuthSuccess" @register-success="handleAuthSuccess" />
              </div>
              <div v-else>
                <div class="mb-6 text-center text-gray-600 font-medium">你已登录，是否接受邀请？</div>
                <div class="flex justify-center gap-4">
                  <el-button type="primary" size="large" :loading="loading" @click="handleAccept">
                    <el-icon class="mr-1"><Check /></el-icon>接受邀请
                  </el-button>
                  <el-button size="large" :loading="loading" @click="handleReject">
                    <el-icon class="mr-1"><Close /></el-icon>拒绝邀请
                  </el-button>
                </div>
              </div>
            </div>
            <div v-else-if="result === 'accepted'">
              <el-result icon="success" title="接受邀请" sub-title="已成功加入团队，正在跳转..."> </el-result>
            </div>
            <div v-else-if="result === 'rejected'">
              <el-result icon="error" title="拒绝邀请" sub-title="你已拒绝加入团队，正在跳转..."> </el-result>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.invite-page {
  background: #f6f8fa;
}
.invite-container {
  min-height: 520px;
}
.team-card,
.inviter-card {
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.04);
}
.animate-fade-in {
  animation: fade-in 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(32px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
