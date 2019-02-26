<template>
  <el-table :data="formatData" :row-style="showRow" v-bind="$attrs" v-loading="loading">
    <el-table-column  v-if="columns.length===0" width="150" :label="firstColumn">
      <template slot-scope="scope">
        <span v-for="space in scope.row._level" :key="space" class="ms-tree-space"/>
        <span v-if="iconShow(0,scope.row)" class="tree-ctrl" @click="toggleExpanded(scope.$index)">
          <i v-if="!scope.row._expanded" class="el-icon-plus"/>
          <i v-else class="el-icon-minus"/>
        </span>
        {{ scope.row.orgName || scope.$index }}
      </template>
    </el-table-column>
    <el-table-column v-for="(column, index) in columns" v-else :key="column.value" :label="column.text"
                         :width="column.width">
      <template slot-scope="scope">
                <!-- Todo -->
                <!-- eslint-disable-next-line vue/no-confusing-v-for-v-if -->
        <span v-for="space in scope.row._level" v-if="index === 0" :key="space" class="ms-tree-space"/>
        <span v-if="iconShow(index,scope.row)" class="tree-ctrl" @click="toggleExpanded(scope.$index)">
          <i v-if="!scope.row._expanded" class="el-icon-plus"/>
          <i v-else class="el-icon-minus"/>
        </span>
        <span v-if='column.show' class="link-type">
             {{ scope.row[column.value] }}
        </span>
        <span v-else>
             {{ scope.row[column.value] }}
        </span>
      </template>
    </el-table-column>
    <slot/>
  </el-table>
</template>

<script>
/**
     Auth: Lei.j1ang
     Created: 2018/1/19-13:59
     */
import treeToArray from './eval';

export default {
    name: 'TreeTable',
    props: {
        /* eslint-disable */
        data: {
            type: [Array, Object],
            required: true
        },
        columns: {
            type: Array,
            default: () => []
        },
        evalFunc: Function,
        evalArgs: Array,
        expandAll: {
            type: Boolean,
            default: false
        },
        loading: true,
        firstColumn:String
    },
    computed: {
        // 格式化数据源
        formatData: function() {
            let tmp;
            if (!Array.isArray(this.data)) {
                tmp = [this.data];
            } else {
                tmp = this.data;
            }
            const func = this.evalFunc || treeToArray;
            const args = this.evalArgs ? Array.concat([tmp, this.expandAll], this.evalArgs) : [tmp, this.expandAll];
            return func.apply(null, args);
        }
    },
    methods: {
        row(row, column, cell, event) {
            console.log(row);
            if (row.show) {
                alert(row);
            }
        },
        showRow: function(row) {
            const show = row.row.parent ? row.row.parent._expanded && row.row.parent._show : true;
            row.row._show = show;
            return show ? 'animation:treeTableShow 0.4s;-webkit-animation:treeTableShow 0.4s;' : 'display:none;';
        },
        // 切换下级是否展开
        toggleExpanded: function(trIndex) {
            const record = this.formatData[trIndex];
            record._expanded = !record._expanded;
        },
        // 图标显示
        iconShow(index, record) {
            return index === 0 && record.children && record.children.length > 0;
        }
    }
}
</script>
<style rel="stylesheet/css">
@-webkit-keyframes treeTableShow {
    from {
        -webkit-transform: translate3d(0, -100%, 0);
        transform: translate3d(0, -100%, 0);
        visibility: visible;
    }

    to {
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
    }
}

@keyframes treeTableShow {
    from {
        -webkit-transform: translate3d(0, -100%, 0);
        transform: translate3d(0, -100%, 0);
        visibility: visible;
    }

    to {
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
    }
}
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
$color-blue: #2196f3;
$space-width: 18px;
.ms-tree-space {
    position: relative;
    top: 1px;
    display: inline-block;
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: $space-width;
    height: 14px;
    &::before {
        content: '';
    }
}

.processContainer {
    width: 100%;
    height: 100%;
}

table td {
    line-height: 26px;
}

.tree-ctrl {
    position: relative;
    cursor: pointer;
    color: $color-blue;
    margin-left: -$space-width;
}

// 变色选中
.link-type {
    color: #337ab7;
    cursor: pointer;
}

.link-type:hover {
    color: #409eff;
    cursor: pointer;
}
</style>
