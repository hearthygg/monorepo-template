import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import Layout from '@/layout/MainLayout.vue';
// 静态路由
export const constantRoutes: RouteRecordRaw[] = [
  // {
  //   path: '/redirect',
  //   component: Layout,
  //   meta: { hidden: true },
  //   children: [
  //     {
  //       path: '/redirect/:path(.*)',
  //       component: () => import('@/views/redirect/index.vue')
  //     }
  //   ]
  // },
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
    path: '/group-details/:id',
    component: () => import('@/pages/GroupDetails/index.vue'),
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

export default router;
