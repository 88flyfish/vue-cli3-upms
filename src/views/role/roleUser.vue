<template>
    <el-dialog :title="'角色成员--'+roleName" :visible.sync="outerVisible" :before-close="modalClose" height="800px" width="60%">
        <ButtonPanel style="margin-right: 1px">
            <div slot='leftTool'>
                <span>&nbsp;</span>
            </div>
            <div slot='rightTool' class="rightTool">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="addUser">添加</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="batchRemove">删除</el-button>
            </div>
        </ButtonPanel>
        <div>
            <el-table
                    v-loading="loading"
                    border
                    ref="multipleTable"
                    :data="tableData"
                    @selection-change="selectable">
                <el-table-column
                        type="selection"
                        width="40">
                </el-table-column>
                <el-table-column
                        prop="accountName"
                        label="账号">
                </el-table-column>
                <el-table-column
                        prop="username"
                        label="姓名">
                </el-table-column>
                <el-table-column
                        prop="orgId"
                        label="所属机构">
                </el-table-column>
                <el-table-column
                        prop="jobNum"
                        label="工号">
                </el-table-column>
            </el-table>
        </div>
        <div style="margin-top: 20px">
            <el-pagination
                    key="one"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="outerDialog.currentPage"
                    :page-sizes="[10, 20, 30]"
                    :page-size="outerDialog.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="outerDialog.total">
            </el-pagination>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="modalClose" size="mini">关 闭</el-button>
        </div>
        <el-dialog
                width="60%"
                title="选择用户"
                :visible.sync="innerVisible"
                append-to-body>
            <el-row :gutter="20">
                <el-col :span="6">
                    <div style="border: 1px solid #ccc;height: 500px;overflow: hidden;">
                        <el-scrollbar  wrap-class="el-scrollbar-i" style="height: 100%">
                            <el-tree
                                    key="one"
                                    ref="tree"
                                    :data="treeData"
                                    node-key="id"
                                    :expand-on-click-node="false"
                                    :highlight-current="true"
                                    :default-expanded-keys="[1]"
                                    :props="defaultProps"
                                    @node-click="treeNodeClick"
                            ></el-tree>
                        </el-scrollbar>
                    </div>
                </el-col>
                <el-col :span="17"><el-scrollbar  wrap-class="el-scrollbar-i" style="height: 100%">
                    <div style="height:450px;width: 97%;margin-left: 1px">

                        <el-table
                                v-loading="loading2"
                                border
                                ref="multipleTable2"
                                :data="tableData2"
                                @selection-change="selectable2">
                            <el-table-column
                                    type="selection"
                                    width="40">
                            </el-table-column>
                            <el-table-column
                                    prop="accountName"
                                    label="账号">
                            </el-table-column>
                            <el-table-column
                                    prop="username"
                                    label="姓名">
                            </el-table-column>
                            <el-table-column
                                    prop="orgId"
                                    label="所属机构">
                            </el-table-column>
                            <el-table-column
                                    prop="jobNum"
                                    label="工号">
                            </el-table-column>
                        </el-table>

                    </div></el-scrollbar>
                    <div style="margin-top: 20px">
                        <el-pagination
                                key="two"
                                @size-change="handleSizeChange2"
                                @current-change="handleCurrentChange2"
                                :current-page="innerDialog.currentPage"
                                :page-sizes="[10, 20, 30]"
                                :page-size="innerDialog.pageSize"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="innerDialog.total">
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" size="mini" @click="addUserList">确 定</el-button>
            </div>
        </el-dialog>
    </el-dialog>
</template>

<script>
import ButtonPanel from '@/components/ButtonPanel';
import WrapPanel from '@/components/WrapPanel';
import { roleUserList, userList, addRoleForUserList, delRoleForUser } from '@/api/project/role';
import { getList } from '@/api/project/org';
import treeUtil from '@/utils/TreeUtil';
export default {
    props: {
        show: {
            type: Boolean,
            default: false
        },
        roleId: '', //父页面传过来的角色id
        roleName: '' //父页面传过来的name
    },
    data() {
        return {
            outerVisible: false,
            innerVisible: false,
            loading: true,
            loading2: true,
            tableData: [],
            tableData2: [], //根据机构筛选用户
            treeData: [],
            defaultProps: {
                children: 'children',
                label: 'orgName'
            },
            outerDialog: {
                pageNumber: 1,
                pageSize: 10,
                total: 1,
                currentPage: 1,
                userTable: [],
                roleUsernameList: [],
                roleUserIdList: []
            },
            innerDialog: {
                orgId: '',
                pageNumber: 1,
                pageSize: 10,
                total: 1,
                currentPage: 1,
                userTable: []
            }
        };
    },
    components: { ButtonPanel, WrapPanel },
    created() {
        this.outerVisible = this.show;
    },
    mounted() {
        this.roleUserList();
    },
    methods: {
        //分页获取角色成员
        roleUserList() {
            roleUserList({
                data: {
                    pageSize: this.outerDialog.pageSize,
                    pageNumber: this.outerDialog.pageNumber,
                    conditions: {
                        roleId: this.roleId
                    }
                }
            }).then((result) => {
                this.loading = false;
                this.tableData = result.data.data.rows;
                this.outerDialog.total = result.data.data.total;
            });
        },
        //添加角色用户
        addUser() {
            this.innerVisible = true;
            //获取所有机构
            getList().then((result) => {
                const data = treeUtil(result.data.data, ['orgName', 'linkMan', 'description']);
                this.treeData = data;
            });
            this.userList();
        },
        userList() {
            //获取所有用户
            userList({
                data: {
                    conditions: { orgId: this.innerDialog.orgId },
                    pageSize: this.innerDialog.pageSize,
                    pageNumber: this.innerDialog.pageNumber
                }
            }).then((result) => {
                this.tableData2 = result.data.data.rows;
                this.loading2 = false;
                this.innerDialog.total = result.data.data.total;
            });
        },
        addUserList() {
            let userIds = [];
            for (let i in this.innerDialog.userTable) {
                userIds.push(this.innerDialog.userTable[i].id);
            }
            addRoleForUserList({ data: { userIds: userIds, roleId: this.roleId } }).then((result) => {
                if (result.data.code == '200') {
                    this.innerVisible = false;
                    this.roleUserList();
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    });
                }
            });
        },
        //第一个表格选择
        selectable(val) {
            this.outerDialog.userTable = val;
        },
        //第二个表格选择
        selectable2(val) {
            this.innerDialog.userTable = val;
        },
        //树节点点击
        treeNodeClick(node) {
            this.innerDialog.orgId = node.id;
            this.userList();
        },
        //第一个分页
        handleSizeChange(val) {
            this.outerDialog.pageSize = val;
            this.roleUserList();
        },
        handleCurrentChange(val) {
            this.outerDialog.pageNumber = val;
            this.roleUserList();
        },
        //第二个分页
        handleSizeChange2(val) {
            this.innerDialog.pageSize = val;
            this.userList();
        },
        handleCurrentChange2(val) {
            this.innerDialog.pageNumber = val;
            this.userList();
        },
        //删除角色用户
        batchRemove() {
            if (!this.outerDialog.userTable.length) {
                this.$notify({
                    title: '警告',
                    message: '请选择用户',
                    type: 'warning'
                });
                return false;
            }
            for (let i in this.outerDialog.userTable) {
                this.outerDialog.roleUserIdList.push(this.outerDialog.userTable[i].id);
                this.outerDialog.roleUsernameList.push(this.outerDialog.userTable[i].username);
            }
            this.$confirm('删除 [' + this.outerDialog.roleUsernameList + '], 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delRoleForUser({
                    data: {
                        roleId: this.roleId,
                        userIds: this.outerDialog.roleUserIdList
                    }
                })
                    .then(() => {
                        this.roleUserList();
                        this.outerDialog.userTable = [];
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    })
                    .catch(() => {});
            });
        },
        modalClose() {
            this.$emit('modalClose');
            this.outerVisible = false;
        }
    }
};
</script>
<style scope>
</style>
