<template>
    <div class="home-warp">
        <el-container class="home-main">
            <el-header class="home-header">
                <img class="header-logo" :src="imgUrl">
                <div class="header-title-box"> 程序版本管理系统 </div>
            </el-header>
            <el-container>
                <el-main class="main-box">
                    <div class="contaier-box">
                        <div class="left-box">
                            <RepoMana />
                        </div>
                        <div class="right-box">
                            <Workspaces />
                        </div>
                    </div>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup name="home">

import RepoMana from './repoMana/index.vue'
import Workspaces from './workspaces/index.vue'
import imgUrl from '../assets/icon.png'

</script>

<style scoped>
.contaier-box {
    /* border: 1px #DCDFE6 solid; */
    height: 100%;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
}

.left-box {
    float: left;
    width: 25%;
    height: 100%;
    border-right: 1px #DCDFE6 solid;
}

.right-box {
    width: 75%;
}

.home-warp {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #e9eaec;
}

.home-header {
    position: relative;
    display: flex;
    align-items: center;
    height: 40px;
    background: #256CFD;
}

.header-title-box {
    font-size: larger;
    color: #fff;
}

.header-logo {
    height: 25px;
    width: 25px;
    margin-right: 10px;
}

.home-main {
    height: 100%;
}


.page-box {
    border: 1px #DCDFE6 solid;
}
</style>
