<template>
  <div class="h-full">
    <div class="h-full cursor-pointer hover:shadow-md transition-all duration-300 group border border-gray-200 rounded-lg bg-white" @click="$emit('click')">
      <div class="p-6">
        <div class="flex justify-between items-start mb-4">
          <div class="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
            <img v-if="avatarUrl" :src="avatarUrl" :alt="name" class="h-12 w-12 rounded-lg object-cover" />
            <span v-else class="text-lg font-semibold text-blue-600">
              {{ name.substring(0, 2).toUpperCase() }}
            </span>
          </div>

          <div class="relative">
            <button class="p-2 hover:bg-gray-100 rounded-md transition-opacity opacity-0 group-hover:opacity-100" @click.stop="showDropdown = !showDropdown">
              <MoreVerticalIcon class="h-4 w-4" />
            </button>

            <div v-if="showDropdown" class="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-10" @click.stop>
              <div class="py-2 px-1">
                <button class="w-full cursor-pointer text-left px-4 py-2 text-sm rounded text-gray-700 hover:bg-primary-300" @click="handleAction('settings')">团队设置</button>
                <button class="w-full cursor-pointer text-left px-4 py-2 text-sm rounded text-gray-700 hover:bg-primary-300" @click="handleAction('invite')">邀请成员</button>
                <button class="w-full cursor-pointer text-left px-4 py-2 text-sm rounded text-red-600 hover:bg-primary-300" @click="handleAction('delete')">删除团队</button>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <h3 class="text-lg font-semibold text-gray-900 truncate">{{ name }}</h3>
            <span :class="['inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border', getRoleBadgeClass()]">
              <component :is="getRoleIcon()" class="h-3 w-3" />
              {{ getRoleText() }}
            </span>
          </div>
          <p class="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">{{ description }}</p>
        </div>
      </div>

      <div class="p-4 pt-0 border-t border-gray-100">
        <div class="w-full space-y-2">
          <div class="flex justify-between items-center text-sm text-gray-500">
            <div class="flex items-center gap-1">
              <UsersIcon class="h-4 w-4" />
              <span>{{ memberCount }}</span>
            </div>
            <div class="flex items-center gap-1">
              <FolderIcon class="h-4 w-4" />
              <span>{{ fileCount }}</span>
            </div>
          </div>
          <div class="flex items-center gap-1 text-xs text-gray-400">
            <CalendarIcon class="h-3 w-3" />
            <span>{{ formatDate(createdAt) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Users as UsersIcon, Folder as FolderIcon, Calendar as CalendarIcon, MoreVertical as MoreVerticalIcon, Crown as CrownIcon, Shield as ShieldIcon, User as UserIcon } from 'lucide-vue-next';

interface Props {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  fileCount: number;
  createdAt: Date;
  role: 'owner' | 'admin' | 'member';
  avatarUrl?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  click: [];
}>();

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
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'admin':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-50 text-gray-600 border-gray-200';
  }
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
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
