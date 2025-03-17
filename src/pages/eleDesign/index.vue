<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-bold mb-8 text-gray-900">Element Plus 集成指南</h1>

    <!-- 主题定制 -->
    <section class="mb-12">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">主题定制</h2>
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <p class="text-gray-700 mb-4">Element Plus 支持通过 CSS 变量进行主题定制，可以轻松地将我们的明亮简约设计规范应用到 Element Plus 组件上。</p>

        <div class="bg-gray-100 p-4 rounded-lg mb-6">
          <h3 class="text-lg font-medium mb-2 text-gray-700">步骤 1: 创建自定义主题文件</h3>
          <pre class="bg-gray-800 text-gray-100 p-4 rounded overflow-x-auto">
// styles/element-variables.scss

// 导入 Element Plus 的样式
@use "element-plus/theme-chalk/src/index.scss" as *;

// 定义主题颜色变量
:root {
  // 主色 - 天空蓝
  --el-color-primary: #0EA5E9;
  --el-color-primary-light-3: #7DD3FC;
  --el-color-primary-light-5: #BAE6FD;
  --el-color-primary-light-7: #E0F2FE;
  --el-color-primary-light-9: #F0F9FF;
  --el-color-primary-dark-2: #0284C7;
  
  // 成功色 - 翡翠绿
  --el-color-success: #10B981;
  --el-color-success-light-3: #34D399;
  --el-color-success-light-5: #6EE7B7;
  --el-color-success-light-7: #A7F3D0;
  --el-color-success-light-9: #ECFDF5;
  --el-color-success-dark-2: #059669;
  
  // 警告色 - 琥珀色
  --el-color-warning: #F59E0B;
  --el-color-warning-light-3: #FBBF24;
  --el-color-warning-light-5: #FCD34D;
  --el-color-warning-light-7: #FDE68A;
  --el-color-warning-light-9: #FFFBEB;
  --el-color-warning-dark-2: #D97706;
  
  // 危险色 - 红色
  --el-color-danger: #EF4444;
  --el-color-danger-light-3: #F87171;
  --el-color-danger-light-5: #FCA5A5;
  --el-color-danger-light-7: #FECACA;
  --el-color-danger-light-9: #FEF2F2;
  --el-color-danger-dark-2: #DC2626;
  
  // 信息色 - 靛蓝色
  --el-color-info: #6366F1;
  --el-color-info-light-3: #818CF8;
  --el-color-info-light-5: #A5B4FC;
  --el-color-info-light-7: #C7D2FE;
  --el-color-info-light-9: #EEF2FF;
  --el-color-info-dark-2: #4F46E5;
  
  // 文本颜色
  --el-text-color-primary: #1F2937;
  --el-text-color-regular: #374151;
  --el-text-color-secondary: #6B7280;
  --el-text-color-placeholder: #9CA3AF;
  --el-text-color-disabled: #D1D5DB;
  
  // 边框颜色
  --el-border-color: #E5E7EB;
  --el-border-color-light: #F3F4F6;
  --el-border-color-lighter: #F9FAFB;
  --el-border-color-extra-light: #FFFFFF;
  --el-border-color-dark: #D1D5DB;
  --el-border-color-darker: #9CA3AF;
  
  // 背景颜色
  --el-bg-color: #FFFFFF;
  --el-bg-color-page: #F9FAFB;
  --el-bg-color-overlay: #FFFFFF;
  
  // 字体设置
  --el-font-size-extra-large: 1.5rem;
  --el-font-size-large: 1.25rem;
  --el-font-size-medium: 1rem;
  --el-font-size-base: 0.875rem;
  --el-font-size-small: 0.75rem;
  --el-font-size-extra-small: 0.75rem;
  
  // 圆角设置
  --el-border-radius-base: 0.375rem;
  --el-border-radius-small: 0.25rem;
  --el-border-radius-round: 1.25rem;
  --el-border-radius-circle: 100%;
}
          </pre>
        </div>

        <div class="bg-gray-100 p-4 rounded-lg">
          <h3 class="text-lg font-medium mb-2 text-gray-700">步骤 2: 在 main.js 中引入自定义主题</h3>
          <pre class="bg-gray-800 text-gray-100 p-4 rounded overflow-x-auto">
// main.js
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import App from './App.vue'

// 引入自定义主题
import './styles/element-variables.scss'

const app = createApp(App)
app.use(ElementPlus)
app.mount('#app')
          </pre>
        </div>
      </div>
    </section>

    <!-- 组件使用示例 -->
    <section class="mb-12">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">组件使用示例</h2>
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <p class="text-gray-700 mb-6">以下是一些 Element Plus 组件的使用示例，展示了如何在保持明亮简约设计风格的同时使用 Element Plus。</p>

        <!-- 按钮示例 -->
        <div class="mb-8">
          <h3 class="text-lg font-medium mb-3 text-gray-700">按钮</h3>
          <div class="bg-gray-50 p-6 rounded-lg">
            <div class="flex flex-wrap gap-4 mb-4">
              <el-button type="primary">主要按钮</el-button>
              <el-button type="success">成功按钮</el-button>
              <el-button type="warning">警告按钮</el-button>
              <el-button type="danger">危险按钮</el-button>
              <el-button type="info">信息按钮</el-button>
            </div>
            <div class="flex flex-wrap gap-4 mb-4">
              <el-button plain>朴素按钮</el-button>
              <el-button type="primary" plain>主要按钮</el-button>
              <el-button type="success" plain>成功按钮</el-button>
              <el-button type="warning" plain>警告按钮</el-button>
              <el-button type="danger" plain>危险按钮</el-button>
            </div>
            <div class="flex flex-wrap gap-4">
              <el-button round>圆角按钮</el-button>
              <el-button type="primary" round>主要按钮</el-button>
              <el-button type="success" :icon="Check" circle></el-button>
              <el-button type="warning" :icon="Star" circle></el-button>
              <el-button type="danger" :icon="Delete" circle></el-button>
            </div>
          </div>

          <div class="mt-4 bg-gray-100 p-4 rounded">
            <pre class="text-sm overflow-x-auto">
&lt;el-button type="primary"&gt;主要按钮&lt;/el-button&gt;
&lt;el-button type="success"&gt;成功按钮&lt;/el-button&gt;
&lt;el-button type="warning"&gt;警告按钮&lt;/el-button&gt;
&lt;el-button type="danger"&gt;危险按钮&lt;/el-button&gt;
&lt;el-button type="info"&gt;信息按钮&lt;/el-button&gt;

&lt;el-button plain&gt;朴素按钮&lt;/el-button&gt;
&lt;el-button type="primary" plain&gt;主要按钮&lt;/el-button&gt;
&lt;el-button type="success" plain&gt;成功按钮&lt;/el-button&gt;
&lt;el-button type="warning" plain&gt;警告按钮&lt;/el-button&gt;
&lt;el-button type="danger" plain&gt;危险按钮&lt;/el-button&gt;

&lt;el-button round&gt;圆角按钮&lt;/el-button&gt;
&lt;el-button type="primary" round&gt;主要按钮&lt;/el-button&gt;
&lt;el-button type="success" :icon="Check" circle&gt;&lt;/el-button&gt;
&lt;el-button type="warning" :icon="Star" circle&gt;&lt;/el-button&gt;
&lt;el-button type="danger" :icon="Delete" circle&gt;&lt;/el-button&gt;
            </pre>
          </div>
        </div>

        <!-- 表单示例 -->
        <div class="mb-8">
          <h3 class="text-lg font-medium mb-3 text-gray-700">表单</h3>
          <div class="bg-gray-50 p-6 rounded-lg">
            <el-form :model="form" label-width="120px" class="max-w-lg">
              <el-form-item label="用户名">
                <el-input v-model="form.name" placeholder="请输入用户名"></el-input>
              </el-form-item>
              <el-form-item label="活动区域">
                <el-select v-model="form.region" placeholder="请选择活动区域" class="w-full">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="活动时间">
                <el-date-picker v-model="form.date" type="date" placeholder="选择日期" class="w-full"></el-date-picker>
              </el-form-item>
              <el-form-item label="即时配送">
                <el-switch v-model="form.delivery"></el-switch>
              </el-form-item>
              <el-form-item label="活动性质">
                <el-checkbox-group v-model="form.type">
                  <el-checkbox label="美食/餐厅线上活动"></el-checkbox>
                  <el-checkbox label="地推活动"></el-checkbox>
                  <el-checkbox label="线下主题活动"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="特殊资源">
                <el-radio-group v-model="form.resource">
                  <el-radio label="线上品牌商赞助"></el-radio>
                  <el-radio label="线下场地免费"></el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="活动形式">
                <el-input v-model="form.desc" type="textarea" rows="3"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary">立即创建</el-button>
                <el-button>取消</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>

        <!-- 表格示例 -->
        <div class="mb-8">
          <h3 class="text-lg font-medium mb-3 text-gray-700">表格</h3>
          <div class="bg-gray-50 p-6 rounded-lg">
            <el-table :data="tableData" style="width: 100%" border>
              <el-table-column prop="date" label="日期" width="180"></el-table-column>
              <el-table-column prop="name" label="姓名" width="180"></el-table-column>
              <el-table-column prop="address" label="地址"></el-table-column>
              <el-table-column label="操作" width="300">
                <template #default>
                  <el-button type="text" size="small">查看</el-button>
                  <el-button type="text" size="small">编辑</el-button>
                  <el-button type="text" size="small" class="text-red-500">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <!-- 卡片示例 -->
        <div>
          <h3 class="text-lg font-medium mb-3 text-gray-700">卡片</h3>
          <div class="bg-gray-50 p-6 rounded-lg">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <el-card class="box-card">
                <template #header>
                  <div class="flex justify-between items-center">
                    <span>卡片标题</span>
                    <el-button class="button" type="text">操作按钮</el-button>
                  </div>
                </template>
                <div v-for="o in 4" :key="o" class="text-item mb-3 pb-3 border-b border-gray-100 last:border-0">
                  {{ '列表内容 ' + o }}
                </div>
              </el-card>

              <el-card class="box-card">
                <div class="flex items-center mb-4">
                  <el-avatar :size="50" src="https://via.placeholder.com/150" class="mr-4"></el-avatar>
                  <div>
                    <h4 class="text-lg font-medium">用户信息卡片</h4>
                    <p class="text-gray-500">这是一个用户信息展示卡片</p>
                  </div>
                </div>
                <div class="space-y-2">
                  <p><strong>用户名:</strong> admin</p>
                  <p><strong>邮箱:</strong> admin@example.com</p>
                  <p><strong>角色:</strong> 管理员</p>
                </div>
                <div class="mt-4 pt-4 border-t border-gray-100">
                  <el-button type="primary" size="small">编辑资料</el-button>
                  <el-button size="small">查看详情</el-button>
                </div>
              </el-card>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 设计最佳实践 -->
    <section class="mb-12">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">设计最佳实践</h2>
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <div class="space-y-6">
          <div>
            <h3 class="text-lg font-medium mb-2 text-gray-700">1. 保持一致的间距</h3>
            <p class="text-gray-600">使用一致的间距比例，可以通过 Tailwind CSS 的间距类与 Element Plus 组件结合使用：</p>
            <ul class="list-disc list-inside mt-2 text-gray-600 space-y-1">
              <li>小间距：p-2, m-2 (0.5rem / 8px)</li>
              <li>中间距：p-4, m-4 (1rem / 16px)</li>
              <li>大间距：p-6, m-6 (1.5rem / 24px)</li>
              <li>特大间距：p-8, m-8 (2rem / 32px)</li>
            </ul>
          </div>

          <div>
            <h3 class="text-lg font-medium mb-2 text-gray-700">2. 颜色使用指南</h3>
            <p class="text-gray-600">在使用 Element Plus 组件时，遵循以下颜色使用原则：</p>
            <ul class="list-disc list-inside mt-2 text-gray-600 space-y-1">
              <li>主色（天空蓝）：用于主要按钮、链接和强调元素</li>
              <li>成功色（翡翠绿）：用于表示成功状态和积极反馈</li>
              <li>警告色（琥珀色）：用于表示警告状态和需要注意的信息</li>
              <li>危险色（红色）：用于表示错误状态和危险操作</li>
              <li>信息色（靛蓝色）：用于表示一般信息和提示</li>
              <li>中性色：用于文本、背景、边框和分隔线</li>
            </ul>
          </div>

          <div>
            <h3 class="text-lg font-medium mb-2 text-gray-700">3. 排版建议</h3>
            <p class="text-gray-600">结合 Element Plus 和我们的排版系统：</p>
            <ul class="list-disc list-inside mt-2 text-gray-600 space-y-1">
              <li>使用 Element Plus 的文本组件时，可以添加 Tailwind 的文本类来增强样式</li>
              <li>保持一致的字体大小层次结构</li>
              <li>使用适当的行高提高可读性</li>
              <li>重要信息使用粗体强调</li>
            </ul>
          </div>

          <div>
            <h3 class="text-lg font-medium mb-2 text-gray-700">4. 组件布局</h3>
            <p class="text-gray-600">使用 Element Plus 组件时的布局建议：</p>
            <ul class="list-disc list-inside mt-2 text-gray-600 space-y-1">
              <li>使用 Element Plus 的栅格系统或 Tailwind 的网格/弹性布局</li>
              <li>相关元素分组放置在卡片或面板中</li>
              <li>保持足够的留白，避免界面过于拥挤</li>
              <li>使用一致的对齐方式（左对齐文本，右对齐数字）</li>
            </ul>
          </div>

          <div>
            <h3 class="text-lg font-medium mb-2 text-gray-700">5. 响应式设计</h3>
            <p class="text-gray-600">确保界面在各种设备上都能良好显示：</p>
            <ul class="list-disc list-inside mt-2 text-gray-600 space-y-1">
              <li>使用 Element Plus 的响应式组件</li>
              <li>结合 Tailwind 的响应式工具类</li>
              <li>在小屏幕上适当调整间距和字体大小</li>
              <li>考虑移动设备上的触摸交互</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { ElButton, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElDatePicker, ElSwitch, ElCheckbox, ElCheckboxGroup, ElRadio, ElRadioGroup, ElTable, ElTableColumn, ElCard, ElAvatar } from 'element-plus';
import { Check, Star, Delete } from '@element-plus/icons-vue';

// 表单数据
const form = reactive({
  name: '',
  region: '',
  date: '',
  delivery: false,
  type: [],
  resource: '',
  desc: ''
});

// 表格数据
const tableData = [
  {
    date: '2023-05-03',
    name: '张三',
    address: '北京市朝阳区芍药居'
  },
  {
    date: '2023-05-02',
    name: '李四',
    address: '上海市浦东新区金科路'
  },
  {
    date: '2023-05-01',
    name: '王五',
    address: '广州市天河区珠江新城'
  },
  {
    date: '2023-04-30',
    name: '赵六',
    address: '深圳市南山区科技园'
  }
];
</script>

<style>
/* 这里可以添加额外的样式，但大部分样式已通过 CSS 变量和 Tailwind 类提供 */
.text-item {
  margin-bottom: 10px;
}
</style>
