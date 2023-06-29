import { defineStore } from 'pinia';
import { apiVersionList } from "../api/repo";

const versionInfoStore = defineStore('versionInfo', {

    state: () => {
        return {
            id: '',                 // 版本编码
            versionDialogType : 0,   // 版本 0 添加版本 1 查看版本信息

            // 版本行数据
            rowData: {}, 
            // 表格数据
            tableData: [],

            // form
            detailForm: {
                tag: '',
                branch: '',
                pageNum: 1,
                repo_id: '',
                pageSize: 10,
                total: 0,
            }
        }
    },


    actions: {
        // 获取数据
        async getData() {
            let { data } = await apiVersionList(this.detailForm)
            if (data.code == 200) {
                this.tableData = data.data
                this.detailForm.total = data.pageInfo.total
            }
        },
    },
})

export default versionInfoStore;