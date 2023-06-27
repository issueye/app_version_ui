<template>
    <div class="content-box">
        <div class="header-box">
            <div class="project-name-box">
                <span class="board-box">.</span> {{ repoInfo.project_name }}
            </div>
            <div>
                <el-button type="primary">查看迭代内容</el-button>
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
                        <el-form-item label="发布类型">
                            <el-select v-model="detailForm.tag" placeholder="请选择 tag" @change="tagChange">
                                <el-option v-for="item in tagOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="分支">
                            <el-select v-model="detailForm.branch" :clearable="true" placeholder="请选择分支"
                                @change="branchChange">
                                <el-option v-for="item in branchOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <!-- 明细表格 -->
        <el-table :data="tableData" border stripe style="width: 100%" height="70vh">
            <el-table-column fixed prop="app_name" label="名称" width="300" show-overflow-tooltip />
            <el-table-column prop="version" label="版本" width="200" show-overflow-tooltip />
            <el-table-column prop="tag" label="TAG" width="120" />
            <el-table-column prop="create_at" label="创建时间" width="230" />
            <el-table-column prop="content" label="内容" min-width="300" show-overflow-tooltip />
            <el-table-column prop="branch" label="分支" width="150" show-overflow-tooltip />
            <el-table-column prop="commit_hash" label="提交HASH" width="300" show-overflow-tooltip />
            <el-table-column fixed="right" label="操作" width="150" align="center">
                <template #default="props">
                    <el-button link type="primary" size="small" @click="removeVersionClick(props.row)">移除</el-button>
                    <el-button link type="primary" size="small" @click="viewInfoClick(props.row)">查看</el-button>
                    <el-button link type="primary" size="small" @click="appCompileClick(props.row)">编译</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-box">
            <el-pagination small background layout="prev, pager, next" :current-page="current" :total="total"
                @current-change="currentChange" />
        </div>
    </div>

    <!-- 版本信息 -->
    <el-dialog :title="versionTitle" v-model="versionDialogVisible" :close-on-click-modal="false" top="5px"
        @open="handleOpenDialogOpen" width="40%">
        <VersionEdit @visible="versionEditClose" />
    </el-dialog>
    <!-- 编辑运行脚本 -->
    <el-dialog title="编辑代码" v-model="codeEditVisible" fullscreen @open="editCodeOpen" @close="editCodeClose">
        <CodeEdit />
    </el-dialog>
    <!-- 程序信息 -->
    <el-dialog title="程序" v-model="appDialogVisible" :close-on-click-modal="false" top="5px" @open="openAppDialog">
        <CompileEdit />
    </el-dialog>
    <!-- 下载程序 -->
    <el-dialog title="程序管理" v-model="downDialogVisible" :close-on-click-modal="false" top="5px" @open="openDownDialog" width="55%" :destroy-on-close="true">
        <Down />
    </el-dialog>
</template>

<script setup name="workspaces">
import { reactive, ref, onMounted, onUnmounted } from "vue"

import { apiVersionList, apiVersionRemove } from "../../api/repo";
import { ElMessage, ElMessageBox } from "element-plus";
import bus from "../../bus";
import "codemirror/mode/javascript/javascript.js";
import CodeEdit from './codeEdit.vue'
import CompileEdit from './compileEdit.vue'
import VersionEdit from './versionEdit.vue'
import Down from './down.vue'

// 添加版本弹窗  addVersionDialogVisible
const versionDialogVisible = ref(false);
// 弹窗标题
const versionTitle = ref('添加版本');
// 当前弹窗类型 0 添加版本 1 查看版本信息
const versionDialogType = ref(0)
// 代码编辑器显示
const codeEditVisible = ref(false)
// 程序
const appDialogVisible = ref(false)
// 下载
const downDialogVisible = ref(false)
// 分支下拉
const branchOptions = ref([])
// 发布类型下拉
const tagOptions = [
    { label: "alpha", value: "alpha" },
    { label: "beta", value: "beta" },
    { label: "rc", value: "rc" },
    { label: 'release', value: 'release' }
]


// 分页信息
const current = ref(1)
const total = ref(0)
// 仓库信息
const repoInfo = reactive({
    project_name: '',
    project_id: '',
    server_name: '',
    repo_url: '',
})
// 行数据
const rowData = ref({})
// 表格数据
const tableData = ref([]);


// 明细表单信息
const detailForm = reactive({
    tag: 'alpha',
    branch: '',
    pageNum: 1,
    repo_id: '',
    pageSize: 10,
})

onMounted(() => {
    // 仓库表格行点击
    bus.$on("mitt-repo-table-row-click", (data) => {
        console.log("mitt-repo-table-row-click => on", data);

        repoInfo.project_id = data.id
        repoInfo.project_name = data.project_name
        repoInfo.server_name = data.server_name
        repoInfo.repo_url = data.repo_url
        detailForm.repo_id = data.id

        getData()
    })

    // 仓库分支列表
    bus.$on('mitt-repo-branch', (data) => {
        branchOptions.value = []
        data.forEach((item, index) => {
            branchOptions.value.push({
                label: item.short_name,
                value: item.short_name,
            })
        })
    })
})

onUnmounted(() => {
    bus.$off("mitt-repo-table-row-click", () => { console.log("mitt-repo-table-row-click => off") })
    bus.$off("mitt-repo-branch", () => { console.log("mitt-repo-table-row-click => off") })
})



// 编辑器打开时
const editCodeOpen = () => {
    // 将 code 和 id 传到组件
    bus.$emit("mitt-code-edit-open", repoInfo)
}

// 版本编辑弹窗关闭
const versionEditClose = (val) => {
    versionDialogVisible.value = val
    getData()
}

// 编辑器关闭时
const editCodeClose = () => {
    getData()
}

// 修改脚本
const editCodeClick = () => {
    // 没有选择中
    if (repoInfo.project_id == '') {
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
    if (repoInfo.project_id == '') {
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

// 打开程序弹窗
const openAppDialog = () => {
    bus.$emit('mitt-compile-edit-open', rowData.value)
}

// 打开下载管理
const openDownDialog = () => {
    bus.$emit('mitt-down-open', {
        repo: repoInfo,
        branch: branchOptions.value,
    })
}


// 添加版本点击按钮
const handleOpenDialogOpen = () => {
    if (versionDialogType.value == 0) {
        bus.$emit('mitt-version-edit-add', repoInfo)
    } else {
        // 查看版本信息
        bus.$emit('mitt-version-edit-view', rowData)
    }
};

// 获取版本列表
const getData = async () => {
    detailForm.pageNum = current.value
    let { data } = await apiVersionList(detailForm)
    if (data.code == 200) {
        tableData.value = data.data
        total.value = data.pageInfo.total
    }
}

getData()

// 分页
const currentChange = (val) => {
    current.value = val
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

// 程序下载
const appDownloadClick = () => {
    // 没有选择中
    if (repoInfo.project_id == '') {
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
    rowData.value = row
    appDialogVisible.value = true
}

// 查看版本信息
const viewInfoClick = (row) => {
    rowData.value = row
    versionDialogType.value = 1
    versionTitle.value = '版本信息'
    versionDialogVisible.value = true
}


</script>

<style scoped>
.header-box {
    display: flex;
    justify-content: space-between;
}

.project-name-box{
    font-size: 20px;
}

.board-box{
    display:inline-block;
    background: #1a94bc;
    width: 5px;
    height: 30px;
    color: #1a94bc;
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
}

</style>
