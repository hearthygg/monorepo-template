<script setup lang="ts">
import { ref } from 'vue';
import { Icon } from '@iconify/vue';

const isCollapsed = ref(false);

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};

const menuItems = [
  {
    path: '/dashboard',
    icon: 'mdi:home-outline',
    text: '首页'
  },
  {
    path: '/my-groups',
    icon: 'mdi:account-group-outline',
    text: '我的团队'
  },
  {
    path: '/all-files',
    icon: 'mdi:folder-outline',
    text: '所有文件'
  },
  {
    path: '/favorites',
    icon: 'mdi:star-outline',
    text: '收藏'
  },
  {
    path: '/recycle',
    icon: 'mdi:delete-outline',
    text: '回收站'
  }
];
</script>

<template>
  <aside class="h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300" :class="isCollapsed ? 'w-16' : 'w-60'">
    <div class="flex items-center h-14 border-b border-gray-200" :class="isCollapsed ? 'px-4' : 'px-6'">
      <img src="@/assets/images/logo.png" alt="ShareFile" class="w-7 h-7" :class="{ 'mr-2': !isCollapsed }" />
      <span v-show="!isCollapsed" class="font-bold text-lg transition-opacity duration-300"> ShareFile </span>
    </div>
    <nav class="flex-1 py-4">
      <ul class="space-y-2 px-2">
        <li v-for="item in menuItems" :key="item.path">
          <router-link :to="item.path" class="py-2 flex items-center rounded-lg hover:bg-blue-50 transition" :class="isCollapsed ? 'px-4 justify-center' : 'px-6'">
            <div class="w-5 h-5 flex items-center justify-center flex-shrink-0">
              <Icon :icon="item.icon" class="w-5 h-5" />
            </div>
            <span class="ml-3 transition-all duration-300 whitespace-nowrap overflow-hidden" :class="isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'">{{ item.text }}</span>
          </router-link>
        </li>
      </ul>
    </nav>
    <div class="py-2 px-4" :class="isCollapsed ? 'text-center' : 'text-right'">
      <el-button type="text" @click="toggleCollapse">
        <Icon icon="fluent-emoji:right-arrow" class="w-5 h-5 transform transition-transform duration-300" :class="{ 'rotate-180': !isCollapsed }" />
      </el-button>
    </div>
  </aside>
</template>

<style scoped>
.router-link-active {
  background-color: var(--color-blue-50);
  color: var(--color-blue-600);
}
</style>
