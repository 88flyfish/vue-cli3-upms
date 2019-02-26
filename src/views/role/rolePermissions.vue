<template>
    <el-dialog
            title="配置权限"
            :visible.sync="addVisible"
            :before-close="modalClose"
            :close-on-click-modal="false"
            :close-on-press-escape="false">
        <div>
            <el-steps :active="active" finish-status="success">
                <el-step title="主系统"></el-step>
                <el-step title="系统菜单"></el-step>
                <el-step title="系统按钮"></el-step>
                <el-step title="数据权限"></el-step>
            </el-steps>
            <div class="step-wrap-1" v-if="active=='0'">
                <el-scrollbar wrap-class="el-scrollbar-i" style="height: 100%">
                    <el-table
                        v-loading="loading"
                        ref="multipleTable"
                        :data="tableData1"
                        style="width: 100%"
                        :show-header=false
                        cell-class-name="tab-cell-align"
                        @selection-change="handleSelectionChange">
                    <el-table-column
                            type="selection"
                            width="55">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="姓名" width="200px">
                    </el-table-column>
                    <el-table-column
                            prop="description"
                            label="备注">
                    </el-table-column>
                </el-table>
                </el-scrollbar>
            </div>
            <div class="step-wrap-2" v-if="active=='1'">
                <el-scrollbar wrap-class="el-scrollbar-i" style="height: 100%">
                <el-tree
                        key="one"
                        ref="tree"
                        :data="data2"
                        show-checkbox
                        node-key="id"
                        :props="defaultProps"
                        @check-change="checkChange"
                        >
                </el-tree>
                </el-scrollbar>
            </div>
            <div class="step-wrap-3" v-if="active=='2'">
                <el-scrollbar wrap-class="el-scrollbar-i" style="height: 100%">
                <el-tree
                        key="two"
                        ref="tree3"
                        :data="data3"
                        show-checkbox
                        node-key="id"
                        :props="defaultProps3"
                >
                </el-tree>
                </el-scrollbar>
            </div>
            <div class="step-wrap-4" v-if="active=='3'">
                <el-scrollbar wrap-class="el-scrollbar-i" style="height: 100%">
                <div style="margin-top: 10px;padding-left: 5px">
                    <el-radio v-model="radio1" label="1">仅限本人</el-radio>
                    <el-radio v-model="radio1" label="2">本人及下属</el-radio>
                </div>
                <div style="margin: 18px 0;padding-left: 5px">
                    <el-radio v-model="radio2" label="3">所在机构</el-radio>
                    <el-radio v-model="radio2" label="4">所在机构及子机构</el-radio>
                </div>
                <div style="padding-left: 5px">
                    <el-radio v-model="radio3" label="5">自定义</el-radio>
                    <div v-if="radio3=='5'" style="margin-top: 15px;border-top: 1px solid #f1f1f1">
                        <el-tree
                                    key="three"
                                    ref="tree5"
                                    :data="data5"
                                    show-checkbox
                                    node-key="id"
                                    :props="defaultProps5"
                            ></el-tree>
                    </div>
                </div>
                </el-scrollbar>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="modalClose">取 消</el-button>
            <el-button style="margin-top: 12px;" @click="prev" :disabled="active=='0'">上一步</el-button>
            <el-button style="margin-top: 12px;" @click="next" :disabled="btnFlat">下一步</el-button>
            <el-button type="primary" :disabled="active!='3'" @click="postPermissions">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import { getAllModels, getAllMenus, getAllButton, postPermissions } from '@/api/project/role';
import { getList } from '@/api/project/org';
import treeUtil from '@/utils/treeConfig';
export default {
    data() {
        return {
            addVisible: false,
            active: 0,
            loading: true,
            tableData1: [],
            modelsId: '', //系统id
            modelsIds: [],
            menuIds: [], //菜单id
            permissionIds: [], //系统按钮id
            data2: [], //菜单树
            data3: [], //系统按钮树
            data5: [], //数据权限机构树
            orgIds: [],
            defaultProps: {
                children: 'child',
                label: 'name'
            },
            defaultProps3: {
                children: 'permissionItemList',
                label: 'name'
            },
            defaultProps5: {
                children: 'child',
                label: 'orgName'
            },
            stepsValue: {}, //总提交参数
            btnFlat: true,
            radio1: '1',
            radio2: '3',
            radio3: ''
        };
    },
    created() {
        this.addVisible = this.show;
    },
    props: {
        show: {
            type: Boolean,
            default: false
        },
        roleId: '' //父页面传过来的角色id
    },
    mounted() {
        this.getAllModels();
    },
    methods: {
        //获取系统模块
        getAllModels() {
            getAllModels().then((result) => {
                const r = result.data.data;
                this.tableData1 = r;
                this.loading = false;
            });
        },
        //获取模块菜单
        getAllMenus() {
            getAllMenus(this.modelsId[0].id).then((result) => {
                const data = treeUtil(result.data.data);
                this.data2 = data;
            });
        },
        //获取页面按钮
        getAllButton() {
            let menuIds = this.menuIds.toString();
            getAllButton(menuIds).then((result) => {
                this.data3 = result.data.data;
            });
        },
        //选择系统
        handleSelectionChange(val) {
            this.modelsIds = [];
            this.modelsId = val;
        },
        //选择节点
        checkChange() {
            this.menuIds = this.$refs.tree.getCheckedKeys(true);
        },
        //总提交
        postPermissions() {
            let perType = this.radio1 + this.radio2 + this.radio3;
            if (this.radio3 == '5') {
                this.orgIds = this.$refs.tree5.getCheckedKeys(true);
            } else {
                this.orgIds = [];
            }
            this.stepsValue = {
                roleId: this.roleId,
                moduleIds: this.modelsIds,
                menuIds: this.menuIds,
                permissionIds: this.permissionIds,
                permissionType: perType,
                orgIds: this.orgIds
            };
            postPermissions({ data: this.stepsValue }).then((result) => {
                if (result.data.code == '200') {
                    this.modalClose();
                    this.$message({
                        message: '配置权限成功',
                        type: 'success'
                    });
                }
            });
        },
        //配置数据权限获取机构
        getOrgList() {
            getList().then((result) => {
                this.loading = false;
                const data = treeUtil(result.data.data);
                this.data5 = data;
            });
        },
        modalClose() {
            this.$emit('modalClose');
            this.addVisible = false;
        },
        next() {
            if (this.active == '0') {
                this.btnFlat = true;
                this.modelsIds.push(this.modelsId[0].id);
                this.getAllMenus();
            } else if (this.active == '1') {
                this.menuIds = this.$refs.tree.getCheckedKeys(true);
                this.getAllButton();
            } else if (this.active == '2') {
                this.btnFlat = true;
                this.permissionIds = this.$refs.tree3.getCheckedKeys(true);
            }
            if (this.active++ > 3) this.active = 3;
        },
        prev() {
            if (this.active-- < 0) this.active = 0;
        }
    },
    watch: {
        modelsId(newV) {
            if (newV.length == '0') {
                this.btnFlat = true;
            } else {
                this.btnFlat = false;
            }
        },
        menuIds(newV) {
            if (newV.length == '0') {
                this.btnFlat = true;
            } else {
                this.btnFlat = false;
            }
        },
        radio3(newV) {
            if (newV == '5') {
                this.radio1 = '';
                this.radio2 = '';
                this.getOrgList();
            }
        },
        radio1(newV) {
            if (newV) {
                this.radio3 = '';
                this.orgIds = [];
            }
        },
        radio2(newV) {
            if (newV) {
                this.radio3 = '';
                this.orgIds = [];
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.step-wrap-1 {
    .el-table {
        .tab-cell-align {
            text-align: right;
        }
        td {
            border: none;
        }
    }
}
.el-steps {
    margin-bottom: 25px;
}
.step-wrap-1,
.step-wrap-2,
.step-wrap-3,
.step-wrap-4 {
    height: 400px;
    overflow: auto;
    border: 1px solid #f1f1f1;
    margin-left: -1px;
}
</style>
