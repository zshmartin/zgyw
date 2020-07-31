<template>
  <div class="variate">
    <!-- 面包屑 -->
    <MyBreadcrumb level1="数据管理" level2="变量管理" />
    <div class="content-main">
      <div class="float-div">
        <!-- 文字 -->
        <div class="content-title">
          <span style="font-size: 18px; color: #fff;">变量列表</span>
          <el-input
            v-model.trim="ncInput"
            suffix-icon="el-icon-search"
            placeholder="变量名称"
            style
            v-throttle="search"
            :disabled="!$store.state.site.siteId"
          ></el-input>
          <el-select
            v-model="equip"
            placeholder="设备"
            clearable
            filterable
            size="mini"
            @change="searchAll"
            @visible-change="getEquip"
          >
            <el-option
              v-for="item in equipOptions"
              :key="item.value"
              :label="item.name"
              :value="item.equipmentId"
            ></el-option>
          </el-select>
          <el-radio-group v-model="selectType" @change="typeSelectChange" size="small" style>
            <el-radio-button label="0">模拟量</el-radio-button>
            <el-radio-button label="1">状态量</el-radio-button>
          </el-radio-group>
          <template v-if="!deleteMul">
            <el-button class="del" size="mini" @click="deleteMul=true">批量选择</el-button>
          </template>
          <template v-else>
            <el-button
              style="padding: 8px 15px; background: green; border: none; color: #fff;"
              size="mini"
              @click="deleteMul=false"
            >取消</el-button>
            <el-button class="del" size="mini" @click="deleteMulVar">批量删除</el-button>
          </template>

          <div class="button-edit" style>
            <el-button
              @click="addVariate"
              size="small"
              class="confirm"
              type="success"
              :disabled="!$store.state.site.siteId"
            >+&nbsp;添加</el-button>
            <!-- 导入导出 -->
            <el-button
              size="small"
              class="confirm"
              icon="el-icon-upload2"
              :disabled="!Boolean(variateData.length) || exportLoading"
              v-loading="exportLoading"
              element-loading-background="rgba(67, 92, 112, 0.5)"
              @click="exportVariable"
            >导出</el-button>
            <el-button
              size="small"
              class="confirm"
              icon="el-icon-upload2"
              :disabled="exportModelLoading"
              v-loading="exportModelLoading"
              @click="exportModel"
            >导出模板</el-button>

            <el-button
              size="small"
              class="confirm"
              icon="el-icon-download"
              :disabled="!Boolean($store.state.site.siteId)"
              @click="importFile"
            >导入</el-button>
          </div>
        </div>

        <!-- 表格 -->

        <el-table
          :data="variateData"
          class="variable-table"
          v-loading="loading"
          style
          size="mini"
          @selection-change="handleSelectionChange"
        >
          <el-table-column v-if="deleteMul" type="selection" width="55"></el-table-column>
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="name" label="变量名"></el-table-column>
          <el-table-column prop="equipmentName" label="所属设备"></el-table-column>
          <el-table-column prop="areaName" label="数据地址"></el-table-column>
          <el-table-column prop="type" label="数据类型" v-if="selectType=='0'"></el-table-column>
          <el-table-column prop="value" label="当前值">
            <template slot-scope="scope">
              <span>{{scope.row.value ? Math.round(scope.row.value * 1000) / 1000 : scope.row.value}}&nbsp;&nbsp;&nbsp;({{scope.row.unit}})</span>
            </template>
          </el-table-column>
          <el-table-column prop="corn" label="存盘周期" v-if="selectType=='0'"></el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                offset="-20"
                content="编辑"
                placement="top-start"
              >
                <el-button
                  icon="el-icon-edit"
                  size="mini"
                  class="confirm"
                  @click="searchVariate(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                offset="-20"
                content="删除"
                placement="top-start"
              >
                <el-button
                  icon="el-icon-delete"
                  size="mini"
                  class="del"
                  @click="tryDelVariate(scope.row)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50]"
            :page-size="size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalVariate"
          ></el-pagination>
        </div>
      </div>
    </div>

    <!-- 新增/编辑模拟量变量弹窗 -->
    <el-dialog
      :visible.sync="VariateVisible1"
      :close-on-click-modal="false"
      width="650px"
      @close="beforeClose"
      :title="visibleTitleName"
    >
      <el-form
        :model="addVariateData"
        :rules="addVariateRules"
        ref="addVariateRef"
        label-width="100px"
        class="variate-form"
        size="small"
      >
        <el-form-item label="变量名称" prop="name" class="inline-input-width">
          <el-input v-model.trim="addVariateData.name"></el-input>
        </el-form-item>
        <el-form-item label="变量编码" prop="code" class="inline-input-width" v-if="ifAdd">
          <el-input v-model.trim="addVariateData.code"></el-input>
        </el-form-item>
        <el-form-item label="变量编码" prop="code" class="inline-input-width" v-else>
          <el-input v-model.trim="addVariateData.simplifiedCode" disabled></el-input>
        </el-form-item>

        <el-form-item label="单位" prop="unit" class="inline-input-width" v-if="variateType == '0'">
          <el-input v-model.trim="addVariateData.unit"></el-input>
        </el-form-item>
        <el-form-item label="变量类型" prop="variableType" class="inline-input-width" v-if="ifAdd">
          <el-select
            v-model.trim="addVariateData.variableType"
            placeholder="请选择"
            @change="variableTypeChange"
            no-data-text="无数据"
            disabled
          >
            <el-option
              v-for="item in variableTypeOptions"
              :key="item.val"
              :label="item.label"
              :value="item.val"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="变量属性" prop="propertiesArr" class="inline-input-width">
          <!-- <el-select
            v-model.trim="addVariateData.properties"
            clearable
            placeholder="请选择"
            no-data-text="无数据"
          >
            <el-option
              v-for="item in propertyOptions"
              :key="item.id"
              :label="item.properties"
              :value="item.id"
            ></el-option>
          </el-select>-->
          <el-cascader
            v-model="addVariateData.propertiesArr"
            :options="propertyOptions"
            @change="attrChange"
            ref="cascaderAddr"
            :props="{ expandTrigger: 'hover', checkStrictly: true, value: 'id', label: 'properties' }"
            clearable
          ></el-cascader>
        </el-form-item>
        <div class="p-title">
          <p>数据来源</p>
        </div>

        <el-form-item label="所属网关" prop="gatewayId" class="inline-input-width">
          <el-select
            v-model="addVariateData.gatewayId"
            placeholder="请选择"
            no-data-text="无数据"
            filterable
            @visible-change="getAllGateway"
            @change="gatewayChange"
          >
            <el-option
              v-for="item in gatewayOptions"
              :key="item.gatewayId"
              :label="item.name"
              :value="item.gatewayId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属电表" prop="equipmentId" class="inline-input-width">
          <el-select
            v-model="addVariateData.equipmentId"
            placeholder="请选择"
            no-data-text="无数据"
            filterable
            @visible-change="getEquipByGateway"
            @change="equipChange"
          >
            <el-option
              v-for="item in variateOptions"
              :key="item.equipmentId"
              :label="item.name"
              :value="item.equipmentId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据区" prop="daId" class="inline-input-width">
          <el-select
            v-model="addVariateData.daId"
            placeholder="请选择"
            @visible-change="searchData"
            no-data-text="无数据"
            @change="selectDataArea"
          >
            <el-option
              v-for="item in dataAreaOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="数据地址" prop="relative" class="inline-input-width">
          <el-input v-model.trim="addVariateData.relative"></el-input>
        </el-form-item>
        <el-form-item label="偏移" prop="offset" class="inline-input-width" v-if="variateType==1">
          <el-input v-model.trim="addVariateData.offset"></el-input>
        </el-form-item>

        <el-form-item label="数据类型" prop="type" class="inline-input-width" v-if="variateType==1">
          <el-select
            v-model="addVariateData.type"
            placeholder="请选择"
            @visible-change="selectDataType"
          >
            <el-option
              v-for="item in dataTypeOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="存盘周期" prop="corn" class="inline-input-width" v-if="variateType==1">
          <el-select v-model="addVariateData.corn" placeholder="请选择">
            <el-option
              v-for="item in cornOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <div class="data" v-if="(variateType == '0')">
          <div class="p-title">
            <p>数据处理</p>
          </div>
          <el-form-item label="数据类型" prop="type" class="inline-input-width">
            <el-select
              v-model="addVariateData.type"
              placeholder="请选择"
              @visible-change="selectDataType"
            >
              <el-option
                v-for="item in dataTypeOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="初始值" prop="init" class="inline-input-width">
            <el-input v-model.trim="addVariateData.init"></el-input>
          </el-form-item>
          <el-form-item label="基限值" prop="base" class="inline-input-width">
            <el-input v-model.trim="addVariateData.base"></el-input>
          </el-form-item>
          <el-form-item label="系数" prop="coefficient" class="inline-input-width">
            <el-input v-model.trim="addVariateData.coefficient"></el-input>
          </el-form-item>
          <el-form-item label="存盘周期" prop="corn" class="inline-input-width">
            <el-select v-model="addVariateData.corn" placeholder="请选择">
              <el-option
                v-for="item in cornOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="VariateVisible1 = false">取 消</el-button>
        <el-button class="confirm" @click="submitVariate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除弹窗 -->
    <el-dialog
      title="提示"
      :visible.sync="delVariateVisible"
      width="500px"
      :close-on-click-modal="false"
    >
      <div style="width: 30px;float: left;margin: -7px 8px 5px -8px;">
        <i :class="{icon: true, 'iconfont': true, 'iconjinggao1': true}"></i>
      </div>
      <span>是否确定删除变量 {{delName}} ?</span>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="delVariateVisible = false">取 消</el-button>
        <el-button class="dang" @click="delVariate">确 定</el-button>
      </span>
    </el-dialog>

    <!-------------------------------- 新增文件表单 --------------------->
    <el-dialog
      title="导入文件"
      :visible.sync="importFileVisible"
      :close-on-click-modal="false"
      width="500px"
      @close="fileClose"
      class="file-dialog"
    >
      <!--  <el-form :model="addFileForm" label-width="100px" class="form">
        <el-form-item label="选择文件" prop="file" style="position: relative;">
          <input
            @change="selectFile($event)"
            type="file"
            ref="input1"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          />
        </el-form-item>
        <div class="form-footer" style="display: flex; justify-content: center">
          <el-button
            class="cancel"
            @click="importFileVisible = false"
            style="    background-color: green;
          color: #fff;
          border: none;"
          >取 消</el-button>
          <el-button class="confirm" @click.prevent="fileSubmit">确 定</el-button>
        </div>
      </el-form>-->
      <el-upload
        action="#"
        :file-list="fileList"
        :on-change="changeData"
        :http-request="handleRequest"
        :before-upload="beforeUpload"
        style="padding-top: 10px"
        :disabled="ifUpload"
      >
        <el-button :disabled="ifUpload" class="btn upload-btn">上传附件</el-button>
        <div slot="tip" class="el-upload__tip">上传文件大小不超过50M</div>
      </el-upload>
      <!-- 1111 -->
      <div class="pro" v-show="ifUpload" style="display: flex;">
        <span>上传进度</span>
        <el-progress
          style="margin-bottom: 10px; flex: 1; margin-left: 16px;"
          :stroke-width="6"
          :percentage="progressPercent"
        ></el-progress>
      </div>

      <div
        style="width: 100%; height: 30px;"
        v-loading="parseLoading"
        element-loading-text="服务器正在解析..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(40, 57, 70)"
      ></div>
    </el-dialog>
  </div>
</template>

<script>
import MyBreadcrumb from "../subcomponents/Mybreadcrumb";
import GLOBAL from "../../utils/global_variable";
import { throttle, findArrIndex } from "../../utils/index.js";
export default {
  components: {
    MyBreadcrumb
  },
  inject: ["reload"], //注入依赖
  data() {
    // 数值验证
    var checkNum = (rule, value, callback) => {
      if (!value && value !== 0) {
        return callback(new Error("数值不能为空"));
      }
      if (parseFloat(value) != value) {
        callback(new Error("请输入数值"));
      } else {
        callback();
      }
    };
    var checkNumNotZ = (rule, value, callback) => {
      if (!value && value !== 0) {
        return callback(new Error("数值不能为空"));
      }
      if (parseFloat(value) === 0) {
        return callback(new Error("系数不能为0"));
      }
      if (parseFloat(value) != value) {
        callback(new Error("请输入数值"));
      } else {
        callback();
      }
    };
    return {
      parseLoading: false,
      // 变量展示模拟量状态量选值
      selectType: "0",
      // 是否处于批量删除状态
      deleteMul: false,
      // 添加变量模拟量状态量选值
      variateType: "0",
      VariateVisible1: false,
      VariateVisible2: false,
      delVariateVisible: false,
      propertyOptions: [],
      equip: null,
      addVariateData: {
        name: "",
        code: "",
        gatewayId: "",
        equipmentId: "",
        unit: "",
        daId: "",
        relative: "",
        type: "",
        corn: "",
        init: "",
        base: "",
        coefficient: "",
        offset: "",
        propertiesArr: [],
        childrenProperties: null,
        properties: null
      },
      gatewayOptions: [],
      variateData: [],
      currentPage: 1,
      totalVariate: 0, //总量
      // 模拟量表单
      simulateVariateData: {
        // status: 0,
      },
      // 状态量表单
      statusVariateData: {},
      // 添加模拟量的表单验证
      addVariateRules: {
        name: [{ required: true, message: "请输入变量名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入变量描述", trigger: "blur" }],
        // properties: [{ required: true, message: "请选择属性", trigger: "blur" }],
        gatewayId: [{ required: true, message: "请选择网关", trigger: "blur" }],
        equipmentId: [
          { required: true, message: "请选择设备", trigger: "change" }
        ],
        // unit: [{ required: true, message: "请输入单位", trigger: "blur" }],
        daId: [{ required: true, message: "请选择数据区", trigger: "change" }],
        relative: [
          {
            validator: checkNum,
            required: true,
            trigger: "blur"
          }
        ],
        type: [{ required: true, message: "请输入数据类型", trigger: "blur" }],
        corn: [{ required: true, message: "请选择上报周期", trigger: "blur" }],
        init: [
          {
            validator: checkNum,
            required: true,
            // message: "请输入id",
            trigger: "blur"
          }
        ],
        base: [
          {
            validator: checkNum,
            required: true,
            // message: "请输入id",
            trigger: "blur"
          }
        ],
        coefficient: [
          {
            validator: checkNumNotZ,
            required: true,
            // message: "请输入id",
            trigger: "blur"
          }
        ],
        offset: [
          {
            validator: checkNum,
            required: true,
            // message: "请输入id",
            trigger: "blur"
          }
        ]
      },
      howAdd: "hour",
      ifDisabled: false,
      equipmentOptions: [],
      variateTypeOptions: [],
      variateNatureOptions: [],
      dataAreaOptions: [],
      dataTypeOptions: [],
      cornOptions: [
        { value: 0, label: "不保存" },
        // { value: 0, label: "1 ——> 5" },
        { value: 5, label: "五分钟" },
        { value: 60, label: "一小时" }
      ],
      // 变量筛选条件
      equipOptions: [], //站下下的所有设备，用于表格的筛选
      variableTypeOptions: [
        {
          label: "模拟量",
          val: "0"
        },
        {
          label: "状态量",
          val: "1"
        }
      ],
      delName: "", //删除变量的名字
      delId: "", //删除变量的编号
      delCode: "", //删除的编码
      dataOptions: [],
      searchDataId: "", //查询数据区的设备id
      ncInput: "", //搜索框内容
      size: 10,
      ifDetail: false, //记录数据区的选择样式
      ifAdd: false, //记录编辑或新增后以何种方式提交
      cascader: false, //联级组件的刷新使用
      dataId: "", //记录由子组件传过来的id用来获取数据类型
      dataNum: "", //记录数据地址需要加上的数据
      length: "", //记录长度，用于检测数据地址范围
      valArr: [
        {
          label: "0",
          val: "0"
        },
        {
          label: "1",
          val: "1"
        }
      ], //当前值数组
      num: 0, //用于状态量模拟量切换清除子组件值
      loading: false,
      codeString: "", //变量编码集字符串
      idString: "", //编号编码集字符串
      interval_variate: null, //定时器
      variateOptions: [], //弹窗里面的设备列表
      importFileVisible: false, //导入文件弹窗
      addFileForm: {}, //导入文件表单
      // 用于标识表单中数据区被删除的情况
      ifDataDel: false, //数据区是否被删除
      dataName: "", //数据区名称
      dataId: "", //数据区标号
      multipleSelection: [], //批量删除的编号集合
      fileList: [], //弹窗文件列表
      url: "",
      progressPercent: 0, //导出文件百分比
      actionURL: "", //导出文件地址
      ifUpload: false, //下载状态
      exportLoading: false, //导出文件状态
      exportModelLoading: false //导出模板状态
    };
  },
  computed: {
    watchSiteChange() {
      return this.$store.state.site.siteId;
    },
    visibleTitleName() {
      return this.ifAdd ? "新增变量" : "变量详情";
    }
  },
  watch: {
    watchSiteChange() {
      this.searchAll();
      this.getAllEquip();
      // this.reload()
    },
    progressPercent(newValue) {
      if (newValue == 100) {
        this.parseLoading = true;
      }
    }
  },
  methods: {
    // 表单展示状态量模拟量值改变
    typeSelectChange(val) {
      if (this.interval_variate) {
        clearInterval(this.interval_variate);
      }
      this.selectType = val;
      this.codeString = "";
      this.idString = "";
      this.currentPage = 1;
      this.searchAll();
    },
    // 请求所有变量数据
    searchAll() {
      // 当前站点存在才请求数据
      if (this.$store.state.site.siteId) {
        this.selectDataType(true);

        var paramsObj = {
          name: this.ncInput,
          page: this.currentPage - 1,
          size: this.size,
          variableType: parseInt(this.selectType)
        };
        paramsObj.siteId = this.$store.state.site.siteId;
        if (this.equip) {
          paramsObj.equipmentId = this.equip;
        }
        this.loading = true;
        let timeout = setTimeout(() => {
          this.loading = false;
        }, 15000);
        this.$http
          .get("equipment/variable/findAll", {
            params: paramsObj
          })
          .then(res => {
            if (res.data.code == 0) {
              this.loading = false;
              this.variateData = res.data.data.variables;
              this.totalVariate = res.data.data.total;
              this.codeString = "";
              this.idString = "";
              this.variateData.forEach(item => {
                this.codeString = this.codeString + item.code + ","; //获取变脸编码集
                this.idString = this.idString + item.equipmentId + ","; //获取编号编码集
                item.areaName = item.areaName + "[" + item.area + "]";
                switch (item.corn) {
                  case 0:
                    item.corn = "不保存";
                    break;
                  case 5:
                    item.corn = "五分钟";
                    break;
                  case 60:
                    item.corn = "一小时";
                    break;
                }
              });
              // 定时刷新当前值
              if (this.codeString) {
                this.getValue(); //获取当前值
                // 定时获取当前值
                if (this.interval_variate) {
                  clearInterval(this.interval_variate);
                }
                this.interval_variate = setInterval(() => {
                  if (!this.codeString) {
                    clearInterval(this.interval_variate);
                    return;
                  }
                  this.getValue();
                }, 10000);
              }

              this.loading = false;
            }
            var option = this.dataTypeOptions;
            var arrayObj = this.variateData;
            for (var i = 0; i < arrayObj.length; i++) {
              for (var j = 0; j < option.length; j++) {
                if (option[j].id == arrayObj[i].type) {
                  arrayObj[i].type = option[j].name;
                }
              }
            }
          })
          .catch(res => {
            this.loading = false;
          });
      }
    },
    // 分页大小改变
    handleSizeChange(val) {
      this.size = val;
      this.currentPage = 1;
      this.searchAll();
    },
    // 分页改变
    handleCurrentChange(val) {
      this.currentPage = val;
      this.searchAll();
    },
    // -------------------------------------查看变量详情
    searchVariate(row) {
      this.selectDataType(true);
      this.getProperty();
      this.getAllGateway(true);
      this.ifDetail = true;
      this.ifAdd = false;
      this.VariateVisible1 = true;
      this.$http
        .get("equipment/variable/detail", {
          params: {
            // id: row.id
            code: row.code
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.area = res.data.data.variable.area;
            this.variateType = res.data.data.variable.variableType + ""; //转字符串
            this.addVariateData = res.data.data.variable;
            this.addVariateData.propertiesArr = []; //联级属性
            this.addVariateData.value = this.addVariateData.value + "";
            this.addVariateData.gatewayId = res.data.data.gatewayId;
            if (this.addVariateData.properties) {
              this.addVariateData.propertiesArr[0] = this.addVariateData.properties;
            }
            if (this.addVariateData.childrenProperties) {
              this.addVariateData.propertiesArr[1] = this.addVariateData.childrenProperties;
            }
            // 自行定义所属设备显示的数组
            var obj = {
              value: res.data.data.variable.equipmentId,
              label: res.data.data.equipmentName
            };
            this.equipmentOptions.splice(0, this.equipmentOptions.length);
            this.equipmentOptions.push(obj);
            // 自行定义显示数据区数组
            var objData = {
              label: res.data.data.dataAreName,
              value: res.data.data.variable.daId
            };
            this.dataAreaOptions.splice(0, this.dataAreaOptions.length);
            this.dataAreaOptions.push(objData);
            // 计算数据区长度及起始地址
            this.controlLength();
          }
        })
        .catch(res => {});
    },
    // 首次编辑变量获取地址长度限制
    controlLength() {
      var equip = this.addVariateData.equipmentId;
      if (equip) {
        let index = findArrIndex(this.variateOptions, "equipmentId", equip);
        this.dataId = this.variateOptions[index].id;
        // this.dataAreaOptions = [];
        // 选中设备和下拉情况下请求数据
        this.$http
          .get("equipment/equipmentDetail", {
            params: {
              id: this.dataId
            }
          })
          .then(res => {
            if (res.data.code == 0) {
              // 定义显示的数据下拉数组
              res.data.data.dataAreas.forEach((item, index) => {
                item.label = item.name;
                item.value = item.id;
              });
              this.dataAreaOptions = res.data.data.dataAreas;
              let index1 = this.dataAreaOptions.findIndex(item => {
                return item.id == this.addVariateData.daId;
              });
              if (index1 > -1) {
                this.length = parseInt(this.dataAreaOptions[index1].length);
                this.dataNum = parseInt(this.dataAreaOptions[index1].begin);
              } else {
                // 数据地址不存在的情况下默认length为10000
                this.length = 10000;
                this.dataNum = 0;
                this.ifDataDel = true;
                this.dataName = this.addVariateData.dataName;
                this.daId = this.addVariateData.daId;
                this.addVariateData.daId = this.dataName;
              }
            }
          });
      }
    },
    // 新增模拟量或状态量弹窗
    addVariate() {
      this.getProperty();
      // 根据当前显示状态量或模拟量锁定表单当前变量类型
      this.variateType = this.selectType;
      this.VariateVisible1 = true;
      this.addVariateData = {};
      this.addVariateData.variableType = this.variateType;
      this.ifDetail = false;
      this.ifAdd = true;
      this.cascader = true;
    },
    // 选中网关修改
    gatewayChange() {
      this.addVariateData.equipmentId = null;
      this.addVariateData.daId = null;
      this.dataAreaOptions = [];
      this.variateOptions = [];
    },
    // 通过网关获取设备
    getEquipByGateway(flag) {
      if (flag) {
        this.variateOptions = [];
        if (!this.addVariateData.gatewayId) {
          this.$message("请先选中网关!");
          return;
        }
        this.$http
          .get("equipment/equipmentList", {
            params: {
              page: 0,
              // size: 9999,
              size: GLOBAL.max_page_size,
              gatewayId: this.addVariateData.gatewayId
            }
          })
          .then(res => {
            if (res.data.code === 0) {
              this.variateOptions = res.data.data.equipments;
            }
          });
      }
    },
    // 选中设备修 改
    equipChange() {
      // 选中电表后，数据区数据清除缓存
      this.$nextTick(() => {
        this.$delete(this.addVariateData, "daId");
        this.dataAreaOptions = [];
      });
      // this.addVariateData.daId = null;
      // this.dataAreaOptions = [];
    },
    // ------------------------------------请求数据区数据
    searchData(flag) {
      var equip = this.addVariateData.equipmentId;
      if (flag && equip) {
        let index = findArrIndex(this.variateOptions, "equipmentId", equip);
        this.dataId = this.variateOptions[index].id;
        // this.dataAreaOptions = [];
        // 选中设备和下拉情况下请求数据
        this.$http
          .get("equipment/equipmentDetail", {
            params: {
              id: this.dataId
              // id: this.addVariateData.equipmentId
            }
          })
          .then(res => {
            if (res.data.code == 0) {
              // 判断是否为空数组
              this.dataAreaOptions = [];
              if (res.data.data.dataAreas.length == 0) {
                this.$message("该电表下无数据区，请重新选择或去数据去添加数据");
                return;
              }
              // 定义显示的数据下拉数组
              res.data.data.dataAreas.forEach((item, index) => {
                item.label = item.name;
                item.value = item.id;
              });
              this.dataAreaOptions = res.data.data.dataAreas;
            }
          });
      } else if (flag && !equip) {
        this.$message("请先选择所属电表");
      }
    },
    // 点击删除操作
    tryDelVariate(row) {
      this.delName = row.name;
      this.delId = row.id;
      this.delCode = row.code;
      this.delVariateVisible = true;
    },
    // 确认删除
    delVariate() {
      this.$http
        .get("equipment/variable/remove", {
          params: {
            // ids: this.delId
            codes: this.delCode
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$notify({
              message: "删除成功",
              type: "success"
            });
            this.delVariateVisible = false;
            if (this.variateData.length == 1 && this.totalVariate > 1) {
              this.currentPage--;
            }
            this.searchAll();
          } else {
            this.$message(res.data.msg);
          }
        });
    },
    // 模拟变量、状态变量的新增编辑修改---------------------------------------
    submitVariate() {
      // 公司编号赋值
      let companyId = this.$store.state.site.searchCompanyId;
      if (this.variateType == 0) {
        this.$refs.addVariateRef.validate(valid => {
          if (valid) {
            // -------------判断数据区地址范围(只能判断在新增情况下或数据区编辑过得情况下)--------------------
            if (
              parseFloat(this.addVariateData.relative) >
                parseFloat(this.length) ||
              parseFloat(this.addVariateData.relative) < 0
            ) {
              this.$message("数据地址的范围为0---" + this.length);
              return;
            }
            // 属性清空
            this.addVariateData.properties = null;
            this.addVariateData.childrenProperties = null;
            if (
              this.addVariateData.propertiesArr &&
              this.addVariateData.propertiesArr.length > 0
            ) {
              for (
                var i = 0;
                i < this.addVariateData.propertiesArr.length;
                i++
              ) {
                if (i === 0) {
                  this.addVariateData.properties = this.addVariateData.propertiesArr[
                    i
                  ];
                }
                if (i === 1) {
                  this.addVariateData.childrenProperties = this.addVariateData.propertiesArr[
                    i
                  ];
                }
              }
            }
            // 系数不设置范围
            if (this.ifAdd) {
              var obj = {
                name: this.addVariateData.name,
                code: this.addVariateData.code,
                gatewayId: this.addVariateData.gatewayId,
                equipmentId: this.addVariateData.equipmentId,
                daId: this.addVariateData.daId,
                relative: this.addVariateData.relative,
                type: this.addVariateData.type,
                corn: this.addVariateData.corn,
                init: this.addVariateData.init,
                base: this.addVariateData.base,
                coefficient: this.addVariateData.coefficient,
                unit: this.addVariateData.unit,
                variableType: +this.variateType,
                companyId: companyId,
                area:
                  parseInt(this.addVariateData.relative) +
                  parseInt(this.dataNum),
                dataName: this.dataAreaOptions[
                  findArrIndex(
                    this.dataAreaOptions,
                    "value",
                    this.addVariateData.daId
                  )
                ].name,
                properties: this.addVariateData.properties
                  ? this.addVariateData.properties
                  : null,
                childrenProperties: this.addVariateData.childrenProperties
                  ? this.addVariateData.childrenProperties
                  : null
              };
              // 新增提交
              this.$http.post("equipment/variable/add", obj).then(res => {
                if (res.data.code == 0) {
                  this.$notify({
                    message: "添加成功",
                    type: "success"
                  });
                  this.searchAll();
                } else {
                  this.$message(res.data.msg);
                }
              });
            } else {
              // 编辑提交模拟量
              var obj = {
                id: this.addVariateData.id,
                name: this.addVariateData.name,
                code: this.addVariateData.code,
                gatewayId: this.addVariateData.gatewayId,
                equipmentId: this.addVariateData.equipmentId,
                daId: this.ifDataDel ? this.daId : this.addVariateData.daId,
                relative: this.addVariateData.relative,
                companyId: companyId,
                type: this.addVariateData.type,
                corn: this.addVariateData.corn,
                init: this.addVariateData.init,
                base: this.addVariateData.base,
                coefficient: this.addVariateData.coefficient,
                properties: this.addVariateData.properties
                  ? this.addVariateData.properties
                  : null,
                childrenProperties: this.addVariateData.childrenProperties
                  ? this.addVariateData.childrenProperties
                  : null,
                unit: this.addVariateData.unit,
                variableType: +this.variateType,
                area: this.dataNum + parseInt(this.addVariateData.relative),
                // 考虑当前数据区已被删除
                dataName: this.ifDataDel
                  ? this.dataName
                  : this.dataAreaOptions[
                      findArrIndex(
                        this.dataAreaOptions,
                        "value",
                        this.addVariateData.daId
                      )
                    ].label
              };
              if (this.addVariateData.properties) {
                obj.properties = this.addVariateData.properties;
              }
              if (this.addVariateData.childrenProperties) {
                obj.childrenProperties = this.addVariateData.childrenProperties;
              }
              this.$http.post("equipment/variable/update", obj).then(res => {
                if (res.data.code == 0) {
                  this.addVariateData = {};
                  this.VariateVisible1 = false;
                  this.$notify({
                    message: "修改成功",
                    type: "success"
                  });
                  this.searchAll();
                } else if (res.data.code == 603) {
                  this.$message("编码已存在");
                } else if (res.data.code == 611) {
                  this.$message(res.data.msg);
                }
              });
            }
          }
        });
      } else if (this.variateType == "1") {
        // 状态量编辑提交
        this.$refs.addVariateRef.validate(valid => {
          if (valid) {
            if (
              parseFloat(this.addVariateData.relative) >
                parseFloat(this.length) ||
              parseFloat(this.addVariateData.relative) < 0
            ) {
              this.$message("数据地址的范围为0---" + this.length);
              return;
            }
            // 属性清空
            this.addVariateData.properties = null;
            this.addVariateData.childrenProperties = null;
            if (
              this.addVariateData.propertiesArr &&
              this.addVariateData.propertiesArr.length > 0
            ) {
              for (
                var i = 0;
                i < this.addVariateData.propertiesArr.length;
                i++
              ) {
                if (i === 0) {
                  this.addVariateData.properties = this.addVariateData.propertiesArr[
                    i
                  ];
                }
                if (i === 1) {
                  this.addVariateData.childrenProperties = this.addVariateData.propertiesArr[
                    i
                  ];
                }
              }
            }
            if (this.ifAdd) {
              // 新增状态量

              this.$http
                .post("equipment/variable/add", {
                  name: this.addVariateData.name,
                  code: this.addVariateData.code,
                  gatewayId: this.addVariateData.gatewayId,
                  equipmentId: this.addVariateData.equipmentId,
                  daId: this.addVariateData.daId,
                  relative: this.addVariateData.relative,
                  companyId: companyId,
                  offset: this.addVariateData.offset,
                  properties: this.addVariateData.properties
                    ? this.addVariateData.properties
                    : null,
                  childrenProperties: this.addVariateData.childrenProperties
                    ? this.addVariateData.childrenProperties
                    : null,
                  variableType: +this.variateType,
                  type: this.addVariateData.type,
                  base: 0,
                  coefficient: 1,
                  corn: this.addVariateData.corn,
                  area:
                    parseInt(this.addVariateData.relative) +
                    parseInt(this.dataNum),
                  dataName: this.dataAreaOptions[
                    findArrIndex(
                      this.dataAreaOptions,
                      "value",
                      this.addVariateData.daId
                    )
                  ].name
                })
                .then(res => {
                  if (res.data.code == 0) {
                    this.$notify({
                      message: "添加成功",
                      type: "success"
                    });
                    this.searchAll();
                  } else if (res.data.code == 603) {
                    this.$message("编码已存在");
                  } else if (res.data.code == 612) {
                    this.$message(res.data.msg);
                  } else if (res.data.code == 611) {
                    this.$message(res.data.msg);
                  }
                });
            } else {
              // 编辑状态量
              var obj = {
                id: this.addVariateData.id,
                name: this.addVariateData.name,
                code: this.addVariateData.code,
                gatewayId: this.addVariateData.gatewayId,
                equipmentId: this.addVariateData.equipmentId,
                // daId: this.addVariateData.daId,
                daId: this.ifDataDel ? this.daId : this.addVariateData.daId,
                // area: this.addVariateData.area + parseInt(this.dataNum),
                relative: this.addVariateData.relative,
                companyId: companyId,
                offset: this.addVariateData.offset,
                properties: this.addVariateData.properties
                  ? this.addVariateData.properties
                  : null,
                childrenProperties: this.addVariateData.childrenProperties
                  ? this.addVariateData.childrenProperties
                  : null,
                variableType: +this.variateType,
                type: this.addVariateData.type,
                base: 0,
                coefficient: 1,
                corn: this.addVariateData.corn,
                // area: this.dataNum
                //   ? parseInt(this.addVariateData.relative) +
                //     parseInt(this.dataNum)
                //   : this.area,
                area: this.dataNum + parseInt(this.addVariateData.relative),
                // 考虑当前数据区已被删除
                dataName: this.ifDataDel
                  ? this.dataName
                  : this.dataAreaOptions[
                      findArrIndex(
                        this.dataAreaOptions,
                        "value",
                        this.addVariateData.daId
                      )
                    ].label
              };
              // 判断当前值是否存在
              if (
                this.addVariateData.value == 0 ||
                this.addVariateData.value == 1
              ) {
                obj.value = +this.addVariateData.value;
              }
              this.$http.post("equipment/variable/update", obj).then(res => {
                // alert(res.data.code)
                if (res.data.code == 0) {
                  this.addVariateData = {};
                  this.VariateVisible1 = false;
                  this.$notify({
                    message: "修改成功",
                    type: "success"
                  });
                  this.searchAll();
                } else if (res.data.code == 603) {
                  this.$message("编码已存在");
                } else if (res.data.code == 612) {
                  this.$message(res.data.msg);
                } else if (res.data.code == 611) {
                  this.$message(res.data.msg);
                }
              });
            }
          }
        });
      }
    },
    // 搜索词修改
    search() {
      this.currentPage = 1;
      this.searchAll();
    },
    // 修改电表按钮
    EquipmentChange() {
      this.ifDetail = false;
      this.cascader = true;
      this.addVariateData.daId = null;
      this.addVariateData.equipmentId = null;
    },
    // 获取变量属性
    getProperty() {
      this.$http
        .get("equipment/variableProperties/findAll", {
          params: {}
        })
        .then(res => {
          if (res.data.code === 0) {
            this.propertyOptions = res.data.data;
          }
        });
    },
    // 请求数据区数组
    selectDataType(flag) {
      if (flag) {
        this.$http
          .get("equipment/dataType/findAll", {
            params: {
              variableType: +this.selectType
            }
          })
          .then(res => {
            if (res.data.code == 0) {
              this.dataTypeOptions = res.data.data;
            }
          });
      }
    },
    // 数据区改变后计算dataNum
    selectDataArea(id) {
      // 清除数据区不存在的数据标识
      this.ifDataDel = false;
      this.dataName = null;
      this.daId = null;
      var daId = this.addVariateData.daId;
      this.$forceUpdate(); //强制更新页面，会触发update生命周期
      var index = this.dataAreaOptions.findIndex(item => {
        return item.id == daId;
      });
      this.dataNum = this.dataAreaOptions[index].begin;
      this.length = this.dataAreaOptions[index].length;
    },
    // 变量显示模拟量或状态量改变
    addVariateTypeChange(val) {
      this.variateType = val;
      if (val == 0) {
        this.cascader = true;
        this.VariateVisible1 = true;
        this.VariateVisible2 = false;
      } else {
        this.cascader = true;
        this.VariateVisible1 = false;
        this.VariateVisible2 = true;
      }
    },
    // 新增变量类型转换
    variableTypeChange() {
      // this.num ++
      this.$forceUpdate(); //强制更新页面
      this.ifDetail = true;
      this.ifDetail = false;
      this.variateType = this.addVariateData.variableType;
      this.addVariateData = {
        variableType: this.variateType
      };
      this.num++;
    },
    // 弹窗关闭前的回调
    beforeClose() {
      this.addVariateData = {};
      this.$refs.addVariateRef.resetFields();
      this.dataNum = null;
      // 清除表单里面数据区不存在的数据
      this.ifDataDel = false;
      this.dataName = null;
      this.daId = null;
      this.searchAll();
    },
    // 获取当前值
    getValue() {
      this.$http
        .get("equipment/variable/getValue", {
          params: {
            variableList: this.codeString.slice(0, this.codeString.length - 1),
            equipmentIds: this.idString.slice(0, this.idString.length - 1)
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            for (var i = 0; i < this.variateData.length; i++) {
              for (var j = 0; j < res.data.data.length; j++) {
                for (var k in res.data.data[j]) {
                  if (this.variateData[i].code == k) {
                    this.variateData[i].value = res.data.data[j][k];
                  }
                }
              }
            }
          }
        });
      // }, 10000);
    },
    // 获取所有网关
    getAllGateway(flag) {
      if (!flag) {
        return;
      }
      this.$http
        .get("equipment/gatewayList", {
          params: {
            page: 0,
            size: GLOBAL.max_page_size,
            roomId: this.$store.state.site.siteId
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.gatewayOptions = res.data.data.gateways;
          }
        });
    },
    // 获取站点下的所有设备
    getAllEquip() {
      // 当前站点存在才请求数据
      if (this.$store.state.site.siteId) {
        this.$http
          .get("equipment/getEqByRoom", {
            params: {
              roomId: this.$store.state.site.siteId
            }
          })
          .then(res => {
            if (res.data.code == 0) {
              this.variateOptions = res.data.data;
            }
          });
      }
    },
    // 导出模板
    exportModel() {
      this.exportModelLoading = true;
      this.$notify({
        message: "开始导出"
      });
      this.$http({
        methods: "GET",
        url: "equipment/variable/uploadModel",
        responseType: "arraybuffer"
        // 设置responseType: 'arraybuffer': 解决下载下来的文件乱码问题
      })
        .then(res => {
          console.log(res);
          const link = document.createElement("a");
          const blob = new Blob([res.data], {
            type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          });
          let href = window.URL.createObjectURL(blob);
          link.href = href;

          let _fileName = res.headers["content-disposition"]
            .split(";")[1]
            .split("=")[1]
            .split(".")[0];
          // 文件名中有中文 则对文件名进行转码
          link.download = decodeURIComponent(_fileName);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(href);
          setTimeout(() => {
            this.$notify({
              message: "模板已导出",
              type: "success"
            });
          }, 1000);
          this.exportModelLoading = false;
        })
        .catch(err => {
          // this.$notify({
          //   message: "模板下载失败"
          // });
          this.exportModelLoading = false;
        });
    },
    // 导入文件
    importFile() {
      // 重置内容
      this.fileList = [];
      this.progressPercent = 0;
      this.importFileVisible = true;
      // this.$nextTick(() => {
      //   let file = this.$refs.input1;
      //   file.value = "";
      //   this.$delete(this.addFileForm, "file");
      // });
    },
    selectFile(event) {
      this.addFileForm.file = event.target.files[0];
    },
    // 导入文件提交
    fileSubmit() {
      if (this.addFileForm.file) {
        // 计算公司Id
        let index = this.$store.state.site.siteList.findIndex((item, index) => {
          return item.id == this.$store.state.site.siteId;
        });
        let companyId = this.$store.state.site.siteList[index].companyId;
        let formdata = new FormData();
        formdata.append("file", this.addFileForm.file);
        formdata.append("siteId", this.$store.state.site.siteId);
        formdata.append("companyId", companyId);
        let config = {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        };
        this.$http
          .post("equipment/variable/importExcel", formdata, config)
          .then(res => {
            if (res.data.code == 0) {
              this.$notify({
                title: "成功",
                message: "上传成功",
                type: "success"
              });
              this.importFileVisible = false;
              this.searchAll();
            } else {
              this.$notify({
                title: "失败",
                message: res.data.msg,
                type: "warning"
              });
            }
          });
      } else {
        this.$notify({
          message: "请选择文件",
          type: "warning"
        });
      }
    },
    // 导出变量
    exportVariable() {
      this.exportLoading = true;
      this.$notify({
        message: "开始导出"
      });
      var obj = {
        siteId: this.$store.state.site.siteId,
        variableType: this.selectType
      };
      if (this.equip) {
        obj.equipmentId = this.equip;
      }
      if (this.ncInput) {
        obj.codeName = this.ncInput;
      }

      this.$http({
        methods: "GET",
        url: "equipment/variable/exportExcel",
        params: obj,
        responseType: "arraybuffer"
      })
        .then(res => {
          const link = document.createElement("a");
          const blob = new Blob([res.data], {
            type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          });
          let href = window.URL.createObjectURL(blob);
          link.href = href;

          let _fileName = res.headers["content-disposition"]
            .split(";")[1]
            .split("=")[1]
            .split(".")[0];
          // 文件名中有中文 则对文件名进行转码
          link.download = decodeURIComponent(_fileName);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(href);
          setTimeout(() => {
            this.$notify({
              message: "变量导出完成",
              type: "success"
            });
          }, 1000);

          this.exportLoading = false;
        })
        .catch(err => {
          this.exportLoading = false;
          // this.$notify({
          //   message: "变量导出失败",
          //   type: 'warning'
          // });
        });
    },
    getEquip(flag) {
      if (!flag) {
        return;
      }
      this.$http
        .get("equipment/getEqByRoom", {
          params: {
            roomId: this.$store.state.site.siteId
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.variateOptions = res.data.data;
            this.equipOptions = res.data.data;
          }
        });
    },
    // 批量删除变量提交
    deleteMulVar() {
      if (!this.multipleSelection.length) {
        this.$message("请至少选中一个变量进行批量删除操作！");
        return;
      }
      let ids;
      let codes;
      if (this.multipleSelection) {
        let arr1 = [];
        this.multipleSelection.forEach(item => {
          // arr1.push(item.id);
          arr1.push(item.code);
        });
        // ids = arr1.join(",");
        codes = arr1.join(",");
      }
      this.$http
        .get("equipment/variable/remove", {
          params: {
            // ids: ids
            codes: codes
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$notify({
              message: "删除成功",
              type: "success"
            });
            this.delVariateVisible = false;
            // if (
            //   this.variateData.length === this.multipleSelection.length &&
            //   this.totalVariate > 1
            // ) {
            //   this.currentPage--;
            // }
            if (
              this.variateData.length === this.multipleSelection.length &&
              this.currentPage !== 1
            ) {
              this.currentPage--;
            }
            this.searchAll();
          } else {
            this.$message(res.data.msg);
          }
        });
    },
    // 改变后的选中状态数组
    handleSelectionChange(val) {
      this.multipleSelection = val;
      return;
      var arr = [];
      // id集合字符串
      var str = "";
      val.forEach(item => {
        arr.push(item.id);
      });
      str = arr.join(",");
    },
    //上传前对文件大小进行校验
    beforeUpload(file) {
      // console.log(file)
      // console.log(file.type)
      var arr = file.name.split(".");
      if (!(arr[arr.length - 1] === "xlsx" || arr[arr.length - 1] === "xls")) {
        this.$message.error("请选择表格文件");
        this.ifUpload = false;
        return false;
      }
      // return
      const isLt2M = file.size / 1024 / 1024 < 50;
      console.log(isLt2M);
      if (!isLt2M) {
        this.$message.error("上传文件大小大小不能超过 50MB!");
        return isLt2M;
      }
    },
    changeData(file, fileList) {
      this.ifUpload = true;
      // 数据小于0.1M的时候按KB显示
      const size =
        file.size / 1024 / 1024 > 0.1
          ? `(${(file.size / 1024 / 1024).toFixed(1)}M)`
          : `(${(file.size / 1024).toFixed(1)}KB)`;
      file.name.indexOf("M") > -1 || file.name.indexOf("KB") > -1
        ? file.name
        : (file.name += size);
    },
    // 文件上传
    handleRequest(data) {
      let formdata = new FormData();
      formdata.append("file", data.file);
      // 计算公司Id
      let index = this.$store.state.site.siteList.findIndex((item, index) => {
        return item.id == this.$store.state.site.siteId;
      });
      let companyId = this.$store.state.site.siteList[index].companyId;
      // let formdata = new formdata();
      // formdata.append("file", this.addFileForm.file);
      formdata.append("siteId", this.$store.state.site.siteId);
      formdata.append("companyId", companyId);
      const config = {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress: progressEvent => {
          // progressEvent.loaded:已上传文件大小
          // progressEvent.total:被上传文件的总大小
          this.progressPercent = Number(
            ((progressEvent.loaded / progressEvent.total) * 100).toFixed(2)
          );
        }
      };
      this.actionURL = "equipment/variable/importExcel";

      this.$http
        .post(this.actionURL, formdata, config)
        .then(res => {
          if (res.data.code === 0) {
            // alert("成功");

            this.$notify({
              title: "导入成功",
              type: "success"
            });
            this.parseLoading = false;
            // 设置0.3秒延迟关闭弹窗
            setTimeout(() => {
              this.importFileVisible = false;
            }, 300);
            this.searchAll();
          } else {
            this.parseLoading = false;
            this.fileList = [];
            // this.update
            this.ifUpload = false;
            this.progressPercent = 0;
            if (res.data.code) {
              this.$notify({
                message: res.data.msg,
                type: "warning"
              });
            }
          }
        })
        .catch(res => {
          this.parseLoading = false;
          this.ifUpload = false;
          this.progressPercent = 0;
          this.fileList = [];
        });
    },
    fileClose() {
      this.ifUpload = false;
      this.progressPercent = 0;
      this.fileList = [];
    },
    // 变量属性选中
    attrChange() {
      // 防止清空表单引起的属性值修改引起的bug
      if(this.VariateVisible1) {
        // 赋值单位
        this.addVariateData.unit = this.$refs.cascaderAddr.getCheckedNodes()[0].data.unit;
      }
    }
  },
  created() {
    this.searchAll();
    this.getAllEquip();
  },
  beforeDestroy() {
    // 清除定时器
    if (this.interval_variate) {
      clearInterval(this.interval_variate);
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/css/index.less";
.variate {
  height: 100%;
  /* 中间内容加一层底色 */
  .content-main {
    background-color: rgba(67, 92, 112);
    overflow-y: auto;
    height: calc(100% - 62px);
    /* 输入框改变大小 */
    /deep/ .el-input__inner {
      height: 32px;
      line-height: 32px;
    }
    .float-div {
      margin: 5px 10px 5px 10px;
      box-shadow: -2px 0 3px -1px #999, 0 2px 3px -1px #aaa, 2px 0 3px -1px #999;
      .content-title {
        padding: 10px;
        /deep/ .el-input {
          width: 200px;
          height: 32px;
          line-height: 32px;
        }
        .el-radio-group {
          margin-left: 16px;
          margin-right: 16px;
        }
        .button-edit {
          float: right;
        }
      }
      .variable-table {
        width: 99%;
        margin-top: 6px;
        margin: 5px 10px 5px 8px;
      }
      // 分页
      .block {
        width: 100%;
        height: 40px;
        padding-bottom: 15px;
        margin-top: 15px;
        /deep/ .el-pagination {
          float: right;
          text-align: right;
        }
      }
    }
  }
  .el-dialog__wrapper {
    /deep/ .variate-form {
      .p-title {
        padding: 5px;
        border-bottom: 1px solid #8fc7ba;
        margin-bottom: 5px;
      }
      .inline-input-width {
        width: 266px;
        display: inline-block;
      }
    }
    .form /deep/ input:hover {
      cursor: pointer;
    }
    .file-dialog {
    }
  }
}
</style>