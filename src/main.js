import { createApp } from 'vue'
import App from './App.vue'
// import router from './router/router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 引入全局样式
import './assets/css/index.css'



createApp(App)
    // .use(router)
    .use(ElementPlus)
    .mount('#app')
