<template>
    <div class="button-panel">
        <el-row>
            <el-col :span="14" style="padding-left: 24px"><slot name='leftTool'></slot></el-col>
            <el-col :span="10" style="text-align: right;padding-right: 24px"><slot name='rightTool'></slot></el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: 'index'
};
</script>

<style lang="scss" scoped>
.button-panel {
    height: 50px;
    line-height: 50px;
    background: rgba(66,185,131,.1);
    border-radius: 4px;
    margin-right: 19px;
    margin-bottom: 20px;
}
</style>
