<template>
    <div class="main-content">
        <ButtonPanel>
            <div slot='leftTool'>
                <span>字典名称：</span>
                <el-input v-model="postParams.conditions.name" style="width: 150px;"
                          size="mini"></el-input>
                <el-button type="primary" size="mini" icon="el-icon-search"  style="margin-left:10px;" @click="select">查询</el-button>
            </div>
            <div slot='rightTool' class="rightTool">
                <el-button type="primary" size="mini" icon="el-icon-plus" @click="addDialog">新增</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="logicBatchDeleteConfirm">删除</el-button>
            </div>
        </ButtonPanel>
        <div>
            <WrapPanel :single="true">
                <div slot="leftWrap" style="height:100%;">
                    <el-scrollbar wrap-class="scrollbar-wrapper" class="left-container">
                        <el-tree highlight-current :data="treeData" node-key="id" :props="defaultProps"
                                 :default-expanded-keys="['0']"
                                 @node-click="handleNodeClick"></el-tree>
                    </el-scrollbar>
                </div>
                <div slot="rightWrap" style="padding:20px;">
                    <el-table :data="tableData" border @selection-change="handleSelectionChange">
                        <el-table-column
                            type="selection"
                            width="55">
                        </el-table-column>
                        <el-table-column v-for="(item,index) in columnData"
                                         :key="index"
                                         :label="item.label"
                                         :prop="item.prop"
                                         :width="item.width"
                                         :min-width="item.minWidth"
                                         align="center">
                            <!--<template slot-scope="scope">-->
                            <!--<span>{{scope.row[prop]}}</span>-->
                            <!--</template>-->
                        </el-table-column>
                        <el-table-column :label="$t('table.actions')" align="center" width="230"
                                         class-name="small-padding fixed-width">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" @click="editDictionaryApi(scope.row)">{{
                                    $t('table.edit') }}
                                </el-button>
                                <el-button type="danger" size="mini" @click="removeDictionaryConfirm(scope.row)">{{
                                    $t('table.delete') }}
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <pagination v-show="total>0" :total="total" :page.sync="postParams.pageNumber"
                                :limit.sync="postParams.pageSize" @pagination="getTableApi"/>
                </div>
            </WrapPanel>
        </div>
        <el-dialog :visible.sync="showAddDialog" title="新增字典">
            <el-form ref="addForm" :rules="addRules" :model="addParams" label-position="right" label-width="100px"
                     style="margin-left:50px;margin-right:50px;">
                <el-form-item label="所属字典">
                    <div class="treeBox">
                        <div @click="showInputTree=!showInputTree">
                            <el-input v-model="currentInputTreeNodeName"></el-input>
                        </div>
                        <div class="inputTree" v-show="showInputTree">
                            <el-tree highlight-current :data="treeData" :props="defaultProps" node-key="id"
                                     :default-expanded-keys="['0']"
                                     @node-click="handleInputTreeNodeClick"></el-tree>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="名称">
                    <el-input v-model="addParams.name"></el-input>
                </el-form-item>
                <el-form-item label="编码">
                    <el-input v-model="addParams.code"></el-input>
                </el-form-item>
                <el-form-item label="说明">
                    <el-input v-model="addParams.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showAddDialog = false">{{ $t('table.cancel') }}</el-button>
                <el-button type="primary" @click="dictionaryApi">{{ $t('table.confirm') }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import ButtonPanel from '../../components/ButtonPanel';
import WrapPanel from '../../components/WrapPanel';
import sidebar from '../../views/layout/components/Sidebar/index';
import Pagination from '../../components/Pagination/index';

import { getTree, getTable, addDictionary, editDictionary, removeDictionary, logicBatchDelete } from '../../api/project/dictionary';
import treeUtil from '../../utils/TreeUtil';

const _addParams = {
    id: '',
    parentId: '',
    name: '',
    code: '',
    remark: ''
};

export default {
    name: 'dictionary',
    components: { ButtonPanel, WrapPanel, sidebar, Pagination },
    created() {
        this.getTreeApi();
        this.getTableApi();
    },
    data() {
        return {
            selectedRows: [],
            dialogType: '',
            currentInputTreeNodeName: '',
            showInputTree: false,
            showAddDialog: false,
            addRules: {},
            addParams: { ..._addParams },
            defaultProps: {
                label: 'name',
                children: 'children'
            },
            treeData: [],
            postParams: {
                pageNumber: 1,
                pageSize: 10,
                conditions: {
                    id: 0,
                    name: ''
                }
            },
            total: 0,
            tableData: [],
            columnData: [
                {
                    prop: 'id',
                    label: 'ID',
                    width: 100
                },
                {
                    prop: 'name',
                    label: '名称'
                },
                {
                    prop: 'code',
                    label: '编码',
                    width: 100
                },
                {
                    prop: 'remark',
                    label: '说明'
                },
                {
                    prop: 'seq',
                    label: '排序',
                    width: 80
                },
                {
                    prop: 'state',
                    label: '状态',
                    width: '80'
                }
            ]
        };
    },
    methods: {
        select() {
            this.postParams.conditions.id = '';
            this.getTableApi();
        },
        getCurrentInputTreeNodeName(id, arr) {
            const _this = this;
            if (!arr) {
                arr = [..._this.treeData];
            }
            for (let i = 0; i < arr.length; i++) {
                let item = arr[i];
                if (item.id == id) {
                    return item.name;
                } else if (item.children && item.children.length) {
                    _this.getCurrentInputTreeNodeName(id, item.children);
                }
            }
        },
        logicBatchDeleteConfirm() {
            let rows = this.selectedRows;
            if (!this.selectedRows.length) {
                this.$message({
                    showClose: true,
                    message: '请至少选中一条数据',
                    type: 'warning'
                });
            } else {
                this.$confirm(
                    `批量删除字典：${rows
                        .map((item) => {
                            return item.name;
                        })
                        .toString()}，是否继续`,
                    '提示',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        center: true
                    }
                ).then(() => {
                    rows = rows.map((item) => {
                        return item.id;
                    });
                    logicBatchDelete({ ids: rows }).then((res) => {
                        if (res.data.code == 200) {
                            this.$message({
                                showClose: true,
                                message: '批量删除成功',
                                type: 'success'
                            });
                            this.getTreeApi();
                            this.getTableApi();
                        } else {
                            this.$message({
                                showClose: true,
                                message: '批量删除失败',
                                type: 'error'
                            });
                        }
                    });
                });
            }
        },
        removeDictionaryConfirm(row) {
            this.$confirm(`删除字典：${row.name}，是否继续？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                removeDictionary(row.id).then((res) => {
                    if (res.data.code == 200) {
                        this.$message({
                            showClose: true,
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getTreeApi();
                        this.getTableApi();
                    } else {
                        this.$message({
                            showClose: true,
                            message: '删除失败',
                            type: 'error'
                        });
                    }
                });
            });
        },
        editDictionaryApi(row) {
            const _this = this;
            this.dialogType = 'edit';
            this.showAddDialog = true;
            this.addParams = Object.assign(this.addParams, row);
            var aaa = _this.getCurrentInputTreeNodeName(row.parentId);
            console.log(aaa);
            this.currentInputTreeNodeName = this.getCurrentInputTreeNodeName(row.parentId);
        },
        dictionaryApi() {
            if (this.dialogType == 'add') {
                addDictionary(this.addParams).then((res) => {
                    if (res.data.code == 200) {
                        this.showAddDialog = false;
                        this.$message({
                            showClose: true,
                            message: '新增字典成功',
                            type: 'success'
                        });
                        this.getTreeApi();
                    } else {
                        this.$message({
                            showClose: true,
                            message: `新增失败 , ${res.data.message}`,
                            type: 'error'
                        });
                    }
                });
            } else if (this.dialogType == 'edit') {
                editDictionary(this.addParams).then((res) => {
                    if (res.data.code == 200) {
                        this.showAddDialog = false;
                        this.$message({
                            showClose: true,
                            message: '修改字典成功',
                            type: 'success'
                        });
                        this.getTreeApi();
                        this.getTableApi();
                    }
                });
            }
        },
        addDialog() {
            this.addParams = { ..._addParams };
            this.dialogType = 'add';
            this.currentInputTreeNodeName = '';
            this.showInputTree = false;
            this.showAddDialog = true;
            // this.$nextTick(() => {
            //     this.$refs['addForm'].clearValidate();
            // });
        },
        handleSelectionChange(rows) {
            this.selectedRows = rows;
        },
        getTreeApi() {
            getTree().then((res) => {
                let data = res.data.data;
                let treeData = treeUtil(data);
                this.treeData = treeData;
            });
        },
        getTableApi() {
            getTable(this.postParams).then((respons) => {
                this.tableData = respons.data.data.rows;
                this.total = respons.data.data.total;
            });
        },
        handleNodeClick(data) {
            this.postParams.conditions.id = data.id;
            this.getTableApi();
        },
        handleInputTreeNodeClick(data) {
            this.addParams.parentId = data.id;
            this.currentInputTreeNodeName = data.name;
        }
    }
};
</script>

<style lang="scss" scoped>
.left-container {
    height: 100%;
    overflow: hidden;
}

.main-content {
    padding: 18px;
    background-color: #f0f2f5;
    min-height: calc(100vh - 85px);
    height: 100%;
    .button-panel {
        margin-bottom: 18px;
    }
    .treeBox {
        position: relative;
        .inputTree {
            position: absolute;
            left: 0;
            top: 40px;
            width: 100%;
            padding: 20px;
            max-height: 400px;
            overflow-y: auto;
            border: 1px solid #dcdfe6;
            z-index: 10;
            background-color: #fff;
        }
    }
}
</style>
