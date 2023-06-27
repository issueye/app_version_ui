<template>
    <el-timeline>
        <el-timeline-item v-for="data in tableData" :timestamp="data.create_at" placement="top">
            <el-card>
                <h4>{{ data.app_name }}</h4>
                <rContent />
            </el-card>
        </el-timeline-item>
    </el-timeline>
</template>

<script setup name="timeTree">
import { ref, onMounted, onUnmounted, reactive, h } from 'vue'
import { apiVersionList } from '../../api/repo';
import { ElMessage } from 'element-plus';
import bus from '../../bus';

let tableData = ref([])

// 明细表单信息
const detailForm = reactive({
    tag: '',
    branch: '',
    repo_id: '',
})

const rContent = {
    render: () => {
        let labels = []
        tableData.value.forEach((e) => {
            let datas = e.content.split('\n')

            datas.forEach((e) => {
                labels.push(h("p", e))
            })
        })

        return h("div", null, labels)
    }
}

onMounted(() => {
    // 编辑窗口打开
    bus.$on('mitt-time-tree-open', (val) => {
        editOpen(val)
    })
})

onUnmounted(() => {
    bus.$off('mitt-time-tree-open', () => { })
})
// 编辑代码弹窗打开
const editOpen = async (val) => {
    detailForm.repo_id = val.repo_id
    // 获取当前仓库的所有版本信息
    let { data } = await apiVersionList(detailForm)
    if (data.code == 200) {
        tableData.value = data.data
    }
}

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
