<template>
    <div style="position: absolute;width: 100%;height: 100%">
        <el-input id="schedule-box"
            v-model="labelModel"
            @focus.stop="focus"
            suffix-icon="el-icon-arrow-down"
            :placeholder="placeholder">
        </el-input>
        <transition name="el-zoom-in-top">
            <div v-if="treeShow" style="border: 1px solid #ccc;height: 200px;position: relative;z-index: 2;width: 98%;background: #fff;
    margin-left: 1px;overflow: hidden">
                <el-scrollbar wrap-class="el-scrollbar-i" style="height: 99%">
                <el-tree  :data="options"
                          ref="tree"
                          node-key="id"
                          :props="defaultProps"
                          :expand-on-click-node="false"
                          @node-click="nodeClick">
                </el-tree>
                </el-scrollbar>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'index',
    data() {
        return {
            treeShow: false,
            labelModel: '',
            valueModel: ''
        };
    },
    props: {
        placeholder: {
            type: String,
            default: '请选择'
        },
        options: {
            type: Array,
            required: true
        },
        //接收名称
        // labelModel: {
        //     type: String,
        //     required: false
        // },
        value: {
            type: String,
            default: ''
        },
        defaultProps: {
            type: Object,
            required: false,
            default: () => ({
                parent: 'parentId',
                value: 'id',
                label: 'name',
                children: 'children'
            })
        }
    },
    created() {
        this.labelModel = this.value;
    },
    model: {
        prop: 'value',
        event: 'selected'
    },
    mounted() {
        let scheduleBox = document.querySelector('#schedule-box');
        let _that = this;
        document.addEventListener('click', function(e) {
            // 判断被点击的元素是不是scheduleInput元素，不是的话，就隐藏之
            if (e.target !== scheduleBox) {
                _that.treeShow = false;
            }
        });
    },
    methods: {
        focus() {
            this.treeShow = true;
        },
        nodeClick(node) {
            this.labelModel = node[this.defaultProps.label];
            this.valueModel = node[this.defaultProps.value];
            this.treeShow = false;
            this.$emit('nodeClick', node);
        }
    },
    watch: {
        value(nv) {
            this.labelModel = nv;
        }
    }
};
</script>

<style scoped>
</style>
