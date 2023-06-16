<template>
    <div class="content-box">
        <div class="header-button-box">
            <el-button type="primary" @click="addRepoClick">添加仓库</el-button>
        </div>

        <!-- 表格数据 -->
        <el-table :data="tableData" border height="80vh" stripe style="width: 100%" @row-click="handleRowClick">
            <el-table-column fixed prop="project_name" label="项目名称" width="200" />
            <el-table-column prop="server_name" label="服务名称" width="200" />
            <el-table-column prop="repo_url" label="仓库地址" min-width="300" show-overflow-tooltip />
            <el-table-column prop="create_at" label="创建时间" width="230" />
            <el-table-column fixed="right" label="操作" align="center" width="180">
                <template #default="props">
                    <el-button link type="primary" size="small" @click.native.close="editClick(props.row)">编辑</el-button>
                    <el-button link type="primary" size="small"
                        @click.native.close="editCodeClick(props.row)">编辑脚本</el-button>
                    <el-button link type="primary" size="small" @click="removeRepoClick(props.row)">移除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>

    <!-- 编辑运行脚本 -->
    <el-dialog title="编辑代码" v-model="codeVisible" fullscreen @open="editCodeOpen" @close="editCodeClose">
        <div class="app-button-group-box">
            <el-button @click="testRunClick">测试运行</el-button>
            <el-button type="primary" @click="saveCodeClick">保存</el-button>
        </div>
        <el-row>
            <el-col :span="14">
                <Codemirror class="code-mirror" height="85vh" v-model:value="code" ref="cmRef" :options="cmOptions" border
                    @change="onChange" @input="onInput" @ready="onReady" />
            </el-col>
            <el-col :span="10">
                <Codemirror class="code-mirror" height="85vh" v-model:value="logInfo" ref="logcmRef" :options="logOptions" border
                    @change="onChange" @input="onInput" @ready="onReady" />
            </el-col>
        </el-row>
    </el-dialog>

    <!-- 添加编辑仓库信息 -->
    <el-dialog top="5px" v-model="repoVisible" width="40%" :close-on-click-modal="false" :title="repoTitle"
        @open="openDialog">
        <div class="repo-dialog-box">
            <el-form :model="form" label-width="80px">
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
                <el-button @click="cancelClick">取消</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script setup name="repoMana">
import { reactive, ref, onMounted, onUnmounted } from 'vue'
import { apiBranchList, apiRepoCreate, apiRepoDel, apiRepoList, apiRepoModify, apiRepoModifyCode, apiRepoTestRun } from '../../api/repo';
import { ElMessage, ElMessageBox } from 'element-plus';
import "codemirror/mode/javascript/javascript.js";
import "codemirror/theme/idea.css";
import "codemirror/addon/hint/show-hint.css";
import Codemirror from "codemirror-editor-vue3"
import bus from '../../bus';

const repoVisible = ref(false)
const repoTitle = ref('添加仓库')
const operationType = ref(0) // 0 添加 1 编辑
const codeVisible = ref(false)

// 代码
const code = ref('')
const cmOptions = {
    mode: "text/javascript",
    lineNumbers: true,
    lineWrapping: true,
}

// websocket 对象
var ws;

const cmRef = ref('')
const logcmRef = ref('')

// 日志
const logInfo = ref('')
const logOptions = {
    mode: 'cflog',
    lineNumbers: true,
    lineWrapping: true,
}

const form = reactive({
    id: '',
    project_name: '',
    server_name: '',
    repo_url: '',
    code: ''
})

const tableData = ref([])


// 代码编辑器
const onChange = (val, cm) => {
    console.log(val);
    console.log(cm.getValue());
}

const onInput = (val) => {
    console.log(val);
};

const onReady = (cm) => {
    console.log(cm.focus());
};

// 测试运行
const testRunClick = async () => {
    let codeData = {
        id: form.id,
        code: code.value
    }
    let { data } = await apiRepoTestRun(codeData)
    if (data.code == 200) {
        ElMessage({
            type: 'success',
            message: data.message,
        })
    } else {
        ElMessage({
            type: 'error',
            message: data.message
        })
    }
}

// 保存代码
const saveCodeClick = async () => {
    let codeData = {
        id: form.id,
        code: code.value
    }
    let { data } = await apiRepoModifyCode(codeData)
    if (data.code == 200) {
        ElMessage({
            type: 'success',
            message: data.message,
        })
    } else {
        ElMessage({
            type: 'error',
            message: data.message
        })
    }
}

onMounted(() => {})

onUnmounted(() => {
    cmRef.value.destroy()
})

// 行选中
const handleRowClick = async (row, event, column) => {
    bus.$emit("mitt-repo-table-row-click", row)

    // 获取分支信息
    // let { data } = await apiBranchList(row.id)
    // if (data.code == 200) {
    //     bus.$emit('mitt-repo-branch', data.data)
    // } else {
    //     ElMessage({
    //         type: 'error',
    //         message: data.message,
    //     })
    // }
}

// 编辑代码弹窗打开
const editCodeOpen = () => {
    cmRef.value.refresh()
    logcmRef.value.refresh()
    logInfo.value = ''
    // 连接 websocket
    let url = `ws://127.0.0.1:10061/api/v1/repo/ws/${form.id}`
    console.log(url);
    ws = new WebSocket(url)
    ws.onmessage = (data) => {
        console.log('data', data);
        logInfo.value += `${data.data}\n`
    }
}

// 编辑代码弹窗关闭
const editCodeClose = () => {
    ws.close()
    getData()
}

// 取消修改
const cancelClick = () => {
    code.value = ''
    repoVisible.value = false
}

// 获取仓库列表
const getData = async () => {
    let { data } = await apiRepoList()
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
        form.code = code.value
        if (operationType.value == 0) {
            // 添加
            let { data } = await apiRepoCreate(form)
            if (data.code == 200) {
                ElMessage({
                    type: 'success',
                    message: data.message,
                })

                repoVisible.value = false
                getData()
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

    }
}

// 编辑代码按钮
const editCodeClick = (row) => {
    form.id = row.id
    form.code = row.code

    code.value = row.code
    if (row.code.trim() == '') {
        code.value = ''
    }

    codeVisible.value = true
}

// 编辑仓库按钮
const editClick = (row) => {
    form.project_name = row.project_name
    form.server_name = row.server_name
    form.repo_url = row.repo_url
    form.id = row.id
    code.value = row.code
    repoTitle.value = '修改仓库信息'

    operationType.value = 1
    repoVisible.value = true
}

// 添加仓库按钮
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
/* 添加仓库 */
.header-button-box {
    margin-bottom: 10px;
    text-align: end;
}

/* 仓库信息 */
.repo-info-box {
    border: #DCDFE6 1px solid;
    padding: 10px;
}

.divider-line {
    width: 1px;
    background: #DCDFE6;
    margin-left: 30px;
}

.app-button-group-box {
    text-align: end;
    margin-bottom: 10px;
}

.code-mirror {
    line-height: 170%;
}

.workspaces-box {
    height: 680px;
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
