<template>
    <div class="content-box">
        <div class="header-box">
            <el-form :model="form" label-width="120px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="仓库名称">
                            <el-input disabled v-model="form.name" />
                        </el-form-item>
                    </el-col>

                    <el-col :span="6" class="button-group-box">
                        <el-button-group>
                            <el-button type="primary">打开仓库</el-button>
                            <el-button type="primary">添加版本</el-button>
                            <el-button type="primary" disabled>保存</el-button>
                        </el-button-group>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <el-divider class="header-divider" />
        <div>
            <el-form :model="form" label-width="120px" disabled>
                <el-row>
                    <el-col :span="5">
                        <el-form-item label="分支名称">
                            <el-input v-model="form.branch" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="Tag">
                            <el-select v-model="form.type" placeholder="Select">
                                <el-option v-for="item in options" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="版本">
                            <el-input-number v-model="form.version_x" class="input-number-version" :min="form.min_x"
                                controls-position="right" @change="handleChange" />
                            <el-input-number v-model="form.version_y" class="input-number-version" :min="form.min_y"
                                controls-position="right" @change="handleChange" />
                            <el-input-number v-model="form.version_z" class="input-number-version" :min="form.min_z"
                                controls-position="right" @change="handleChange" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="19">
                        <el-form-item label="内容">
                            <el-input type="textarea" :rows="5" v-model="form.content" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

        </div>

        <el-table :data="tableData" stripe style="width: 100%" @row-click="rowClick">
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
    </div>
</template>

<script setup name="workspaces">
import { reactive, ref } from 'vue'

const options = [
    {
        label: 'Alpha',
        value: 'Alpha',
    },
    {
        label: 'Beta',
        value: 'Beta',
    },
    {
        label: 'RC',
        value: 'RC',
    }
]

const form = reactive({
    name: 'Alpha',
    type: 'Alpha',
    version_x: 2,
    version_y: 10,
    version_z: 3,
    min_x: 2,
    min_y: 10,
    min_z: 3
})

const tableData = [
    {
        name: 'LineServer-v2.10.3.20230611-Beta',
        version: 'v2.10.3',
        tag: 'Alpha',
        create_at: '2023-06-11 22:15:00',
        content: '这是一段这个仓库的简单介绍，更新了内容说明的功能，并且能够在点击每一行的时候都在上面的form中显示出内容来',
        branch: 'master',
        commit_hash: '',
    },
    {
        name: 'LineServer-v2.10.4.20230611-Beta',
        version: 'v2.10.4',
        tag: 'Beta',
        create_at: '2023-06-11 22:15:00',
        content: '这是一段这个仓库的简单介绍，更新了内容说明的功能，并且能够在点击每一行的时候都在上面的form中显示出内容来',
        branch: 'main',
        commit_hash: '',
    }
]

const rowClick = (row, event, column) => {
    form.name = row.name
    form.content = row.content
    form.type = row.tag
    form.branch = row.branch
    let v = row.version
    v = v.substring(1)
    let data = v.split('.')
    form.min_x = +data[0]
    form.min_y = +data[1]
    form.min_z = +data[2]

    form.version_x = +data[0]
    form.version_y = +data[1]
    form.version_z = +data[2]
}

</script>

<style scoped>
.input-number-version {
    margin-right: 2px;
    width: 90px;
}

.header-divider {
    margin: 10px 0;
}

.button-group-box {
    margin-left: 20px;
}

.detail-table-box {
    margin-right: 30%;
    margin-left: 10px;
}
</style>
