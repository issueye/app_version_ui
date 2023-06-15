<template>
    <div class="content-box">
        <div class="header-box">
            <!-- <el-button type="primary">打开仓库</el-button> -->
            <el-button type="primary" @click="handleAddVersionClick">添加版本</el-button>
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
                    <el-col :span="5">
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
                    <el-button link type="primary" size="small" @click="appInfoClick(props.row)">程序</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-box">
            <el-pagination small background layout="prev, pager, next" :current-page="current" :total="total"
                @current-change="currentChange" />
        </div>
    </div>

    <el-dialog :title="versionTitle" v-model="versionDialogVisible" :close-on-click-modal="false" top="5px"
        @open="handleOpenDialogClick" width="40%">
        <div class="dialog-content-box">
            <el-form :model="form" label-width="80px">
                <el-form-item label="程序名称">
                    <el-input disabled v-model="form.app_name" />
                </el-form-item>

                <el-row>
                    <el-col :span="14">
                        <el-form-item label="发布版号">
                            <el-input-number :disabled="versionDialogType == 1" v-model="form.version_x"
                                class="input-number-version" :min="form.min_x" controls-position="right" />
                            <el-input-number :disabled="versionDialogType == 1" v-model="form.version_y"
                                class="input-number-version" :min="form.min_y" controls-position="right" />
                            <el-input-number :disabled="versionDialogType == 1" v-model="form.version_z"
                                class="input-number-version" :min="form.min_z" controls-position="right" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="发布类型">
                            <el-select :disabled="versionDialogType == 1" v-model="form.tag" placeholder="请选择 tag">
                                <el-option v-for="item in tagOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item label="分支">
                    <el-select :disabled="versionDialogType == 1" v-model="form.branch" placeholder="请选择分支"
                        @change="branchDialogChange">
                        <el-option v-for="item in branchOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="提交hash">
                    <el-input disabled v-model="form.commit_hash" />
                </el-form-item>
                <el-form-item label="发布内容">
                    <el-input type="textarea" :rows="15" v-model="form.content" :readonly="versionDialogType == 1" />
                </el-form-item>
            </el-form>

            <!-- 按钮 -->
            <div class="button-group-box">
                <el-button type="primary" @click="saveVersionDataClick">保存</el-button>
                <el-button @click="cancelVersionClick">取消</el-button>
            </div>
        </div>
    </el-dialog>
    <el-dialog title="程序" v-model="appDialogVisible" :close-on-click-modal="false" top="5px" @open="openAppDialog">
        <div class="app-button-group-box">
            <el-button type="primary" @click="compileAppClick">编译</el-button>
            <el-button @click="downloadAppClick">下载</el-button>
        </div>
        <div class="code-box">
            <Codemirror class="code-mirror" height="500px" v-model:value="code" :options="cmOptions" border :KeepCursorInEnd="true"
                        @change="onChange" @input="onInput" @ready="onReady" />
        </div>
    </el-dialog>
</template>

<script setup name="workspaces">
import { reactive, ref, watch, onMounted, onUnmounted } from "vue"
import dayjs from 'dayjs'
import { apiVersionCreate, apiVersionList, apiVersionRemove, apiLastVerNum, apiVersionBuild } from "../../api/repo";
import { ElMessage, ElMessageBox } from "element-plus";
import bus from "../../bus";
import "codemirror/mode/javascript/javascript.js";
import Codemirror, { createTitle, createLogMark, createLog } from "codemirror-editor-vue3"

// 添加版本弹窗  addVersionDialogVisible
const versionDialogVisible = ref(false);
// 弹窗标题
const versionTitle = ref('添加版本');
// 当前弹窗类型 0 添加版本 1 查看版本信息
const versionDialogType = ref(0)

// 程序
const appDialogVisible = ref(false)

// 代码
const code = ref('')
const cmOptions = {
    mode: "cflog",
    lineNumbers: true,
    lineWrapping: true,
    readOnly: true,
}

// 分页信息
const current = ref(1)
const total = ref(0)

// repo info
const repoInfo = reactive({
    project_name: '',
    project_id: '',
    server_name: '',
    repo_url: '',
})

const tagOptions = [
    {
        label: "alpha",
        value: "alpha",
    },
    {
        label: "beta",
        value: "beta",
    },
    {
        label: "rc",
        value: "rc",
    },
    {
        label: 'release',
        value: 'release',
    }
];

const branchOptions = ref([])
const branchData = ref([])


var watchForm;

// 版本表单信息
const form = reactive({
    app_name: '',
    commit_hash: '',
    tag: 'alpha',
    repo_id: '',
    version: '',
    version_x: 0,
    version_y: 1,
    version_z: 1,
    min_x: 0,
    min_y: 1,
    min_z: 1,
})

// 版本id
const versionId  = ref('')

// 重置表单
const resetForm = () => {
    form.app_name = ''
    form.commit_hash = ''
    form.tag = ''
    form.app_name = ''
    form.content = ''
    form.tag = 'alpha'
    form.branch = ''
    form.repo_id = repoInfo.project_id
}

// 明细表单信息
const detailForm = reactive({
    tag: 'alpha',
    branch: '',
    pageNum: 1,
    pageSize: 10,
})

onMounted(() => {
    code.value =
`








`
    // ${createTitle('程序编译记录信息 ' + dayjs().format('YYYY-MM-DD HH:mm:ss'))}

    bus.$on("mitt-repo-table-row-click", (data) => {
        console.log("mitt-repo-table-row-click => on", data);

        repoInfo.project_id = data.id
        repoInfo.project_name = data.project_name
        repoInfo.server_name = data.server_name
        repoInfo.repo_url = data.repo_url

        getData()
    })

    bus.$on('mitt-repo-branch', (data) => {
        console.log('mitt-repo-branch => on', data)

        branchData.value = data

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
    bus.$off("mitt-repo-table-row-click", () => {
        console.log("mitt-repo-table-row-click => off");
    })
})

const tableData = ref([]);

// 添加版本
const handleAddVersionClick = () => {
    // 弹窗类型 0 添加
    versionDialogType.value = 0

    // 没有选择中
    if (repoInfo.project_id == '') {
        ElMessage({
            type: 'warning',
            message: '请选择仓库',
        })
        return
    }

    resetForm()

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

const branchDialogChange = async (val) => {
    form.branch = val

    // 处理提交 hash
    branchData.value.find((item) => {
        if (item.short_name == val) {
            form.commit_hash = item.hash
            return
        }
    })

    let params = {
        tag: form.tag,
        branch: form.branch,
    }
    let { data } = await apiLastVerNum(repoInfo.project_id, params)
    if (data.code == 200) {

        let version_y = data.data.version_y == 0 ? 1 : data.data.version_y

        form.min_x = data.data.version_x
        form.min_y = version_y
        form.min_z = data.data.version_z + 1
        form.version_x = data.data.version_x
        form.version_y = version_y
        form.version_z = data.data.version_z + 1
    }
}

// 打开程序弹窗
const openAppDialog = () => {
    code.value = `${createTitle('程序记录信息 ' + dayjs().format('YYYY-MM-DD HH:mm:ss'))}`
}

// 编译程序
const compileAppClick = async() => {
    let { data } = await apiVersionBuild(versionId.value)
}

// 下载程序
const downloadAppClick = () => {

}

// 添加版本点击按钮
const handleOpenDialogClick = () => {
    // 如果当前是查看版本信息则不处理
    if (versionDialogType.value == 1) return

    form.app_name = ''
    form.content = ''
    form.tag = 'alpha'
    form.branch = ''
    form.repo_id = repoInfo.project_id
    form.commit_hash = ''
    form.branch = ''

    // 监听表单内容是否发生了变化
    watchForm = watch(
        () => [form.tag, form.version_x, form.version_y, form.version_z],
        (newValue, oldValue) => {
            let version = `v${newValue[1]}.${newValue[2]}.${newValue[3]}.${dayjs().format('MMDD')}_${newValue[0]}`
            form.app_name = `${repoInfo.server_name}_${version}`
            form.version = version
        },
        { immediate: true }
    )
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

// 保存数据按钮
const saveVersionDataClick = async () => {
    try {
        let { data } = await apiVersionCreate(form)
        if (data.code == 200) {
            ElMessage({
                type: 'success',
                message: data.message,
            })

            cancelVersionClick()
        } else {
            ElMessage({
                type: 'error',
                message: data.message,
            })
        }
    } finally {
        getData()
    }
}

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
    }).finally(() => {
        getData()
    })
}

// 弹窗程序
const appInfoClick = (row) => {
    versionId.value = row.id
    appDialogVisible.value = true
}

// 查看版本信息
const viewInfoClick = (row) => {
    // 弹窗类型 1 查看版本信息
    versionDialogType.value = 1

    console.log('viewInfoClick', row);

    form.app_name = row.app_name;
    form.content = row.content;
    form.tag = row.tag;
    form.branch = row.branch;
    form.commit_hash = row.commit_hash
    let v = row.version;
    v = v.substring(1);
    let data = v.split(".");
    form.min_x = +data[0];
    form.min_y = +data[1];
    form.min_z = +data[2];

    form.version_x = +data[0];
    form.version_y = +data[1];
    form.version_z = +data[2];

    versionTitle.value = '版本信息'
    versionDialogVisible.value = true
}

// 取消
const cancelVersionClick = () => {
    resetForm()
    // 添加版本时，去除监听
    if (versionDialogType.value == 0) {
        watchForm()
    }

    versionDialogVisible.value = false
};
</script>

<style scoped>
.header-box {
    text-align: end;
}

.input-number-version {
    margin-right: 2px;
    width: 85px;
}

.pagination-box {
    margin-top: 10px;
}

.header-divider {
    margin-top: 10px;
    margin-bottom: 0px;
}

.dialog-content-box {
    padding-right: 20px;
}

.el-divider--vertical {
    display: inline-block;
    width: 1px;
    position: relative;
    height: 90%;
    margin-left: 30px;
}

.content-detail-box {
    margin-top: 30px;
}

.button-group-box {
    /* margin-left: 20px; */
    text-align: end;
    margin-top: 27px;
}

.code-box {
    margin-top: 10px;
}
.app-button-group-box{
    text-align: end;
}

</style>
