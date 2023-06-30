<template>
    <div class="content-box">
        <div class="content-detail-box">
            <el-form :model="detailForm" label-width="75px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="发布类型:">
                            <el-select v-model="detailForm.tag" :clearable="true" placeholder="请选择 tag" @change="tagChange">
                                <el-option v-for="item in tagOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="分支:">
                            <el-select v-model="detailForm.branch" :clearable="true" placeholder="请选择分支"
                                @change="branchChange">
                                <el-option v-for="item in branchOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <el-divider class="header-divider" />
        <div class="tree-box">
            <el-scrollbar height="70vh">
                <el-timeline>
                    <el-timeline-item v-for="data in tableData" :key="data.id" :timestamp="data.create_at" placement="top">
                        <LogCard :data="data" :content="data.content" />
                    </el-timeline-item>
                </el-timeline>
            </el-scrollbar>
        </div>
    </div>
</template>

<script setup name="timeTree">
import { ref, reactive } from 'vue'
import { apiVersionList } from '../../api/repo';
import LogCard from './logCard.vue'
import useRepoInfoStore from '../../store/repoInfo';
import { storeToRefs } from 'pinia';

// 仓库状态管理
let repoInfoStore = useRepoInfoStore();

const { id, branchOptions, tagOptions } = storeToRefs(repoInfoStore);
let tableData = ref([])

// 明细表单信息
const detailForm = reactive({
    tag: '',
    branch: '',
    repo_id: '',
})

const getData = async () => {
    // 获取当前仓库的所有版本信息
    detailForm.repo_id = id.value
    let { data } = await apiVersionList(detailForm)
    if (data.code == 200) {
        tableData.value = data.data
    }
}

getData()

// tag 发生变化时
const tagChange = (val) => {
    detailForm.tag = val
    getData()
}

const branchChange = (val) => {
    detailForm.branch = val
    getData()
}

</script>

<style scoped>
.content-box {
    height: 80vh;
}

.tree-box {
    margin: 20px;
}

.header-divider {
    margin-top: 10px;
    margin-bottom: 0px;
}
</style>
