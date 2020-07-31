<template>
  <div class="product">
    <MyBreadcrumb level1="站点监控" level2="产品库" />
    <div class="content">
      <el-tabs type="border-card" v-model="activeName" @tab-click="tabChange">
        <!-- 产品 -->
        <el-tab-pane label="产品" name="first">
          <div class="product-branch">
            <div class="top">
              <el-button class="confirm" @click="addProduct">+ 添加产品</el-button>
              <div class="input">
                <el-input
                  v-model.trim="product_input"
                  suffix-icon="el-icon-search"
                  placeholder="产品或厂家或类型"
                  style
                  v-throttle="productSearch"
                  :disabled="!$store.state.site.siteId"
                ></el-input>
              </div>
            </div>
            <div class="table">
              <el-table :data="product_data" border style="width: 100%">
                <el-table-column type="index" label="序号" width="50"></el-table-column>
                <el-table-column prop="model" label="型号"></el-table-column>
                <el-table-column prop="providerName" label="厂家"></el-table-column>
                <el-table-column prop="productType" label="类型"></el-table-column>
                <el-table-column label="操作" width="100">
                  <template slot-scope="scope">
                    <!-- <el-button @click="editProduct(scope.row)" type="text" size="small">编辑</el-button> -->
                    <el-tooltip class="item" effect="dark" content="编辑" offset="-20" placement="top-start">
                      <el-button
                        icon="el-icon-edit"
                        size="mini"
                        class="confirm"
                        @click="editProduct(scope.row)"
                      ></el-button>
                    </el-tooltip>
                  </template>
                </el-table-column>
              </el-table>
              <div class="block">
                <el-pagination
                  @size-change="productSizeChange"
                  @current-change="productCurrentChange"
                  :current-page="product_currentPage"
                  :page-sizes="[10,20,50]"
                  :page-size="product_size"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="product_total"
                ></el-pagination>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="产品类型" name="second">
          <!-- 产品类型 -->
          <div class="product-type">
            <div class="top">
              <el-button class="confirm" @click="addType">+ 添加产品类型</el-button>
              <div class="input">
                <el-input
                  v-model.trim="type_input"
                  suffix-icon="el-icon-search"
                  placeholder="类型名称"
                  style
                  v-throttle="typeSearch"
                  :disabled="!$store.state.site.siteId"
                ></el-input>
              </div>
            </div>
            <div class="table">
              <el-table :data="product_type_data" border style="width: 100%">
                <el-table-column type="index" label="序号" width="50"></el-table-column>
                <el-table-column prop="name" label="产品类型"></el-table-column>
                <el-table-column label="操作" width="100">
                  <template slot-scope="scope">
                    <!-- <el-button @click="editType(scope.row)" type="text" size="small">编辑</el-button> -->
                    <el-tooltip class="item" effect="dark" content="编辑" offset="-20" placement="top-start">
                      <el-button
                        icon="el-icon-edit"
                        size="mini"
                        class="confirm"
                        @click="editType(scope.row)"
                      ></el-button>
                    </el-tooltip>
                  </template>
                </el-table-column>
              </el-table>
              <div class="block">
                <el-pagination
                  @size-change="typeSizeChange"
                  @current-change="typeCurrentChange"
                  :current-page="type_currentPage"
                  :page-sizes="[10,20,50]"
                  :page-size="type_size"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="type_total"
                ></el-pagination>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="厂家" name="third">
          <!-- 厂家 -->
          <div class="product-type">
            <div class="top">
              <el-button class="confirm" @click="addFactory">+ 添加厂家</el-button>
              <div class="input">
                <el-input
                  v-model.trim="factory_input"
                  suffix-icon="el-icon-search"
                  placeholder="厂家名称或公司简介"
                  style
                  v-throttle="factorySearch"
                  :disabled="!$store.state.site.siteId"
                ></el-input>
              </div>
            </div>
            <div class="table">
              <el-table :data="factory_data" border style="width: 100%">
                <el-table-column type="index" label="序号" width="50"></el-table-column>
                <el-table-column prop="name" label="厂家"></el-table-column>
                <el-table-column prop="simpleName" label="公司简称"></el-table-column>
                <el-table-column prop="url" label="官方网址"></el-table-column>
                <el-table-column label="操作" width="100">
                  <template slot-scope="scope">
                    <!-- <el-button @click="editFactory(scope.row)" type="text" size="small">编辑</el-button> -->
                    <el-tooltip class="item" effect="dark" content="编辑" offset="-20" placement="top-start">
                      <el-button
                        icon="el-icon-edit"
                        size="mini"
                        class="confirm"
                        @click="editFactory(scope.row)"
                      ></el-button>
                    </el-tooltip>
                  </template>
                </el-table-column>
              </el-table>
              <div class="block">
                <el-pagination
                  @size-change="factorySizeChange"
                  @current-change="factoryCurrentChange"
                  :current-page="factory_currentPage"
                  :page-sizes="[10,20,50]"
                  :page-size="factory_size"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="factory_total"
                ></el-pagination>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- --------------------------产品 -->
    <!-- 编辑产品弹窗 -->
    <el-dialog
      :visible.sync="productVisible"
      width="500px"
      title="编辑产品"
      modal
      :close-on-click-modal="false"
      :show-close="true"
      @close="beforeProductClose"
      class="product-dialog"
    >
      <el-form
        :label-position="labelPosition"
        :rules="productRule"
        ref="productRef"
        label-width="80px"
        :model="editProductForm"
        class="product-form"
      >
        <el-form-item label="型号" prop="model">
          <el-input v-model.trim="editProductForm.model"></el-input>
        </el-form-item>
        <el-form-item label="厂家" prop="providerId">
          <el-select
            v-model.trim="editProductForm.providerId"
            placeholder="请选择厂家"
            @visible-change="searchFactoryChange"
          >
            <el-option
              v-for="item in factory_data"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品类型" prop="typeId">
          <el-select v-model.trim="editProductForm.typeId" @visible-change="searchTypeChange">
            <el-option
              v-for="item in product_type_data"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="productVisible = false">取 消</el-button>
        <el-button class="confirm" @click="editProductSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- --------------------------类型 -->
    <!-- 编辑类型弹窗 -->
    <el-dialog
      :visible.sync="typeVisible"
      width="500px"
      title="编辑类型"
      modal
      :close-on-click-modal="false"
      :show-close="true"
      @close="beforeTypeClose"
      class="type-dialog"
    >
      <el-form
        :label-position="labelPosition"
        :rules="typeRule"
        ref="typeRef"
        label-width="80px"
        :model="editTypeForm"
        class="type-form"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model.trim="editTypeForm.name" placeholder="产品类型名称"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="typeVisible = false">取 消</el-button>
        <el-button class="confirm" @click="editTypeSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- --------------------------厂家 -->
    <!-- 编辑厂家弹窗 -->
    <el-dialog
      :visible.sync="factoryVisible"
      width="500px"
      title="编辑厂家"
      modal
      :close-on-click-modal="false"
      :show-close="true"
      @close="beforeFactoryClose"
      class="factory-dialog"
    >
      <el-form
        :label-position="labelPosition"
        :rules="factoryRule"
        ref="factoryRef"
        label-width="80px"
        :model="editFactoryForm"
        class="factory-form"
      >
        <el-form-item label="厂家名称" prop="name">
          <el-input v-model.trim="editFactoryForm.name" placeholder="公司全称"></el-input>
        </el-form-item>
        <el-form-item label="名称缩写" prop="simpleName">
          <el-input v-model.trim="editFactoryForm.simpleName" placeholder="公司简介"></el-input>
        </el-form-item>
        <el-form-item label="官方网址" prop="url">
          <el-input v-model.trim="editFactoryForm.url" placeholder="格式：http://xxxxx"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="contactPerson">
          <el-input v-model.trim="editFactoryForm.contactPerson" placeholder="请输入厂家联系人"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="contactPhone">
          <el-input v-model.trim="editFactoryForm.contactPhone" placeholder="请输入厂家联系电话"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="factoryVisible = false">取 消</el-button>
        <el-button class="confirm" @click="editFactorySubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import MyBreadcrumb from "../subcomponents/Mybreadcrumb";
export default {
  components: {
    MyBreadcrumb
  },
  data() {
    return {
      activeName: "first",
      option: [],
      // ----------------产品
      product_data: [],
      product_size: 10,
      product_total: 0,
      product_currentPage: 1,
      product_input: "",
      productVisible: false,
      productRule: {
        model: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur"
          }
        ],
        providerId: [
          {
            required: true,
            message: "请选择厂家",
            trigger: "change"
          }
        ],
        typeId: [
          {
            required: true,
            message: "请选择类型",
            trigger: "change"
          }
        ]
      },
      editProductForm: {
        model: null,
        providerId: null,
        typeId: null
      },
      labelPosition: "right",
      // ------------产品类型
      product_type_data: [],
      type_size: 10,
      type_total: 0,
      type_currentPage: 1,
      type_input: "",
      typeVisible: false,
      typeRule: {
        name: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur"
          }
        ]
      },
      editTypeForm: {
        name: null
      },
      // ----------------厂家
      factory_data: [],
      factory_size: 10,
      factory_total: 0,
      factory_currentPage: 1,
      factory_input: "",
      factoryVisible: false,
      factoryRule: {
        name: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur"
          }
        ]
      },
      editFactoryForm: {
        name: null,
        url: null,
        contactPerson: null,
        contactPhone: null,
        companyId: this.$store.state.site.searchCompanyId,
        simpleName: null
      }
    };
  },
  computed: {
    watchSiteChange() {
      return this.$store.state.site.siteId;
    }
  },
  watch: {
    // 初始化数据
    watchSiteChange(newVal, oldVal) {
      this.product_input = this.type_input = this.factory_input = "";
      this.product_currentPage = this.type_currentPage = this.factory_currentPage = 1;
      this.product_size = this.type_size = this.factory_size = 10;
      switch (this.activeName) {
        case "first":
          this.productInfoSearch();
          break;
        case "second":
          this.typeInfoSearch();
          break;
        case "third":
          this.factoryInfoSearch();
          break;
      }
    }
  },
  created() {
    this.productInfoSearch();
  },
  methods: {
    // 标签切换
    tabChange(tab) {
      console.log(tab);
      var activeTab = tab.label;
      switch (activeTab) {
        case "产品":
          this.productInfoSearch();
          break;
        case "产品类型":
          this.typeInfoSearch();
          break;
        case "厂家":
          this.factoryInfoSearch();
          break;
      }
    },
    // ------------------------------------产品
    // 查看产品信息列表
    productInfoSearch() {
      var companyId = this.$store.state.site.searchCompanyId;
      if (companyId !== 0 && !companyId) {
        return;
      }
      this.$http
        .get("equipment/product/findAll", {
          params: {
            name: this.product_input,
            page: this.product_currentPage - 1,
            size: this.product_size,
            companyId: companyId
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.product_data = res.data.data.data;
            this.product_total = res.data.data.total;
          }
        });
    },
    // 添加产品
    addProduct() {
      // if (this.$refs.productRef) {
      //   this.$refs.productRef.resetFields();
      // }
      this.productVisible = true;
    },
    // 产品分页大小改变
    productSizeChange(size) {
      this.product_size = size;
      this.productInfoSearch();
    },
    // 产品页码改变
    productCurrentChange(page) {
      this.product_currentPage = page;
      this.productInfoSearch();
    },
    // 编辑产品
    editProduct(row) {
      this.productVisible = true;
      this.$http
        .get("equipment/product/detail", {
          params: {
            id: row.id
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.typeInfoSearch(true);
            this.factoryInfoSearch(true);
            this.editProductForm = res.data.data;
          }
        });
    },
    // 输入框值改变
    productSearch() {
      this.product_currentPage = 1;
      this.productInfoSearch();
    },
    beforeProductClose() {
      this.editProductForm = {
        model: null,
        providerId: null,
        typeId: null
      };
      this.$refs.productRef.resetFields();
    },
    // 编辑产品提交
    editProductSubmit() {
      this.$refs.productRef.validate(valid => {
        if (valid) {
          var index = this.factory_data.findIndex( item => {
            return item.id === this.editProductForm.providerId
          })
          console.log(index)
          this.editProductForm.providerName = this.factory_data[index].name
          var index1 = this.product_type_data.findIndex( item => {
            return item.id === this.editProductForm.typeId
          })
          console.log(index1)
          this.editProductForm.productType = this.product_type_data[index1].name
          if (!this.editProductForm.id) {
            // 新增
            this.editProductForm.companyId = this.$store.state.site.searchCompanyId;
            this.$http
              .post("equipment/product/add", this.editProductForm)
              .then(res => {
                if (res.data.code === 0) {
                  this.$notify({
                    title: "成功",
                    type: "success"
                  });
                  this.productVisible = false;
                  this.productInfoSearch();
                }
              });
          } else {
            // 编辑
            this.$http
              .post("equipment/product/modify", {
                id: this.editProductForm.id,
                model: this.editProductForm.model,
                providerId: this.editProductForm.providerId,
                typeId: this.editProductForm.typeId,
                companyId: this.editProductForm.companyId,
                providerName: this.editProductForm.providerName,
                productType: this.editProductForm.productType,
              })
              .then(res => {
                if (res.data.code === 0) {
                  this.$notify({
                    title: "成功",
                    type: "success"
                  });
                  this.productVisible = false;
                  this.productInfoSearch();
                }
              });
          }
        }
      });
    },
    // 下拉刷新厂家
    searchFactoryChange(flag) {
      if (flag) {
        this.factoryInfoSearch(true);
        this.$forceUpdate();
      }
    },
    // 下拉刷新类型
    searchTypeChange(flag) {
      if (flag) {
        this.typeInfoSearch(true);
        this.$forceUpdate();
      }
    },
    // ---------------------------------产品类型
    // 获取产品类型列表
    typeInfoSearch(data) {
      // data布尔类型用于判断是否获取所有的内容
      var companyId = this.$store.state.site.searchCompanyId;
      if (companyId !== 0 && !companyId) {
        return;
      }
      this.$http
        .get("equipment/productType/findAll", {
          params: {
            name: data ? "" : this.type_input,
            page: data ? 0 : this.type_currentPage - 1,
            size: data ? 999 : this.type_size,
            companyId: companyId
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.product_type_data = res.data.data.data;
            this.type_total = res.data.data.total;
          }
        });
    },
    // 输入后更新产品列表
    typeSearch() {
      this.type_currentPage = 1;
      this.typeInfoSearch();
    },
    // 类型分页大小改变
    typeSizeChange(size) {
      this.type_size = size;
      this.typeInfoSearch();
    },
    // 类型页码改变
    typeCurrentChange(page) {
      this.type_currentPage = page;
      this.typeInfoSearch();
    },
    beforeTypeClose() {
      this.editTypeForm = {
        name: null
      };
      this.$refs.typeRef.resetFields();
    },
    // 编辑类型
    addType() {
      this.typeVisible = true;
    },
    editType(row) {
      this.typeVisible = true;
      this.$http
        .get("equipment/productType/detail", {
          params: {
            id: row.id
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.editTypeForm = res.data.data;
          }
        });
    },
    // 类型新增编辑提交
    editTypeSubmit() {
      this.$refs.typeRef.validate(valid => {
        if (valid) {
          if (this.editTypeForm.id) {
            // 编辑
            this.$http
              .post("equipment/productType/modify", {
                id: this.editTypeForm.id,
                name: this.editTypeForm.name,
                companyId: this.editTypeForm.companyId
              })
              .then(res => {
                if (res.data.code === 0) {
                  this.$notify({
                    title: "成功",
                    type: "success"
                  });
                  this.typeVisible = false;
                  this.typeInfoSearch();
                }
              });
          } else {
            // 新增
            this.$http
              .post("equipment/productType/add", {
                name: this.editTypeForm.name,
                companyId: this.$store.state.site.searchCompanyId
              })
              .then(res => {
                if (res.data.code === 0) {
                  this.$notify({
                    title: "成功",
                    type: "success"
                  });
                  this.typeVisible = false;
                  this.typeInfoSearch();
                }
              });
          }
        }
      });
    },
    // ------------------------------------厂家
    // 获取厂家列表
    factoryInfoSearch(data) {
      var companyId = this.$store.state.site.searchCompanyId;
      if (companyId !== 0 && !companyId) {
        return;
      }
      // data布尔类型用于分页最大情况
      this.$http
        .get("equipment/provider/findAll", {
          params: {
            name: this.factory_input,
            page: data ? 0 : this.factory_currentPage - 1,
            size: data ? 999 : this.factory_size,
            companyId: companyId
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.factory_data = res.data.data.data;
            this.factory_total = res.data.data.total;
          }
        });
    },
    // 输入框值改变跟新列表
    factorySearch() {
      this.factory_currentPage = 1;
      this.factoryInfoSearch();
    },
    // 厂家分页大小改变
    factorySizeChange(size) {
      this.factory_size = size;
      this.factoryInfoSearch();
    },
    // 厂家页码改变
    factoryCurrentChange(page) {
      this.factory_currentPage = page;
      this.factoryInfoSearch();
    },
    beforeFactoryClose() {
      this.editFactoryForm = {
        name: null,
        url: null,
        contactPerson: null,
        contactPhone: null,
        companyId: this.$store.state.site.searchCompanyId,
        simpleName: null
      };
      this.$refs.factoryRef.resetFields();
    },
    addFactory() {
      if (this.$refs.factoryRef) {
        this.$refs.factoryRef.resetFields();
      }
      this.factoryVisible = true;
    },
    // 编辑厂家
    editFactory(row) {
      this.factoryVisible = true;
      this.$http
        .get("equipment/provider/detail", {
          params: {
            id: row.id
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.editFactoryForm = res.data.data;
          }
        });
    },
    // 编辑新增厂家提交
    editFactorySubmit() {
      this.$refs.factoryRef.validate(valid => {
        if (valid) {
          if (this.editFactoryForm.id) {
            // 编辑
            this.$http
              .post("equipment/provider/modify", {
                id: this.editFactoryForm.id,
                name: this.editFactoryForm.name,
                url: this.editFactoryForm.url,
                contactPerson: this.editFactoryForm.contactPerson,
                contactPhone: this.editFactoryForm.contactPhone,
                companyId: this.editFactoryForm.companyId,
                simpleName: this.editFactoryForm.simpleName
              })
              .then(res => {
                if (res.data.code === 0) {
                  this.$notify({
                    title: "成功",
                    type: "success"
                  });
                  this.factoryVisible = false;
                  this.factoryInfoSearch();
                }
              });
          } else {
            // 新增
            this.$http
              .post("equipment/provider/add", this.editFactoryForm)
              .then(res => {
                if (res.data.code === 0) {
                  this.$notify({
                    title: "成功",
                    type: "success"
                  });
                  this.factoryVisible = false;
                  this.factoryInfoSearch();
                }
              });
          }
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/css/index.less";
.product {
  width: 100%;
  height: 100%;
  @dis-flex();
  @flex-c();
  .content {
    @flex-1();
    background-color: rgba(67, 92, 112);
    height: 0;
    padding: 4px;
    overflow: auto;
    /* 四个标签样式 */
    /deep/ .el-tabs--border-card {
      background: none;
      border: none;
      box-shadow: 0 0 4px #aaa;
    }
    /deep/ .el-tabs--border-card > .el-tabs__header {
      background: none;
      border: none;
    }
    /deep/ .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
      color: @radio-bgc;
      border-right-color: rgba(67, 92, 112);
      border-left-color: rgba(67, 92, 112);
      background: none;
    }
    /deep/ .el-tabs--border-card > .el-tabs__header .el-tabs__item {
      color: @radio-bgc;
      border-right-color: rgba(67, 92, 112);
      border-left-color: rgba(67, 92, 112);
      background: rgba(84, 101, 125);
    }
    .product-branch {
      @dis-flex();
      @flex-c();
      .top {
        @dis-flex();
        justify-content: space-between;
        margin-bottom: 6px;
      }
      .table {
        @flex-1();
        .block {
          float: right;
        }
      }
    }
    .product-type {
      @dis-flex();
      @flex-c();
      .top {
        @dis-flex();
        justify-content: space-between;
        margin-bottom: 6px;
      }
      .table {
        @flex-1();
        .block {
          float: right;
        }
      }
    }
  }
  // 弹窗
  .product-dialog {
    /deep/ .el-select {
      width: 100%;
    }
  }
  .type-dialog {
    /deep/ .el-select {
      width: 100%;
    }
  }
  .factory-dialog {
    /deep/ .el-select {
      width: 100%;
    }
  }
}
</style>