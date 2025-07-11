import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import Layout from '@/layout/MainLayout.vue';
import { useUserStore } from '@/stores/user';

// 白名单路由
const whiteList = ['/auth', '/invite/operate'];

// 检查用户是否已登录
const isAuthenticated = (): boolean => {
  const userStore = useUserStore();
  return !!userStore.token;
};

// 静态路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/auth',
    component: () => import('@/pages/auth/index.vue'),
    meta: { hidden: true }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    meta: { title: '', icon: 'homepage', affix: true },
    children: [
      {
        path: 'dashboard',
        component: () => import('@/pages/dashboard/index.vue'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'homepage', affix: true }
      },
      {
        path: 'my-groups',
        component: () => import('@/pages/MyGroups/index.vue'),
        name: 'MyGroups',
        meta: { title: '我的团队', icon: 'homepage', affix: true }
      },
      {
        path: 'all-files',
        component: () => import('@/pages/AllFiles/index.vue'),
        name: 'AllFiles',
        meta: { title: '所有文件', icon: 'homepage', affix: true }
      }
    ]
  },
  {
    path: '/im',
    component: () => import('@/modules/IM/index.vue'),
    name: 'IM',
    meta: { title: 'IM', icon: 'homepage', affix: true }
  },
  {
    path: '/group-details/:id',
    component: () => import('@/pages/GroupDetails/index.vue'),
    meta: { hidden: true }
  },
  // 邀请操作
  {
    path: '/invite/operate',
    name: 'InviteOperate',
    component: () => import('@/pages/invite/Operate.vue'),
    meta: { hidden: true, public: true } // 可选，表示无需登录即可访问
  },
  // 测试
  {
    path: '/test',
    component: () => import('@/components/common/DropdownDemo.vue'),
    meta: { hidden: true }
  },
  // 404 页面路由
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/pages/error/404.vue'),
    meta: { hidden: true }
  }
];

// 创建路由
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes as RouteRecordRaw[],
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 })
});

// 路由守卫
router.beforeEach((to, _, next) => {
  const isLoggedIn = isAuthenticated();

  // 如果用户已登录且访问登录页，重定向到首页
  if (isLoggedIn && to.path === '/auth') {
    next({ path: '/' });
    return;
  }

  // 如果用户未登录且访问的不是白名单页面，重定向到登录页
  if (!isLoggedIn && !whiteList.includes(to.path)) {
    next({ path: '/auth', query: { redirect: to.fullPath } });
    return;
  }

  next();
});

export default router;
