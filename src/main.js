import { createApp } from 'vue'
import App from './App.vue'
// import router from './router/router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 引入全局样式
import './assets/css/index.css'
import { createPinia } from 'pinia';


const pinia = createPinia();

createApp(App)
    // .use(router)
    .use(pinia)
    .use(ElementPlus)
    .mount('#app')
