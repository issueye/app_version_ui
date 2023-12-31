<template>
    <!-- 编辑运行脚本 -->
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
            <Codemirror class="code-mirror" height="85vh" v-model:value="logInfo" ref="logCmRef" :options="logOptions"
                border @change="onChange" @input="onInput" @ready="onReady" />
        </el-col>
    </el-row>
</template>

<script setup name="codeEdit">
import { reactive, ref, onMounted, onUnmounted } from 'vue'
import { apiRepoModifyCode, apiRepoTestRun, apiRepoGetById } from '../../api/repo';
import { ElMessage } from 'element-plus';
import "codemirror/mode/javascript/javascript.js";
import "codemirror/theme/idea.css";
import "codemirror/addon/hint/show-hint.css";
import Codemirror from "codemirror-editor-vue3"
import useRepoInfoStore from '../../store/repoInfo';
import { storeToRefs } from 'pinia';

// 仓库状态管理
let repoInfoStore = useRepoInfoStore();
const { id } = storeToRefs(repoInfoStore);

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
const logCmRef = ref('')

// 日志
const logInfo = ref('')
const logOptions = {
    mode: 'cflog',
    lineNumbers: true,
    lineWrapping: true,
}

// 代码编辑器
const onChange = (val, cm) => {
    console.log('onChange', val);
}

const onInput = (val) => {
    console.log('onInput', val);
};

const onReady = (cm) => {
    console.log('onReady', cm.focus());
};

// 测试运行
const testRunClick = async () => {
    let codeData = {
        id: id.value,
        code: code.value
    }

    // 测试运行代码
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
        id: id.value,
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

onMounted( async() => {
    cmRef.value.refresh()
    logCmRef.value.refresh()

    // 获取仓库的代码
    let { data } = await apiRepoGetById(id.value)
    if (data.code == 200) {
        code.value = data.data.code
    } else {
        ElMessage({
            type: 'error',
            message: data.message
        })
    }

    let url = `ws://${window.location.host}/api/v1/repo/ws/${id.value}`
    ws = new WebSocket(url)
    ws.onmessage = (value) => {
        logInfo.value += `${value.data}\n`
    }
})

onUnmounted(() => {
    cmRef.value.destroy()
})

</script>

<style scoped>
.app-button-group-box {
    text-align: end;
    margin-bottom: 10px;
}

.code-mirror {
    line-height: 170%;
}
</style>
