<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-bold mb-8 text-gray-900">间距系统</h1>

    <!-- 间距比例 -->
    <section class="mb-12">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">间距比例</h2>
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <div class="space-y-6">
          <div v-for="(size, index) in spacingSizes" :key="index" class="flex items-center">
            <div class="w-24 text-sm text-gray-600">{{ size.name }}</div>
            <div class="flex-1">
              <div :class="`h-6 bg-primary-500 rounded`" :style="{ width: size.value }"></div>
            </div>
            <div class="w-24 text-right text-sm text-gray-600">{{ size.value }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 内边距示例 -->
    <section class="mb-12">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">内边距示例</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="(padding, index) in paddingExamples" :key="index" class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="bg-gray-100 p-3 text-sm font-medium text-gray-700">
            {{ padding.name }}
          </div>
          <div :class="`bg-white border-2 border-dashed border-primary-200 ${padding.class}`">
            <div class="bg-primary-100 rounded p-2 text-primary-700 text-sm">内容区域</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 外边距示例 -->
    <section class="mb-12">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">外边距示例</h2>
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <div class="space-y-8">
          <div v-for="(margin, index) in marginExamples" :key="index">
            <h3 class="text-lg font-medium mb-3 text-gray-700">{{ margin.name }}</h3>
            <div class="bg-gray-100 p-4 rounded-lg">
              <div :class="`bg-primary-100 inline-block rounded p-2 text-primary-700 text-sm ${margin.class}`">第一个元素</div>
              <div class="bg-primary-100 inline-block rounded p-2 text-primary-700 text-sm">第二个元素</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 间距最佳实践 -->
    <section class="mb-12">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">间距最佳实践</h2>
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <ul class="space-y-3 text-gray-700">
          <li><strong>一致性</strong>：使用一致的间距比例，避免随意的数值</li>
          <li><strong>层次感</strong>：相关元素之间使用较小的间距，不相关元素之间使用较大的间距</li>
          <li><strong>呼吸空间</strong>：确保界面有足够的空白空间，避免过度拥挤</li>
          <li><strong>响应式调整</strong>：在小屏幕上适当减小间距，但保持可读性和可用性</li>
          <li><strong>垂直节奏</strong>：保持一致的垂直间距，创建视觉节奏</li>
          <li><strong>容器内边距</strong>：容器内边距通常应大于或等于其内部元素之间的间距</li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const spacingSizes = ref([
  { name: '间距-0', value: '0' },
  { name: '间距-1', value: '0.25rem' },
  { name: '间距-2', value: '0.5rem' },
  { name: '间距-3', value: '0.75rem' },
  { name: '间距-4', value: '1rem' },
  { name: '间距-6', value: '1.5rem' },
  { name: '间距-8', value: '2rem' },
  { name: '间距-12', value: '3rem' },
  { name: '间距-16', value: '4rem' },
  { name: '间距-20', value: '5rem' },
  { name: '间距-24', value: '6rem' }
]);

const paddingExamples = ref([
  { name: '小内边距 (p-2)', class: 'p-2' },
  { name: '中内边距 (p-4)', class: 'p-4' },
  { name: '大内边距 (p-8)', class: 'p-8' },
  { name: '水平内边距 (px-4)', class: 'px-4 py-2' },
  { name: '垂直内边距 (py-4)', class: 'py-4 px-2' },
  { name: '不同方向内边距', class: 'pt-6 pr-4 pb-2 pl-8' }
]);

const marginExamples = ref([
  { name: '右外边距 (mr-4)', class: 'mr-4' },
  { name: '下外边距 (mb-4)', class: 'mb-4 block' },
  { name: '所有方向外边距 (m-4)', class: 'm-4' }
]);
</script>

<style>
/* 样式已在全局 CSS 中定义 */
</style>
