<template>
  <div class="my-custom-menu w-full">
    <!-- logo -->
    <div class="flex items-center justify-between h-[50px] border-b border-gray-200">
      <div class="flex items-center">
        <Boxes class="w-7 h-7 text-blue-400 mr-2"></Boxes>
        <span class="text-xl font-bold text-gray-900">My Admin</span>
      </div>
      <div class="p-1.5 rounded-sm hover:bg-gray-200" @click="menuRefData.isCollapse = !menuRefData.isCollapse">
        <AlignJustify class="w-5 h-5 text-gray-700 cursor-pointer"></AlignJustify>
      </div>
    </div>
    <el-menu default-active="1-1" :mode="menuRefData.mode" class="el-menu-vertical-demo" :collapse="menuRefData.isCollapse">
      <el-sub-menu index="1">
        <template #title>
          <School class="w-4 h-4 mr-2"></School>
          <span>课程管理</span>
        </template>
        <el-menu-item index="1-1">
          <template #title>
            <BookOpenCheck class="w-4 h-4 mr-2"></BookOpenCheck>
            <span>开课管理</span>
          </template>
        </el-menu-item>
        <el-menu-item index="1-2">
          <template #title>
            <BellRing class="w-4 h-4 mr-2"></BellRing>
            <span>实验公告</span>
          </template>
        </el-menu-item>
        <el-menu-item index="1-3">
          <template #title>
            <BookCheck class="w-4 h-4 mr-2"></BookCheck>
            <span>实验报告</span>
          </template>
        </el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="2">
        <template #title>
          <NotebookTabs class="w-4 h-4 mr-2"></NotebookTabs>
          <span>教学计划</span>
        </template>
        <el-menu-item index="2-1">
          <template #title>
            <BookOpenText class="w-4 h-4 mr-2"></BookOpenText>
            <span>课程信息</span>
          </template>
        </el-menu-item>
        <el-menu-item index="2-2">
          <template #title>
            <Beaker class="w-4 h-4 mr-2"></Beaker>
            <span>实验项目</span>
          </template>
        </el-menu-item>
        <el-menu-item index="2-3">
          <template #title>
            <BookText class="w-4 h-4 mr-2"></BookText>
            <span>报告模板</span>
          </template>
        </el-menu-item>
      </el-sub-menu>

      <!-- <el-menu-item index="3">
        <template #title>
          <MessageCircleMore class="w-4 h-4 mr-2"></MessageCircleMore>
          <span>交流中心</span>
        </template>
      </el-menu-item>
      <el-menu-item index="4">
        <template #title>
          <ServerCog class="w-4 h-4 mr-2"></ServerCog>
          <span>设备管理</span>
        </template>
      </el-menu-item> -->
    </el-menu>
  </div>
</template>
<script setup>
import { reactive } from 'vue';
import { Boxes, AlignJustify, School, BookOpenCheck, BookText, BookCheck, BellRing, NotebookTabs, BookOpenText, Beaker } from 'lucide-vue-next';
// menu相关响应数据
const menuRefData = reactive({
  isCollapse: false,
  // 菜单模式 vertical | horizontal  垂直 | 水平
  mode: 'vertical',
  menuList: [
    {
      name: '首页',
      icon: 'HomeFilled',
      path: '/'
    },
    {
      name: '表格',
      icon: 'DataAnalysis',
      path: '/table'
    },
    {
      name: '图表',
      icon: 'DataAnalysis',
      path: '/chart'
    }
  ]
});
</script>
