# 图片预览功能说明

## 功能特性

新的图片预览组件提供了以下功能：

### 🖼️ 基本预览
- 支持多种图片格式：JPG、JPEG、PNG、GIF、BMP、WebP、SVG、ICO
- 自适应容器大小，保持图片比例
- 加载状态显示
- 错误处理和重试机制

### 🔍 缩放功能
- 鼠标滚轮缩放（10% - 500%）
- 工具栏缩放按钮
- 实时显示缩放百分比
- 平滑的缩放动画

### 🔄 旋转功能
- 向左/向右旋转（90度步进）
- 支持任意角度旋转
- 旋转状态保持

### 🖱️ 拖拽平移
- 放大后可拖拽查看图片细节
- 平滑的拖拽体验
- 鼠标指针状态提示

### 🖥️ 全屏预览
- 点击全屏按钮进入全屏模式
- 点击图片或按ESC键退出
- 全屏模式下保持所有交互功能

### ⌨️ 键盘快捷键
- `+` 或 `=`：放大
- `-`：缩小
- `0`：重置视图
- `←`：向左旋转
- `→`：向右旋转

### 📥 下载功能
- 一键下载原图
- 保持原始文件名
- 下载状态提示

## 使用方法

### 在 FilePreviewWindow 中使用

```vue
<template>
  <ImagePreview
    v-if="isImageFile"
    :file="file"
    class="h-full"
  />
</template>

<script setup>
import ImagePreview from './ImagePreview.vue'

// 判断是否为图片文件
const isImageFile = computed(() => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'ico']
  return imageExtensions.includes(file.ext || '')
})
</script>
```

### 独立使用

```vue
<template>
  <ImagePreview
    :file="imageFile"
    class="w-full h-96"
  />
</template>

<script setup>
import ImagePreview from './ImagePreview.vue'

const imageFile = {
  id: 1,
  name: 'example.jpg',
  path: 'https://example.com/image.jpg',
  size: 1024000,
  ext: 'jpg',
  isFolder: false,
  isOwner: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  owner: {
    id: 1,
    nickname: '用户'
  },
  permission: FilePermissionLevel.DELETE
}
</script>
```

## 组件属性

| 属性 | 类型 | 必需 | 说明 |
|------|------|------|------|
| file | FileTreeDto | 是 | 文件信息对象 |

## 技术实现

### 核心技术
- Vue 3 Composition API
- TypeScript 类型安全
- CSS Transform 实现缩放和旋转
- 原生拖拽事件处理
- 键盘事件监听

### 性能优化
- 使用 `computed` 优化样式计算
- 事件监听器在组件卸载时清理
- 防抖处理鼠标滚轮事件
- 图片加载状态管理

### 用户体验
- 平滑的动画过渡
- 直观的工具栏界面
- 响应式设计
- 无障碍访问支持

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 注意事项

1. 图片路径必须是可访问的URL
2. 大图片建议使用CDN或图片压缩服务
3. 全屏模式在某些移动设备上可能受限
4. 键盘快捷键仅在组件获得焦点时生效

## 未来改进

- [ ] 支持图片滤镜效果
- [ ] 添加图片裁剪功能
- [ ] 支持图片标注和画笔工具
- [ ] 添加图片对比功能
- [ ] 支持批量图片预览
- [ ] 添加图片元数据显示 