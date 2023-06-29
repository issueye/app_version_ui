import { defineStore } from 'pinia';

const versionInfoStore = defineStore('versionInfo', {

    state: () => {
        return {
            id: '',                 // 版本编码
            versionDialogType : 0,   // 版本 0 添加版本 1 查看版本信息

            // 版本行数据
            rowData: {},            
        }
    },


    actions: {

    },
})

export default versionInfoStore;