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
                                <el-option v-for="item in options" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="分支">
                            <el-select v-model="detailForm.tag" placeholder="请选择 tag" @change="tagChange">
                                <el-option v-for="item in options" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <!-- 明细表格 -->
        <el-table :data="tableData" border stripe style="width: 100%" height="70vh" @row-click="rowClick">
            <el-table-column fixed prop="app_name" label="名称" width="300" show-overflow-tooltip />
            <el-table-column prop="version" label="版本" width="200" show-overflow-tooltip />
            <el-table-column prop="tag" label="TAG" width="120" />
            <el-table-column prop="create_at" label="创建时间" width="230" />
            <el-table-column prop="content" label="内容" min-width="300" show-overflow-tooltip />
            <el-table-column prop="branch" label="分支" width="120" />
            <el-table-column prop="commit_hash" label="提交HASH" width="120" />
            <el-table-column fixed="right" label="操作" width="100">
                <template #default="props">
                    <el-button link type="primary" size="small"
                        @click.native.stop="removeVersionClick(props.row)">移除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-box">
            <el-pagination small background layout="prev, pager, next" :current-page="current" :total="total"
                @current-change="currentChange" />
        </div>
    </div>

    <el-dialog :title="versionTitle" v-model="addVersionDialogVisible" :close-on-click-modal="false" top="5px"
        @open="handlOpenDialogClick" width="40%">
        <div class="dialog-content-box">
            <el-form :model="form" label-width="80px">
                <el-form-item label="程序名称">
                    <el-input disabled v-model="form.app_name" />
                </el-form-item>

                <el-row>
                    <el-col :span="14">
                        <el-form-item label="发布版号">
                            <el-input-number v-model="form.version_x" class="input-number-version" :min="form.min_x"
                                controls-position="right" />
                            <el-input-number v-model="form.version_y" class="input-number-version" :min="form.min_y"
                                controls-position="right" />
                            <el-input-number v-model="form.version_z" class="input-number-version" :min="form.min_z"
                                controls-position="right" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="发布类型">
                            <el-select v-model="form.tag" placeholder="请选择 tag">
                                <el-option v-for="item in options" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>


                <el-form-item label="提交hash">
                    <el-input disabled v-model="form.commit_hash" />
                </el-form-item>
                <el-form-item label="发布内容">
                    <el-input type="textarea" :rows="15" v-model="form.content" />
                </el-form-item>
            </el-form>

            <!-- 按钮 -->
            <div class="button-group-box">
                <el-button type="primary" @click="saveVersionDataClick">保存</el-button>
                <el-button @click="cancelVersionClick">取消</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script setup name="workspaces">
import { reactive, ref, watch, onMounted, onUnmounted } from "vue"
import dayjs from 'dayjs'
import { apiVersionCreate, apiVersionList, apiVersionRemove } from "../../api/repo";
import { ElMessage, ElMessageBox } from "element-plus";
import bus from "../../bus";

// 保存按钮状态
const saveButtonDisabled = ref(true);
// 添加版本弹窗
const addVersionDialogVisible = ref(false);
// 弹窗标题
const versionTitle = ref('添加版本');

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

const options = [
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

// 仓库表单信息
const repoFrom = reactive({
    id: '',
    name: '',
    branch: ''
})

var watchForm;

// 版本表单信息
const form = reactive({
    app_name: '',
    tag: 'alpha',
    repo_id: '',
    version: '',
    version_x: 0,
    version_y: 0,
    version_z: 0,
    min_x: 0,
    min_y: 0,
    min_z: 0,
})

const resetForm = () => {
    form.app_name = ''
    form.tag = ''
    form.app_name = ''
    form.content = ''
    form.tag = 'alpha'
    form.branch = ''
    form.repo_id = repoInfo.project_id
}

// 明细表单信息
const detailForm = reactive({
    tag: "alpha",
    pageNum: 1,
    pageSize: 10,
})

onMounted(() => {
    bus.$on("mitt-repo-table-row-click", (data) => {
        console.log("mitt-repo-table-row-click => on", data);

        repoInfo.project_id = data.id
        repoInfo.project_name = data.project_name
        repoInfo.server_name = data.server_name
        repoInfo.repo_url = data.repo_url

        getData()
    })
})

onUnmounted(() => {
    bus.$off("mitt-repo-table-row-click", () => {
        console.log("mitt-repo-table-row-click => off");
    })
})

const tableData = ref([]);

// 行选中
const rowClick = (row, event, column) => {
    if (!saveButtonDisabled.value) return;

    form.app_name = row.app_name;
    form.content = row.content;
    form.tag = row.tag;
    form.branch = row.branch;
    let v = row.version;
    v = v.substring(1);
    let data = v.split(".");
    form.min_x = +data[0];
    form.min_y = +data[1];
    form.min_z = +data[2];

    form.version_x = +data[0];
    form.version_y = +data[1];
    form.version_z = +data[2];
};

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

    resetForm()

    addVersionDialogVisible.value = true
}

// tag 发生变化时
const tagChange = (val) => {
    detailForm.tag = val
    getData()
}

// 添加版本点击按钮
const handlOpenDialogClick = () => {
    form.app_name = ''
    form.content = ''
    form.tag = 'alpha'
    form.branch = ''
    form.repo_id = repoInfo.project_id
    form.commit_hash = '1111123'
    form.branch = 'test_branch'

    console.log('handlOpenDialogClick open');

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
    console.log('getdata', data);
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

const removeVersionClick = (row) => {
    console.log('removeVersionClick', row);
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

// 取消
const cancelVersionClick = () => {
    watchForm()
    form.content = ''
    form.app_name = ''
    form.min_x = 0
    form.min_y = 0
    form.min_z = 0
    form.version_x = 0
    form.version_y = 0
    form.version_z = 0

    addVersionDialogVisible.value = false
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

.dialog-content-box{
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
</style>
