<template>
    <div class="main-content">
        <ButtonPanel>
            <div slot='leftTool'>
                <span style="display:inline-block"></span>
            </div>
            <div slot='rightTool' class="rightTool">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="add">新增</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteBatch">批量删除</el-button>
            </div>
        </ButtonPanel>
        <div>
            <WrapPanel :single="false">
                <div slot="rightWrap">
                    <fast-table :columns='tableColumn'
                                :queryApi="searchCallBack"
                                :updateApi="searchCallBack"
                                :removeApi="deleteCallBack"
                                :modifyApi="modifyCallback"
                                @getSelections="getSelection"
                                ref="fastTable"
                                :keyword="name">
                    </fast-table>
                </div>
            </WrapPanel>
        </div>

        <!--新增角色-->
        <div>
            <el-dialog :title="moduleWindowConfig.title" :visible.sync="moduleWindowConfig.visible">
                <el-form :model="moduleWindowConfig.form">
                    <el-form-item label="项目名称" :label-width="moduleWindowConfig.formLabelWidth">
                        <el-input v-model="moduleWindowConfig.form.name" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <el-form :model="moduleWindowConfig.form">
                    <el-form-item label="项目描述" :label-width="moduleWindowConfig.formLabelWidth">
                        <el-input v-model="moduleWindowConfig.form.description" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <el-form :model="moduleWindowConfig.form">
                    <el-form-item label="项目地址" :label-width="moduleWindowConfig.formLabelWidth">
                        <el-input v-model="moduleWindowConfig.form.address" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <el-form :model="moduleWindowConfig.form">
                    <el-form-item label="联系电话" :label-width="moduleWindowConfig.formLabelWidth">
                        <el-input v-model="moduleWindowConfig.form.phone" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <el-form :model="moduleWindowConfig.form">
                    <el-form-item label="邮箱" :label-width="moduleWindowConfig.formLabelWidth">
                        <el-input v-model="moduleWindowConfig.form.email" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="moduleWindowConfig.visible = false">取 消</el-button>
                    <el-button type="primary" @click="updata">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import ButtonPanel from '@/components/ButtonPanel';
    import WrapPanel from '@/components/WrapPanel';
    import FastTable from '@/components/FastTable';
    import { getModuleList, addModule, deleteModule, modify, getById, batchDeleteModule } from '@/api/project/module';

    export default {
        name: 'index',
        data() {
            return {
                name: null,
                //传递给table的Api
                searchCallBack: getModuleList,
                deleteCallBack: deleteModule,

                modifyCallback: this.modify,
                //选中行
                selectList: [],
                tableColumn: [
                    {
                        text: '项目名称1',
                        value: 'name',
                        show: true
                    },
                    {
                        text: '项目描述',
                        value: 'description',
                        show: true
                    },
                    {
                        text: '项目地址',
                        value: 'address',
                        show: true
                    },
                    {
                        text: '联系电话',
                        value: 'phone',
                        show: true
                    },
                    {
                        text: '邮箱',
                        value: 'email',
                        show: true
                    },
                    {
                        text: "状态",
                        value: 'state'
                    }
                ],
                moduleWindowConfig:{
                    title:'',
                    visible:false,
                    formLabelWidth:'120px',
                    form:{
                        name:'',
                        description:'',
                        address:'',
                        email:'',
                        phone:''
                    },
                    row:null
                }
            };
        },
        methods: {
            add() {
                this.moduleWindowConfig.form = {
                    name: ''
                };
                this.moduleWindowConfig.title = '添加';
                this.moduleWindowConfig.visible = true;
            },

            //获取单条信息
            getById(row){
                getById(row.data.id).then((res) => {
                    const r = res.data.data;
                    this.moduleWindowConfig.row = r;
                    this.moduleWindowConfig.form = {
                        name: r.name,
                        description:r.description,
                        address:r.address,
                        email:r.email,
                        phone:r.phone
                    };
                });
            },
            //修改角色
            modify(row) {
                this.moduleWindowConfig.title = '修改';
                this.moduleWindowConfig.visible = true;
                this.getById(row);
            },
            updata(){
                if (this.moduleWindowConfig.title == '添加') {
                    addModule({ data: this.moduleWindowConfig.form }).then((res) => {
                        if (res.data.code == '200') {
                            this.moduleWindowConfig.visible = false;
                            this.$refs.fastTable.getList();
                            this.$message({
                                message: '添加成功',
                                type: 'success'
                            });
                        }
                    });
                } else {
                    let form = Object.assign(this.moduleWindowConfig.row,this.moduleWindowConfig.form)
                    modify({ data: form }).then((res) => {
                        if (res.data.code == '200') {
                            this.moduleWindowConfig.visible = false;
                            this.$refs.fastTable.getList();
                            this.$message({
                                message: '修改成功',
                                type: 'success'
                            });
                        }
                    });
                }
            },
            getSelection(list) {
                this.selectList = list.map(item=>{
                    return item.id;
                });
            },
            //对应批量删除按钮
            deleteBatch() {
                if (this.selectList && this.selectList.length > 0) {
                    this.confirmMessage('是否要所有选中行进行删除?', 'warning', batchDeleteModule({ data: this.selectList }));
                } else {
                    this.$message({
                        dangerouslyUseHTMLString: true,
                        message: '请选择需要删除的数据',
                        duration: 1000,
                        type: 'warning'
                    });
                }
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
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.$refs.fastTable.getList();
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
        },
        mounted() {

        },
        components: {
            ButtonPanel,
            WrapPanel,
            FastTable
        }
    };
</script>

<style scoped lang="scss">
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
