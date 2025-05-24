<template>
  <div class="w-full bg-white">
    <div
      :class="['cursor-pointer transition-all duration-200 border rounded-lg p-6', isActive ? 'ring-2 ring-blue-500 shadow-md border-blue-200' : 'hover:shadow-md border-gray-200', isHovered ? 'border-blue-200' : '']"
      @click="$emit('click')"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <div class="flex items-start justify-between">
        <div class="flex items-start space-x-4 flex-1">
          <!-- 团队头像 -->
          <div class="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
            <img v-if="avatarUrl" :src="avatarUrl" :alt="name" class="h-12 w-12 rounded-lg object-cover" />
            <span v-else class="text-lg font-semibold text-blue-600">
              {{ name.substring(0, 2).toUpperCase() }}
            </span>
          </div>

          <!-- 团队信息 -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <h3 class="text-lg font-semibold text-gray-900 truncate">{{ name }}</h3>
              <span :class="['inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold', getRoleBadgeClass()]">
                <component :is="getRoleIcon()" class="h-3 w-3" />
                {{ getRoleText() }}
              </span>
            </div>

            <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ description }}</p>

            <!-- 统计信息 -->
            <div class="flex items-center gap-4 text-sm text-gray-500">
              <div class="flex items-center gap-1">
                <UsersIcon class="h-4 w-4" />
                <span>{{ memberCount }} 成员</span>
              </div>
              <div class="flex items-center gap-1">
                <FolderIcon class="h-4 w-4" />
                <span>{{ fileCount }} 文件</span>
              </div>
              <div class="flex items-center gap-1">
                <CalendarIcon class="h-4 w-4" />
                <span>创建于 {{ formatDate(createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 操作菜单 -->
        <div class="relative">
          <button class="p-2 hover:bg-gray-100 rounded-md transition-colors opacity-0 group-hover:opacity-100" @click.stop="showDropdown = !showDropdown">
            <MoreVerticalIcon class="h-4 w-4" />
          </button>

          <div v-if="showDropdown" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10" @click.stop>
            <div class="py-1">
              <button class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" @click="handleAction('settings')">
                <SettingsIcon class="mr-2 h-4 w-4" />
                团队设置
              </button>
              <button v-if="role === 'owner' || role === 'admin'" class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" @click="handleAction('invite')">
                <UserPlusIcon class="mr-2 h-4 w-4" />
                邀请成员
              </button>
              <button v-if="role !== 'owner'" class="flex items-center w-full px-4 py-2 text-sm text-orange-600 hover:bg-gray-100" @click="handleAction('leave')">
                <LogOutIcon class="mr-2 h-4 w-4" />
                退出团队
              </button>
              <button v-if="role === 'owner'" class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100" @click="handleAction('delete')">
                <Trash2Icon class="mr-2 h-4 w-4" />
                删除团队
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  Users as UsersIcon,
  Folder as FolderIcon,
  Calendar as CalendarIcon,
  MoreVertical as MoreVerticalIcon,
  Settings as SettingsIcon,
  UserPlus as UserPlusIcon,
  LogOut as LogOutIcon,
  Trash2 as Trash2Icon,
  Crown as CrownIcon,
  Shield as ShieldIcon,
  User as UserIcon
} from 'lucide-vue-next';

interface Props {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  fileCount: number;
  createdAt: Date;
  role: 'owner' | 'admin' | 'member';
  avatarUrl?: string;
  isActive?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  avatarUrl: '',
  isActive: false
});

const emit = defineEmits<{
  click: [];
}>();

const isHovered = ref(false);
const showDropdown = ref(false);

const getRoleIcon = () => {
  switch (props.role) {
    case 'owner':
      return CrownIcon;
    case 'admin':
      return ShieldIcon;
    default:
      return UserIcon;
  }
};

const getRoleText = () => {
  switch (props.role) {
    case 'owner':
      return '组长';
    case 'admin':
      return '管理员';
    default:
      return '成员';
  }
};

const getRoleBadgeClass = () => {
  switch (props.role) {
    case 'owner':
      return 'bg-blue-100 text-blue-800 border border-blue-200';
    case 'admin':
      return 'bg-gray-100 text-gray-800 border border-gray-200';
    default:
      return 'bg-gray-50 text-gray-600 border border-gray-200';
  }
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const handleAction = (action: string) => {
  showDropdown.value = false;
  console.log(`Action: ${action} for team ${props.id}`);
};

// 点击外部关闭下拉菜单
document.addEventListener('click', () => {
  showDropdown.value = false;
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
