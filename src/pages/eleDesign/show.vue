<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- 导航 -->
    <header class="bg-white shadow-sm sticky top-0 z-10">
      <div class="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 class="text-xl font-bold text-gray-900">明亮简约设计系统</h1>
        <nav>
          <ul class="flex space-x-6">
            <li v-for="(item, index) in navItems" :key="index">
              <a href="#" :class="['text-sm font-medium transition-colors', activeSection === item.id ? 'text-primary-600' : 'text-gray-600 hover:text-gray-900']" @click.prevent="activeSection = item.id">
                {{ item.name }}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>

    <!-- 主内容 -->
    <main class="container mx-auto px-4 py-8">
      <!-- 颜色系统 -->
      <section v-if="activeSection === 'ant-design'">
        <antDesignStyle />
      </section>

      <!-- 排版系统 -->
      <section v-if="activeSection === 'ele'">
        <showEle />
      </section>

      <!-- 导航栏 -->
      <section v-if="activeSection === 'sideBar'">
        <SideBar />
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import antDesignStyle from './antDesignStyle.vue';
import showEle from './index.vue';
import SideBar from './SideBar.vue';

const activeSection = ref('ele');

const navItems = [
  { id: 'ant-design', name: 'ant-design' },
  { id: 'ele', name: 'element-plus' },
  { id: 'sideBar', name: '导航栏展示' }
];
</script>

<style>
/* 全局样式已在其他组件中定义 */
</style>
