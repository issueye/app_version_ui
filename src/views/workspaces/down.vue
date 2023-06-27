<template>
    <div class="app-button-group-box">
        <el-button type="primary" @click="queryClick">查询</el-button>
    </div>
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
                        <el-select v-model="detailForm.branch" :clearable="true" placeholder="请选择分支" @change="branchChange">
                            <el-option v-for="item in branchOptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
    <div class="code-box">
        <el-table :data="tableData" border stripe style="width: 100%" height="50vh">
            <el-table-column fixed prop="app_name" label="程序名称" width="300" show-overflow-tooltip />
            <el-table-column prop="internal_version" label="内部版号" width="100" />
            <el-table-column label="平台" width="100">
                <template #default="props">
                    <el-tag v-if="props.row.platform == 0" size="small" type="success">windows</el-tag> <el-tag v-else size="small">linux</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="tag" label="发布类型" width="120" />
            <el-table-column prop="branch" label="分支" width="150" show-overflow-tooltip />
            <el-table-column prop="create_at" label="编译时间" width="230" />
            <el-table-column fixed="right" label="操作" width="110" align="center">
                <template #default="props">
                    <el-button link type="primary" size="small" @click="downClick(props.row)">下载</el-button>
                    <el-button link type="primary" size="small" @click="removeClick(props.row)">移除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-box">
            <el-pagination small background layout="prev, pager, next" :current-page="current" :total="total"
                @current-change="currentChange" />
        </div>
    </div>
</template>

<script setup name="down">
import { ref, onMounted, onUnmounted, reactive } from 'vue'
import { apiVersionReleaseDelete, apiVersionReleaseList } from '../../api/repo';
import { ElMessage, ElMessageBox } from 'element-plus';
import bus from '../../bus';

// 发布类型下拉
const tagOptions = [
    { label: "alpha", value: "alpha" },
    { label: "beta", value: "beta" },
    { label: "rc", value: "rc" },
    { label: 'release', value: 'release' }
]

const current = ref(1)
const total = ref(0)

// 分支下拉
const branchOptions = ref([])

// 表格数据
const tableData = ref([]);

const detailForm = reactive({
    tag: 'alpha',
    branch: '',
    pageNum: 1,
    pageSize: 10,
})

// 保存代码
const queryClick = async () => {
    getData()
}

onMounted(() => {
    // 编辑窗口打开
    bus.$on('mitt-down-open', (val) => {
        editOpen(val)
    })
})

onUnmounted(() => {
    bus.$off('mitt-down-open', () => { })
})
// 编辑代码弹窗打开
const editOpen = async (val) => {
    branchOptions.value = val.branch
}

const getData = async() => {
    let { data } = await apiVersionReleaseList(detailForm)
    if (data.code != 200) {
        ElMessage({
            type: 'error',
            message: data.message,
        })
    }

    tableData.value = data.data
    total.value = data.pageInfo.total
}

getData()

const currentChange = (val) => {
    current.value = val
    detailForm.pageNum = val
    getData()
}

const branchChange = (val) => {
    detailForm.branch = val
    getData()
}

const tagChange = (val) => {
    detailForm.tag = val
    getData()
}

// 移除程序
const removeClick = (row) => {
    ElMessageBox.confirm(
        '是否移除版本',
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {
        let { data } = await apiVersionReleaseDelete(row.id)
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

</script>

<style scoped>
.app-button-group-box {
    text-align: end;
    margin-bottom: 10px;
}

.pagination-box {
    margin-top: 10px;
}
</style>
