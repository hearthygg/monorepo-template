<template>
  <nav class="nav-container" :class="{ dark: isDark, collapsed: isCollapsed }">
    <div class="nav-header">
      <h1 v-if="!isCollapsed" class="nav-title">导航</h1>
      <button class="collapse-toggle" @click="toggleCollapse">
        <el-icon>
          <component :is="isCollapsed ? 'Expand' : 'Fold'" />
        </el-icon>
      </button>
    </div>

    <div class="nav-menu">
      <div v-for="item in menuItems" :key="item.id" class="nav-item-wrapper">
        <!-- 一级菜单 -->
        <a
          class="nav-item"
          :class="{
            active: activeItem === item.id || activeParent === item.id,
            'has-children': hasChildren(item)
          }"
          @click="handleItemClick(item)"
        >
          <el-icon class="nav-icon">
            <component :is="item.icon" />
          </el-icon>
          <span v-if="!isCollapsed" class="nav-label">{{ item.label }}</span>
          <el-icon v-if="hasChildren(item) && !isCollapsed" class="arrow-icon">
            <component :is="isExpanded(item.id) ? 'ArrowDown' : 'ArrowRight'" />
          </el-icon>
        </a>

        <!-- 二级菜单 -->
        <div v-if="hasChildren(item) && isExpanded(item.id) && !isCollapsed" class="submenu">
          <a v-for="child in item.children" :key="child.id" class="submenu-item" :class="{ active: activeItem === child.id }" @click="handleSubItemClick(item.id, child.id)">
            <div class="submenu-dot"></div>
            <span class="submenu-label">{{ child.label }}</span>
          </a>
        </div>
      </div>
    </div>

    <div class="nav-footer">
      <button class="theme-toggle" @click="toggleTheme">
        <el-icon>
          <component :is="isDark ? 'Sunny' : 'Moon'" />
        </el-icon>
        <span v-if="!isCollapsed">{{ isDark ? '浅色模式' : '深色模式' }}</span>
      </button>
    </div>

    <!-- 悬浮子菜单 (当导航栏折叠时) -->
    <div v-if="isCollapsed && hoverItem && hasChildren(hoverItem)" class="floating-submenu" :style="floatingMenuStyle" :class="{ dark: isDark }">
      <div class="floating-submenu-title">{{ hoverItem.label }}</div>
      <a v-for="child in hoverItem.children" :key="child.id" class="floating-submenu-item" :class="{ active: activeItem === child.id }" @click="handleSubItemClick(hoverItem.id, child.id)">
        <span class="submenu-label">{{ child.label }}</span>
      </a>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue';
import { HomeFilled, DataLine, User, Setting, Document } from '@element-plus/icons-vue';

const isDark = ref(false);
const isCollapsed = ref(false);
const activeItem = ref('home');
const activeParent = ref(null);
const expandedMenus = ref(['analytics']);
const hoverItem = ref(null);
const hoverPosition = ref({ top: 0 });

// 菜单数据
const menuItems = [
  {
    id: 'home',
    label: '首页',
    icon: HomeFilled,
    path: '/'
  },
  {
    id: 'analytics',
    label: '统计分析',
    icon: DataLine,
    children: [
      {
        id: 'overview',
        label: '数据概览',
        path: '/analytics/overview'
      },
      {
        id: 'reports',
        label: '统计报表',
        path: '/analytics/reports'
      },
      {
        id: 'trends',
        label: '趋势分析',
        path: '/analytics/trends'
      }
    ]
  },
  {
    id: 'users',
    label: '用户管理',
    icon: User,
    children: [
      {
        id: 'user-list',
        label: '用户列表',
        path: '/users/list'
      },
      {
        id: 'user-roles',
        label: '角色权限',
        path: '/users/roles'
      }
    ]
  },
  {
    id: 'content',
    label: '内容管理',
    icon: Document,
    children: [
      {
        id: 'articles',
        label: '文章管理',
        path: '/content/articles'
      },
      {
        id: 'categories',
        label: '分类管理',
        path: '/content/categories'
      }
    ]
  },
  {
    id: 'settings',
    label: '设置',
    icon: Setting,
    path: '/settings'
  }
];

// 计算悬浮菜单的样式
const floatingMenuStyle = computed(() => {
  return {
    top: `${hoverPosition.value.top}px`,
    left: '60px' // 折叠后的导航宽度
  };
});

// 检查菜单项是否有子菜单
const hasChildren = item => {
  return item.children && item.children.length > 0;
};

// 检查菜单是否展开
const isExpanded = id => {
  return expandedMenus.value.includes(id);
};

// 切换菜单展开/折叠状态
const toggleExpand = id => {
  if (expandedMenus.value.includes(id)) {
    expandedMenus.value = expandedMenus.value.filter(item => item !== id);
  } else {
    expandedMenus.value.push(id);
  }
};

// 处理一级菜单点击
const handleItemClick = item => {
  if (hasChildren(item)) {
    if (isCollapsed.value) {
      // 折叠状态下，显示悬浮子菜单
      const menuElement = event.currentTarget;
      const rect = menuElement.getBoundingClientRect();
      hoverItem.value = item;
      hoverPosition.value = { top: rect.top };
    } else {
      // 展开状态下，切换子菜单的展开状态
      toggleExpand(item.id);
    }
    activeParent.value = item.id;
  } else {
    // 没有子菜单，直接激活
    activeItem.value = item.id;
    activeParent.value = null;
    // 这里可以添加路由导航逻辑
    console.log('Navigate to:', item.path);
  }
};

// 处理二级菜单点击
const handleSubItemClick = (parentId, childId) => {
  activeItem.value = childId;
  activeParent.value = parentId;
  // 清除悬浮菜单
  hoverItem.value = null;
  // 这里可以添加路由导航逻辑
  const parent = menuItems.find(item => item.id === parentId);
  const child = parent.children.find(item => item.id === childId);
  console.log('Navigate to:', child.path);
};

// 切换主题
const toggleTheme = () => {
  isDark.value = !isDark.value;
};

// 切换导航栏展开/折叠
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
  // 折叠时清除悬浮菜单
  if (isCollapsed.value) {
    hoverItem.value = null;
  }
};
</script>

<style>
.nav-container {
  width: 200px;
  height: 100vh;
  background-color: #ffffff;
  border-right: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  position: relative;
}

.nav-container.collapsed {
  width: 60px;
}

.nav-container.dark {
  background-color: #1a1a1a;
  border-right-color: #2a2a2a;
}

.nav-header {
  height: 60px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f0f0f0;
}

.nav-container.collapsed .nav-header {
  justify-content: center;
  padding: 0;
}

.dark .nav-header {
  border-bottom-color: #2a2a2a;
}

.nav-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin: 0;
}

.dark .nav-title {
  color: #ffffff;
}

.collapse-toggle {
  background: transparent;
  border: none;
  color: #666;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.collapse-toggle:hover {
  background-color: #f5f5f5;
}

.dark .collapse-toggle {
  color: #ffffff;
}

.dark .collapse-toggle:hover {
  background-color: #2a2a2a;
}

.nav-menu {
  flex: 1;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
}

.nav-container.collapsed .nav-menu {
  padding: 12px 8px;
  align-items: center;
}

.nav-item-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.nav-item {
  height: 40px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #666;
  border-radius: 6px;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
}

.nav-container.collapsed .nav-item {
  justify-content: center;
  width: 44px;
  padding: 0;
}

.nav-item:hover {
  background-color: #f5f5f5;
  color: #333;
}

.nav-item.active {
  background-color: #e6f4ff;
  color: #1677ff;
}

.nav-item.has-children {
  position: relative;
}

.dark .nav-item {
  color: #999;
}

.dark .nav-item:hover {
  background-color: #2a2a2a;
  color: #ffffff;
}

.dark .nav-item.active {
  background-color: #177ddc20;
  color: #177ddc;
}

.nav-icon {
  font-size: 18px;
  width: 18px;
  height: 18px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-container.collapsed .nav-icon {
  margin-right: 0;
}

.nav-label {
  font-size: 14px;
  flex: 1;
}

.arrow-icon {
  font-size: 12px;
  transition: transform 0.3s;
}

/* 子菜单样式 */
.submenu {
  margin-left: 30px;
  margin-top: 4px;
  margin-bottom: 4px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.submenu-item {
  height: 32px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #666;
  border-radius: 6px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.submenu-item:hover {
  background-color: #f5f5f5;
  color: #333;
}

.submenu-item.active {
  background-color: #e6f4ff;
  color: #1677ff;
}

.dark .submenu-item {
  color: #999;
}

.dark .submenu-item:hover {
  background-color: #2a2a2a;
  color: #ffffff;
}

.dark .submenu-item.active {
  background-color: #177ddc20;
  color: #177ddc;
}

.submenu-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #d9d9d9;
  margin-right: 8px;
}

.submenu-item.active .submenu-dot {
  background-color: #1677ff;
}

.dark .submenu-item.active .submenu-dot {
  background-color: #177ddc;
}

.submenu-label {
  font-size: 14px;
}

/* 悬浮子菜单 */
.floating-submenu {
  position: fixed;
  left: 60px;
  background-color: #ffffff;
  border-radius: 6px;
  box-shadow:
    0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 9px 28px 8px rgba(0, 0, 0, 0.05);
  padding: 8px;
  min-width: 160px;
  z-index: 1000;
}

.floating-submenu.dark {
  background-color: #1a1a1a;
  box-shadow:
    0 3px 6px -4px rgba(0, 0, 0, 0.48),
    0 6px 16px 0 rgba(0, 0, 0, 0.32),
    0 9px 28px 8px rgba(0, 0, 0, 0.2);
}

.floating-submenu-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  padding: 8px 12px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 4px;
}

.dark .floating-submenu-title {
  color: #ffffff;
  border-bottom-color: #2a2a2a;
}

.floating-submenu-item {
  height: 32px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #666;
  border-radius: 6px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.floating-submenu-item:hover {
  background-color: #f5f5f5;
  color: #333;
}

.floating-submenu-item.active {
  background-color: #e6f4ff;
  color: #1677ff;
}

.dark .floating-submenu-item {
  color: #999;
}

.dark .floating-submenu-item:hover {
  background-color: #2a2a2a;
  color: #ffffff;
}

.dark .floating-submenu-item.active {
  background-color: #177ddc20;
  color: #177ddc;
}

/* 导航底部 */
.nav-footer {
  padding: 16px;
  border-top: 1px solid #f0f0f0;
}

.nav-container.collapsed .nav-footer {
  padding: 16px 8px;
  display: flex;
  justify-content: center;
}

.dark .nav-footer {
  border-top-color: #2a2a2a;
}

.theme-toggle {
  background: transparent;
  border: none;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
  width: 100%;
}

.theme-toggle:hover {
  background-color: #f5f5f5;
}

.dark .theme-toggle {
  color: #ffffff;
}

.dark .theme-toggle:hover {
  background-color: #2a2a2a;
}
</style>
