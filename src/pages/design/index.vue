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
      <!-- 介绍 -->
      <section v-if="activeSection === 'intro'" class="space-y-8">
        <div class="bg-white p-8 rounded-lg shadow-sm">
          <h2 class="text-3xl font-bold mb-6 text-gray-900">明亮简约设计系统</h2>
          <p class="text-lg text-gray-700 mb-4">这是一套专注于美观明亮、简约和一致性的前端设计规范，旨在创建易于使用且对所有用户友好的界面。</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div class="bg-primary-50 p-6 rounded-lg border border-primary-100">
              <h3 class="text-xl font-semibold mb-3 text-primary-900">设计原则</h3>
              <ul class="space-y-2 text-primary-800">
                <li class="flex items-start">
                  <svg class="w-5 h-5 mr-2 text-primary-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>美观明亮：使用明亮的色调，避免过于暗沉的颜色</span>
                </li>
                <li class="flex items-start">
                  <svg class="w-5 h-5 mr-2 text-primary-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>简约：保持界面简洁，减少不必要的装饰</span>
                </li>
                <li class="flex items-start">
                  <svg class="w-5 h-5 mr-2 text-primary-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>一致性：在颜色、字体、间距等方面保持一致</span>
                </li>
                <li class="flex items-start">
                  <svg class="w-5 h-5 mr-2 text-primary-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>可访问性：确保设计对所有用户友好</span>
                </li>
              </ul>
            </div>
            <div class="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 class="text-xl font-semibold mb-3 text-gray-900">设计系统包含</h3>
              <ul class="space-y-2 text-gray-700">
                <li class="flex items-start">
                  <svg class="w-5 h-5 mr-2 text-gray-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    ></path>
                  </svg>
                  <span>颜色系统：主色、辅助色和中性色</span>
                </li>
                <li class="flex items-start">
                  <svg class="w-5 h-5 mr-2 text-gray-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    ></path>
                  </svg>
                  <span>排版系统：字体、大小、粗细和行高</span>
                </li>
                <li class="flex items-start">
                  <svg class="w-5 h-5 mr-2 text-gray-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    ></path>
                  </svg>
                  <span>组件系统：按钮、表单、卡片等</span>
                </li>
                <li class="flex items-start">
                  <svg class="w-5 h-5 mr-2 text-gray-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    ></path>
                  </svg>
                  <span>间距系统：一致的间距比例</span>
                </li>
                <li class="flex items-start">
                  <svg class="w-5 h-5 mr-2 text-gray-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    ></path>
                  </svg>
                  <span>可访问性指南：确保所有用户都能使用</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 示例界面 -->
        <div class="bg-white p-8 rounded-lg shadow-sm">
          <h2 class="text-2xl font-bold mb-6 text-gray-900">设计系统示例</h2>
          <div class="border border-gray-200 rounded-lg overflow-hidden">
            <!-- 示例界面头部 -->
            <div class="bg-white border-b border-gray-200 p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">A</div>
                  <h3 class="font-semibold text-gray-900">应用名称</h3>
                </div>
                <div class="flex items-center space-x-2">
                  <button class="btn btn-sm btn-ghost">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      ></path>
                    </svg>
                  </button>
                  <button class="btn btn-sm btn-ghost">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      ></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </button>
                  <button class="btn btn-sm btn-primary">
                    <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    新建
                  </button>
                </div>
              </div>
            </div>

            <!-- 示例界面内容 -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gray-50">
              <!-- 侧边栏 -->
              <div class="md:col-span-1">
                <div class="bg-white rounded-lg shadow-sm p-4">
                  <h4 class="font-medium text-gray-900 mb-3">导航</h4>
                  <nav>
                    <ul class="space-y-1">
                      <li>
                        <a href="#" class="flex items-center px-3 py-2 text-sm rounded-md bg-primary-50 text-primary-700">
                          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            ></path>
                          </svg>
                          首页
                        </a>
                      </li>
                      <li>
                        <a href="#" class="flex items-center px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100">
                          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            ></path>
                          </svg>
                          统计
                        </a>
                      </li>
                      <li>
                        <a href="#" class="flex items-center px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100">
                          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                          </svg>
                          用户
                        </a>
                      </li>
                      <li>
                        <a href="#" class="flex items-center px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100">
                          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            ></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                          设置
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>

              <!-- 主内容 -->
              <div class="md:col-span-2">
                <div class="bg-white rounded-lg shadow-sm p-6">
                  <h4 class="text-xl font-semibold text-gray-900 mb-4">欢迎使用明亮简约设计系统</h4>
                  <p class="text-gray-700 mb-6">这是一个示例界面，展示了设计系统的各种元素和组件。</p>

                  <div class="alert alert-info mb-6">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>这是一条信息提示，用于展示一般性信息。</span>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div class="p-4 bg-gray-50 rounded-lg">
                      <h5 class="font-medium text-gray-900 mb-2">表单示例</h5>
                      <div class="space-y-3">
                        <div>
                          <label for="example-input" class="form-label">输入框</label>
                          <input id="example-input" type="text" class="form-input" placeholder="请输入内容" />
                        </div>
                        <div>
                          <label for="example-select" class="form-label">选择框</label>
                          <select id="example-select" class="form-select">
                            <option value="" disabled selected>请选择选项</option>
                            <option value="option1">选项 1</option>
                            <option value="option2">选项 2</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div class="p-4 bg-gray-50 rounded-lg">
                      <h5 class="font-medium text-gray-900 mb-2">按钮示例</h5>
                      <div class="space-y-3">
                        <div class="flex flex-wrap gap-2">
                          <button class="btn btn-primary">主要按钮</button>
                          <button class="btn btn-secondary">次要按钮</button>
                        </div>
                        <div class="flex flex-wrap gap-2">
                          <button class="btn btn-outline">轮廓按钮</button>
                          <button class="btn btn-ghost">幽灵按钮</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="border-t border-gray-200 pt-4">
                    <h5 class="font-medium text-gray-900 mb-3">卡片示例</h5>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div class="card">
                        <div class="card-body">
                          <h3 class="card-title">基础卡片</h3>
                          <p class="card-text">这是一个基础卡片示例，只包含简单的内容。</p>
                        </div>
                      </div>
                      <div class="card">
                        <div class="card-body">
                          <h3 class="card-title">带操作的卡片</h3>
                          <p class="card-text">这是一个带有操作按钮的卡片示例。</p>
                          <div class="card-actions">
                            <button class="btn btn-sm btn-primary">确认</button>
                            <button class="btn btn-sm btn-outline">取消</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 颜色系统 -->
      <section v-if="activeSection === 'colors'">
        <ColorPalette />
      </section>

      <!-- 排版系统 -->
      <section v-if="activeSection === 'typography'">
        <Typography />
      </section>

      <!-- 组件系统 -->
      <section v-if="activeSection === 'components'">
        <Components />
      </section>

      <!-- 间距系统 -->
      <section v-if="activeSection === 'spacing'">
        <Spacing />
      </section>

      <!-- 可访问性 -->
      <section v-if="activeSection === 'accessibility'">
        <Accessibility />
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ColorPalette from './ColorPalette.vue';
import Typography from './Typography.vue';
import Components from './Components.vue';
import Spacing from './Spacing.vue';
import Accessibility from './Accessibility.vue';

const activeSection = ref('intro');

const navItems = [
  { id: 'intro', name: '介绍' },
  { id: 'colors', name: '颜色系统' },
  { id: 'typography', name: '排版系统' },
  { id: 'components', name: '组件系统' },
  { id: 'spacing', name: '间距系统' },
  { id: 'accessibility', name: '可访问性' }
];
</script>

<style>
/* 全局样式已在其他组件中定义 */
</style>
