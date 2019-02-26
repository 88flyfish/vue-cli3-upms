<template>
    <div class="main-content">
        <ButtonPanel>
            <div slot='leftTool'>
                <span style="color: #fafafa">角色名：</span>
                <el-input placeholder="请输入内容" style="width: 150px;" v-model="rolePages.conditions.name"></el-input>
                <el-button size="mini" type="primary" icon="el-icon-search" style="margin-left:10px" @click="search">查询</el-button>
            </div>
            <div slot='rightTool' class="rightTool">
                <el-button type="primary" size="mini" icon="el-icon-setting" @click="permissions">角色权限</el-button>
                <el-button type="primary" size="mini" icon="el-icon-setting" @click="roleUser">角色成员</el-button>
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="add">新增</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="batchRemove">删除</el-button>
            </div>
        </ButtonPanel>
        <div>
            <WrapPanel :single="false">
                <div slot="rightWrap">
                    <el-table
                            border
                            ref="multipleTable"
                            :data="tableData"
                            tooltip-effect="dark"
                            style="width: 100%"
                            @selection-change="handleSelectionChange">
                        <el-table-column
                                type="selection"
                                width="55">
                        </el-table-column>
                        <el-table-column
                                label="角色名称"
                                width="300">
                            <template slot-scope="scope">{{ scope.row.name }}</template>
                        </el-table-column>
                        <el-table-column
                                prop="description"
                                label="角色描述"
                                show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column label="操作" width="200">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" @click="editor(scope.row)" icon="el-icon-edit">修改</el-button>
                                <!--预留启/停用功能-->
                                <!--<el-button type="success" size="mini" @click="stop(scope.row)" icon="el-icon-success" v-if="roleState">已启用</el-button>-->
                                <!--<el-button type="info" size="mini" @click="start(scope.row)" icon="el-icon-warning" v-else>已停用</el-button>-->
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="rolePages.currentPage"
                            :page-sizes="[10, 20, 30]"
                            :page-size="rolePages.pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :background=true
                            :total="rolePages.total">
                    </el-pagination>
                </div>
            </WrapPanel>
        </div>
        <!--新增角色-->
        <div>
            <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
                <el-form :model="form">
                    <el-form-item label="角色名称" :label-width="formLabelWidth">
                        <el-input v-model="form.name" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="备注" :label-width="formLabelWidth">
                        <el-input v-model="form.description"   type="textarea"
                                  :rows="2" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="updata">确 定</el-button>
                </div>
            </el-dialog>
        </div>
        <!--步骤条窗口-->
        <rolePermissions v-if="rolePermissionsShow" :show="rolePermissionsShow" :roleId="multipleSelection[0].id" @modalClose="rolePermissionsModel"/>
        <!--角色成员窗口-->
        <roleUser  v-if="roleUserShow" :show="roleUserShow" :roleId="multipleSelection[0].id" :roleName="multipleSelection[0].name" @modalClose="roleUserModel"/>
    </div>
</template>

<script>
import ButtonPanel from '@/components/ButtonPanel';
import WrapPanel from '@/components/WrapPanel';
import rolePermissions from './rolePermissions';
import roleUser from './roleUser';
import { rolePage, addRole, batchRemove, editor, getById } from '@/api/project/role';
const FORM_INIT = {
    name: '',
    description: ''
};
export default {
    data() {
        return {
            rolePermissionsShow: false,
            roleUserShow: false,
            tableData: [],
            formLabelWidth: '120px',
            multipleSelection: [],
            dialogFormVisible: false,
            dialogTitle: '添加',
            roleState: true,
            rolePages: {
                pageNumber: 1,
                pageSize: 10,
                total: 1,
                currentPage: 1,
                conditions: {
                    name: ''
                }
            },
            form: { ...FORM_INIT },
            roleIdList: [],
            roleNameList: []
        };
    },
    components: { ButtonPanel, WrapPanel, rolePermissions, roleUser },
    mounted() {
        this.rolePage();
    },
    methods: {
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        //配置权限
        permissions() {
            if (this.multipleSelection.length != '1') {
                this.$notify({
                    title: '警告',
                    message: '请选择一条角色',
                    type: 'warning'
                });
                return false;
            }
            this.rolePermissionsShow = true;
        },
        rolePermissionsModel() {
            this.rolePermissionsShow = false;
        },
        roleUserModel() {
            this.roleUserShow = false;
        },
        // 新增角色
        add() {
            this.dialogTitle = '添加';
            this.dialogFormVisible = true;
            this.form = { ...FORM_INIT };
            this.form.id = '';
        },
        //修改角色
        editor(row) {
            this.dialogFormVisible = true;
            this.dialogTitle = '修改';
            getById(row.id).then((result) => {
                const r = result.data.data;
                this.form = {
                    name: r.name,
                    description: r.description,
                    id: r.id
                };
            });
        },
        updata() {
            if (this.dialogTitle == '添加') {
                addRole({ data: this.form }).then((result) => {
                    if (result.data.code == '200') {
                        this.dialogFormVisible = false;
                        this.rolePage();
                        this.$message({
                            message: '添加成功',
                            type: 'success'
                        });
                    }
                });
            } else {
                editor({ data: this.form }).then((result) => {
                    if (result.data.code == '200') {
                        this.dialogFormVisible = false;
                        this.rolePage();
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                    }
                });
            }
        },
        //批量删除
        batchRemove() {
            if (!this.multipleSelection.length) {
                this.$notify({
                    title: '警告',
                    message: '请选择角色',
                    type: 'warning'
                });
                return false;
            }
            for (let i in this.multipleSelection) {
                this.roleIdList.push(this.multipleSelection[i].id);
                this.roleNameList.push(this.multipleSelection[i].name);
            }
            this.$confirm('删除 [' + this.roleNameList + '], 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    batchRemove({ data: this.roleIdList }).then(() => {
                        this.rolePage();
                        this.multipleSelection = [];
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    });
                })
                .catch(() => {});
        },
        //角色名搜索
        search() {
            this.rolePage();
        },
        //配置用户
        roleUser() {
            if (this.multipleSelection.length != '1') {
                this.$notify({
                    title: '警告',
                    message: '请选择一条角色',
                    type: 'warning'
                });
                return false;
            }
            this.roleUserShow = true;
        },
        //分页获取角色列表
        rolePage() {
            rolePage({
                data: {
                    pageSize: this.rolePages.pageSize,
                    pageNumber: this.rolePages.pageNumber,
                    conditions: this.rolePages.conditions
                }
            }).then((result) => {
                const r = result.data.data;
                this.tableData = r.rows;
                this.rolePages.total = r.total;
            });
        },
        handleSizeChange(val) {
            this.rolePages.pageSize = val;
            this.rolePage();
        },
        handleCurrentChange(val) {
            this.rolePages.pageNumber = val;
            this.rolePage();
        }
    }
};
</script>
<style scope lang="scss">
.main-content {
    padding: 18px;
    background-color: #f0f2f5;
    min-height: calc(100vh - 85px);
    height: 100%;
    .button-panel {
        margin-bottom: 18px;
    }
    .el-input {
        input {
            height: 29px;
        }
    }
    .el-table__row td:last-child {
        text-align: center;
    }
}
</style>
