import { createApp } from 'vue';
import '@/styles/main.scss';
import '@/styles/tailwindInit.css';
import App from './App.vue';
import ElementPlus from 'element-plus';
import router from '@/router';

const app = createApp(App);
app.use(ElementPlus).use(router);
app.mount('#app');
