<template>
    <div class="main-content">
        <ButtonPanel>
            <div slot='leftTool'>
                <span>&nbsp;</span>
                <!--<el-input placeholder="请输入内容" style="width: 150px;"></el-input>-->
                <!--<el-button type="primary" size="mini">查询</el-button>-->
            </div>
            <div slot='rightTool' class="rightTool">
                <el-button type="primary" size="mini" @click="add" icon="el-icon-edit">新增</el-button>
            </div>
        </ButtonPanel>
        <div>
            <WrapPanel :single="false">
                <div slot="rightWrap">
                    <tree-table  :data="treeData" :firstColumn="firstColumn" :eval-func="func" :title="title" :loading="loading" border>
                        <!--<el-table-column label="机构名称">-->
                            <!--<template slot-scope="scope">-->
                                <!--<span style="color:sandybrown">{{ scope.row.orgName }}</span>-->
                            <!--</template>-->
                        <!--</el-table-column>-->
                        <el-table-column label="机构管理员">
                            <template slot-scope="scope">
                                <span style="color:sandybrown">{{ scope.row.linkMan }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="备注">
                            <template slot-scope="scope">
                                <span style="color:sandybrown">{{ scope.row.description }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="200">
                            <template slot-scope="scope" v-if="scope.row.parentId!='-1'">
                                <el-button type="primary" size="mini" @click="editor(scope.row)" icon="el-icon-edit">修改</el-button>
                                <el-button type="danger" size="mini" @click="del(scope.row)" icon="el-icon-delete">删除</el-button>
                            </template>
                        </el-table-column>
                    </tree-table>
                </div>
            </WrapPanel>
        </div>
        <!--新增-->
        <div>
            <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
                <el-form :model="form">
                    <el-form-item label="机构名称" :label-width="formLabelWidth">
                        <el-input v-model="form.orgName" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="所属机构" :label-width="formLabelWidth">
                        <!--<select-tree width="100%" :options="treeData" v-model="form.parentId" :placeholder="form.orgName"/>-->
                        <treeSelect
                                :defaultProps="defaultProps"
                                :options="treeData"
                                v-model="selected"
                                :placeholder="form.parentId?form.parentId:'请选择'"
                                @nodeClick="nodeClick"
                        ></treeSelect>
                    </el-form-item>
                    <el-form-item label="机构管理员" :label-width="formLabelWidth">
                        <el-input v-model="form.linkMan" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="管理员电话" :label-width="formLabelWidth">
                        <el-input v-model="form.phone" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="管理员邮箱" :label-width="formLabelWidth">
                        <el-input v-model="form.email" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="备注" :label-width="formLabelWidth">
                        <el-input v-model="form.description" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="updata">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import treeTable from '@/components/TreeTable';
import treeToArray from '@/components/TreeTable/customEval';
import ButtonPanel from '@/components/ButtonPanel';
import WrapPanel from '@/components/WrapPanel';
import treeSelect from '@/components/SelectTree';
import treeUtil from '@/utils/TreeUtil';
import { getList, updata, singleDelete, getById, editor } from '@/api/project/org';
const FORM_INIT = {
    orgName: '',
    parentId: '',
    linkMan: '',
    phone: '',
    email: '',
    description: ''
};
export default {
    data() {
        return {
            func: treeToArray,
            treeData: [],
            loading: true,
            title:"orgName",
            dialogFormVisible: false,
            formLabelWidth: '120px',
            dialogTitle: '添加',
            form: { ...FORM_INIT },
            selected: '选择机构',
            defaultProps: {
                children: 'children',
                label: 'orgName',
                value: 'id'
            },
            firstColumn: "机构名称"
        };
    },
    components: {
        treeTable,
        ButtonPanel,
        WrapPanel,
        treeSelect
    },
    mounted() {
        this.getList();
    },
    methods: {
        getList() {
            getList().then((result) => {
                this.loading = false;
                const data = treeUtil(result.data.data, ['orgName', 'linkMan', 'description']);
                this.treeData = data;
            });
        },
        //新增
        updata() {
            if (this.dialogTitle == '添加') {
                updata({ data: this.form }).then((result) => {
                    if (result.data.code == '200') {
                        this.dialogFormVisible = false;
                        this.getList();
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
                        this.getList();
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                    }
                });
            }
        },
        //删除
        del(row) {
            this.$confirm('删除 [' + row.orgName + '] 机构, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    singleDelete(row.id).then((result) => {
                        if (result.data.code == '200') {
                            this.getList();
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                        }
                    });
                })
                .catch(() => {});
        },
        add() {
            this.dialogFormVisible = true;
            this.dialogTitle = '添加';
            this.form = { ...FORM_INIT };
            this.form.id = '';
            this.selected = '';
        },
        //修改
        editor(row) {
            this.dialogTitle = '修改';
            getById(row.id).then((result) => {
                const r = result.data.data;
                this.form = {
                    orgName: r.orgName,
                    parentId: r.parentId,
                    linkMan: r.linkMan,
                    phone: r.phone,
                    email: r.email,
                    description: r.description,
                    id: r.id
                };
                this.selected = r.parentName;
                this.dialogFormVisible = true;
            });
        },
        nodeClick(node) {
            this.form.parentId = node.id;
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
    .el-table_1_column_35 {
        .cell {
            text-align: center;
        }
    }
}
</style>
