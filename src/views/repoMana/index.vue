<template>
    <div class="content-box">
        <div class="step-content-box">

        </div>

        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column fixed type="expand">
                <template #default="props">
                    <div class="detail-table-box">
                        <el-table :data="detailData" border stripe style="width: 100%">
                            <el-table-column prop="name" label="分支名称" width="180" />
                            <el-table-column prop="version" label="版本" width="180" />
                            <el-table-column prop="mark" label="备注" />
                        </el-table>
                    </div>
                </template>
            </el-table-column>
            <el-table-column fixed prop="name" label="名称" width="150" />
            <el-table-column prop="repo_url" label="仓库地址" width="300" />
            <el-table-column prop="mark" label="备注" min-width="300" />
            <el-table-column prop="create_at" label="创建时间" width="120" />
            <el-table-column fixed="right" label="操作" width="180">
                <template #default>
                    <el-button link type="primary" size="small" @click="handleClick">工作台</el-button>
                    <el-button link type="primary" size="small">移除</el-button>
                    <el-button link type="primary" size="small">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>

    <el-dialog class="workspaces-box" v-model="workspacesVisible" top="5px" :close-on-click-modal="false" title="工作台"
        width="95%" :before-close="handleClose">
        <Workspaces />
    </el-dialog>
</template>

<script setup name="repoMana">
import { reactive, ref } from 'vue'
import Workspaces from '../workspaces/index.vue'

const workspacesVisible = ref(false)

const detailData = [
    { name: 'main', version: 'v2.1', mark: '主分支' },
    { name: 'main', version: 'v2.1', mark: '主分支' },
    { name: 'main', version: 'v2.1', mark: '主分支' },
    { name: 'main', version: 'v2.1', mark: '主分支' },
]

const tableData = [
    {
        name: '排队叫号',
        repo_url: '',
        head: 'main',
        mark: '这是一个排队叫号后台服务',
        create_at: '2016-05-03',
    },
    {
        name: '排队叫号',
        repo_url: '',
        head: 'main',
        mark: '这是一个排队叫号后台服务',
        create_at: '2016-05-03',
    },
    {
        name: '排队叫号',
        repo_url: '',
        head: 'main',
        mark: '这是一个排队叫号后台服务',
        create_at: '2016-05-03',
    },
    {
        name: '排队叫号',
        repo_url: '',
        head: 'main',
        mark: '这是一个排队叫号后台服务',
        create_at: '2016-05-03',
    },
]


const handleClick = () => {
    workspacesVisible.value = true
}

</script>

<style scoped>
.workspaces-box {
    /* padding: 10px; */
}



.detail-table-box {
    margin-right: 30%;
    margin-left: 10px;
}
</style>
