<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
  router.push('/');
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-gray-800">404</h1>
      <p class="text-2xl text-gray-600 mt-4">抱歉，您访问的页面不存在</p>
      <button class="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" @click="goHome">返回首页</button>
    </div>
  </div>
</template>
