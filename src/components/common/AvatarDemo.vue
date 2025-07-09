<template>
  <div class="avatar-demo p-6">
    <h2 class="text-2xl font-bold mb-6">Avatar 组件演示</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- 基础文字头像 -->
      <div class="demo-section">
        <h3 class="text-lg font-semibold mb-4">基础文字头像</h3>
        <div class="flex items-center gap-4">
          <Avatar name="张三" size="sm" />
          <Avatar name="李四" size="md" />
          <Avatar name="王五" size="lg" />
          <Avatar name="赵六" size="xl" />
        </div>
      </div>

      <!-- 群组头像 -->
      <div class="demo-section">
        <h3 class="text-lg font-semibold mb-4">群组头像</h3>
        <div class="flex items-center gap-4">
          <Avatar name="技术交流群" :is-group="true" size="sm" />
          <Avatar name="产品讨论组" :is-group="true" size="md" />
          <Avatar name="设计团队" :is-group="true" size="lg" />
        </div>
      </div>

      <!-- 在线状态 -->
      <div class="demo-section">
        <h3 class="text-lg font-semibold mb-4">在线状态</h3>
        <div class="flex items-center gap-4">
          <Avatar name="在线用户" :is-online="true" :show-online-status="true" size="md" />
          <Avatar name="离线用户" :is-online="false" :show-online-status="true" size="md" />
        </div>
      </div>

      <!-- 自定义颜色 -->
      <div class="demo-section">
        <h3 class="text-lg font-semibold mb-4">自定义颜色</h3>
        <div class="flex items-center gap-4">
          <Avatar name="红色头像" bg-color="#FF6B6B" size="md" />
          <Avatar name="蓝色头像" bg-color="#4ECDC4" size="md" />
          <Avatar name="紫色头像" bg-color="#A78BFA" size="md" />
        </div>
      </div>

      <!-- 方形头像 -->
      <div class="demo-section">
        <h3 class="text-lg font-semibold mb-4">方形头像</h3>
        <div class="flex items-center gap-4">
          <Avatar name="方形用户" shape="square" size="md" />
          <Avatar name="方形群组" :is-group="true" shape="square" size="md" />
        </div>
      </div>

      <!-- 聊天列表示例 -->
      <div class="demo-section col-span-full">
        <h3 class="text-lg font-semibold mb-4">聊天列表示例</h3>
        <div class="bg-white rounded-lg shadow p-4">
          <div class="space-y-3">
            <div class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
              <Avatar name="张三" size="md" />
              <div class="flex-1">
                <div class="font-medium">张三</div>
                <div class="text-sm text-gray-500">你好，最近怎么样？</div>
              </div>
            </div>

            <div class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
              <Avatar name="技术交流群" :is-group="true" size="md" />
              <div class="flex-1">
                <div class="font-medium">技术交流群</div>
                <div class="text-sm text-gray-500">欢迎新成员加入！</div>
              </div>
            </div>

            <div class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
              <Avatar name="李四" :is-online="true" :show-online-status="true" size="md" />
              <div class="flex-1">
                <div class="font-medium">李四</div>
                <div class="text-sm text-gray-500">在线</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Avatar from './Avatar.vue';
</script>

<style scoped>
.avatar-demo {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.demo-section {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
</style>
