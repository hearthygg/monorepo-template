<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-bold mb-8 text-gray-900">排版系统</h1>

    <!-- 字体家族 -->
    <section class="mb-12">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">字体家族</h2>
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2 text-gray-700">主要字体</h3>
          <p class="font-sans text-xl">Inter - 用于所有界面文本</p>
          <p class="text-gray-500 mt-2 text-sm">无衬线字体，清晰易读，适合各种屏幕尺寸</p>
        </div>
        <div>
          <h3 class="text-lg font-medium mb-2 text-gray-700">备用字体</h3>
          <p class="font-sans text-xl">系统字体堆栈</p>
          <code class="text-sm block mt-2 bg-gray-100 p-3 rounded"> font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"; </code>
        </div>
      </div>
    </section>

    <!-- 字体大小 -->
    <section class="mb-12">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">字体大小</h2>
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <div class="space-y-6">
          <div>
            <h1 class="text-4xl font-bold">标题 1 (2.5rem / 40px)</h1>
            <p class="text-gray-500 mt-1">用于页面主标题</p>
          </div>
          <div>
            <h2 class="text-3xl font-bold">标题 2 (1.875rem / 30px)</h2>
            <p class="text-gray-500 mt-1">用于主要区域标题</p>
          </div>
          <div>
            <h3 class="text-2xl font-bold">标题 3 (1.5rem / 24px)</h3>
            <p class="text-gray-500 mt-1">用于区域子标题</p>
          </div>
          <div>
            <h4 class="text-xl font-semibold">标题 4 (1.25rem / 20px)</h4>
            <p class="text-gray-500 mt-1">用于卡片或小节标题</p>
          </div>
          <div>
            <h5 class="text-lg font-semibold">标题 5 (1.125rem / 18px)</h5>
            <p class="text-gray-500 mt-1">用于小组件标题</p>
          </div>
          <div>
            <p class="text-base">正文 (1rem / 16px)</p>
            <p class="text-gray-500 mt-1">用于主要内容文本</p>
          </div>
          <div>
            <p class="text-sm">小文本 (0.875rem / 14px)</p>
            <p class="text-gray-500 mt-1">用于辅助文本、标签</p>
          </div>
          <div>
            <p class="text-xs">超小文本 (0.75rem / 12px)</p>
            <p class="text-gray-500 mt-1">用于注释、版权信息</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 字体粗细 -->
    <section class="mb-12">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">字体粗细</h2>
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p class="font-normal text-xl">常规 (400)</p>
            <p class="text-gray-500 mt-1">用于大多数正文内容</p>
          </div>
          <div>
            <p class="font-medium text-xl">中等 (500)</p>
            <p class="text-gray-500 mt-1">用于强调和小标题</p>
          </div>
          <div>
            <p class="font-semibold text-xl">半粗体 (600)</p>
            <p class="text-gray-500 mt-1">用于次级标题</p>
          </div>
          <div>
            <p class="font-bold text-xl">粗体 (700)</p>
            <p class="text-gray-500 mt-1">用于主要标题</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 行高 -->
    <section class="mb-12">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">行高</h2>
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <div class="space-y-8">
          <div>
            <p class="leading-none text-lg mb-1">无行高 (1)</p>
            <p class="leading-none bg-gray-100 p-3 rounded">这是无行高的文本示例。这是无行高的文本示例。这是无行高的文本示例。这是无行高的文本示例。这是无行高的文本示例。</p>
          </div>
          <div>
            <p class="leading-tight text-lg mb-1">紧凑行高 (1.25)</p>
            <p class="leading-tight bg-gray-100 p-3 rounded">这是紧凑行高的文本示例。这是紧凑行高的文本示例。这是紧凑行高的文本示例。这是紧凑行高的文本示例。这是紧凑行高的文本示例。</p>
          </div>
          <div>
            <p class="leading-normal text-lg mb-1">标准行高 (1.5) - 推荐用于正文</p>
            <p class="leading-normal bg-gray-100 p-3 rounded">这是标准行高的文本示例。这是标准行高的文本示例。这是标准行高的文本示例。这是标准行高的文本示例。这是标准行高的文本示例。</p>
          </div>
          <div>
            <p class="leading-relaxed text-lg mb-1">宽松行高 (1.75)</p>
            <p class="leading-relaxed bg-gray-100 p-3 rounded">这是宽松行高的文本示例。这是宽松行高的文本示例。这是宽松行高的文本示例。这是宽松行高的文本示例。这是宽松行高的文本示例。</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 排版最佳实践 -->
    <section class="mb-12">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">排版最佳实践</h2>
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <ul class="space-y-3 text-gray-700">
          <li><strong>可读性优先</strong>：确保文本在各种设备上都易于阅读</li>
          <li><strong>层次结构</strong>：使用不同的字体大小和粗细创建清晰的视觉层次</li>
          <li><strong>一致性</strong>：在整个应用中保持一致的字体样式</li>
          <li><strong>行长度</strong>：理想的行长度为 50-75 个字符，提高可读性</li>
          <li><strong>对比度</strong>：确保文本与背景之间有足够的对比度（至少 4.5:1）</li>
          <li><strong>响应式调整</strong>：在小屏幕上适当减小字体大小，但保持可读性</li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup>
// 无需额外脚本
</script>

<style>
/* 样式已在全局 CSS 中定义 */
</style>
