<template>
    <div class="dialog-content-box">
        <el-form>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="操作系统:">
                        <el-checkbox-group v-model="platform" @change="onPlatformChange" size="small">
                            <el-checkbox-button label="windows" />
                            <el-checkbox-button label="linux" />
                        </el-checkbox-group>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="架构平台:">
                        <el-checkbox-group v-model="arch" @change="onArchChange" size="small">
                            <el-checkbox-button label="amd64" />
                            <el-checkbox-button label="amd386" />
                            <el-checkbox-button label="arm64" />
                        </el-checkbox-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="GIT代理:">
                        <el-input v-model="git.proxy" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <el-divider style="margin-top: 30px">🎈</el-divider>

        <div style="margin-top: 20px">
            <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="环境变量" name="env">
                    <ParamEnv />
                </el-tab-pane>
                <el-tab-pane label="注入变量" name="inject_env">
                    <ParamInject />
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script setup name="buildConfigEdit">
import { ref, onMounted, onUnmounted, reactive } from "vue";
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
import useBuildConfigStore from "../../store/module/buildConfig";
import ParamEnv from "../../components/paramEnv.vue";
import ParamInject from "../../components/paramInject.vue";

const buildConfig = useBuildConfigStore();
let { platform, arch, git } = storeToRefs(buildConfig);

const activeName = ref("env");

// 系统平台选项发生变化时
const onPlatformChange = (val) => {
    console.log("onPlatformChange", val);
    if (platform.value.length == 0) {
        platform.value.push("windows");
    }
};

const onArchChange = (val) => {
    console.log("onArchChange", val);
    if (arch.value.length == 0) {
        arch.value.push("amd64");
    }
};

onMounted(async () => { });

onUnmounted(() => { });
</script>

<style scoped>
.app-button-group-box {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.code-mirror {
    line-height: 170%;
}

.dialog-content-box {
    padding: 20px;
}
</style>
