<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-6">下拉菜单 Teleport 测试</h1>

    <!-- 普通下拉菜单 -->
    <div class="mb-8">
      <h2 class="text-lg font-semibold mb-4">普通下拉菜单</h2>
      <Dropdown trigger="click" placement="bottom">
        <template #trigger>
          <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">点击显示菜单</button>
        </template>
        <DropdownItem value="option1">选项 1</DropdownItem>
        <DropdownItem value="option2">选项 2</DropdownItem>
        <DropdownItem value="option3" disabled>禁用选项</DropdownItem>
        <DropdownItem value="option4">选项 4</DropdownItem>
      </Dropdown>
    </div>

    <!-- 弹窗内的下拉菜单 -->
    <div class="mb-8">
      <h2 class="text-lg font-semibold mb-4">弹窗内的下拉菜单</h2>
      <button class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600" @click="showDialog = true">打开弹窗</button>
    </div>

    <!-- 弹窗 -->
    <el-dialog v-model="showDialog" title="测试弹窗" width="500px" :close-on-click-modal="false">
      <div class="p-4">
        <p class="mb-4">这是一个弹窗，测试下拉菜单是否会被截取：</p>

        <!-- 靠近边缘的下拉菜单 -->
        <div class="flex justify-between items-center mb-4">
          <Dropdown trigger="click" placement="bottom">
            <template #trigger>
              <button class="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600">左侧菜单</button>
            </template>
            <DropdownItem value="left1">左侧选项 1</DropdownItem>
            <DropdownItem value="left2">左侧选项 2</DropdownItem>
            <DropdownItem value="left3">左侧选项 3</DropdownItem>
          </Dropdown>

          <Dropdown trigger="click" placement="bottom">
            <template #trigger>
              <button class="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600">右侧菜单</button>
            </template>
            <DropdownItem value="right1">右侧选项 1</DropdownItem>
            <DropdownItem value="right2">右侧选项 2</DropdownItem>
            <DropdownItem value="right3">右侧选项 3</DropdownItem>
          </Dropdown>
        </div>

        <!-- 不同位置的下拉菜单 -->
        <div class="grid grid-cols-2 gap-4">
          <Dropdown trigger="click" placement="top">
            <template #trigger>
              <button class="w-full px-3 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">向上显示</button>
            </template>
            <DropdownItem value="top1">向上选项 1</DropdownItem>
            <DropdownItem value="top2">向上选项 2</DropdownItem>
          </Dropdown>

          <Dropdown trigger="click" placement="right">
            <template #trigger>
              <button class="w-full px-3 py-2 bg-teal-500 text-white rounded hover:bg-teal-600">向右显示</button>
            </template>
            <DropdownItem value="right1">向右选项 1</DropdownItem>
            <DropdownItem value="right2">向右选项 2</DropdownItem>
          </Dropdown>
        </div>

        <!-- 悬停触发的下拉菜单 -->
        <div class="mt-4">
          <Dropdown trigger="hover" placement="bottom" :delay="100">
            <template #trigger>
              <button class="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600">悬停显示菜单</button>
            </template>
            <DropdownItem value="hover1">悬停选项 1</DropdownItem>
            <DropdownItem value="hover2">悬停选项 2</DropdownItem>
            <DropdownItem value="hover3">悬停选项 3</DropdownItem>
          </Dropdown>
        </div>
      </div>
    </el-dialog>

    <!-- 测试结果 -->
    <div class="mt-8 p-4 bg-gray-100 rounded">
      <h3 class="font-semibold mb-2">测试说明：</h3>
      <ul class="list-disc list-inside space-y-1 text-sm">
        <li>点击"打开弹窗"按钮打开弹窗</li>
        <li>在弹窗内测试各个下拉菜单</li>
        <li>检查菜单是否被弹窗边缘截取</li>
        <li>测试不同位置的菜单显示</li>
        <li>验证悬停触发功能</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Dropdown from './Dropdown.vue';
import DropdownItem from './DropdownItem.vue';

const showDialog = ref(false);
</script>
