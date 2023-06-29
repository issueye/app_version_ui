<template>
    <div class="app-button-group-box">
        <div>
            <span>程序名称：{{ versionInfo.name }}</span>
        </div>
        <div>
            <el-button type="primary" @click="compileAppClick">编译</el-button>
        </div>
        
    </div>
    <div class="code-box">
        <Codemirror class="code-mirror" height="500px" v-model:value="code" ref="cmRef" :options="cmOptions" border
            :KeepCursorInEnd="true" @change="onChange" @input="onInput" @ready="onReady" />
    </div>
</template>

<script setup name="compileEdit">
import { ref, onMounted, onUnmounted, reactive } from 'vue'
import { apiVersionBuild } from '../../api/repo';
import { ElMessage } from 'element-plus';
import "codemirror/mode/javascript/javascript.js";
import "codemirror/theme/idea.css";
import "codemirror/addon/hint/show-hint.css";
import Codemirror from "codemirror-editor-vue3"
import useVersionInfoStore from '../../store/versionInfo';
import { storeToRefs } from 'pinia';

let versionInfoStore = useVersionInfoStore();
const { rowData } = storeToRefs(versionInfoStore);

// 代码
const code = ref('')
const cmOptions = {
    mode: "cflog",
    lineNumbers: true,
    lineWrapping: true,
}

const versionInfo = reactive({
    name: '',
})

// websocket 对象
var ws;

const cmRef = ref('')

// 代码编辑器
const onChange = (val, cm) => {
    // console.log('onChange', val);
}

const onInput = (val) => {
    // console.log('onInput', val);
};

const onReady = (cm) => {
    // console.log('onReady', cm.focus());
};

// 保存代码
const compileAppClick = async () => {
    let { data } = await apiVersionBuild(rowData.value.id)
    if (data.code == 200) {
        ElMessage({
            type: 'info',
            message: '开始进行编译',
        })
    }
}

onMounted( async() => {
    cmRef.value.refresh()
    code.value = ''

    let url = `ws://${window.location.host}/api/v1/repo/version/ws/${rowData.value.id}`
    ws = new WebSocket(url)
    ws.onmessage = (value) => {
        code.value += `${value.data}\n`
    }
})

onUnmounted(() => {
    cmRef.value.destroy()
})

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
</style>
