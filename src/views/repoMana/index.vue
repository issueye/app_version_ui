<template>
    <div class="content-box">
        <div class="header-button-box">
            <el-button type="primary" @click="addRepoClick">添加仓库</el-button>
        </div>
        <!-- 分割线 -->
        <el-divider class="header-divider" />
        <!-- 表格数据 -->
        <div class="table-content-box">
            <!-- 表格数据 -->
            <el-table :data="tableData" border height="80vh" stripe style="width: 100%" @row-click="handleRowClick">
                <el-table-column fixed prop="project_name" label="项目名称" width="200" />
                <el-table-column prop="server_name" label="服务名称" width="200" />
                <el-table-column prop="repo_url" label="仓库地址" min-width="300" show-overflow-tooltip />
                <el-table-column prop="create_at" label="创建时间" width="230" />
                <el-table-column fixed="right" label="操作" align="center" width="110">
                    <template #default="props">
                        <el-button link type="primary" size="small"
                            @click.native.close="editClick(props.row)">编辑</el-button>
                        <el-button link type="primary" size="small" @click="removeRepoClick(props.row)">移除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>

    <!-- 添加编辑仓库信息 -->
    <el-dialog top="5px" v-model="repoVisible" width="40%" :close-on-click-modal="false" :title="repoTitle">
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
                <el-form-item label="代理地址">
                    <el-input v-model="form.proxy_url" />
                </el-form-item>
                <el-form-item label="代理用户">
                    <el-input v-model="form.proxy_user" />
                </el-form-item>
                <el-form-item label="代理密码">
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
import { ref } from "vue";
import {
    apiRepoCreate,
    apiRepoDel,
    apiRepoList,
    apiRepoModify,
} from "../../api/repo";
import { ElMessage, ElMessageBox } from "element-plus";
import useRepoInfoStore from "../../store/repoInfo";
import { storeToRefs } from "pinia";

let repoInfoStore = useRepoInfoStore(); // 仓库状态管理
let { form, tableData } = storeToRefs(repoInfoStore);

const repoVisible = ref(false);
const repoTitle = ref("添加仓库");
const operationType = ref(0); // 0 添加 1 编辑

// 行选中
const handleRowClick = (row, event, column) => {
    // 赋值
    repoInfoStore.setInfo(row);
};

// 获取仓库列表
const getData = async () => {
    let { data } = await apiRepoList();
    if (data.code == 200) {
        tableData.value = data.data;
    }
};

// 打开获取仓库列表
getData();

// 移除仓库
const removeRepoClick = async (row) => {
    ElMessageBox.confirm("是否移除仓库", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    })
        .then(async () => {
            let { data } = await apiRepoDel(row.id);
            if (data.code == 200) {
                ElMessage({
                    type: "success",
                    message: data.message,
                });
            }
        })
        .finally(() => {
            getData();
        });
};

// 保存信息
const repoSaveClick = async () => {
    if (operationType.value == 0) {
        // 如果创建成功则关闭窗口
        if (repoInfoStore.create()) {
            repoVisible.value = false;
            getData();
        }
    } else {
        // 如果创建成功则关闭窗口
        if (repoInfoStore.modify()) {
            repoVisible.value = false;
            getData();
        }
    }
};

// 编辑仓库按钮
const editClick = (row) => {
    repoInfoStore.viewData(row);
    repoTitle.value = "修改仓库信息";
    operationType.value = 1;
    repoVisible.value = true;
};

// 添加仓库按钮
const addRepoClick = () => {
    repoInfoStore.resetForm();

    repoTitle.value = "添加仓库";
    operationType.value = 0;
    repoVisible.value = true;
};
</script>

<style scoped>
/* 添加仓库 */
.header-button-box {
    margin-bottom: 10px;
    text-align: end;
}

.header-divider {
    margin-top: 10px;
    margin-bottom: 0px;
}

.table-content-box {
    margin-top: 30px;
}

.repo-dialog-footer-box {
    text-align: end;
}

.repo-dialog-box {
    margin-right: 30px;
}
</style>
