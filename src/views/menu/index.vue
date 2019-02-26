<template>
  <div class="main-content">
    <ButtonPanel>
      <div slot='leftTool'>
        <span style="display:inline-block"></span>
      </div>
      <div slot='rightTool'
           class="rightTool">
        <el-button type="primary"
                   size="mini"
                   icon="el-icon-edit"
                   @click="add">新增</el-button>
        <el-button type="danger"
                   size="mini"
                   icon="el-icon-delete"
                   @click="deleteBatch">批量删除</el-button>
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
      <el-dialog :title="menuWindowConfig.title"
                 :visible.sync="menuWindowConfig.visible">
        <el-form :model="menuWindowConfig.form">
          <el-form-item label="菜单名称"
                        :label-width="menuWindowConfig.formLabelWidth">
            <el-input v-model="menuWindowConfig.form.name"
                      autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer"
             class="dialog-footer">
          <el-button @click="menuWindowConfig.visible = false">取 消</el-button>
          <el-button type="primary"
                     @click="updata">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import ButtonPanel from '@/components/ButtonPanel';
import WrapPanel from '@/components/WrapPanel';
import FastTable from '@/components/FastTable';
import customTreeTable from '@/components/TreeTable/customTreeTable';
import { getMenuList, addMenu, deleteMenu, modify, getById, batchDeleteMenu } from '@/api/project/menu';

export default {
  name: 'index',
  data () {
    return {
      name: null,
      //传递给table的Api
      searchCallBack: getMenuList,
      deleteCallBack: deleteMenu,

      modifyCallback: this.modify,
      //选中行
      selectList: [],
      tableColumn: [
        {
          text: '菜单名称',
          value: 'name',
          show: true
        },
        {
          text: '状态',
          value: 'state'
        }
      ],
      menuWindowConfig: {
        title: '',
        visible: false,
        formLabelWidth: '120px',
        form: {
          name: ''
        },
        row: null
      }
    };
  },
  methods: {
    add () {
      this.menuWindowConfig.form = {
        name: ''
      };
      this.menuWindowConfig.title = '添加';
      this.menuWindowConfig.visible = true;
    },

    getMenuPage () {
      getMenuList({ data: { pageNumber: 1, pageSize: 10 } }).then((res) => {
        const r = res.data.data;
        this.pagesConfig.total = r.total;
      });
    },
    //获取单条信息
    getById (row) {
      getById(row.data.id).then((res) => {
        const r = res.data.data;
        this.menuWindowConfig.row = r;
        this.menuWindowConfig.form = {
          state: r.state,
          name: r.name
        };
      });
    },
    //修改角色
    modify (row) {
      this.menuWindowConfig.title = '修改';
      this.menuWindowConfig.visible = true;
      this.getById(row);
    },
    updata () {
      if (this.menuWindowConfig.title == '添加') {
        addMenu({ data: this.menuWindowConfig.form }).then((res) => {
          if (res.data.code == '200') {
            this.menuWindowConfig.visible = false;
            this.$refs.fastTable.getList();
            this.$message({
              message: '添加成功',
              type: 'success'
            });
          }
        });
      } else {
        let form = Object.assign(this.menuWindowConfig.row, this.menuWindowConfig.form);
        modify({ data: form }).then((res) => {
          if (res.data.code == '200') {
            this.menuWindowConfig.visible = false;
            this.$refs.fastTable.getList();
            this.$message({
              message: '修改成功',
              type: 'success'
            });
          }
        });
      }
    },
    getSelection (list) {
      this.selectList = list.map((item) => {
        return item.id;
      });
    },
    //对应批量删除按钮
    deleteBatch () {
      if (this.selectList && this.selectList.length > 0) {
        this.confirmMessage('是否要所有选中行进行删除?', 'warning', batchDeleteMenu({ data: this.selectList }));
      } else {
        this.$message({
          dangerouslyUseHTMLString: true,
          message: '请选择需要删除的数据',
          duration: 1000,
          type: 'warning'
        });
      }
    },
    confirmMessage (message, type, fn) {
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: type,
        center: true
      })
        .then(() => {
          fn.then(() => {
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
    }
  },
  mounted () {
    // this.getMenuPage();
  },
  components: {
    ButtonPanel,
    WrapPanel,
    FastTable,
    customTreeTable
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
