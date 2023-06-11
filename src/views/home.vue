<template>
    <div class="home-warp">
        <el-container class="home-main">
            <el-header class="home-header">程序版本管理系统</el-header>
            <el-container>
                <el-main>
                    <div>
                        <RepoMana />
                    </div>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup name="home">
import { ref } from 'vue'

import RepoMana from './repoMana/index.vue'

const tabPosition = ref('top')
const stepIndex = ref(0)
const stepIndexActive = ref('0')


const tabClick = (tab, event) => {
    console.log(JSON.stringify(tab));
    console.log('tab.paneName', typeof tab.paneName);
    stepIndex.value = +tab.paneName
    stepIndexActive.value = tab.paneName
}

// 下一步
const nextStep = () => {
    if (stepIndex.value == 3) return
    stepIndex.value++
    stepIndexActive.value = stepIndex.value.toString()

    console.log('stepIndex.value', stepIndex.value, 'stepIndexActive.value', stepIndexActive.value);
}

const lastStep = () => {
    if (stepIndex.value == 0) return
    stepIndex.value--
    stepIndexActive.value = stepIndex.value.toString()
}

</script>

<style scoped>
.home-warp {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.home-header {
    position: relative;
    display: flex;
    align-items: center;
    height: 40px;
    background: #1a94bc;
    /* text-align: center; */
    font-size: larger;
    color: #fff;
}

.home-main {
    height: 100%;
}

.main-button-menu {
    /* border: #DCDFE6 1px solid; */
    padding: 10px;
    margin-bottom: 10px;
}

.content-box-tab {
    height: 90%;
}

.box-card-button {
    margin-top: 20px;
}
</style>
