<template>
    <div class="kv-box">
        <el-row :gutter="5">
            <el-col :span="20">
                <el-row :gutter="2">
                    <el-col :span="props.nameSize">
                        <el-tooltip effect="dark" :content="data.name" placement="top-start">
                            <el-input v-model="data.name" :disabled="enable" />
                        </el-tooltip>

                    </el-col>
                    <el-col :span="props.valueSize">
                        <el-tooltip effect="dark" :content="data.value" placement="top-start">
                            <el-input v-model="data.value" :disabled="enable" />
                        </el-tooltip>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="4">
                <el-button type="primary" @click="onModifyClick">{{ enable ? '编辑' : '保存' }}</el-button>
                <el-button type="danger" @click="onDeleteClick">删除</el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script setup name="kv">
import { ref, onMounted, onUnmounted, reactive } from 'vue'
import { ElMessage } from 'element-plus';

const enable = ref(true)

const props = defineProps({
    name: '',
    value: {
        required: true,
    },
    nameSize: {
        type: Number,
        default: 12,
    },
    valueSize: {
        type: Number,
        default: 12,
    }
})

const emits = defineEmits([
    'update:value',
    'delete:value'
])

const data = reactive({
    name: '',
    value: '',
})

data.name = props.name
data.value = props.value

const onModifyClick = () => {
    enable.value = !enable.value

    if (enable.value) {
        emits('update:value', data);
    }
}

const onDeleteClick = () => {
    emits('delete:value', data);
}

onMounted(async () => { })

onUnmounted(() => { })

</script>

<style scoped>
.kv-box {
    margin-bottom: 2px;
}
</style>
