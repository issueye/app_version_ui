<template>
    <div class="home-warp">
        <el-container class="home-main">
            <el-header class="home-header">程序版本管理系统</el-header>
            <el-container>
                <el-main class="main-box">
                    <el-row class="page-box">
                        <el-col :span="10">
                            <div class="repo-box">
                                <RepoMana  />
                            </div>
                        </el-col>
                        <el-col :span="14">
                            <div class="workspaces-box">
                                <Workspaces />
                            </div>
                        </el-col>
                    </el-row>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup name="home">
import { ref } from 'vue'

import RepoMana from './repoMana/index.vue'
import Workspaces from './workspaces/index.vue'

</script>

<style scoped>

.repo-box{
    padding: 10px;
    height: 88vh;
    border-right: 1px #DCDFE6 solid;
}

/* 版本管理 */
.workspaces-box{
    padding: 10px;
}

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

.page-box{
    border: 1px #DCDFE6 solid;
}

.box-card-button {
    margin-top: 20px;
}
</style>
