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

<style>
:root {
  /* 主色 - 天空蓝 */
  --color-primary-50: #f0f9ff;
  --color-primary-100: #e0f2fe;
  --color-primary-200: #bae6fd;
  --color-primary-300: #7dd3fc;
  --color-primary-400: #38bdf8;
  --color-primary-500: #0ea5e9;
  --color-primary-600: #0284c7;
  --color-primary-700: #0369a1;
  --color-primary-800: #075985;
  --color-primary-900: #0c4a6e;

  /* 成功色 - 翡翠绿 */
  --color-success-50: #ecfdf5;
  --color-success-100: #d1fae5;
  --color-success-500: #10b981;
  --color-success-600: #059669;
  --color-success-700: #047857;

  /* 警告色 - 琥珀色 */
  --color-warning-50: #fffbeb;
  --color-warning-100: #fef3c7;
  --color-warning-500: #f59e0b;
  --color-warning-600: #d97706;
  --color-warning-700: #b45309;

  /* 错误色 - 红色 */
  --color-error-50: #fef2f2;
  --color-error-100: #fee2e2;
  --color-error-500: #ef4444;
  --color-error-600: #dc2626;
  --color-error-700: #b91c1c;

  /* 信息色 - 靛蓝色 */
  --color-info-50: #eef2ff;
  --color-info-100: #e0e7ff;
  --color-info-500: #6366f1;
  --color-info-600: #4f46e5;
  --color-info-700: #4338ca;

  /* 中性色 - 灰色 */
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;
}

.bg-primary-50 {
  background-color: var(--color-primary-50);
}
.bg-primary-100 {
  background-color: var(--color-primary-100);
}
.bg-primary-500 {
  background-color: var(--color-primary-500);
}
.bg-primary-600 {
  background-color: var(--color-primary-600);
}
.bg-primary-700 {
  background-color: var(--color-primary-700);
}

.bg-success-500 {
  background-color: var(--color-success-500);
}
.bg-warning-500 {
  background-color: var(--color-warning-500);
}
.bg-error-500 {
  background-color: var(--color-error-500);
}
.bg-info-500 {
  background-color: var(--color-info-500);
}

.text-primary-900 {
  color: var(--color-primary-900);
}
</style>
