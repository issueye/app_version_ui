import { createApp } from 'vue'
import App from './App.vue'
// import router from './router/router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 引入全局样式
import './assets/css/index.css'
import { createPinia } from 'pinia';

import locale from 'element-plus/lib/locale/lang/zh-CN' 
locale.el.pagination = {
    goto: '跳转',
    pageClassifier: '页',
    total: `共 {total} 条`
}

const pinia = createPinia();

createApp(App)
    // .use(router)
    .use(pinia)
    .use(ElementPlus, {
        locale: locale,
    })
    .mount('#app')
