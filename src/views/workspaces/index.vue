<template>
    <div class="content-box">
        <div class="header-box">
            <el-form :model="repoFrom" label-width="80px">
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="仓库名称">
                            <el-input disabled v-model="repoFrom.name" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="分支名称">
                            <el-input v-model="repoFrom.branch" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="4" style="margin-left: 10px;">
                        <el-button type="primary">打开仓库</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <el-divider class="header-divider" />
        <!-- 版本内容 -->
        <el-row class="body-content-box">
            <el-col :span="8">
                <div class="version-body-box">
                    <el-form :model="form" label-width="80px">
                        <el-form-item label="程序名称">
                            <el-input disabled v-model="form.name" />
                        </el-form-item>
                        <el-form-item label="tag">
                            <el-select v-model="form.type" :disabled="versionInfoDisabled" placeholder="请选择 tag">
                                <el-option v-for="item in options" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="版号">
                            <el-input-number v-model="form.version_x" class="input-number-version"
                                :disabled="versionInfoDisabled" :min="form.min_x" controls-position="right" />
                            <el-input-number v-model="form.version_y" class="input-number-version"
                                :disabled="versionInfoDisabled" :min="form.min_y" controls-position="right" />
                            <el-input-number v-model="form.version_z" class="input-number-version"
                                :disabled="versionInfoDisabled" :min="form.min_z" controls-position="right" />
                        </el-form-item>
                        <el-form-item label="内容">
                            <el-input type="textarea" :rows="8" v-model="form.content" :readonly="versionInfoDisabled" />
                        </el-form-item>
                    </el-form>

                    <!-- 按钮 -->
                    <div class="button-group-box">
                        <el-button type="primary" @click="addVersionClick">添加版本</el-button>

                        <el-button :disabled="saveButtondisabled" @click="cancelVersionClick">取消</el-button>
                        <el-button type="primary" :disabled="saveButtondisabled">保存</el-button>
                    </div>
                </div>
            </el-col>
            <!-- 竖向分割线 -->
            <div class="divider-line" />
            <!-- 明细表格 -->
            <el-col :span="15">
                <div class="content-detail-box">
                    <el-form :model="detailForm" label-width="30px">
                        <el-row>
                            <el-col :span="20">
                                <el-form-item>
                                    <el-select v-model="detailForm.type" placeholder="请选择 tag">
                                        <el-option v-for="item in options" :key="item.value" :label="item.label"
                                            :value="item.value" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
                <div class="detail-table-box">
                    <el-row>
                        <el-col>
                            <el-table :data="tableData" border stripe style="width: 100%" height="290px"
                                @row-click="rowClick">
                                <el-table-column fixed prop="name" label="名称" width="150" show-overflow-tooltip />
                                <el-table-column prop="version" label="版本" width="120" />
                                <el-table-column prop="tag" label="TAG" width="120" />
                                <el-table-column prop="create_at" label="创建时间" width="200" />
                                <el-table-column prop="content" label="内容" min-width="300" show-overflow-tooltip />
                                <el-table-column prop="branch" label="分支" width="120" />
                                <el-table-column prop="commit_hash" label="提交HASH" width="120" />
                                <el-table-column fixed="right" label="操作" width="100">
                                    <template #default>
                                        <el-button link type="primary" size="small">移除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-col>
                    </el-row>
                    <div class="pagination-box">
                        <el-pagination small background layout="prev, pager, next" :total="50" class="mt-4" />
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script setup name="workspaces">
import { reactive, ref, watch } from "vue"
import dayjs from 'dayjs'

// 保存按钮状态
const saveButtondisabled = ref(true);
// 版本信息状态
const versionInfoDisabled = ref(true);

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
        label: "RC",
        value: "RC",
    },
    {
        label: 'release',
        value: 'release',
    }
];

// 仓库表单信息
const repoFrom = reactive({
    name: '',
    branch: ''
})

var watchForm;

// 版本表单信息
const form = reactive({
    name: "",
    type: "alpha",
    version_x: 2,
    version_y: 10,
    version_z: 3,
    min_x: 2,
    min_y: 10,
    min_z: 3,
})

// 明细表单信息
const detailForm = reactive({
    type: "alpha"
})

const tableData = [
    {
        name: "LineServer-v2.10.3.20230611-Beta",
        version: "v2.10.3",
        tag: "alpha",
        create_at: "2023-06-11 22:15:00",
        content:
            "这是一段这个仓库的简单介绍，更新了内容说明的功能，并且能够在点击每一行的时候都在上面的form中显示出内容来",
        branch: "master",
        commit_hash: "",
    },
    {
        name: "LineServer-v2.10.4.20230611-Beta",
        version: "v2.10.4",
        tag: "beta",
        create_at: "2023-06-11 22:15:00",
        content:
            "这是一段这个仓库的简单介绍，更新了内容说明的功能，并且能够在点击每一行的时候都在上面的form中显示出内容来",
        branch: "main",
        commit_hash: "",
    },
];

const rowClick = (row, event, column) => {
    if (!saveButtondisabled.value) return;

    form.name = row.name;
    form.content = row.content;
    form.type = row.tag;
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

// 添加版本点击按钮
const addVersionClick = () => {
    saveButtondisabled.value = false;
    versionInfoDisabled.value = false;

    form.name = "";
    form.content = "";
    form.type = "alpha";
    form.branch = "";

    // 监听表单内容是否发生了变化
    watchForm = watch(
        () => [form.type, form.version_x, form.version_y, form.version_z],
        (newValue, oldValue) => {
            if (saveButtondisabled.value) return

            form.name = `YXLineServer_v${newValue[1]}.${newValue[2]}.${newValue[3]}.${dayjs().format('MMDD')}_${newValue[0]}`
        },
        { immediate: true }
    )
};

// 取消
const cancelVersionClick = () => {
    watchForm()
    saveButtondisabled.value = true;
    versionInfoDisabled.value = true;
};
</script>

<style scoped>
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

.el-divider--vertical {
    display: inline-block;
    width: 1px;
    position: relative;
    height: 80%;
    margin-left: 30px;
}

.version-body-box {
    margin-top: 30px;
}

.divider-line {
    width: 1px;
    background: #DCDFE6;
    margin-left: 30px;
}

.content-detail-box {
    margin-top: 30px;
}

.button-group-box {
    /* margin-left: 20px; */
    text-align: end;
}

.detail-table-box {
    margin-left: 30px;
    /* margin-right: 70px; */
}
</style>
