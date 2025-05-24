<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
    <div class="absolute inset-0" @click="$emit('close')"></div>

    <div class="relative bg-white rounded-lg shadow-lg w-full max-w-md" @click.stop>
      <div class="flex justify-between items-center p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">邀请成员</h2>
        <button class="p-2 hover:bg-gray-100 rounded-md" @click="$emit('close')">
          <X class="h-4 w-4" />
        </button>
      </div>

      <div class="p-6">
        <!-- 标签切换 -->
        <div class="flex border-b border-gray-200 mb-6">
          <button :class="['py-2 px-4 text-sm font-medium border-b-2 transition-colors', activeTab === 'email' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700']" @click="activeTab = 'email'">
            邮箱邀请
          </button>
          <button
            :class="['py-2 px-4 text-sm font-medium border-b-2 transition-colors', activeTab === 'link' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700']"
            @click="
              activeTab = 'link';
              generateInviteLink();
            "
          >
            邀请链接
          </button>
        </div>

        <!-- 邮箱邀请 -->
        <div v-if="activeTab === 'email'" class="space-y-4">
          <div class="space-y-2">
            <label for="emails" class="block text-sm font-medium text-gray-700">邮箱地址</label>
            <textarea
              id="emails"
              v-model="emails"
              placeholder="输入邮箱地址，多个邮箱用逗号或换行分隔&#10;例如：user1@example.com, user2@example.com"
              rows="3"
              :class="['w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none', !validateEmails() ? 'border-red-500' : 'border-gray-300']"
            ></textarea>
            <p v-if="!validateEmails()" class="text-sm text-red-500">请输入有效的邮箱地址</p>
          </div>

          <div class="space-y-2">
            <label for="role" class="block text-sm font-medium text-gray-700">角色权限</label>
            <select id="role" v-model="role" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="member">成员 - 可查看和编辑文件</option>
              <option value="admin">管理员 - 可管理成员和设置</option>
            </select>
          </div>

          <div class="space-y-2">
            <label for="message" class="block text-sm font-medium text-gray-700">邀请消息（可选）</label>
            <textarea
              id="message"
              v-model="message"
              placeholder="添加个人消息..."
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            ></textarea>
          </div>

          <button
            :disabled="!emails.trim() || !validateEmails() || isLoading"
            class="w-full flex justify-center items-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50"
            @click="handleEmailInvite"
          >
            <Mail v-if="!isLoading" class="h-4 w-4 mr-2" />
            <Loader2 v-else class="h-4 w-4 mr-2 animate-spin" />
            {{ isLoading ? '发送邀请中...' : '发送邀请' }}
          </button>
        </div>

        <!-- 邀请链接 -->
        <div v-else class="space-y-4">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">邀请链接</label>
            <div class="flex gap-2">
              <input :value="inviteLink" readonly class="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md" />
              <button class="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors" @click="copyInviteLink">
                <Check v-if="copied" class="h-4 w-4 text-green-500" />
                <Copy v-else class="h-4 w-4" />
              </button>
            </div>
          </div>

          <div class="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div class="flex">
              <UserPlus class="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
              <p class="text-sm text-blue-700">任何拥有此链接的人都可以加入团队。链接将在7天后过期。</p>
            </div>
          </div>

          <button class="w-full py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors" @click="generateInviteLink">重新生成链接</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { X, Mail, Copy, Check, UserPlus, Loader2 } from 'lucide-vue-next';

const props = defineProps<{
  teamName: string;
}>();

const emit = defineEmits(['close', 'invite']);

const activeTab = ref('email');
const emails = ref('');
const role = ref('member');
const message = ref('');
const inviteLink = ref('');
const isLoading = ref(false);
const copied = ref(false);

const generateInviteLink = () => {
  const link = `https://sharefile.com/invite/${props.teamName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
  inviteLink.value = link;
};

const copyInviteLink = async () => {
  if (inviteLink.value) {
    await navigator.clipboard.writeText(inviteLink.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  }
};

const validateEmails = () => {
  if (!emails.value.trim()) return true;

  const emailList = emails.value
    .split(/[,\n]/)
    .map(email => email.trim())
    .filter(email => email);

  return emailList.every(email => email.includes('@'));
};

const handleEmailInvite = async () => {
  if (!emails.value.trim()) return;

  isLoading.value = true;

  const emailList = emails.value
    .split(/[,\n]/)
    .map(email => email.trim())
    .filter(email => email && email.includes('@'));

  if (emailList.length === 0) {
    isLoading.value = false;
    return;
  }

  // 模拟发送邀请
  await new Promise(resolve => setTimeout(resolve, 1000));

  emit('invite', {
    emails: emailList,
    role: role.value,
    message: message.value.trim() || undefined
  });

  isLoading.value = false;
  emails.value = '';
  message.value = '';
};
</script>
