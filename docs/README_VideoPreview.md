# 视频预览功能说明

## 功能特性

新的视频预览组件基于 Plyr 播放器，提供了以下功能：

### 🎥 基本播放功能
- 支持多种视频格式：MP4、AVI、MOV、WMV、FLV、WebM、MKV、M4V
- 自适应容器大小，保持视频比例
- 加载状态显示
- 错误处理和重试机制

### 🎮 播放控制
- 播放/暂停按钮
- 进度条拖拽
- 音量控制
- 当前时间显示
- 总时长显示

### ⚡ 高级功能
- **播放速度控制**：0.5x - 2x 可调
- **全屏播放**：支持全屏模式
- **画中画模式**：支持 PiP
- **键盘快捷键**：空格播放/暂停，方向键快进/快退
- **自动隐藏控制栏**：鼠标离开时自动隐藏

### 🎨 用户体验
- 现代化的UI设计
- 响应式布局
- 平滑的动画过渡
- 自定义主题色彩（紫色主题）

## 使用方法

### 在 FilePreviewWindow 中使用

```vue
<template>
  <VideoPreview
    v-if="isVideoFile"
    :file="file"
    class="h-full"
  />
</template>

<script setup>
import VideoPreview from './VideoPreview.vue'

// 判断是否为视频文件
const isVideoFile = computed(() => {
  const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', 'm4v']
  return videoExtensions.includes(file.ext || '')
})
</script>
```

### 独立使用

```vue
<template>
  <VideoPreview
    :file="videoFile"
    class="w-full h-96"
  />
</template>

<script setup>
import VideoPreview from './VideoPreview.vue'

const videoFile = {
  id: 1,
  name: 'example.mp4',
  path: 'https://example.com/video.mp4',
  size: 10240000,
  ext: 'mp4',
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
- **Plyr 播放器**：现代化的 HTML5 视频播放器
- **Vue 3 Composition API**：响应式状态管理
- **TypeScript**：类型安全
- **CSS 深度选择器**：自定义播放器样式

### Plyr 配置
```javascript
const player = new Plyr(video, {
  controls: [
    'play-large',    // 大播放按钮
    'play',          // 播放/暂停
    'progress',      // 进度条
    'current-time',  // 当前时间
    'mute',          // 静音
    'volume',        // 音量
    'captions',      // 字幕
    'settings',      // 设置
    'pip',           // 画中画
    'airplay',       // 投屏
    'fullscreen'     // 全屏
  ],
  settings: ['captions', 'quality', 'speed'],
  speed: {
    selected: 1,
    options: [0.5, 0.75, 1, 1.25, 1.5, 2]
  },
  keyboard: {
    focused: true,
    global: true
  },
  tooltips: {
    controls: true,
    seek: true
  },
  hideControls: true,
  resetOnEnd: false
})
```

### 自定义样式
- 紫色主题色彩
- 渐变控制栏背景
- 自定义播放按钮样式
- 响应式布局适配

## 键盘快捷键

| 按键 | 功能 |
|------|------|
| 空格 | 播放/暂停 |
| ← | 快退 10 秒 |
| → | 快进 10 秒 |
| ↑ | 音量增加 |
| ↓ | 音量减少 |
| F | 全屏切换 |
| M | 静音切换 |
| 0-9 | 跳转到指定百分比 |

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 性能优化

- **懒加载**：只在需要时初始化播放器
- **内存管理**：组件卸载时销毁播放器实例
- **错误处理**：网络错误时提供重试机制
- **加载状态**：显示加载进度，提升用户体验

## 注意事项

1. **视频格式支持**：不同浏览器支持的视频格式可能不同
2. **跨域问题**：如果视频来自不同域名，可能需要设置 CORS
3. **大文件处理**：大视频文件建议使用流式传输
4. **移动设备**：某些功能在移动设备上可能受限

## 与原生 video 标签对比

| 功能 | 原生 video | Plyr |
|------|------------|------|
| 基本播放 | ✅ | ✅ |
| 自定义样式 | ❌ | ✅ |
| 播放速度 | ❌ | ✅ |
| 键盘快捷键 | 有限 | ✅ |
| 画中画 | 部分支持 | ✅ |
| 全屏控制 | 有限 | ✅ |
| 错误处理 | 基础 | ✅ |
| 包大小 | 0KB | ~20KB |

## 未来改进

- [ ] 支持视频截图功能
- [ ] 添加视频标注工具
- [ ] 支持视频编辑功能
- [ ] 添加视频质量切换
- [ ] 支持视频播放列表
- [ ] 添加视频统计信息 