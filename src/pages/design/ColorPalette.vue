<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-bold mb-8 text-gray-900">颜色系统</h1>

    <!-- 主色 -->
    <section class="mb-12">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">主色</h2>
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div class="rounded-lg overflow-hidden shadow-sm">
          <div class="h-24 bg-primary-50 flex items-end p-3">
            <span class="text-primary-900 text-sm font-medium">主色-50</span>
          </div>
          <div class="p-3 bg-white">
            <code class="text-xs">#F0F9FF</code>
          </div>
        </div>
        <div class="rounded-lg overflow-hidden shadow-sm">
          <div class="h-24 bg-primary-100 flex items-end p-3">
            <span class="text-primary-900 text-sm font-medium">主色-100</span>
          </div>
          <div class="p-3 bg-white">
            <code class="text-xs">#E0F2FE</code>
          </div>
        </div>
        <div class="rounded-lg overflow-hidden shadow-sm">
          <div class="h-24 bg-primary-500 flex items-end p-3">
            <span class="text-white text-sm font-medium">主色-500</span>
          </div>
          <div class="p-3 bg-white">
            <code class="text-xs">#0EA5E9</code>
          </div>
        </div>
        <div class="rounded-lg overflow-hidden shadow-sm">
          <div class="h-24 bg-primary-600 flex items-end p-3">
            <span class="text-white text-sm font-medium">主色-600</span>
          </div>
          <div class="p-3 bg-white">
            <code class="text-xs">#0284C7</code>
          </div>
        </div>
        <div class="rounded-lg overflow-hidden shadow-sm">
          <div class="h-24 bg-primary-700 flex items-end p-3">
            <span class="text-white text-sm font-medium">主色-700</span>
          </div>
          <div class="p-3 bg-white">
            <code class="text-xs">#0369A1</code>
          </div>
        </div>
      </div>
    </section>

    <!-- 辅助色 -->
    <section class="mb-12">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">辅助色</h2>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="rounded-lg overflow-hidden shadow-sm">
          <div class="h-24 bg-success-500 flex items-end p-3">
            <span class="text-white text-sm font-medium">成功色</span>
          </div>
          <div class="p-3 bg-white">
            <code class="text-xs">#10B981</code>
          </div>
        </div>
        <div class="rounded-lg overflow-hidden shadow-sm">
          <div class="h-24 bg-warning-500 flex items-end p-3">
            <span class="text-white text-sm font-medium">警告色</span>
          </div>
          <div class="p-3 bg-white">
            <code class="text-xs">#F59E0B</code>
          </div>
        </div>
        <div class="rounded-lg overflow-hidden shadow-sm">
          <div class="h-24 bg-error-500 flex items-end p-3">
            <span class="text-white text-sm font-medium">错误色</span>
          </div>
          <div class="p-3 bg-white">
            <code class="text-xs">#EF4444</code>
          </div>
        </div>
        <div class="rounded-lg overflow-hidden shadow-sm">
          <div class="h-24 bg-info-500 flex items-end p-3">
            <span class="text-white text-sm font-medium">信息色</span>
          </div>
          <div class="p-3 bg-white">
            <code class="text-xs">#6366F1</code>
          </div>
        </div>
      </div>
    </section>

    <!-- 中性色 -->
    <section class="mb-12">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">中性色</h2>
      <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div class="rounded-lg overflow-hidden shadow-sm">
          <div class="h-24 bg-gray-50 flex items-end p-3">
            <span class="text-gray-900 text-sm font-medium">灰色-50</span>
          </div>
          <div class="p-3 bg-white">
            <code class="text-xs">#F9FAFB</code>
          </div>
        </div>
        <div class="rounded-lg overflow-hidden shadow-sm">
          <div class="h-24 bg-gray-100 flex items-end p-3">
            <span class="text-gray-900 text-sm font-medium">灰色-100</span>
          </div>
          <div class="p-3 bg-white">
            <code class="text-xs">#F3F4F6</code>
          </div>
        </div>
        <div class="rounded-lg overflow-hidden shadow-sm">
          <div class="h-24 bg-gray-200 flex items-end p-3">
            <span class="text-gray-900 text-sm font-medium">灰色-200</span>
          </div>
          <div class="p-3 bg-white">
            <code class="text-xs">#E5E7EB</code>
          </div>
        </div>
        <div class="rounded-lg overflow-hidden shadow-sm">
          <div class="h-24 bg-gray-400 flex items-end p-3">
            <span class="text-white text-sm font-medium">灰色-400</span>
          </div>
          <div class="p-3 bg-white">
            <code class="text-xs">#9CA3AF</code>
          </div>
        </div>
        <div class="rounded-lg overflow-hidden shadow-sm">
          <div class="h-24 bg-gray-700 flex items-end p-3">
            <span class="text-white text-sm font-medium">灰色-700</span>
          </div>
          <div class="p-3 bg-white">
            <code class="text-xs">#374151</code>
          </div>
        </div>
        <div class="rounded-lg overflow-hidden shadow-sm">
          <div class="h-24 bg-gray-900 flex items-end p-3">
            <span class="text-white text-sm font-medium">灰色-900</span>
          </div>
          <div class="p-3 bg-white">
            <code class="text-xs">#111827</code>
          </div>
        </div>
      </div>
    </section>

    <!-- 颜色使用规范 -->
    <section class="mb-12">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">颜色使用规范</h2>
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <ul class="space-y-3 text-gray-700">
          <li><strong>主色</strong>：用于主要按钮、链接、强调元素和品牌标识</li>
          <li><strong>辅助色</strong>：用于表示不同状态和反馈（成功、警告、错误、信息）</li>
          <li><strong>中性色</strong>：用于文本、背景、边框和分隔线</li>
          <li><strong>对比度</strong>：确保文本与背景之间的对比度至少为 4.5:1，以符合 WCAG AA 标准</li>
          <li><strong>色彩搭配</strong>：避免使用过多颜色，一般一个页面不超过 3-4 种主要颜色</li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup>
// 无需额外脚本
</script>
