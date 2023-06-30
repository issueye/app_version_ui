<template>
    <div class="content-box">
        <div class="header-box">
            <div class="project-name-box">
                <span class="board-box">.</span> {{ project_name }}
            </div>
            <div>
                <el-button type="primary" @click="refreshClick">刷新分支列表</el-button>
                <el-button type="primary" @click="appTreeClick">查看迭代内容</el-button>
                <el-button type="primary" @click="appDownloadClick">下载程序</el-button>
                <el-button type="primary" @click="editCodeClick">编辑脚本</el-button>
                <el-button type="primary" @click="handleAddVersionClick">添加版本</el-button>
            </div>
        </div>
        <el-divider class="header-divider" />
        <!-- 版本内容 -->
        <div class="content-detail-box">
            <el-form :model="detailForm" label-width="75px">
                <el-row>
                    <el-col :span="5">
                        <el-form-item label="发布类型:">
                            <el-select v-model="detailForm.tag" :clearable="true" placeholder="请选择 tag" @change="tagChange">
                                <el-option v-for="item in tagOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="分支:">
                            <el-select v-model="detailForm.branch" :clearable="true" placeholder="请选择分支"
                                @change="branchChange">
                                <el-option v-for="item in branchOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <!-- 明细表格 -->
            <el-table :data="tableData" border stripe style="width: 100%" height="72vh">
                <el-table-column fixed prop="app_name" label="名称" width="300" show-overflow-tooltip />
                <el-table-column prop="version" label="版本" width="200" show-overflow-tooltip />
                <el-table-column prop="tag" label="TAG" width="120" />
                <el-table-column prop="create_at" label="创建时间" width="230" />
                <el-table-column prop="content" label="内容" min-width="300" show-overflow-tooltip />
                <el-table-column prop="branch" label="分支" width="150" show-overflow-tooltip />
                <el-table-column prop="commit_hash" label="提交HASH" width="300" show-overflow-tooltip />
                <el-table-column fixed="right" label="操作" width="150" align="center">
                    <template #default="props">
                        <el-button link type="primary" size="small" @click="viewInfoClick(props.row)">查看</el-button>
                        <el-button link type="primary" size="small" @click="appCompileClick(props.row)">编译</el-button>
                        <el-button link type="danger" size="small" @click="removeVersionClick(props.row)">移除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-box">
                <el-pagination small background layout="->, slot, total, prev, pager, next, jumper" :current-page="current" :total="detailForm.total"
                    @current-change="currentChange" />
            </div>
        </div>
    </div>

    <!-- 版本信息 -->
    <el-dialog :title="versionTitle" v-model="versionDialogVisible" :close-on-click-modal="false" destroy-on-close top="5px"
        width="40%">
        <VersionEdit @visible="versionEditClose" />
    </el-dialog>
    <!-- 编辑运行脚本 -->
    <el-dialog title="编辑代码" v-model="codeEditVisible" fullscreen @close="editCodeClose">
        <CodeEdit />
    </el-dialog>
    <!-- 程序信息 -->
    <el-dialog title="程序" v-model="appDialogVisible" :close-on-click-modal="false" top="5px">
        <CompileEdit />
    </el-dialog>
    <!-- 下载程序 -->
    <el-dialog title="程序管理" v-model="downDialogVisible" :close-on-click-modal="false" top="5px" width="55%"
        :destroy-on-close="true">
        <Down />
    </el-dialog>
    <!-- 更新树 -->
    <el-dialog title="迭代记录" v-model="treeDialogVisible" :close-on-click-modal="false" top="5px" width="40%"
        :destroy-on-close="true">
        <TimeTree />
    </el-dialog>
</template>

<script setup name="workspaces">
import { reactive, ref } from "vue"

import { apiVersionList, apiVersionRemove } from "../../api/repo";
import { ElMessage, ElMessageBox } from "element-plus";
import "codemirror/mode/javascript/javascript.js";
import CodeEdit from './codeEdit.vue'
import CompileEdit from './compileEdit.vue'
import VersionEdit from './versionEdit.vue'
import Down from './down.vue'
import TimeTree from './timeTree.vue'
import useRepoInfoStore from '../../store/repoInfo';
import useVersionInfoStore from '../../store/versionInfo';
import { storeToRefs } from 'pinia';


// 仓库状态管理
let repoInfoStore = useRepoInfoStore();
let versionInfoStore = useVersionInfoStore();

const { id, project_name, branchOptions, tagOptions } = storeToRefs(repoInfoStore);
const { versionDialogType, tableData, detailForm } = storeToRefs(versionInfoStore);

const versionDialogVisible = ref(false)         // 添加版本弹窗  addVersionDialogVisible
const versionTitle = ref('添加版本')             // 弹窗标题
const codeEditVisible = ref(false)              // 代码编辑器显示
const appDialogVisible = ref(false)             // 程序
const downDialogVisible = ref(false)            // 下载
const treeDialogVisible = ref(false)            // 时间树

// 分页信息
const current = ref(1)

// 版本编辑弹窗关闭
const versionEditClose = () => {
    versionDialogVisible.value = false
    getData()
}



// 编辑器关闭时
const editCodeClose = () => {
    getData()
}

// 修改脚本
const editCodeClick = () => {
    // 没有选择中
    if (id.value == '') {
        ElMessage({
            type: 'warning',
            message: '请选择仓库',
        })
        return
    }

    codeEditVisible.value = true
}

// 添加版本
const handleAddVersionClick = () => {
    // 没有选择中
    if (id.value == '') {
        ElMessage({
            type: 'warning',
            message: '请选择仓库',
        })
        return
    }

    versionDialogType.value = 0
    versionTitle.value = '添加版本'
    versionDialogVisible.value = true
}

// tag 发生变化时
const tagChange = (val) => {
    detailForm.tag = val
    getData()
}

const branchChange = (val) => {
    detailForm.branch = val
    getData()
}

// 获取版本列表
const getData = () => {
    versionInfoStore.detailForm.pageNum = current.value
    versionInfoStore.getData()
}

getData()

// 分页
const currentChange = (val) => {
    current.value = val
    versionInfoStore.detailForm.pageNum = val
    getData()
}

// 移除版本
const removeVersionClick = (row) => {
    ElMessageBox.confirm(
        '是否移除版本',
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {
        let { data } = await apiVersionRemove(row.id)
        if (data.code == 200) {
            ElMessage({
                type: 'success',
                message: data.message,
            })
        }
    }).catch(() => {
        ElMessage({
            type: 'info',
            message: '取消移除',
        })
    }).finally(() => {
        getData()
    })
}

// 刷新分支列表
const refreshClick = () => {
    repoInfoStore.reFreshBranch()
}

// 时间树
const appTreeClick = () => {
    // 没有选择中
    if (id.value == '') {
        ElMessage({
            type: 'warning',
            message: '请选择仓库',
        })
        return
    }

    treeDialogVisible.value = true
}

// 程序下载
const appDownloadClick = () => {
    // 没有选择中
    if (id.value == '') {
        ElMessage({
            type: 'warning',
            message: '请选择仓库',
        })
        return
    }
    downDialogVisible.value = true
}

// 弹窗程序
const appCompileClick = (row) => {
    versionInfoStore.rowData = row
    appDialogVisible.value = true
}

// 查看版本信息
const viewInfoClick = (row) => {
    versionDialogType.value = 1
    id.value = row.id
    versionInfoStore.rowData = row

    versionTitle.value = '版本信息'
    versionDialogVisible.value = true
}


</script>

<style scoped>
.header-box {
    display: flex;
    justify-content: space-between;
    margin: 0 10px;
    margin-top: 10px;
}

.project-name-box {
    font-size: 20px;
}

.board-box {
    display: inline-block;
    background: #007AFF;
    width: 10px;
    height: 32px;
    color: #007AFF;
}

.pagination-box {
    margin-top: 10px;
}

.header-divider {
    margin-top: 10px;
    margin-bottom: 0px;
}

.content-detail-box {
    margin-top: 30px;
    margin-left: 10px;
    margin-right: 10px;
}</style>
