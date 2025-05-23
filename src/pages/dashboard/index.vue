<script setup lang="ts">
const user = { name: '张三' };
const teams = [
  { id: 1, name: '产品设计团队', tag: '产品', desc: '负责产品UI/UX设计和用户研究', members: 8, files: 36 },
  { id: 2, name: '前端开发组', tag: '前端', desc: '负责Web前端和移动端应用开发', members: 5, files: 24 },
  { id: 3, name: '市场营销部', tag: '市场', desc: '负责产品推广、市场分析和用户增长', members: 6, files: 18 }
];
const recentFiles = [
  { id: 1, name: '产品需求文档.docx', team: '产品设计团队', time: '2小时前' },
  { id: 2, name: '前端开发计划.xlsx', team: '前端开发组', time: '昨天' },
  { id: 3, name: '市场调研报告.pdf', team: '市场营销部', time: '3天前' }
];
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">欢迎回来，{{ user.name }}</h1>
    <div class="text-gray-500 mb-6">这是您的文件和团队空间概览</div>
    <div>
      <h2 class="text-lg font-semibold mb-3">我的团队空间</h2>
      <div class="flex gap-4 mb-8">
        <template v-for="team in teams" :key="team.id">
          <div class="bg-white rounded-xl shadow p-5 w-72 flex flex-col justify-between">
            <div class="flex items-center mb-2">
              <span class="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-sm font-medium mr-2">{{ team.tag }}</span>
              <el-dropdown>
                <el-icon class="cursor-pointer"><el-icon-more /></el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>管理团队</el-dropdown-item>
                    <el-dropdown-item>退出团队</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <div class="font-bold text-base mb-1">{{ team.name }}</div>
            <div class="text-gray-500 text-sm mb-3">{{ team.desc }}</div>
            <div class="flex justify-between text-gray-400 text-xs">
              <span><i class="el-icon-user mr-1" />{{ team.members }} 成员</span>
              <span><i class="el-icon-document mr-1" />{{ team.files }} 文件</span>
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
      <h2 class="text-lg font-semibold mb-3">最近访问的文件</h2>
      <div class="bg-white rounded-xl shadow p-5">
        <div v-for="file in recentFiles" :key="file.id" class="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
          <div class="flex items-center">
            <el-icon class="text-xl text-blue-500 mr-3"><el-icon-document /></el-icon>
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
