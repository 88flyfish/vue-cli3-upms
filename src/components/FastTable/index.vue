<template>
    <div>
        <el-table v-loading="loading" :data="list" :row-style="showRow" style="width: 100%" highlight-current-row
                  border
                  fit
                  @cell-mouse-enter="showDetail"
                  @select="selectRow"
                  @select-all="selectAll">
            <!--设置index 代表出现#123序号-->
            <el-table-column type="index" min-width></el-table-column>
            <!--设置selection 代表出现checkbox-->
            <el-table-column type="selection" min-width></el-table-column>

            <el-table-column v-if="columns.length===0" width="150">
                <template slot-scope="scope">
                    {{ scope.$index }}
                </template>
            </el-table-column>

            <el-table-column v-for="(column) in columns" v-else :key="column.value" :label="column.text"
                             :prop="column.value"
                             :width="column.width ? column.width:computedWidth"
                             :sortable="column.sortable"
                             :align="'center'"
                             :show-overflow-tooltip="column.showOverflowTooltip" :title="column.value">
                <template slot-scope="scope">
                <span v-if='column.show' class="link-type" @click="rowShow(scope.row)">
                        {{ scope.row[column.value] }}
                         </span>
                    <el-tag :type="scope.row.state | statusFilter" v-else-if="column.text=='状态'">{{ scope.row.state |
                        nameFilter}}
                    </el-tag>
                    <span v-else>
                         {{ scope.row[column.value] }}
                 </span>

                </template>
            </el-table-column>

            <el-table-column :label="'操作项'" align="center" v-if="hasOperation" width="300">
                <template slot-scope="scope">
                    <el-row>
                        <el-button type="success" plain size="mini" @click="authorization(scope.row)"
                                   icon="iconfont icon-setting-permissions" v-if="hasPermissionBtn">
                            授权
                        </el-button>
                        <el-button type="success" plain size="mini" icon="iconfont icon-circle-down"
                                   @click="enable(scope.row)"
                                   v-if="scope.row.state=='1' && enableApi">
                            启用
                        </el-button>
                        <el-button type="info" size="mini" icon="iconfont icon-blocked" @click="disable(scope.row)"
                                   v-else-if="scope.row.state=='0' && enableApi">
                            禁用
                        </el-button>
                        <el-button type="primary" size="mini" icon="iconfont icon-pencil1"
                                   @click="modify(scope.row,modifyExtra)"
                                   v-if="modifyApi">
                            修改
                        </el-button>
                        <!--<el-button type="warning" plain size="mini" icon="el-icon-edit" @click="update(scope.row)" v-if="updateApi">修改-->
                        <!--</el-button>-->
                        <el-button type="danger" size="mini" icon="iconfont icon-trash" @click="remove(scope.row)"
                                   v-if="removeApi">删除
                        </el-button>
                        <div>
                            <slot v-if="hasOperation" :scope="scope.row"/>
                        </div>
                    </el-row>
                </template>
            </el-table-column>

        </el-table>
        <div class="block">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="params.pageNumber"
                :page-sizes="[10, 20, 50, 100]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="page.total"
                :background=true>
            </el-pagination>
        </div>
    </div>
</template>

<script>
import Sortable from 'sortablejs';

export default {
    name: 'FastTable',
    props: {
        // data: {
        //     type: [Array, Object],
        //     required: true
        // },
        keyword: {
            type: String
        },
        columns: {
            type: Array,
            default: () => []
        },
        //开启拖拽功能
        enableDrag: {
            type: Boolean,
            default: true
        },
        //传入请求API进行获取数据
        queryApi: {
            type: Function,
            required: true
        },
        //传入更新Api
        updateApi: {
            type: Function
        },
        //传入启用Api
        enableApi: {
            type: Function
        },
        disableApi: {
            type: Function
        },
        hasPermissionBtn: {
            type: Boolean,
            default: false
        },
        //修改按钮
        modifyApi: {
            type: Function
        },
        modifyExtra: {
            type: Object
        },
        //传入移除Api
        removeApi: {
            type: Function
        },
        params: {
            type: Object,
            default: () => {
                return {
                    pageNumber: 1,
                    pageSize: 10
                };
            }
        }
    },
    filters: {
        statusFilter(status) {
            const statusMap = {
                '0': 'success',
                '1': 'danger',
                '9': 'info',
                '3': '',
                '4': 'warning'
            };
            return statusMap[status];
        },
        nameFilter(status) {
            const stateNameMap = {
                '0': '正常',
                '1': '禁用',
                '9': '删除',
                '3': '注册待审核',
                '4': '审核不通过'
            };
            return stateNameMap[status];
        }
    },
    data() {
        return {
            page: {
                total: 1,
                totalPageNum: 1
            },
            loading: false,
            list: null,
            oldList: [],
            newList: [],
            selectList: []
        };
    },
    computed: {
        hasOperation() {
            var validate = function() {
                return function() {
                    let args = arguments[0];
                    let ret = Object.prototype.toString.call(args);
                    return String.prototype.includes.call(ret, 'Function');
                };
            };
            let flag = validate();
            return flag(this.enableApi) || flag(this.removeApi) || flag(this.updateApi);
        },
        computedWidth() {
            return 'auto';
        }
    },
    mounted() {
        this.getList();
    },
    watch: {
        keyword() {
            this.getList();
        }
    },
    methods: {
        refresh() {
            this.getList();
        },
        //获取数据信息
        getList() {
            //加载开始
            this.loading = true;
            this.params.name = this.keyword;
            this.queryApi({
                data: this.params
            }).then(
                (response) => {
                    this.loading = false;
                    this.list = response.data.data.rows;
                    this.page.total = response.data.data.total;
                    this.page.totalPageNum = response.data.data.totalPageNum;

                    if (this.enableDrag) {
                        this.oldList = this.list.map((v) => v.id);
                        this.newIndex = this.oldList.splice();
                        this.$nextTick(() => {
                            this.setSort();
                        });
                    }
                },
                () => {
                    this.loading = false;
                    this.$message.error('获取数据失败');
                }
            );
        },
        //发送事件给父组件
        rowShow(row) {
            this.$emit('rowDetail', row);
        },
        //移动时显示详情
        showDetail(row, column) {
            if (column.showOverflowTooltip) {
                console.log(column);
            }
        },
        showRow: function() {
            return 'animation:treeTableShow 0.4s;-webkit-animation:treeTableShow 0.4s;';
        },

        //监听table选择框事件变化
        selectRow(selection) {
            this.selectList = selection;
            this.getSelections();
        },
        selectAll(selection) {
            this.selectList = selection;
            this.getSelections();
        },
        //暴露给外部的调用方法，来获取选中的row
        getSelections() {
            this.$emit('getSelections', this.selectList);
        },
        //处理分页变化
        handleSizeChange(val) {
            this.params.pageSize = val;
            this.getList();
        },
        handleCurrentChange(val) {
            this.params.pageNumber = val;
            this.getList();
        },
        //托拉拽
        setSort() {
            const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0];
            Sortable.create(el, {
                disabled: !this.enableDrag,
                ghostClass: 'sortable-ghost',
                setData: function(dataTransfer) {
                    dataTransfer.setData('Text', '');
                },
                onEnd: (evt) => {
                    const targetRow = this.list.splice(evt.oldIndex, 1)[0];
                    this.list.splice(evt.newIndex, 0, targetRow);

                    const tempIndex = this.newList.splice(evt.oldIndex, 1)[0];
                    this.newList.splice(evt.newIndex, 0, tempIndex);
                }
            });
        },

        //业务逻辑增删改查
        //授权事件
        authorization(row) {
            this.$emit('authorization', row);
        },
        enable(row) {
            this.enableApi({
                data: {
                    ids: [row.id]
                }
            }).then(
                (response) => {
                    if (response.data.code == 200) {
                        this.$message.success('启用成功!');
                        this.getList();
                    } else {
                        this.$message.error('启用成功!');
                    }
                },
                () => {
                    this.$message.error('服务器调用错误!');
                }
            );
        },
        disable(row) {
            this.disableApi({
                data: {
                    ids: [row.id]
                }
            }).then(
                (response) => {
                    if (response.data.code == 200) {
                        this.$message.success('禁用成功!');
                        this.getList();
                    } else {
                        this.$message.error('禁用失败!');
                    }
                },
                () => {
                    this.$message.error('服务器调用错误!');
                }
            );
        },
        update() {
            this.$message.success('更新');
        },
        modify(data, modifyExtra) {
            this.modifyApi({
                data: { ...data, ...modifyExtra }
            }).then(
                (response) => {
                    if (response.data.code == 200) {
                        this.$message.success('修改成功!');
                        this.getList();
                    } else {
                        this.$message.error('修改失败!');
                    }
                },
                () => {
                    this.$message.error('服务器调用错误!');
                }
            );
        },
        remove(row) {
            this.$confirm('是否确认删除该用户？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            })
                .then(() => {
                    this.removeApi(row.id).then(
                        (response) => {
                            if (response.data.code == 200) {
                                this.$message.success('删除成功!');
                                this.getList();
                            } else {
                                this.$message.error('删除失败!');
                            }
                        },
                        () => {
                            this.$message.error('服务器调用错误!');
                        }
                    );
                })
                .catch(() => {
                    //失败会调用
                    this.$message({
                        type: 'info',
                        message: '已取消删除!'
                    });
                });
        }
    }
};
</script>

<style rel="stylesheet/css" scoped>
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

/*拖拽*/
.sortable-ghost {
    opacity: 0.8;
    color: #fff !important;
    background: #42b983 !important;
}

.block {
    padding: 30px 24px;
    float: right;
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
