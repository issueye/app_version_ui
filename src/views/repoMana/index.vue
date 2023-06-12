<template>
    <div class="content-box">
        <div class="header-button-box">
            <el-button type="primary" @click="addRepoClick">添加仓库</el-button>
        </div>

        <el-table :data="tableData" border stripe style="width: 100%">
            <el-table-column fixed prop="project_name" label="项目名称" width="150" />
            <el-table-column fixed prop="server_name" label="服务名称" width="300" />
            <el-table-column prop="repo_url" label="仓库地址" width="300" />
            <el-table-column prop="mark" label="备注" min-width="300" />
            <el-table-column prop="create_at" label="创建时间" width="120" />
            <el-table-column fixed="right" label="操作" width="180">
                <template #default="props">
                    <el-button link type="primary" size="small" @click="handleClick">工作台</el-button>
                    <el-button link type="primary" size="small" @click="editClick(props.row)">编辑</el-button>
                    <el-button link type="primary" size="small">移除</el-button>
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
                <el-button type="primary" @click="repoDialogClick">确定</el-button>
                <el-button @click="repoVisible = false">取消</el-button>
            </div>
        </div>
    </el-dialog>

    <el-dialog class="workspaces-box" v-model="workspacesVisible" top="5px" :close-on-click-modal="false" title="工作台"
        width="80%" :before-close="handleClose">
        <Workspaces />
    </el-dialog>
</template>

<script setup name="repoMana">
import { reactive, ref } from 'vue'
import Workspaces from '../workspaces/index.vue'

const workspacesVisible = ref(false)
const repoVisible = ref(false)
const repoTitle = ref('添加仓库')

const detailData = [
    { name: 'main', version: 'v2.1', mark: '主分支' },
    { name: 'main', version: 'v2.1', mark: '主分支' },
    { name: 'main', version: 'v2.1', mark: '主分支' },
    { name: 'main', version: 'v2.1', mark: '主分支' },
]

const form = reactive({
    project_name: '',
    server_name: '',
    repo_url: '',
    mark: '',
})

const tableData = [
    {
        project_name: '排队叫号',
        server_name: 'LineServer',
        repo_url: '',
        head: 'main',
        mark: '这是一个排队叫号后台服务',
        create_at: '2016-05-03',
    },
    {
        project_name: '排队叫号',
        server_name: 'LineServer',
        repo_url: '',
        head: 'main',
        mark: '这是一个排队叫号后台服务',
        create_at: '2016-05-03',
    },
    {
        project_name: '排队叫号',
        server_name: 'LineServer',
        repo_url: '',
        head: 'main',
        mark: '这是一个排队叫号后台服务',
        create_at: '2016-05-03',
    },
    {
        project_name: '排队叫号',
        server_name: 'LineServer',
        repo_url: '',
        head: 'main',
        mark: '这是一个排队叫号后台服务',
        create_at: '2016-05-03',
    },
]


const handleClick = () => {
    workspacesVisible.value = true
}

const editClick = (row) => {
    console.log('row', row);
    form.project_name = row.project_name
    form.server_name = row.server_name
    form.repo_url = row.repo_url
    form.mark = row.mark

    repoTitle.value = '修改仓库信息'
    repoVisible.value = true
}

const addRepoClick = () => {
    repoTitle.value = '添加仓库'
    repoVisible.value = true
}

</script>

<style scoped>
.header-button-box{
    margin-bottom: 30px;
}

.repo-dialog-footer-box{
    text-align: end;
}

.repo-dialog-box{
    margin-right: 30px;
}

.detail-table-box {
    width: 400px;
    margin-left: 10px;
}
</style>
