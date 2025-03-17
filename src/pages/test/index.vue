<template>
  <div :class="['min-h-screen transition-colors duration-300', themeClasses[currentTheme].background]">
    <!-- 顶部导航栏 -->
    <header :class="['sticky top-0 z-10 shadow-md', themeClasses[currentTheme].header]">
      <div class="container mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <palette-icon class="h-6 w-6" :class="themeClasses[currentTheme].icon" />
          <h1 class="text-xl font-bold" :class="themeClasses[currentTheme].text">主题展示</h1>
        </div>

        <div class="flex items-center space-x-4">
          <button
            v-for="(theme, name) in themes"
            :key="name"
            :class="['px-3 py-1.5 rounded-full text-sm font-medium transition-colors', currentTheme === name ? themeClasses[currentTheme].activeButton : themeClasses[currentTheme].inactiveButton]"
            @click="setTheme(name)"
          >
            {{ theme.label }}
          </button>
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="container mx-auto px-4 py-8">
      <!-- 主题信息 -->
      <div :class="['mb-8 p-6 rounded-lg', themeClasses[currentTheme].card]">
        <h2 class="text-2xl font-bold mb-2" :class="themeClasses[currentTheme].title">{{ themes[currentTheme].label }} 主题</h2>
        <p :class="themeClasses[currentTheme].text">
          {{ themes[currentTheme].description }}
        </p>
      </div>

      <!-- UI 元素展示 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <!-- 按钮展示 -->
        <div :class="['p-6 rounded-lg', themeClasses[currentTheme].card]">
          <h3 class="text-xl font-bold mb-4" :class="themeClasses[currentTheme].title">按钮</h3>
          <div class="space-y-4">
            <div class="flex flex-wrap gap-3">
              <button :class="['px-4 py-2 rounded-md font-medium', themeClasses[currentTheme].primaryButton]">主要按钮</button>
              <button :class="['px-4 py-2 rounded-md font-medium', themeClasses[currentTheme].secondaryButton]">次要按钮</button>
              <button :class="['px-4 py-2 rounded-md font-medium', themeClasses[currentTheme].outlineButton]">轮廓按钮</button>
            </div>
            <div class="flex flex-wrap gap-3">
              <button :class="['px-3 py-1 rounded-md text-sm', themeClasses[currentTheme].primaryButton]">小按钮</button>
              <button :class="['px-6 py-3 rounded-md', themeClasses[currentTheme].primaryButton]">大按钮</button>
              <button :class="['px-4 py-2 rounded-md font-medium opacity-50 cursor-not-allowed', themeClasses[currentTheme].primaryButton]">禁用按钮</button>
            </div>
          </div>
        </div>

        <!-- 表单元素 -->
        <div :class="['p-6 rounded-lg', themeClasses[currentTheme].card]">
          <h3 class="text-xl font-bold mb-4" :class="themeClasses[currentTheme].title">表单元素</h3>
          <div class="space-y-4">
            <div>
              <label class="block mb-2 text-sm font-medium" :class="themeClasses[currentTheme].label"> 输入框 </label>
              <input type="text" placeholder="请输入内容" :class="['w-full px-4 py-2 rounded-md border', themeClasses[currentTheme].input]" />
            </div>
            <div>
              <label class="block mb-2 text-sm font-medium" :class="themeClasses[currentTheme].label"> 下拉选择 </label>
              <select :class="['w-full px-4 py-2 rounded-md border', themeClasses[currentTheme].input]">
                <option>选项 1</option>
                <option>选项 2</option>
                <option>选项 3</option>
              </select>
            </div>
            <div class="flex items-center space-x-2">
              <input id="checkbox" type="checkbox" :class="['rounded', themeClasses[currentTheme].checkbox]" />
              <label for="checkbox" :class="themeClasses[currentTheme].text">复选框</label>
            </div>
          </div>
        </div>
      </div>

      <!-- 卡片展示 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div v-for="i in 3" :key="i" :class="['p-6 rounded-lg', themeClasses[currentTheme].card]">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-lg font-bold" :class="themeClasses[currentTheme].title">卡片标题 {{ i }}</h3>
            <more-horizontal-icon class="h-5 w-5" :class="themeClasses[currentTheme].icon" />
          </div>
          <p class="mb-4 text-sm" :class="themeClasses[currentTheme].text">这是一个示例卡片，展示了在 {{ themes[currentTheme].label }} 主题下的样式和布局。 不同的主题会有不同的颜色、阴影和边框效果。</p>
          <div class="flex justify-end">
            <button :class="['text-sm px-3 py-1 rounded', themeClasses[currentTheme].secondaryButton]">查看详情</button>
          </div>
        </div>
      </div>

      <!-- 数据表格 -->
      <div :class="['p-6 rounded-lg mb-8', themeClasses[currentTheme].card]">
        <h3 class="text-xl font-bold mb-4" :class="themeClasses[currentTheme].title">数据表格</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full border-collapse">
            <thead>
              <tr>
                <th v-for="header in tableHeaders" :key="header" :class="['px-4 py-3 text-left text-sm font-medium', themeClasses[currentTheme].tableHeader]">
                  {{ header }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in tableData" :key="index" :class="index % 2 === 0 ? themeClasses[currentTheme].tableRowEven : themeClasses[currentTheme].tableRowOdd">
                <td v-for="(cell, cellIndex) in row" :key="cellIndex" :class="['px-4 py-3 text-sm', themeClasses[currentTheme].tableCell]">
                  {{ cell }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 统计卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div v-for="(stat, index) in stats" :key="index" :class="['p-6 rounded-lg', themeClasses[currentTheme].card]">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium" :class="themeClasses[currentTheme].label">{{ stat.label }}</p>
              <p class="text-2xl font-bold mt-1" :class="themeClasses[currentTheme].title">{{ stat.value }}</p>
            </div>
            <div class="p-3 rounded-full" :class="themeClasses[currentTheme].iconBackground">
              <component :is="stat.icon" class="h-6 w-6" :class="themeClasses[currentTheme].iconInverse" />
            </div>
          </div>
          <div class="mt-4 flex items-center">
            <!-- <trend-up-icon v-if="stat.trend > 0" class="h-4 w-4 text-green-500 mr-1" />
            <trend-down-icon v-else class="h-4 w-4 text-red-500 mr-1" /> -->
            <span :class="stat.trend > 0 ? 'text-green-500' : 'text-red-500'"> {{ Math.abs(stat.trend) }}% </span>
            <span class="text-xs ml-1" :class="themeClasses[currentTheme].mutedText">相比上月</span>
          </div>
        </div>
      </div>
    </main>

    <!-- 页脚 -->
    <footer :class="['py-6 border-t', themeClasses[currentTheme].footer]">
      <div class="container mx-auto px-4 text-center">
        <p class="text-sm" :class="themeClasses[currentTheme].mutedText">主题展示页面 &copy; {{ new Date().getFullYear() }}</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import {
  PaletteIcon,
  MoreHorizontalIcon,
  // TrendUpIcon,
  // TrendDownIcon,
  UsersIcon,
  ShoppingCartIcon,
  ActivityIcon,
  BarChartIcon
} from 'lucide-vue-next';

// 当前主题
const currentTheme = ref('light');

// 主题定义
const themes = {
  light: {
    label: '明亮',
    description: '清新明亮的主题，适合日常使用，提供良好的可读性和舒适的视觉体验。'
  },
  dark: {
    label: '暗黑',
    description: '深色主题减少眼睛疲劳，适合夜间使用，同时提供现代感的用户界面。'
  },
  blue: {
    label: '蓝色',
    description: '专业的蓝色主题，传达信任和可靠性，适合商业和企业应用。'
  },
  green: {
    label: '绿色',
    description: '清新自然的绿色主题，给人平静和和谐的感觉，适合健康和环保相关应用。'
  }
};

// 主题样式类
const themeClasses = {
  light: {
    background: 'bg-gray-50',
    header: 'bg-white text-gray-800',
    footer: 'bg-white border-gray-200',
    card: 'bg-white shadow border border-gray-100',
    text: 'text-gray-700',
    mutedText: 'text-gray-500',
    title: 'text-gray-900',
    label: 'text-gray-700',
    icon: 'text-gray-700',
    iconInverse: 'text-white',
    iconBackground: 'bg-blue-500',
    primaryButton: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondaryButton: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    outlineButton: 'border border-gray-300 text-gray-700 hover:bg-gray-100',
    activeButton: 'bg-blue-600 text-white',
    inactiveButton: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
    input: 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900',
    checkbox: 'text-blue-600 focus:ring-blue-500 border-gray-300',
    tableHeader: 'bg-gray-100 text-gray-700 border-b border-gray-200',
    tableRowEven: 'bg-white',
    tableRowOdd: 'bg-gray-50',
    tableCell: 'text-gray-700 border-b border-gray-200'
  },
  dark: {
    background: 'bg-gray-900',
    header: 'bg-gray-800 text-gray-100',
    footer: 'bg-gray-800 border-gray-700',
    card: 'bg-gray-800 shadow border border-gray-700',
    text: 'text-gray-300',
    mutedText: 'text-gray-400',
    title: 'text-white',
    label: 'text-gray-300',
    icon: 'text-gray-300',
    iconInverse: 'text-gray-900',
    iconBackground: 'bg-blue-400',
    primaryButton: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondaryButton: 'bg-gray-700 hover:bg-gray-600 text-gray-200',
    outlineButton: 'border border-gray-600 text-gray-300 hover:bg-gray-700',
    activeButton: 'bg-blue-500 text-white',
    inactiveButton: 'bg-gray-700 text-gray-300 hover:bg-gray-600',
    input: 'border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white',
    checkbox: 'text-blue-500 focus:ring-blue-400 border-gray-600 bg-gray-700',
    tableHeader: 'bg-gray-700 text-gray-200 border-b border-gray-600',
    tableRowEven: 'bg-gray-800',
    tableRowOdd: 'bg-gray-750',
    tableCell: 'text-gray-300 border-b border-gray-700'
  },
  blue: {
    background: 'bg-blue-50',
    header: 'bg-blue-800 text-white',
    footer: 'bg-white border-blue-100',
    card: 'bg-white shadow-md border border-blue-100',
    text: 'text-gray-700',
    mutedText: 'text-blue-700',
    title: 'text-blue-900',
    label: 'text-blue-800',
    icon: 'text-blue-700',
    iconInverse: 'text-white',
    iconBackground: 'bg-blue-600',
    primaryButton: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondaryButton: 'bg-blue-100 hover:bg-blue-200 text-blue-800',
    outlineButton: 'border border-blue-300 text-blue-700 hover:bg-blue-50',
    activeButton: 'bg-blue-600 text-white',
    inactiveButton: 'bg-white text-blue-700 hover:bg-blue-50',
    input: 'border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900',
    checkbox: 'text-blue-600 focus:ring-blue-500 border-blue-300',
    tableHeader: 'bg-blue-100 text-blue-800 border-b border-blue-200',
    tableRowEven: 'bg-white',
    tableRowOdd: 'bg-blue-50',
    tableCell: 'text-gray-700 border-b border-blue-100'
  },
  green: {
    background: 'bg-green-50',
    header: 'bg-green-800 text-white',
    footer: 'bg-white border-green-100',
    card: 'bg-white shadow-md border border-green-100',
    text: 'text-gray-700',
    mutedText: 'text-green-700',
    title: 'text-green-900',
    label: 'text-green-800',
    icon: 'text-green-700',
    iconInverse: 'text-white',
    iconBackground: 'bg-green-600',
    primaryButton: 'bg-green-600 hover:bg-green-700 text-white',
    secondaryButton: 'bg-green-100 hover:bg-green-200 text-green-800',
    outlineButton: 'border border-green-300 text-green-700 hover:bg-green-50',
    activeButton: 'bg-green-600 text-white',
    inactiveButton: 'bg-white text-green-700 hover:bg-green-50',
    input: 'border-green-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900',
    checkbox: 'text-green-600 focus:ring-green-500 border-green-300',
    tableHeader: 'bg-green-100 text-green-800 border-b border-green-200',
    tableRowEven: 'bg-white',
    tableRowOdd: 'bg-green-50',
    tableCell: 'text-gray-700 border-b border-green-100'
  }
};

// 设置主题
const setTheme = theme => {
  currentTheme.value = theme;
};

// 表格数据
const tableHeaders = ['产品名称', '类别', '价格', '库存', '状态'];
const tableData = [
  ['高级办公椅', '办公家具', '¥1,299', '24', '在售'],
  ['无线蓝牙耳机', '电子设备', '¥499', '156', '在售'],
  ['超薄笔记本电脑', '电子设备', '¥6,999', '8', '低库存'],
  ['人体工学键盘', '办公设备', '¥899', '42', '在售'],
  ['智能手表', '可穿戴设备', '¥1,599', '0', '缺货']
];

// 统计数据
const stats = [
  {
    label: '总用户数',
    value: '24,521',
    trend: 12.5,
    icon: UsersIcon
  },
  {
    label: '订单数量',
    value: '1,429',
    trend: 8.2,
    icon: ShoppingCartIcon
  },
  {
    label: '平均转化率',
    value: '3.6%',
    trend: -2.4,
    icon: ActivityIcon
  },
  {
    label: '总收入',
    value: '¥286,432',
    trend: 14.8,
    icon: BarChartIcon
  }
];
</script>
