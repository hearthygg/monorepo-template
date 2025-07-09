import { createApp } from 'vue';
import '@/styles/main.scss';
import '@/styles/tailwindInit.css';
import App from './App.vue';
import ElementPlus from 'element-plus';
import router from '@/router';
import { createPinia } from 'pinia';
import { useUserStore } from './stores/user';
import { initIconify } from '@/utils/iconify-config';

const app = createApp(App);

// 初始化Iconify配置
initIconify();

// 创建 Pinia 实例
const pinia = createPinia();
app.use(pinia);

// 初始化用户状态
const userStore = useUserStore();
userStore.initState();

app.use(ElementPlus).use(router);
app.mount('#app');
