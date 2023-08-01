import { defineStore } from 'pinia';
import { ElMessage, ElMessageBox } from 'element-plus';

// 仓库状态
const useBuildConfigStore = defineStore('buildConfig', {

    state: () => {
        return {
            platform: ['windows'],   // 操作系统
            arch: ['amd64'],       // 架构平台
            envList: [],        // 环境变量
            injectList: [],     // 注入变量
            git: {
                proxy: '',  // 设置代理
            }
        }
    },

    actions: {
        
    }
})


export default useBuildConfigStore;