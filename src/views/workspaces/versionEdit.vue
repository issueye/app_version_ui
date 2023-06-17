<template>
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
                    @change="branchChange">
                    <el-option v-for="item in branchOptions" :key="item.value" :label="item.label" :value="item.value" />
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
</template>

<script setup name="versionEdit">
import { reactive, ref, watch, onMounted, onUnmounted, defineProps } from 'vue'
import { apiBranchList, apiLastVerNum, apiVersionCreate } from '../../api/repo';
import { ElMessage } from 'element-plus';
import dayjs from 'dayjs'
import bus from '../../bus';

const emits = defineEmits(['visible'])

// 版本表单信息
const form = reactive({
    app_name: '',           // 程序名称
    commit_hash: '',        // 提交 hash
    tag: 'alpha',           // 发布类型
    repo_id: '',            // 仓库id
    version: '',            // 版本
    version_x: 0,           // 主版本
    version_y: 1,           // 功能版本
    version_z: 1,           // 迭代 bug
    min_x: 0,               // 最小版本号
    min_y: 1,               //
    min_z: 1,               // 
})

// 发布类型下拉
const tagOptions = [
    { label: "alpha", value: "alpha" },
    { label: "beta", value: "beta" },
    { label: "rc", value: "rc" },
    { label: 'release', value: 'release' }
]

// 分支下拉
const branchOptions = ref([])
const branchData = ref([])

// 监听表单变化
var watchForm;

// 当前弹窗类型 0 添加版本 1 查看版本信息
const versionDialogType = ref(0)


onMounted(() => {
    // 添加版本
    bus.$on('mitt-version-edit-add', (data) => {
        console.log('mitt-version-edit-add', data);
        createVers(data)
    })

    // 查看版本信息
    bus.$on('mitt-version-edit-view', (versionData) => {
        let data = versionData.value
        viewVers(data)
    })
})

onUnmounted(() => {
    // 关闭监听
    watchForm()
})

// 创建版本初始化
const createVers = (data) => {
    versionDialogType.value = 0
    form.app_name = ''
    form.content = ''
    form.tag = 'alpha'
    form.branch = ''
    form.repo_id = data.project_id
    form.commit_hash = ''
    form.branch = ''

    // 获取分支列表
    getBranchList(data.project_id)

    // 监听表单内容是否发生了变化
    watchForm = watch(
        () => [form.tag, form.version_x, form.version_y, form.version_z],
        (newValue, oldValue) => {
            let version = `v${newValue[1]}.${newValue[2]}.${newValue[3]}.${dayjs().format('MMDD')}_${newValue[0]}`
            form.app_name = `${data.server_name}_${version}`
            form.version = version
        },
        { immediate: true }
    )
}

const viewVers = (data) => {
    // 弹窗类型 1 查看版本信息
    versionDialogType.value = 1

    form.app_name = data.app_name
    form.content = data.content
    form.tag = data.tag
    form.branch = data.branch
    form.commit_hash = data.commit_hash
    let v = data.version
    v = v.substring(1)
    let version = v.split(".")
    form.min_x = +version[0]
    form.min_y = +version[1]
    form.min_z = +version[2]

    form.version_x = +version[0]
    form.version_y = +version[1]
    form.version_z = +version[2]
}

// 获取分支列表
const getBranchList = async (id) => {
    // 获取分支信息
    let { data } = await apiBranchList(id)
    if (data.code == 200) {

        branchData.value = data.data
        branchOptions.value = []
        data.data.forEach((item, index) => {
            branchOptions.value.push({
                label: item.short_name,
                value: item.short_name,
            })
        })

    } else {
        ElMessage({
            type: 'error',
            message: data.message,
        })
    }
}

// 分支变化
const branchChange = async (val) => {
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
    let { data } = await apiLastVerNum(form.repo_id, params)
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

// 保存数据按钮
const saveVersionDataClick = async () => {
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
}

// 重置表单
const resetForm = () => {
    form.app_name = ''
    form.commit_hash = ''
    form.tag = ''
    form.app_name = ''
    form.content = ''
    form.tag = 'alpha'
    form.branch = ''
    form.repo_id = ''
}


// 取消
const cancelVersionClick = () => {
    resetForm()

    // 关闭显示
    emits('visible', false)
};

</script>

<style scoped>
.dialog-content-box {
    padding-right: 20px;
}

.button-group-box {
    /* margin-left: 20px; */
    text-align: end;
    margin-top: 27px;
}

.input-number-version {
    margin-right: 2px;
    width: 85px;
}
</style>
