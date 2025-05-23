<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const handleCommand = (command: string) => {
  switch (command) {
    case 'settings':
      router.push('/settings');
      break;
    case 'logout':
      // TODO: 实现退出登录逻辑
      router.push('/auth');
      break;
  }
};
</script>

<template>
  <header class="h-14 flex items-center justify-between px-8 bg-white border-b border-gray-200">
    <div class="flex items-center">
      <div class="relative w-80 mr-4">
        <Icon icon="mdi:magnify" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <el-input placeholder="搜索文件或团队..." class="pl-10" size="large" />
      </div>
    </div>
    <div class="flex items-center space-x-4">
      <el-badge is-dot>
        <el-button class="p-2" circle>
          <Icon icon="mdi:bell-outline" class="w-5 h-5 text-gray-600" />
        </el-button>
      </el-badge>
      <el-dropdown trigger="click" @command="handleCommand">
        <div class="w-7 h-7 cursor-pointer">
          <img class="w-full h-full rounded-full" src="@/assets/images/logo.png" alt="" />
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="settings">
              <div class="flex items-center">
                <Icon icon="mdi:cog-outline" class="w-4 h-4 mr-2" />
                <span>账号设置</span>
              </div>
            </el-dropdown-item>
            <el-dropdown-item command="logout" divided>
              <div class="flex items-center text-red-500">
                <Icon icon="mdi:logout" class="w-4 h-4 mr-2" />
                <span>退出登录</span>
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>
