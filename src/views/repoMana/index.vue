<template>
    <div class="header-button-box">
        <el-button type="primary" @click="addRepoClick">添加仓库</el-button>
    </div>
    <!-- 分割线 -->
    <el-divider class="header-divider" />

    <div style="margin-top: 20px;">
        <el-form :model="qryForm" :inline="true">
            <el-form-item style="margin-left: 10px;">
                <el-input v-model="qryForm.condition" clearable placeholder="请输入检索内容" @clear="handleClean">
                    <template #append>
                        <el-button :icon="Search" @click="handleQueryClick" />
                    </template>
                </el-input>
            </el-form-item>
        </el-form>
    </div>

    <!-- 表格数据 -->
    <div class="table-content-box">
        <!-- 表格数据 -->
        <el-table :data="tableData" border stripe style="width: 100%" @row-click="handleRowClick">
            <el-table-column fixed prop="project_name" label="项目名称" width="160" />
            <el-table-column prop="server_name" label="服务名称" width="200" />
            <el-table-column prop="repo_url" label="仓库地址" min-width="300" show-overflow-tooltip />
            <el-table-column prop="create_at" label="创建时间" width="230" />
            <el-table-column fixed="right" label="操作" align="center" width="110">
                <template #default="props">
                    <el-button link type="primary" size="small" @click.native.close="editClick(props.row)">编辑</el-button>
                    <el-button link type="danger" size="small" @click="removeRepoClick(props.row)">移除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>

    <!-- 添加编辑仓库信息 -->
    <el-dialog top="5px" v-model="repoVisible" width="40%" :close-on-click-modal="false" :title="repoTitle">
        <div class="repo-dialog-box">
            <el-form :model="form" label-width="100px" :rules="rules" ref="ruleFormRef">
                <el-form-item label="项目名称:" prop="project_name">
                    <el-input v-model="form.project_name" />
                </el-form-item>
                <el-form-item label="服务名称:" prop="server_name">
                    <el-input v-model="form.server_name" />
                </el-form-item>
                <el-form-item label="仓库地址:" prop="repo_url">
                    <el-input v-model="form.repo_url" />
                </el-form-item>
                <el-form-item label="代理地址:">
                    <el-input v-model="form.proxy_url" />
                </el-form-item>
                <el-form-item label="代理用户:">
                    <el-input v-model="form.proxy_user" />
                </el-form-item>
                <el-form-item label="代理密码:">
                    <el-input v-model="form.proxy_pwd" />
                </el-form-item>
            </el-form>
            <div class="repo-dialog-footer-box">
                <el-button type="primary" @click="repoSaveClick">确定</el-button>
                <el-button @click="repoVisible = false">取消</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script setup name="repoMana">
import { ref, reactive, onMounted } from "vue";
import useRepoInfoStore from "../../store/repoInfo";
import { storeToRefs } from "pinia";
import { Search } from "@element-plus/icons-vue";

let repoStore = useRepoInfoStore(); // 仓库状态管理
let { form, qryForm, tableData } = storeToRefs(repoStore);

const repoVisible = ref(false);
const repoTitle = ref("添加仓库");
const operationType = ref(0); // 0 添加 1 编辑

// 行选中
const handleRowClick = (row, event, column) => {
    repoStore.setInfo(row); // 赋值
};

const ruleFormRef = ref(null)

const rules = reactive({
    project_name: [{ required: true, message: '项目名称不能为空', trigger: 'blur' },],
    server_name: [{ required: true, message: '服务名称不能为空', trigger: 'blur' },],
    repo_url: [{ required: true, message: '代码仓库地址不能为空', trigger: 'blur' },],
})

onMounted(() => {
    repoStore.getData()
})

// 移除仓库
const removeRepoClick = (row) => {
    repoStore.remove(row.id)
};

// 保存信息
const repoSaveClick = async () => {
    ruleFormRef.value.validate((valid) => {
        if (valid) {
            if (operationType.value == 0) {
                // 如果创建成功则关闭窗口
                if (repoStore.create()) {
                    repoVisible.value = false;
                }
            } else {
                // 如果创建成功则关闭窗口
                if (repoStore.modify()) {
                    repoVisible.value = false;
                }
            }
        }
    })
};

// 编辑仓库按钮
const editClick = (row) => {
    repoStore.viewData(row);
    repoTitle.value = "修改仓库信息";
    operationType.value = 1;
    repoVisible.value = true;
};

const handleQueryClick = () => {
    repoStore.getData()
}

const handleClean = () => {
    repoStore.getData()
}

// 添加仓库按钮
const addRepoClick = () => {
    repoStore.resetForm();

    repoTitle.value = "添加仓库";
    operationType.value = 0;
    repoVisible.value = true;
};
</script>

<style scoped>
/* 添加仓库 */
.header-button-box {
    margin: 0 10px;
    margin-top: 10px;
    text-align: end;
}

.header-divider {
    margin-top: 10px;
    margin-bottom: 0px;
}

.el-table {
    height: 100%;
}

.table-content-box {
    margin: 10px;
    height: calc(100% - 144px);
}

.repo-dialog-footer-box {
    text-align: end;
}

.repo-dialog-box {
    margin-right: 30px;
}
</style>
