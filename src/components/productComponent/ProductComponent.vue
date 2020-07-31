<template>
  <div class="component">
    <MyBreadcrumb level1="系统配置" level2="备件" />
    <div class="top">
      <el-button class="confirm" @click="addComponent">+ 添加备件</el-button>
      <div class="input">
        <el-input
          v-model.trim="component_input"
          suffix-icon="el-icon-search"
          placeholder="配件名称或厂家或类型"
          style
          v-throttle="componentSearch"
          :disabled="!$store.state.site.siteId"
        ></el-input>
      </div>
    </div>
    <div class="data-show">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="partsName" label="配件名称"></el-table-column>
        <el-table-column prop="partsFactory" label="厂家"></el-table-column>
        <el-table-column prop="partsType" label="分类/类型">
          <template slot-scope="scope">{{scope.row.partsClassify}}/{{scope.row.partsType}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- <el-button type="text" @click="editComponent(scope.row.id)" size="small">编辑</el-button>
            <el-button type="text" @click="delComponent(scope.row)" size="small">删除</el-button> -->
            <el-tooltip class="item" effect="dark" offset="-20" content="编辑" placement="top-start">
              <el-button
                icon="el-icon-edit"
                class="confirm"
                size="mini"
                @click="editComponent(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" offset="-20" content="删除" placement="top-start">
              <el-button
                icon="el-icon-delete"
                class="del"
                size="mini"
                @click="delComponent(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="componentSizeChange"
          @current-change="componentCurrentChange"
          :current-page="component_currentPage"
          :page-sizes="[10,20,50]"
          :page-size="component_size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="component_total"
        ></el-pagination>
      </div>
    </div>
    <!-- 编辑产品弹窗 -->
    <el-dialog
      :visible.sync="componentVisible"
      width="500px"
      title="编辑备件"
      modal
      :close-on-click-modal="false"
      :show-close="true"
      @close="beforeComponentClose"
      class="component-dialog"
    >
      <el-form
        :label-position="labelPosition"
        :rules="componentRule"
        ref="componentRef"
        label-width="80px"
        :model="editComponentForm"
        class="component-form"
      >
        <el-form-item label="备件名称" prop="partsName">
          <el-input v-model.trim="editComponentForm.partsName"></el-input>
        </el-form-item>
        <el-form-item label="厂家" prop="partsFactory">
          <el-select
            v-model.trim="editComponentForm.partsFactory"
            filterable
            allow-create
            default-first-option
            placeholder="请选择或输入"
          >
            <el-option
              v-for="item in factory_data"
              :key="item.id"
              :label="item.factory"
              :value="item.factory"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备件分类" prop="partsClassify">
          <el-select
            v-model.trim="editComponentForm.partsClassify"
            filterable
            allow-create
            default-first-option
            placeholder="请选择或输入"
            @change="classChange"
          >
            <el-option
              v-for="item in component_type_all"
              :key="item.id"
              :label="item.partsClassify"
              :value="item.partsClassify"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备件类型" prop="partsType">
          <el-select
            v-model.trim="editComponentForm.partsType"
            filterable
            allow-create
            default-first-option
            placeholder="请选择或输入"
            @visible-change="getAllType"
          >
            <el-option
              v-for="item in component_type_data"
              :key="item.id"
              :label="item.type"
              :value="item.type"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="componentVisible = false">取 消</el-button>
        <el-button class="confirm" @click="editcomponentSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 备件删除 -->
    <el-dialog
      title="备件删除"
      :visible.sync="delComponentVisible"
      width="500px"
      :close-on-click-modal="false"
    >
      <div style="width: 30px;float: left;margin: -7px 8px 5px -8px;">
        <i :class="{icon: true, 'iconfont': true, 'iconjinggao1': true}"></i>
      </div>
      <span>是否确定删除备件 {{delComponentName}} ?</span>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="delComponentVisible = false">取 消</el-button>
        <el-button class="dang" @click="delComponentSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import MyBreadcrumb from "../subcomponents/Mybreadcrumb";
import GLOBAL from "../../utils/global_variable";
export default {
  components: {
    MyBreadcrumb
  },
  data() {
    return {
      component_input: "", //搜索配件输入值
      tableData: [], //配件列表
      component_currentPage: 1, //分页总数
      component_size: 10, //分页大小
      component_total: 0, //总数
      componentVisible: false, //编辑新增备件弹窗
      labelPosition: "right", //表单label对齐方式
      componentRule: {
        partsName: [
          {
            required: true,
            message: "请输入配件名称",
            trigger: "blur"
          }
        ],
        partsFactory: [
          {
            required: true,
            message: "请选择厂家",
            trigger: "change"
          }
        ],
        partsClassify: [
          {
            required: true,
            message: "请选择分类",
            trigger: "change"
          }
        ],
        partsType: [
          {
            required: true,
            message: "请选择类型",
            trigger: "change"
          }
        ]
      },
      // 新增编辑配件表单
      editComponentForm: {
        partsName: "",
        partsFactory: "",
        partsClassify: "",
        partsType: ""
      },
      factory_data: [], //所有厂家数据
      component_type_all: [], //所有备件分类
      component_type_data: [], //所有备件类型数据
      delComponentVisible: false, //配件的删除弹窗
      delComponentName: null, //将要删除的配件名称
      delComponentId: null //将要删除配件id
    };
  },
  computed: {
    getSite() {
      return this.$store.state.site.siteId;
    }
  },
  watch: {
    getSite() {
      this.component_input = "";
      this.component_currentPage = 1;
      this.getComponent();
    }
  },
  created() {
    this.getComponent();
  },
  methods: {
    // 节流获取备件列表
    componentSearch() {
      this.component_currentPage = 1;
      this.getComponent();
    },
    // 获取备件列表
    getComponent() {
      this.$http
        .get("equipment/spareParts/findAll", {
          params: {
            page: this.component_currentPage - 1,
            size: this.component_size,
            name: this.component_input,
            companyId: this.$store.state.site.searchCompanyId
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.tableData = res.data.data.data;
            this.component_total = res.data.data.total;
          }
        });
    },
    // 新增配件
    addComponent() {
      this.componentVisible = true;
      this.getAllFactory();
      this.getComponentAllType();
      // this.getAllType();
    },
    // 分页大小改变
    componentSizeChange(size) {
      this.component_size = size;
      this.component_currentPage = 1;
      this.getComponent();
    },
    // 当前页改变
    componentCurrentChange(page) {
      this.component_currentPage = page;
      this.getComponent();
    },
    // 查看备件
    editComponent(id) {
      this.componentVisible = true;
      this.getComponentDetail(id);
    },
    // 备件详情
    getComponentDetail(id) {
      this.getAllFactory();
      this.getComponentAllType().then(val => {
        this.detailRequest(id);
      });
    },
    // 详情请求
    detailRequest(id) {
      this.$http
        .get("equipment/spareParts/detail", {
          params: {
            id: id
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.editComponentForm = res.data.data;
            var index = this.component_type_all.findIndex(item => {
              return item.id == this.editComponentForm.classifyId;
            });
            console.log(index);
            this.editComponentForm.partsClassify = this.component_type_all[
              index
            ].partsClassify;
          }
        });
    },
    // 获取所有厂家
    getAllFactory() {
      this.$http
        .get("equipment/spareParts/findFactory", {
          params: {
            companyId: this.$store.state.site.searchCompanyId
          }
        })
        .then(res => {
          this.factory_data = res.data.data;
        });
    },
    // 获取所有的备件分类
    getComponentAllType() {
      return new Promise((resolve, reject) => {
        this.$http
          .get("equipment/spareParts/findPartsClassify", {
            params: {}
          })
          .then(res => {
            if (res.data.code === 0) {
              this.component_type_all = res.data.data;
              resolve();
            }
          });
      });
    },
    // 备件分类修改
    classChange() {
      this.editComponentForm.partsType = "";
      this.getAllType(true);
    },
    // 获取所有类型
    getAllType(flag) {
      if (!flag) {
        return;
      }
      if (!this.editComponentForm.partsClassify) {
        this.$message("请先选中备件分类");
        return;
      }
      this.$http
        .get("equipment/spareParts/findType", {
          params: {
            partsClassify: this.editComponentForm.partsClassify
          }
        })
        .then(res => {
          this.component_type_data = res.data.data;
        });
    },
    // 新增或修改配件提交
    editcomponentSubmit() {
      this.$refs.componentRef.validate(valid => {
        if (valid) {
          if (this.editComponentForm.id) {
            // 编辑
            this.$http
              .post("equipment/spareParts/modify", this.editComponentForm)
              .then(res => {
                if (res.data.code === 0) {
                  this.$notify({
                    title: "编辑成功",
                    type: "success"
                  });
                  this.componentVisible = false;
                  this.getComponent();
                } else {
                  this.$notify({
                    title: res.data.msg,
                    type: "warning"
                  });
                }
              });
          } else {
            // 新增
            this.editComponentForm.companyId = this.$store.state.site.searchCompanyId;
            this.$http
              .post("equipment/spareParts/saveParts", this.editComponentForm)
              .then(res => {
                if (res.data.code === 0) {
                  this.$notify({
                    title: "新增成功",
                    type: "success"
                  });
                  this.componentVisible = false;
                  this.getComponent();
                } else {
                  this.$notify({
                    title: res.data.msg,
                    type: "warning"
                  });
                }
              });
          }
        }
      });
    },
    // 编辑备件弹窗关闭前
    beforeComponentClose() {
      (this.editComponentForm = {
        partsName: "",
        partsFactory: "",
        partsType: ""
      }),
        this.$refs.componentRef.resetFields();
    },
    // 删除配件
    delComponent(row) {
      this.delComponentVisible = true;
      this.delComponentName = row.partsName;
      this.delComponentId = row.id;
    },
    // 删除配件提交
    delComponentSubmit() {
      this.$http
        .get("equipment/spareParts/remove", {
          params: {
            id: this.delComponentId
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.$notify({
              title: "删除成功",
              type: "success"
            });
            if (this.tableData.length === 1 && this.component_currentPage > 1) {
              this.component_currentPage--;
            }
            this.delComponentVisible = false;
            this.delComponentId = null;
            this.getComponent();
          }
        });
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/css/index.less";
.component {
  height: 100%;
  @dis-flex();
  @flex-c();
  .top {
    @dis-flex();
    justify-content: space-between;
  }
  .data-show {
    box-shadow: -2px 0 3px -1px #999, 0 2px 3px -1px #aaa, 2px 0 3px -1px #999;
    margin: 3px;
    padding: 8px;
    @flex-1();
    height: 0;
    overflow: auto;
    .block {
      float: right;
    }
  }
  .component-dialog {
    /deep/ .el-select {
      width: 100%;
    }
  }
}
</style>