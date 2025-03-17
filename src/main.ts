import { createApp } from 'vue';
import '@/styles/main.scss';
import '@/assets/init.css';
import App from './App.vue';
import ElementPlus from 'element-plus';
import router from '@/router';
// import 'element-plus/dist/index.css'
const app = createApp(App);
app.use(ElementPlus).use(router);
app.mount('#app');
