# Tiptap 协作文档编辑器

这是一个基于 Tiptap 和 Yjs 的实时协作文档编辑器组件。

## 功能特性

- ✨ 实时协作编辑
- 🎨 富文本编辑（粗体、斜体、下划线、删除线、标题、列表、引用、代码块等）
- 👥 多人协作光标显示
- 💾 自动保存和离线支持
- 📱 响应式设计
- 🔄 连接状态监控

## 使用方法

### 1. 在父组件中使用

```vue
<template>
  <TiptapCollaborate 
    :file="fileInfo" 
    :is-editable="true" 
    class="h-full" 
  />
</template>

<script setup lang="ts">
import TiptapCollaborate from '@/modules/tiptapCollaborate/index.vue';
import type { FileTreeDto } from '@/services/api/file/types';

const fileInfo: FileTreeDto = {
  id: 123,
  name: '协作文档.sdoc',
  ext: 'sdoc',
  // ... 其他文件信息
};
</script>
```

### 2. 配置 WebSocket 服务器

确保 Yjs WebSocket 服务器正在运行：

```bash
# 启动 Yjs WebSocket 服务器
y-websocket-server --port 3001
```

### 3. API 接口

组件会自动调用以下 API：

- `getCollaborativeInfoApi(fileId)` - 获取协作文档信息
- `getCollaborativeContentApi(fileId)` - 获取协作文档内容

## 依赖包

确保以下依赖已安装：

```json
{
  "@tiptap/vue-3": "^3.0.7",
  "@tiptap/starter-kit": "^3.0.7",
  "@tiptap/extension-image": "^3.0.7",
  "@tiptap/extension-underline": "^3.0.7",
  "@tiptap/extension-strike": "^3.0.7",
  "@tiptap/extension-collaboration": "^3.0.7",
  "@tiptap/extension-collaboration-cursor": "^2.26.1",
  "yjs": "^13.6.27",
  "y-websocket": "^3.0.0",
  "y-indexeddb": "^9.0.12"
}
```

## 配置说明

### WebSocket 地址

默认 WebSocket 地址为：`ws://localhost:3001/yjs/{documentId}?token={userToken}`

如需修改，请更新 `initEditor` 函数中的 `wsUrl` 变量。

### 用户信息

协作光标会显示随机生成的用户信息。如需自定义，请修改 `CollaborationCursor.configure` 中的 `user` 配置。

### Tailwind CSS v4 配置

本项目使用 Tailwind CSS v4，样式配置方式有所不同：

- 组件样式使用原生 CSS 而非 `@apply` 指令
- 确保 `src/styles/tailwindInit.css` 文件正确导入
- 如需使用 Tailwind 类名，请在模板中直接使用

## 注意事项

1. 确保文档已启用协作功能（`collaborationEnabled: true`）
2. WebSocket 服务器必须正在运行
3. 组件会自动处理连接状态和错误重试
4. 支持离线编辑，数据会保存在 IndexedDB 中
5. 用户认证通过 token 参数传递到 WebSocket 连接

## 故障排除

### 连接失败
- 检查 WebSocket 服务器是否正在运行
- 确认端口 3001 未被占用
- 检查网络连接
- 验证用户 token 是否有效

### 协作功能不工作
- 确认文档的 `collaborationEnabled` 为 `true`
- 检查 `documentId` 是否正确
- 查看浏览器控制台是否有错误信息

### 内容不保存
- 检查 IndexedDB 是否可用
- 确认浏览器支持 IndexedDB
- 查看网络请求是否成功

### Tailwind CSS 错误
- 确保使用 Tailwind CSS v4 兼容的语法
- 避免在 `<style scoped>` 中使用 `@apply` 指令
- 使用原生 CSS 属性替代 Tailwind 工具类 