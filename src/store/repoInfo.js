import { defineStore } from 'pinia';
import { apiBranchList, apiBranchRefresh, apiRepoCreate, apiRepoModify, apiRepoList, apiRepoDel } from '../api/repo'
import { ArrObjItemDedup } from '../utils/utils'
import useVersionInfoStore from './versionInfo';
import { ElMessage, ElMessageBox } from 'element-plus';

// 仓库状态
const repoInfoStore = defineStore('repoInfo', {

    state: () => {
        return {
            id: '',             // 仓库编码
            project_name: '',   // 仓库名称
            server_name: '',    // 服务名称
            repo_url: '',       // 仓库地址
            create_at: '',      // 创建时间

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
            // 表格数据
            tableData: [],
            qryForm: {
                condition: '',
            },
            // 表单
            form: {
                id: '',
                project_name: '',
                server_name: '',
                repo_url: '',
                proxy_url: '',
                proxy_user: '',
                proxy_pwd: '',
            }
        }
    },

    actions: {
        async getData() {
            let { data } = await apiRepoList();
            if (data.code == 200) {
                this.tableData = data.data;
            }
        },
        // 赋值
        setInfo(data) {
            this.id = data.id
            this.project_name = data.project_name
            this.server_name = data.server_name
            this.repo_url = data.repo_url
            this.create_at = data.create_at

            let versionInfoStore = useVersionInfoStore();
            versionInfoStore.detailForm.repo_id = this.id
            this.getBranchList()
            versionInfoStore.getData()
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
        // 创建
        async create() {
            // 添加
            let { data } = await apiRepoCreate(this.form)
            if (data.code == 200) {
                ElMessage({
                    type: 'success',
                    message: data.message,
                })

                this.getData()
                return true
            }
        },
        // 修改
        async modify() {
            // 修改
            let { data } = await apiRepoModify(this.form)
            if (data.code == 200) {
                ElMessage({
                    type: 'success',
                    message: data.message,
                })

                this.getData()
                return true
            }
        },
        // 获取表格数据
        async getData() {
            let { data } = await apiRepoList(this.qryForm)
            if (data.code == 200) {
                console.log('getData => ', data.data);
                this.tableData = data.data
            }
        },

        remove(id) {
            ElMessageBox.confirm("是否移除仓库", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(async () => {
                    let { data } = await apiRepoDel(id);
                    if (data.code == 200) {
                        ElMessage({
                            type: "success",
                            message: data.message,
                        });
                    }
                })
                .finally(() => {
                    this.getData();
                });
        },

        // 查看表格数据
        async viewData(row) {
            this.form.id = row.id
            this.form.project_name = row.project_name
            this.form.server_name = row.server_name
            this.form.repo_url = row.repo_url
            this.form.proxy_url = row.proxy_url
            this.form.proxy_user = row.proxy_user
            this.form.proxy_pwd = row.proxy_pwd
        },
        // 清除表单
        resetForm() {
            this.form.id = ''
            this.form.project_name = ''
            this.form.server_name = ''
            this.form.repo_url = ''
            this.form.mark = ''
            this.form.proxy_url = ''
            this.form.proxy_user = ''
            this.form.proxy_pwd = ''
        }
    }
})


export default repoInfoStore;