<template>
    <div class="main-content">
        <buttonPanel>
            <div slot='leftTool'>
                <!--<span></span>-->
                <!--<i>用户名称:</i>-->
                <el-input placehoder="请输入用户名称" style="width: 150px;" size="mini" v-model="keyword">
                    <!--<template slot="prepend">用户名称:</template>-->
                </el-input>
                <el-button type="danger" size="mini" @click="search">查询</el-button>
            </div>
            <div slot='rightTool' class="rightTool">
                <el-button size="mini" circle icon="el-icon-refresh" title="刷新" @click="refresh"></el-button>
                <el-button size="mini" @click="openDialog" type="primary" icon="el-icon-circle-plus-outline">添加用户
                </el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteAll">批量删除</el-button>
                <el-button size="mini" icon="el-icon-loading" @click="clearSearch">清除选中</el-button>
            </div>
        </buttonPanel>
        <WrapPanel :single="false">
            <!-- <div slot="leftWrap">左</div> -->
            <div slot="rightWrap">
                <fast-table :columns='tableColumn'
                            :queryApi="searchCallBack"
                            :updateApi="searchCallBack"
                            :removeApi="deleteCallBack"
                            :enableApi="enableCallBack"
                            :disableApi="disableCallBack"
                            @getSelections="getSelection"
                            @authorization="auth"
                            @rowDetail="openDialog" ref="fastTable"
                            :keyword="name">
                </fast-table>
            </div>
        </WrapPanel>

        <!--信息查看对话框-->
        <el-dialog title="个人信息" :visible.sync="dialogTableVisible" v-el-drag-dialog @dragDialog="handleDrag"
                   @close="closeDialog">
            <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">

                <el-form-item label="启用编辑" style="width: 500px" v-if="ruleForm.id != undefined">
                    <el-switch v-model="edit"></el-switch>
                </el-form-item>
                <el-form-item label="登录名称" prop="name" style="width: 500px">
                    <el-input v-model="ruleForm.accountName"></el-input>
                </el-form-item>
                <el-form-item label="登录密码" prop="name" style="width: 500px" v-if="ruleForm.id == undefined">
                    <el-input v-model="ruleForm.password"></el-input>
                </el-form-item>
                <el-form-item label="用户名称" prop="name" style="width: 500px">
                    <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>

                <el-form-item label="工作编号" prop="jobNum" style="width: 500px">
                    <el-input v-model="ruleForm.jobNum"></el-input>
                </el-form-item>

                <el-form-item label="直属主管" prop="name" style="width: 500px">
                    <el-input v-model="ruleForm.manager"></el-input>
                </el-form-item>

                <el-form-item label="所在部门" prop="rog">
                    <el-select v-model="ruleForm.orgId" placeholder="选择部门">
                        <el-option v-for="(org) in orgList" :label="org.orgName" :value="org.id"
                                   :key="org.id"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="锁定时间" v-if="!edit">
                    <el-col :span="11">
                        <el-form-item prop="lockDate">
                            <el-date-picker type="datetime" placeholder="选择时间"
                                            v-model="ruleForm.lockDate"
                                            style="width: 100%;"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="用户状态">
                    <el-radio-group v-model="ruleForm.state">
                        <el-radio :label="'0'">启动</el-radio>
                        <el-radio :label="'1'">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-form :inline="true" :model="ruleForm" class="demo-inlineForm">
                        <el-form-item label="电子邮箱">
                            <el-input v-model="ruleForm.email" placeholder="电子邮箱"></el-input>
                        </el-form-item>
                        <el-form-item label="电话号码">
                            <el-input v-model="ruleForm.phone" placeholder="电话号码"></el-input>
                        </el-form-item>
                    </el-form>
                </el-form-item>
                <el-form-item label="审核原因" prop="checkReason">
                    <el-input type="textarea" v-model="ruleForm.checkReason"></el-input>
                </el-form-item>

                <!--开启编辑模式才可以显示-->
                <el-form-item v-if="edit">
                    <el-button type="primary" @click="submitForm(ruleForm)">提交</el-button>
                    <el-button @click="resetForm(ruleForm)">重置</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="用户授权" :visible.sync="dialogUserVisible" v-el-drag-dialog @dragDialog="handleDrag"
                   @close="closeDialog" width="540px">
            <el-transfer v-model="authorized" :data="unauthorized"
                         :titles="['未授权角色', '已授权角色']"
            ></el-transfer>
            <el-row style="margin: 20px 0 10px 45px; padding-left: 60%">
                <el-button type="primary" @click="submitAuthForm">提交</el-button>
                <el-button @click="resetAuthForm">重置</el-button>
            </el-row>
        </el-dialog>

    </div>
</template>

<script>
import ButtonPanel from '@/components/ButtonPanel';
import WrapPanel from '@/components/WrapPanel';
import FastTable from '@/components/FastTable';
import {
    getUserList,
    saveUser,
    deleteUser,
    enableUser,
    disableUser,
    getUserAuths,
    batchDeleteUser,
    getUserAuthsById,
    authsUser
} from '@/api/project/user';
import elDragDialog from '@/components/DragDialog';
import { getList } from '@/api/project/org';
// import { hex_md5 } from '@/utils/md5';

export default {
    directives: { elDragDialog },
    data() {
        return {
            keyword: null,
            name: null,
            dialogUserVisible: false,
            authorized: [],
            unauthorized: [],
            //被授权的用户ID
            authUserId: null,
            backAuthorized: [],
            //是否启用对话框的编辑模式
            edit: false,
            //选中行
            selectList: [],
            //传递给table的Api
            searchCallBack: getUserList,
            deleteCallBack: deleteUser,
            disableCallBack: disableUser,
            enableCallBack: enableUser,
            //备份表单，方便还原
            fallbackForm: {},
            orgList: [],
            saveForm: {
                name: null,
                accountName: null,
                lockDate: null,
                email: null,
                phone: null,
                //工号
                jobNum: null,
                checkReason: null,
                manager: null,
                orgId: null
            },
            ruleForm: {
                edit: true
            },
            // rules: {
            //     name: [
            //         { required: true, message: '请输入用户名', trigger: 'blur' },
            //         { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
            //     ],
            //     org: [{ required: true, message: '请选择部门', trigger: 'change' }],
            //     lockDate: [{ type: 'date', required: true, message: '请选择日期', trigger: 'change' }],
            //     checkReason: [{ required: true, message: '请填写审核原因', trigger: 'blur' }]
            // },
            dialogTableVisible: false,
            tableColumn: [
                {
                    text: '登录名称',
                    value: 'accountName',
                    show: true
                },
                {
                    text: '工作编号',
                    value: 'jobNum'
                },
                {
                    text: '用户名称',
                    value: 'name'
                },
                {
                    text: '电话号码',
                    value: 'phone'
                },
                {
                    text: '直属主管',
                    value: 'manager'
                },
                {
                    text: '状态',
                    value: 'state'
                }
            ]
        };
    },
    components: {
        ButtonPanel,
        WrapPanel,
        FastTable
    },
    mounted() {
        this.loadOrg();
        //加载登录用户角色列表
        getUserAuths().then(
            (response) => {
                response.data &&
                    response.data.data &&
                    response.data.data.forEach((item) => {
                        this.unauthorized.push({
                            key: item.id,
                            label: item.name
                        });
                    });
            },
            () => {
                this.$message.error('用户权限数据加载失败');
            }
        );
    },
    methods: {
        search() {
            //中转变量
            this.name = this.keyword;
        },
        loadOrg() {
            getList().then(
                (response) => {
                    if (response.data && response.data.data) {
                        this.orgList = response.data.data;
                    }
                },
                () => {
                    this.$message.error('部门机构信息加载失败');
                }
            );
        },
        confirmMessage(message, type, fn) {
            this.$confirm(message, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: type,
                center: true
            })
                .then(() => {
                    fn.then((response) => {
                        console.log(response);
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    });
                })
                .catch(() => {
                    //失败会调用
                    this.$message({
                        type: 'info',
                        message: '已取消删除!'
                    });
                });
        },
        //用户授权角色
        auth(row) {
            getUserAuthsById(row.id).then(
                (response) => {
                    //清空授权信息
                    this.authorized = [];
                    response.data &&
                        response.data.data &&
                        response.data.data.forEach((item) => {
                            this.authorized.push(item.id);
                            this.backAuthorized = Object.assign([], this.authorized);
                        });
                    this.authUserId = row.id;
                    this.dialogUserVisible = true;
                },
                () => {
                    this.$message.error('授权信息查询失败');
                }
            );
        },
        //对应批量删除按钮
        deleteAll() {
            if (this.selectList && this.selectList.length > 0) {
                this.confirmMessage('是否要所有选中行进行删除?', 'warning', batchDeleteUser({ data: this.deleteAll() }));
            } else {
                this.$message({
                    dangerouslyUseHTMLString: true,
                    message: '请选择需要删除的数据',
                    duration: 1000,
                    type: 'warning'
                });
            }
        },
        handleDrag() {},
        submitAuthForm() {
            authsUser({
                data: {
                    roleIds: this.authorized,
                    userId: this.authUserId
                }
            }).then(
                (response) => {
                    this.dialogUserVisible = false;
                    if (response.data.code == 200) {
                        this.$message.success('成功授权');
                    } else {
                        this.$message.warning('授权失败');
                    }
                    this.dialogUserVisible = false;
                },
                () => {
                    this.dialogUserVisible = false;
                    this.$message.error('服务器调用错误');
                }
            );
        },
        //重置权限框选择
        resetAuthForm() {
            this.authorized = Object.assign([], this.backAuthorized);
        },

        submitForm() {
            saveUser({
                data: this.ruleForm
            }).then(
                (response) => {
                    if (response.code == 200) {
                        this.$message.success('添加成功');
                    } else {
                        this.$message.warning('添加未能成功');
                    }
                    this.dialogTableVisible = false;
                },
                () => {
                    this.dialogTableVisible = false;
                    this.$message.error('添加失败');
                }
            );
        },
        resetForm() {
            this.ruleForm = Object.assign({}, this.fallbackForm);
        },
        openDialog(row) {
            if (row.id == undefined) {
                this.edit = true;
                this.ruleForm = Object.assign({}, this.saveForm);
            } else {
                this.ruleForm = row;
                this.fallbackForm = Object.assign({}, row);
            }
            this.dialogTableVisible = true;
        },
        //关闭对话框 重置所有变量
        closeDialog() {
            this.edit = false;
            for (let key in this.ruleForm) {
                if (this.ruleForm.hasOwnProperty(key)) {
                    this.saveForm[key] = null;
                }
            }
        },
        //刷新列表
        refresh() {
            this.$refs.fastTable.refresh();
        },
        //清除选择框内容
        clearSearch() {
            this.$refs.fastTable.$children[0].clearSelection();
        },
        getSelection(list) {
            this.selectList = list;
        }
    }
};
</script>
<style scope lang="scss">
.main-content {
    padding: 18px;
    background-color: #f0f2f5;
    height: calc(100vh - 85px);
    .button-panel {
        margin-bottom: 18px;
    }
}

.message_tip {
    top: 20%;
}

.demo-inlineForm {
    margin-left: -68px;
}
</style>
