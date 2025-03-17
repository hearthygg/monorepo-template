<template>
  <div class="min-h-screen flex bg-background">
    <!-- 侧边菜单栏 -->
    <div class="w-[224px] border-r border-gray-300 px-2">
      <MyMenu></MyMenu>
    </div>

    <!-- 内容 -->
    <div class="flex-1">
      <!-- 头部栏 -->
      <!-- <header class="w-full h-[60px] border-gray-100 border-b">111</header> -->

      <!-- 子路由 -->
      <main class="w-full main-container">
        <router-view />
      </main>

      <!-- 底部栏 -->
      <footer class="w-full h-[40px]"></footer>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.main-container {
  height: calc(100vh - 60px - 40px);
  overflow-y: auto;
}
</style>
