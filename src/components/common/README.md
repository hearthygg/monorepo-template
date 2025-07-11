# 下拉菜单组件

一个美观的原生下拉菜单组件，支持多种触发方式和丰富的自定义选项。

## 特性

- 🎨 **现代化设计** - 美观的UI设计，支持深色模式
- 🎯 **多种触发方式** - 支持点击、悬浮、右键三种触发方式
- 📍 **智能定位** - 自动检测边界并调整位置
- ⌨️ **键盘导航** - 支持键盘操作和可访问性
- 🎭 **流畅动画** - 平滑的显示/隐藏动画
- 🎛️ **高度可定制** - 支持自定义样式和内容

## 基础用法

### 安装组件

```vue
<script setup>
import Dropdown from '@/components/common/Dropdown.vue';
import DropdownItem from '@/components/common/DropdownItem.vue';
</script>
```

### 基本下拉菜单

```vue
<template>
  <Dropdown @select="handleSelect">
    <template #trigger>
      <button class="px-4 py-2 bg-blue-500 text-white rounded">
        点击我
      </button>
    </template>
    
    <DropdownItem value="option1">选项1</DropdownItem>
    <DropdownItem value="option2">选项2</DropdownItem>
    <DropdownItem divider />
    <DropdownItem value="option3" danger>删除</DropdownItem>
  </Dropdown>
</template>

<script setup>
const handleSelect = (value) => {
  console.log('选择了:', value);
};
</script>
```

## 触发方式

### 点击触发（默认）

```vue
<Dropdown trigger="click">
  <!-- 内容 -->
</Dropdown>
```

### 悬浮触发

```vue
<Dropdown trigger="hover">
  <!-- 内容 -->
</Dropdown>
```

### 右键触发

```vue
<Dropdown trigger="contextmenu">
  <!-- 内容 -->
</Dropdown>
```

### 组合触发

```vue
<!-- 点击 + 悬浮 -->
<Dropdown trigger="click-hover">
  <!-- 内容 -->
</Dropdown>

<!-- 点击 + 右键 -->
<Dropdown trigger="click-contextmenu">
  <!-- 内容 -->
</Dropdown>

<!-- 所有触发方式 -->
<Dropdown trigger="all">
  <!-- 内容 -->
</Dropdown>
```

## 位置设置

```vue
<!-- 底部（默认） -->
<Dropdown placement="bottom">
  <!-- 内容 -->
</Dropdown>

<!-- 顶部 -->
<Dropdown placement="top">
  <!-- 内容 -->
</Dropdown>

<!-- 左侧 -->
<Dropdown placement="left">
  <!-- 内容 -->
</Dropdown>

<!-- 右侧 -->
<Dropdown placement="right">
  <!-- 内容 -->
</Dropdown>

<!-- 带对齐的位置 -->
<Dropdown placement="bottom-start">  <!-- 底部左对齐 -->
<Dropdown placement="bottom-end">    <!-- 底部右对齐 -->
<Dropdown placement="top-start">     <!-- 顶部左对齐 -->
<Dropdown placement="top-end">       <!-- 顶部右对齐 -->
```

## 菜单项类型

### 基础菜单项

```vue
<DropdownItem value="basic">基础菜单项</DropdownItem>
```

### 带图标的菜单项

```vue
<DropdownItem value="with-icon" icon="User">
  个人资料
</DropdownItem>
```

### 带后缀的菜单项

```vue
<DropdownItem value="with-suffix" icon="Settings" suffix="ChevronRight">
  设置
</DropdownItem>
```

### 危险操作

```vue
<DropdownItem value="delete" icon="Trash2" danger>
  删除
</DropdownItem>
```

### 禁用状态

```vue
<DropdownItem value="disabled" disabled>
  禁用选项
</DropdownItem>
```

### 分割线

```vue
<DropdownItem divider />
```

### 不同尺寸

```vue
<DropdownItem value="small" size="sm">小尺寸</DropdownItem>
<DropdownItem value="medium" size="md">中尺寸（默认）</DropdownItem>
<DropdownItem value="large" size="lg">大尺寸</DropdownItem>
```

### 复杂内容

```vue
<DropdownItem value="complex" icon="Plus" size="lg">
  <div class="flex flex-col">
    <span class="font-medium">添加成员</span>
    <span class="text-xs text-gray-500">邀请新成员加入团队</span>
  </div>
</DropdownItem>
```

## 完整示例

```vue
<template>
  <Dropdown @select="handleSelect" trigger="click" placement="bottom">
    <template #trigger>
      <div class="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center gap-2">
        <MoreHorizontal class="h-5 w-5" />
        <span>更多操作</span>
      </div>
    </template>
    
    <DropdownItem value="add" icon="Plus" size="lg">
      <div class="flex flex-col">
        <span class="font-medium">添加成员</span>
        <span class="text-xs text-gray-500">邀请新成员加入团队</span>
      </div>
    </DropdownItem>
    
    <DropdownItem value="edit" icon="Edit">
      编辑信息
    </DropdownItem>
    
    <DropdownItem divider />
    
    <DropdownItem value="archive" icon="Archive">
      归档
    </DropdownItem>
    
    <DropdownItem value="delete" icon="Trash2" danger>
      删除
    </DropdownItem>
  </Dropdown>
</template>

<script setup>
import Dropdown from '@/components/common/Dropdown.vue';
import DropdownItem from '@/components/common/DropdownItem.vue';
import { MoreHorizontal, Plus, Edit, Archive, Trash2 } from 'lucide-vue-next';

const handleSelect = (value) => {
  console.log('选择了:', value);
  // 处理选择逻辑
};
</script>
```

## API 参考

### Dropdown Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| trigger | string | 'click' | 触发方式：'click' \| 'hover' \| 'contextmenu' \| 'click-hover' \| 'click-contextmenu' \| 'hover-contextmenu' \| 'all' |
| placement | string | 'bottom' | 位置：'bottom' \| 'top' \| 'left' \| 'right' \| 'bottom-start' \| 'bottom-end' \| 'top-start' \| 'top-end' \| 'left-start' \| 'left-end' \| 'right-start' \| 'right-end' |
| offset | number | 8 | 偏移距离 |
| delay | number | 200 | 悬浮延迟时间（毫秒） |
| disabled | boolean | false | 是否禁用 |
| autoClose | boolean | true | 选择后是否自动关闭 |
| triggerClass | string | '' | 触发元素的自定义类名 |
| menuClass | string | '' | 菜单的自定义类名 |

### Dropdown Events

| 事件 | 参数 | 说明 |
|------|------|------|
| visibleChange | (visible: boolean) | 显示状态变化时触发 |
| select | (value: any) | 选择菜单项时触发 |

### DropdownItem Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | any | - | 菜单项的值 |
| disabled | boolean | false | 是否禁用 |
| divider | boolean | false | 是否为分割线 |
| icon | any | - | 图标组件 |
| suffix | any | - | 后缀图标组件 |
| danger | boolean | false | 是否为危险操作 |
| size | string | 'md' | 尺寸：'sm' \| 'md' \| 'lg' |

### DropdownItem Events

| 事件 | 参数 | 说明 |
|------|------|------|
| click | (event: MouseEvent) | 点击时触发 |

## 样式定制

组件使用 Tailwind CSS 类名，你可以通过以下方式自定义样式：

### 自定义触发元素样式

```vue
<Dropdown trigger-class="custom-trigger">
  <template #trigger>
    <button class="custom-button">自定义按钮</button>
  </template>
</Dropdown>
```

### 自定义菜单样式

```vue
<Dropdown menu-class="custom-menu">
  <!-- 内容 -->
</Dropdown>
```

### 全局样式覆盖

```css
/* 自定义下拉菜单样式 */
.dropdown-menu {
  @apply bg-white border border-gray-200 rounded-lg shadow-lg;
}

/* 自定义菜单项样式 */
.dropdown-item {
  @apply px-4 py-2 hover:bg-gray-100 transition-colors;
}
```

## 注意事项

1. **图标组件**：需要传入 Vue 组件，推荐使用 Lucide Vue Next 图标库
2. **定位计算**：组件会自动检测视口边界并调整位置
3. **键盘导航**：支持 Enter、Space、Escape 键操作
4. **可访问性**：包含适当的 ARIA 属性和角色
5. **深色模式**：自动适配系统深色模式偏好

## 在 IM 组件中的使用

```vue
<template>
  <div class="group-member-title flex justify-between items-center">
    <div>群成员（{{ members.length }}）</div>
    <ChatDropdown @select="handleMenuSelect" />
  </div>
</template>

<script setup>
import ChatDropdown from './ChatDropdown.vue';

const handleMenuSelect = (value) => {
  switch (value) {
    case 'add':
      // 处理添加成员
      break;
    case 'delete':
      // 处理删除会话
      break;
  }
};
</script>
``` 