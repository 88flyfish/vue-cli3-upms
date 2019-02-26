<template>
    <div class="wrap-panel">
        <el-container>
            <el-aside width="250px" v-show="single">
                <slot name='leftWrap'></slot>
            </el-aside>
            <el-main>
                <slot name='rightWrap'></slot>
            </el-main>
        </el-container>
    </div>
</template>

<script>
export default {
    props: {
        single: true
    },
    name: 'single'
};
</script>

<style lang="scss" scoped>
.el-aside {
    /*height: 854px;*/
    height: calc(100vh - 189px);
    background: #fff;
    margin-right: 19px;
    border-radius: 4px;
}
.el-main {
    /*min-height: 854px;*/
    height: calc(100vh - 189px);
    background: #fff;
    border-radius: 4px;
    margin-right: 19px;
    padding: 0;
}
</style>
