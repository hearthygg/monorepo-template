<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { getRecentTeamsApi } from '@/services';
import { onMounted, ref } from 'vue';
import type { TeamListDto } from '@/services/types';
import { useUserStore } from '@/stores/user';

const teams = ref<TeamListDto[]>([]);
const userStore = useUserStore();
onMounted(async () => {
  const { data } = await getRecentTeamsApi();
  teams.value = data;
});
const user = { name: '张三' };
// const teams = [
//   { id: 1, name: '产品设计团队', tag: '产品', desc: '负责产品UI/UX设计和用户研究', members: 8, files: 36 },
//   { id: 2, name: '前端开发组', tag: '前端', desc: '负责Web前端和移动端应用开发', members: 5, files: 24 },
//   { id: 3, name: '市场营销部', tag: '市场', desc: '负责产品推广、市场分析和用户增长', members: 6, files: 18 }
// ];
const recentFiles = [
  { id: 1, name: '产品需求文档.docx', team: '产品设计团队', time: '2小时前' },
  { id: 2, name: '前端开发计划.xlsx', team: '前端开发组', time: '昨天' },
  { id: 3, name: '市场调研报告.pdf', team: '市场营销部', time: '3天前' },
  { id: 4, name: '产品功能设计.pptx', team: '产品设计团队', time: '5天前' },
  { id: 5, name: '用户访谈记录.docx', team: '产品设计团队', time: '7天前' },
  { id: 6, name: '市场推广方案.docx', team: '市场营销部', time: '10天前' }
];
const handleCommand = () => {};
</script>

<template>
  <div class="main-container">
    <h1 class="text-2xl font-bold mb-1">欢迎回来，{{ user.name }}</h1>
    <div class="text-gray-500 mb-6">这是您的文件和团队空间概览</div>
    <div>
      <div class="flex justify-between items-center mb-3">
        <h2 class="text-lg font-semibold">我的团队空间</h2>
        <el-button type="primary" size="large"><Icon icon="material-symbols:add-rounded" class="w-5 h-5" />创建团队空间</el-button>
      </div>
      <div class="flex gap-4 mb-8">
        <template v-for="team in teams" :key="team.id">
          <div class="bg-white rounded-xl shadow-sm cursor-pointer p-5 w-80 flex flex-col justify-between border border-gray-200 hover:shadow-md transition-shadow duration-300">
            <div class="flex items-center justify-between mb-2">
              <el-tooltip :content="team.ownerId === userStore.userInfo?.id ? '创建者' : '成员'" placement="top" effect="dark">
                <Icon :icon="team.ownerId === userStore.userInfo?.id ? 'mdi:crown' : 'mdi:user'" class="w-6 h-6" :class="[team.ownerId === userStore.userInfo?.id ? 'text-yellow-500' : 'text-blue-500']" />
              </el-tooltip>
              <el-dropdown @command="handleCommand">
                <Icon icon="mdi:dots-vertical" class="cursor-pointer w-5 h-5" />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item v-if="team.ownerId === userStore.userInfo?.id" command="settings">管理团队</el-dropdown-item>
                    <el-dropdown-item command="s">退出团队</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <div class="font-bold text-base mb-1">{{ team.name }}</div>
            <div class="text-gray-500 text-sm mb-3">{{ team.description }}</div>
            <div class="flex justify-between text-gray-400 text-xs">
              <span class="flex items-center"><Icon icon="mdi:user" class="mr-1 w-4 h-4" />{{ team.memberCount }} 成员</span>
              <!-- <span class="flex items-center"><Icon icon="mdi:document" class="mr-1 w-4 h-4" />{{ team.files }} 文件</span> -->
            </div>
          </div>
        </template>
        <div class="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center w-72 h-40 cursor-pointer hover:bg-gray-100 transition">
          <el-icon class="text-2xl mb-2"><el-icon-plus /></el-icon>
          <div class="font-medium">创建新团队空间</div>
          <div class="text-xs text-gray-400 mt-1">创建一个新的团队空间协作和共享文件</div>
        </div>
      </div>
    </div>
    <div>
      <div class="flex justify-between items-center mb-3">
        <h2 class="text-lg font-semibold">最近访问的文件</h2>
        <el-button size="large">查看更多</el-button>
      </div>
      <div class="bg-white rounded-xl shadow border border-gray-200">
        <div v-for="file in recentFiles" :key="file.id" class="flex items-center justify-between px-4 py-3 border-b border-gray-200 last:border-b-0">
          <div class="flex items-center">
            <Icon icon="mdi:file-document-outline" class="w-10 h-10 text-gray-400 mr-3" />
            <div>
              <div class="font-medium">{{ file.name }}</div>
              <div class="text-xs text-gray-400">{{ file.team }} · {{ file.time }}</div>
            </div>
          </div>
          <el-button type="text">查看</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
