import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

export const Layout = () => import('@/layouts/DefaultLayout.vue');

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
    path: '/test',
    component: () => import('@/pages/test/index.vue'),
    meta: { hidden: true }
  },
  {
    path: '/design',
    component: () => import('@/pages/design/index.vue'),
    meta: { hidden: true }
  },
  {
    path: '/eleDesign',
    component: () => import('@/pages/eleDesign/show.vue'),
    meta: { hidden: true }
  },
  {
    path: '/studentScore',
    component: () => import('@/pages/test/StudentScore.vue'),
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
      }
    ]
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
