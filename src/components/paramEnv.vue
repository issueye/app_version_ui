<template>
    <div style="margin-top: 20px">
        <el-form>
            <el-row :gutter="10">
                <el-col :span="20">
                    <el-row :gutter="10">
                        <el-col :span="12">
                            <el-form-item label="参数名称">
                                <el-input v-model.trim="data.name" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="参数值">
                                <el-input v-model.trim="data.value" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="4"><el-button type="primary" @click="onAddParamClick">添加</el-button></el-col>
            </el-row>
        </el-form>
    </div>
    <el-divider style="margin-top: 10px" />
    <div>
        <KV v-for="item in envList" :key="item.name" :name="item.name" :value="item.value"
            @update:value="onUpdateParamClick" @delete:value="onDeleteParamClick" />
    </div>
</template>

<script setup name="param">
import { ref, onMounted, onUnmounted, reactive } from "vue";
import { ElMessage } from "element-plus";
import KV from "./kv.vue";
import useBuildConfigStore from "../store/module/buildConfig";
import { storeToRefs } from "pinia";

const buildConfig = useBuildConfigStore();
let { envList } = storeToRefs(buildConfig);

const data = reactive({
    name: "",
    value: "",
});

// 添加参数
const onAddParamClick = () => {
    if (data.name == "" || data.value == "") {
        ElMessage({
            type: "error",
            message: "参数名称或者参数值不能为空",
        });
        return;
    }

    console.log("envList", envList);

    // 判断数组中是否已经存在
    let isExist = envList.value.find((e) => {
        return e.name == data.name;
    });

    if (isExist) {
        ElMessage({
            type: "error",
            message: `[${data.name}]环境变量已经添加`,
        });
        return;
    }

    envList.value.push({
        name: data.name,
        value: data.value,
    });

    data.name = "";
    data.value = "";
};

// 更新值
const onUpdateParamClick = (data) => {
    envList.value.forEach((e) => {
        if (e.name == data.name) {
            e.value = data.value;
        }
    });
};

// 删除值
const onDeleteParamClick = (data) => {
    envList.value = envList.value.filter((e) => e.name !== data.name);
};

onMounted(async () => { });

onUnmounted(() => { });
</script>

<style scoped></style>
