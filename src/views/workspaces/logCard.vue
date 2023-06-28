<template>
    <el-card class="card-box">
        <template #header>
            <div class="card-header">
                <h2>版本:{{ title }}</h2>
            </div>
        </template>
        <div class="content-box">
            <h3>创建时间: {{ data.create_at }}</h3>
            <h3>更新内容:</h3>
            <h4 v-for="item in contentList" :key="item"> {{ item }}</h4>
        </div>
    </el-card>
</template>

<script setup name="timeTree">
import { ref, onMounted, onUnmounted, reactive, defineProps } from 'vue'

const props = defineProps({
    data: {
        type: Object,
        default: '',
    },
    content: {
        type: String,
        default: '',
    }
})

let contentList = ref([])
let title = ref([])


onMounted(() => {
    contentList.value = props.content.split('\n')
    title.value = props.data.version
})

onUnmounted(() => { })

</script>

<style scoped>

.card-box{
    padding: 10px;
}

.content-box {
    margin-top: 10px;
}

h1 {
    font-size: 1.7rem;
}

h2 {
    font-size: 1.5rem;
    margin-bottom: 10px;
}

h3 {
    font-size: 1rem;
    margin-bottom: 10px;
}

h4 {
    font-size: 0.6rem;
}
</style>
