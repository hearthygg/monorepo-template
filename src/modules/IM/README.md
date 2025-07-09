# 即时通讯模块 (IM Module)

这是一个基于Vue 3 + TypeScript开发的即时通讯模块，提供了完整的聊天界面和功能。

## 功能特性

### 🎯 核心功能
- **用户列表管理** - 显示联系人列表，支持在线状态显示
- **实时聊天** - 支持发送和接收文本消息
- **消息历史** - 显示聊天记录，支持时间戳
- **搜索功能** - 支持按姓名搜索联系人
- **未读消息提醒** - 显示未读消息数量
- **响应式设计** - 适配不同屏幕尺寸

### 🎨 界面特性
- **现代化UI设计** - 采用简洁美观的界面设计
- **消息气泡** - 区分自己和他人的消息
- **在线状态指示** - 绿色圆点表示在线状态
- **自动滚动** - 新消息自动滚动到底部
- **输入框自适应** - 根据内容自动调整高度

## 文件结构

```
src/modules/IM/
├── index.vue              # 主组件文件
├── components/
│   └── MessageBubble.vue  # 消息气泡组件
└── README.md              # 使用说明
```

## 使用方法

### 1. 基本使用

```vue
<template>
  <div>
    <IMChat />
  </div>
</template>

<script setup>
import IMChat from '@/modules/IM/index.vue'
</script>
```

### 2. 自定义配置

```vue
<template>
  <div>
    <IMChat 
      :users="customUsers"
      :messages="customMessages"
      @message-sent="handleMessageSent"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import IMChat from '@/modules/IM/index.vue'

const customUsers = ref([
  {
    id: 'user1',
    name: '张三',
    avatar: 'https://example.com/avatar1.jpg',
    isOnline: true,
    unreadCount: 0
  }
])

const customMessages = ref([])

const handleMessageSent = (message) => {
  console.log('新消息:', message)
}
</script>
```

## 数据结构

### User 接口
```typescript
interface User {
  id: string;           // 用户唯一标识
  name: string;         // 用户姓名
  avatar: string;       // 头像URL
  isOnline: boolean;    // 在线状态
  unreadCount: number;  // 未读消息数量
}
```

### Message 接口
```typescript
interface Message {
  id: string;                    // 消息唯一标识
  senderId: string;              // 发送者ID
  receiverId: string;            // 接收者ID
  content: string;               // 消息内容
  timestamp: Date;               // 发送时间
  type: 'text' | 'image' | 'file'; // 消息类型
}
```

## 测试数据

模块内置了测试数据，包括：
- 4个测试用户（张三、李四、王五、赵六）
- 5条测试消息记录
- 在线状态模拟
- 未读消息计数

## 样式定制

### 主题色彩
- 主色调: `#007bff` (蓝色)
- 成功色: `#4caf50` (绿色)
- 警告色: `#ff4757` (红色)
- 背景色: `#f5f5f5` (浅灰)

### 自定义样式
可以通过CSS变量或直接修改样式来定制外观：

```css
/* 自定义主题色 */
:root {
  --im-primary-color: #your-color;
  --im-success-color: #your-color;
  --im-warning-color: #your-color;
}
```

## 扩展功能

### 1. 添加表情功能
```javascript
// 在工具栏中添加表情选择器
const showEmojiPicker = () => {
  // 实现表情选择逻辑
}
```

### 2. 文件上传
```javascript
// 添加文件上传功能
const handleFileUpload = (file) => {
  // 实现文件上传逻辑
}
```

### 3. 语音消息
```javascript
// 添加语音录制功能
const startVoiceRecord = () => {
  // 实现语音录制逻辑
}
```

## 注意事项

1. **网络连接** - 当前版本使用本地测试数据，实际使用时需要集成WebSocket或API
2. **数据持久化** - 消息数据仅在内存中，刷新页面会丢失
3. **用户认证** - 需要集成用户认证系统
4. **文件上传** - 需要配置文件上传服务
5. **消息加密** - 生产环境建议添加端到端加密

## 技术栈

- **Vue 3** - 前端框架
- **TypeScript** - 类型安全
- **Composition API** - 组合式API
- **CSS3** - 样式设计
- **响应式设计** - 移动端适配

## 浏览器兼容性

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## 许可证

MIT License 