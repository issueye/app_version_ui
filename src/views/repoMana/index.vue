<template>
    <div class="content-box">
        <div class="header-button-box">
            <el-button type="primary" @click="addRepoClick">添加仓库</el-button>
        </div>

        <el-table :data="tableData" border height="600px" stripe style="width: 100%">
            <el-table-column fixed prop="project_name" label="项目名称" width="300" />
            <el-table-column fixed prop="server_name" label="服务名称" width="300" />
            <el-table-column prop="repo_url" label="仓库地址" min-width="300" />
            <el-table-column prop="create_at" label="创建时间" width="230" />
            <el-table-column fixed="right" label="操作" width="180">
                <template #default="props">
                    <el-button link type="primary" size="small" @click="handleClick(props.row)">工作台</el-button>
                    <el-button link type="primary" size="small" @click="editClick(props.row)">编辑</el-button>
                    <el-button link type="primary" size="small" @click="removeRepoClick(props.row)">移除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>

    <el-dialog top="5px" v-model="repoVisible" :close-on-click-modal="false" :title="repoTitle">
        <div class="repo-dialog-box">
            <el-form :model="form" label-width="120px">
                <el-form-item label="项目名称">
                    <el-input v-model="form.project_name" />
                </el-form-item>
                <el-form-item label="服务名称">
                    <el-input v-model="form.server_name" />
                </el-form-item>
                <el-form-item label="仓库地址">
                    <el-input v-model="form.repo_url" />
                </el-form-item>
            </el-form>

            <div class="repo-dialog-footer-box">
                <el-button type="primary" @click="repoSaveClick">确定</el-button>
                <el-button @click="repoVisible = false">取消</el-button>
            </div>
        </div>
    </el-dialog>

    <el-dialog v-model="workspacesVisible" top="5px" :close-on-click-modal="false" title="工作台"
        width="80%" :before-close="handleClose">
        <div class="workspaces-box">
            <Workspaces :server_name="form.server_name" :project_id="form.id" :project_name="form.project_name" />
        </div>
    </el-dialog>
</template>

<script setup name="repoMana">
import { reactive, ref } from 'vue'
import Workspaces from '../workspaces/index.vue'
import { apiRepoCreate, apiRepoDel, apiRepoList, apiRepoModify } from '../../api/repo';
import { ElMessage, ElMessageBox } from 'element-plus';

const workspacesVisible = ref(false)
const repoVisible = ref(false)
const repoTitle = ref('添加仓库')
const operationType = ref(0) // 0 添加 1 编辑


const form = reactive({
    id: '',
    project_name: '',
    server_name: '',
    repo_url: '',
})

const tableData = ref([])


// 工作台
const handleClick = (row) => {
    form.id = row.id
    form.project_name = row.project_name
    form.server_name = row.server_name
    form.repo_url = row.repo_url

    workspacesVisible.value = true
}

// 获取仓库列表
const getData = async () => {
    let { data } = await apiRepoList()
    console.log('getdata', data);
    if (data.code == 200) {
        tableData.value = data.data
    }
}

// 打开获取仓库列表
getData()

// 移除仓库
const removeRepoClick = async (row) => {
    ElMessageBox.confirm(
        '是否移除仓库',
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {

        let { data } = await apiRepoDel(row.id)
        if (data.code == 200) {
            ElMessage({
                type: 'success',
                message: data.message,
            })
        }
    }).finally(() => {
        getData()
    })
}

// 保存信息
const repoSaveClick = async () => {
    try {
        if (operationType.value == 0) {
            // 添加
            let { data } = await apiRepoCreate(form)
            if (data.code == 200) {
                ElMessage({
                    type: 'success',
                    message: data.message,
                })
            }
        } else {
            // 修改
            let { data } = await apiRepoModify(form)
            if (data.code == 200) {
                ElMessage({
                    type: 'success',
                    message: data.message,
                })
            }
        }
    } finally {
        repoVisible.value = false
        getData()
    }
}

// 编辑仓库
const editClick = (row) => {
    form.project_name = row.project_name
    form.server_name = row.server_name
    form.repo_url = row.repo_url
    form.id = row.id
    repoTitle.value = '修改仓库信息'

    operationType.value = 1
    repoVisible.value = true
}

// 添加仓库
const addRepoClick = () => {
    form.project_name = ''
    form.server_name = ''
    form.repo_url = ''
    form.mark = ''
    form.id = ''

    repoTitle.value = '添加仓库'
    operationType.value = 0
    repoVisible.value = true
}

</script>

<style scoped>
.header-button-box {
    margin-bottom: 30px;
}

.workspaces-box{
    height: 73vh;
}

.repo-dialog-footer-box {
    text-align: end;
}

.repo-dialog-box {
    margin-right: 30px;
}

.detail-table-box {
    width: 400px;
    margin-left: 10px;
}
</style>
