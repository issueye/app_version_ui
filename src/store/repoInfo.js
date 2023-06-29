import { defineStore } from 'pinia';
import { apiBranchList, apiBranchRefresh } from '../api/repo'
import { ArrObjItemDedup } from '../utils/utils'


// 仓库状态
const repoInfoStore = defineStore('repoInfo', {

    state: () => {
        return {
            id: '',             // 仓库编码
            project_name: '',   // 仓库名称
            server_name: '',    // 服务名称
            repo_url: '',       // 仓库地址
            createa_at: '',     // 创建时间

            // 分支列表
            branchOptions: [],     

            // 发布类型下拉
            tagOptions: [
                { label: "alpha", value: "alpha" },
                { label: "beta", value: "beta" },
                { label: "rc", value: "rc" },
                { label: 'release', value: 'release' }
            ],

            // 分支列表data
            branchData: [],
        }
    },

    actions: {
        // 赋值
        setInfo(data) {
            this.id = data.id
            this.project_name = data.project_name
            this.server_name = data.server_name
            this.repo_url = data.repo_url
            this.createa_at = data.createa_at
        },
        // 获取分支列表
        async getBranchList() {
            let { data } = await apiBranchList(this.id)
            if (data.code == 200) {
                this.branchOptions = data.data
                this.branchOptions = []
                this.branchData = data.data
                
                data.data.forEach((item, index) => {
                    let data = item.short_name.split('/')
                    let value = data[data.length - 1]
                    this.branchOptions.push({
                        label: value,
                        value: value,
                    })
                })

                this.branchOptions = ArrObjItemDedup(this.branchOptions)
            } else {
                ElMessage({
                    type: 'error',
                    message: data.message,
                })
            }
        },
        // 刷新分支列表
        async reFreshBranch() {
            let { data } = await apiBranchRefresh(this.id)
            if (data.code == 200) {
                this.branchList = data.data
            } else {
                ElMessage({
                    type: 'error',
                    message: data.message,
                })
            }
        },
    }
})


export default repoInfoStore;