<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-bold mb-8 text-gray-900">可访问性指南</h1>

    <!-- 颜色对比度 -->
    <section class="mb-12">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">颜色对比度</h2>
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <div class="space-y-6">
          <p class="text-gray-700">确保文本与其背景之间有足够的对比度，以便所有用户都能轻松阅读内容。 根据 WCAG 2.1 标准：</p>
          <ul class="list-disc list-inside space-y-2 text-gray-700">
            <li>普通文本（小于 18pt）：对比度至少为 4.5:1（AA 级）或 7:1（AAA 级）</li>
            <li>大文本（18pt 或以上）：对比度至少为 3:1（AA 级）或 4.5:1（AAA 级）</li>
          </ul>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div v-for="(example, index) in contrastExamples" :key="index" class="rounded-lg overflow-hidden">
              <div class="p-3 text-sm font-medium" :class="example.headerClass">
                {{ example.name }}
              </div>
              <div class="p-4" :class="example.bgClass">
                <p class="text-base mb-2" :class="example.textClass">这是普通大小的文本示例。</p>
                <p class="text-2xl" :class="example.textClass">这是大号文本示例。</p>
              </div>
              <div class="bg-gray-100 p-3 text-sm">
                <span :class="example.passClass">{{ example.passText }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 键盘可访问性 -->
    <section class="mb-12">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">键盘可访问性</h2>
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <div class="space-y-4">
          <p class="text-gray-700">确保所有交互元素都可以通过键盘访问和操作，这对于使用屏幕阅读器或无法使用鼠标的用户至关重要。</p>

          <div class="space-y-6 mt-4">
            <div>
              <h3 class="text-lg font-medium mb-2 text-gray-700">焦点状态</h3>
              <p class="text-gray-600 mb-3">交互元素应有明显的焦点状态，以便键盘用户知道当前选中的元素。</p>
              <div class="flex flex-wrap gap-4">
                <button class="btn btn-primary">默认状态</button>
                <button class="btn btn-primary focus">焦点状态</button>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-medium mb-2 text-gray-700">焦点顺序</h3>
              <p class="text-gray-600 mb-3">Tab 键焦点顺序应该符合页面的逻辑流程。</p>
              <div class="p-4 border border-gray-200 rounded-lg">
                <div class="flex flex-wrap gap-4">
                  <button class="btn btn-outline">第一个按钮</button>
                  <button class="btn btn-outline">第二个按钮</button>
                  <button class="btn btn-outline">第三个按钮</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 屏幕阅读器支持 -->
    <section class="mb-12">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">屏幕阅读器支持</h2>
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <div class="space-y-4">
          <p class="text-gray-700">确保内容对使用屏幕阅读器的用户友好，提供适当的替代文本和 ARIA 属性。</p>

          <div class="space-y-6 mt-4">
            <div>
              <h3 class="text-lg font-medium mb-2 text-gray-700">图像替代文本</h3>
              <div class="p-4 border border-gray-200 rounded-lg">
                <div class="flex items-center gap-4">
                  <img src="https://via.placeholder.com/100" alt="示例图片" class="rounded" />
                  <div>
                    <p class="text-gray-600">图片应包含有意义的 alt 属性：</p>
                    <code class="text-sm block mt-2 bg-gray-100 p-2 rounded"> &lt;img src="logo.png" alt="公司徽标"&gt; </code>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-medium mb-2 text-gray-700">ARIA 标签</h3>
              <div class="p-4 border border-gray-200 rounded-lg">
                <div class="flex items-center gap-4">
                  <button class="btn btn-primary" aria-label="关闭对话框">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                  <div>
                    <p class="text-gray-600">纯图标按钮应使用 aria-label：</p>
                    <code class="text-sm block mt-2 bg-gray-100 p-2 rounded"> &lt;button aria-label="关闭对话框"&gt;X&lt;/button&gt; </code>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-medium mb-2 text-gray-700">隐藏元素</h3>
              <div class="p-4 border border-gray-200 rounded-lg">
                <div class="flex items-center gap-4">
                  <div>
                    <button class="btn btn-primary">
                      提交
                      <span class="sr-only">表单</span>
                    </button>
                  </div>
                  <div>
                    <p class="text-gray-600">使用 sr-only 类为屏幕阅读器提供额外信息：</p>
                    <code class="text-sm block mt-2 bg-gray-100 p-2 rounded"> &lt;button&gt;提交&lt;span class="sr-only"&gt;表单&lt;/span&gt;&lt;/button&gt; </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 可访问性检查清单 -->
    <section class="mb-12">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">可访问性检查清单</h2>
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <ul class="space-y-3 text-gray-700">
          <li><strong>颜色对比度</strong>：确保文本与背景之间有足够的对比度</li>
          <li><strong>键盘导航</strong>：确保所有功能都可以通过键盘访问</li>
          <li><strong>替代文本</strong>：为所有非装饰性图像提供有意义的替代文本</li>
          <li><strong>表单标签</strong>：确保所有表单控件都有关联的标签</li>
          <li><strong>焦点指示器</strong>：确保焦点状态清晰可见</li>
          <li><strong>语义化标记</strong>：使用适当的 HTML 元素（如 header、nav、main、footer）来构建页面结构</li>
          <li><strong>ARIA 属性</strong>：在必要时使用 ARIA 属性来增强可访问性</li>
          <li><strong>错误提示</strong>：确保错误消息清晰且易于理解</li>
          <li><strong>响应式设计</strong>：确保界面在不同设备和屏幕尺寸上都可用</li>
          <li><strong>动画控制</strong>：提供暂停或禁用动画的选项</li>
          <li><strong>文本大小</strong>：确保文本可以放大至少 200% 而不丢失内容或功能</li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const contrastExamples = ref([
  {
    name: '良好对比度',
    headerClass: 'bg-gray-100 text-gray-800',
    bgClass: 'bg-white',
    textClass: 'text-gray-900',
    passClass: 'text-green-600 font-medium',
    passText: '✓ 通过 WCAG AA 标准'
  },
  {
    name: '不足对比度',
    headerClass: 'bg-gray-100 text-gray-800',
    bgClass: 'bg-gray-100',
    textClass: 'text-gray-400',
    passClass: 'text-red-600 font-medium',
    passText: '✗ 未通过 WCAG AA 标准'
  }
]);
</script>

<style>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.focus {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}
</style>
