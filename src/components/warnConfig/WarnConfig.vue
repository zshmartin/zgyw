<template>
  <!-- <div style="position: relative; height: 100%;"> -->
  <div style="position: relative; height: 100%;" id="warn-config">
    <MyBreadcrumb level1="告警管理" level2="触发配置"></MyBreadcrumb>
    <div class="sec">
      <div class="sec-left">
        <div class="tree">
          <el-tree
            :data="equipTree"
            style="width: 220px;"
            :props="defaultProps"
            node-key="id"
            ref="groupTree"
            highlight-current
            default-expand-all
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>
                <i :class="data.icon"></i>
                <!-- <i class="el-icon-edit"></i> -->
                <span>{{ node.label }}</span>
              </span>
            </span>
          </el-tree>
        </div>
      </div>
      <div class="sec-right">
        <div class="warn-top" style="margin-bottom: 4px;">
          <span style="font-size: 28px; color: rgb(62, 151, 205);">{{equipmentName}}</span>
          <el-switch
            v-model="monitorStatus"
            active-color="#13ce66"
            inactive-color="#ccc"
            @change="warnSwitch"
            :disabled="!Boolean(searchId)"
          ></el-switch>
          <span style="font-size: 12px; color: #fff;">告警开关</span>
        </div>
        <div class="warn-detail">
          <el-select
            v-model="type"
            filterable
            clearable
            placeholder="告警类型"
            size="mini"
            style="width: 150px; display: inline-block;"
            @visible-change="getWarnType"
            @change="warnTypeChange"
            :disabled="!Boolean(searchId)"
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select
            v-model="code"
            filterable
            clearable
            placeholder="变量筛选"
            size="mini"
            @visible-change="getCode"
            @change="codeChange"
            style="width: 150px; display: inline-block;"
            :disabled="!Boolean(monitorStatus)"
          >
            <el-option
              v-for="item in codeOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
          <div style="margin-top: 5px; margin-bottom: 5px; display: block; float: right">
            <el-button
              @click="tryAddWarn"
              size="mini"
              :disabled="!monitorStatus"
              class="confirm"
            >+ &nbsp;新建告警</el-button>
            <el-button
              @click="delMulConfig"
              size="mini"
              icon="el-icon-delete"
              class="del"
              :disabled="!(monitorStatus && configData.length)"
            >批量删除配置</el-button>
          </div>
        </div>
        <div class="warn-table">
          <div style=" box-shadow: rgb(202, 198, 198) 0px 0px 4px; padding: 4px;">
            <el-table :data="configData" border style="width: 100%;">
              <el-table-column prop="simplifiedCode" label="变量编码"></el-table-column>
              <el-table-column prop="equipmentName" label="设备描述"></el-table-column>
              <el-table-column prop="alarmTypeName" label="告警类型描述"></el-table-column>
              <el-table-column prop="threshold" label="阈值"></el-table-column>
              <el-table-column prop="status" label="告警开关">
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.status"
                    active-color="#13ce66"
                    @change="switch_change(scope.$index,scope.row)"
                    inactive-color="#ff4949"
                    :active-value="switchValueOpen"
                    :inactive-value="switchValueClose"
                    :disabled="!monitorStatus"
                  ></el-switch>
                </template>
              </el-table-column>
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
                      class="confirm"
                      size="mini"
                      :disabled="!monitorStatus"
                      @click="tryEdit( scope.row)"
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
                      :disabled="!monitorStatus"
                      class="del"
                      @click="del(scope.row)"
                    ></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
            <div style="height: 32px;">
              <div class="block" style="float: right; display: block;">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-sizes="[10,20,50]"
                  :page-size="pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total"
                ></el-pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 新增告警弹窗 -->
    <el-dialog
      :title="titleText"
      :close-on-click-modal="false"
      :visible.sync="addConfigVisible"
      width="500px"
      @close="visibleClose"
    >
      <el-form
        :model="addConfigForm"
        :rules="addConfigRule"
        ref="addConfigRef"
        label-width="110px"
        class="demo-ruleForm"
      >
        <el-form-item label="网关" prop="gatewayId" class="inline-input">
          <el-select
            style="margin-bottom: 4px;"
            v-model="addConfigForm.gatewayId"
            :disabled="Boolean(addConfigForm.id)"
            @visible-change="getAllGateway"
            @change="gatewayChange"
            filterable
          >
            <el-option
              v-for="item in gatewayOptions"
              :key="item.gatewayId"
              :value="item.gatewayId"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电表" prop="equipmentId" class="inline-input">
          <el-select
            style="margin-bottom: 4px;"
            v-model="addConfigForm.equipmentId"
            :disabled="Boolean(addConfigForm.id)"
            @visible-change="getEquipByGateway"
            @change="equipChange"
            filterable
          >
            <el-option
              v-for="item in equipmentOptions"
              :key="item.equipmentId"
              :value="item.equipmentId"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="变量编码" prop="code" class="inline-input" v-if="!addConfigForm.id">
          <el-select
            style="margin-bottom: 4px;"
            v-model="addConfigForm.code"
            @visible-change="getVariable"
            filterable
          >
            <!-- <el-option
              v-for="item in codeOptions"
              :key="item.code"
              :label="item.dataId"
              :value="item.code"
            ></el-option>-->
            <el-option
              v-for="item in codeOptions"
              :key="item.code"
              :label="item.simplifiedCode"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="变量编码" v-else>{{addConfigForm.simplifiedCode}}</el-form-item>
        <el-form-item label="告警类型" prop="alarmType" class="inline-input">
          <el-select v-model="addConfigForm.alarmType" @change="showTrigger">
            <el-option
              v-for="item in typeOptions"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="触发条件"
          prop="trigger"
          class="inline-input"
          v-if="addConfigForm.triggerCondition"
        >{{addConfigForm.trigger}}</el-form-item>
        <!-- 需要根据触发条判断是否需要填阈值 -->
        <el-form-item
          label="阈值"
          prop="threshold"
          class="inline-input"
          v-if="addConfigForm.trigger == '数值大于A' || addConfigForm.trigger == '数值小于A'"
        >
          <el-input v-model="addConfigForm.threshold"></el-input>
        </el-form-item>

        <!-- <el-form-item label="告警开关" prop="status" class="inline-input">
          <el-radio-group v-model="addConfigForm.status">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="addConfigVisible = false">取 消</el-button>
        <el-button class="confirm" @click="addConfigSubmit">保 存</el-button>
      </span>
    </el-dialog>
    <!-- 删除告警弹窗 -->
    <el-dialog title="提示" :close-on-click-modal="false" :visible.sync="delWarnVisible" width="30%">
      <div style="width: 30px;float: left;margin: -7px 8px 5px -8px;">
        <i :class="{icon: true, 'iconfont': true, 'iconjinggao1': true}"></i>
      </div>
      <span>是否确定删除此告警？</span>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="delWarnVisible = false">取 消</el-button>
        <el-button class="dang" @click="delWarn">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 批量删除 -->
    <el-dialog
      title="批量删除监控设备"
      :visible.sync="delMulConfigVisible"
      width="500px"
      class="user-dialog"
      @close="clearMoniorInfo"
    >
      <el-form
        :model="delMulConfigForm"
        :rules="delMulConfigRule"
        ref="delMulConfigRef"
        label-width="110px"
        class="user-form"
      >
        <el-form-item label="删除多选项" prop="id">
          <el-select
            v-model="delMulConfigForm.id"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择编码配置"
          >
            <el-option
              v-for="item in delMulConfigOptions"
              :key="item.id"
              :label="item.simplifiedCode"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="delMulConfigVisible = false">取 消</el-button>
        <el-button class="dang" @click="delMulSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import MyBreadcrumb from "../subcomponents/Mybreadcrumb";
import GLOBAL from "../../utils/global_variable";
export default {
  components: {
    MyBreadcrumb,
  },
  inject: ["reload"], //注入依赖
  computed: {
    watchSiteChange() {
      return this.$store.state.site.siteId;
    }
  },
  watch: {
    watchSiteChange() {
      this.equipmentName = null;
      this.equipTree = [];
      this.configData = [];
      this.searchId = null;
      this.index = 0;
      this.getAllVariateMenu();
      this.getEquipment();
    }
  },
  data() {
    // 新增网关、新增设备表单中的编号验证
    var checkInt = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("数值不能为空"));
      }
      if (parseFloat(value) != value) {
        callback(new Error("请输入数值"));
      } else {
        callback();
      }
    };
    return {
      monitorStatus: true, //设备告警开关
      addConfigVisible: false, //新增编辑告警弹窗
      delWarnVisible: false, //删除告警弹窗
      // 编辑新增告警表单
      addConfigForm: {
        gatewayId: null,
        equipmentId: null,
        code: null,
        type: null,
        trigger: null
      },
      // 表单验证规则
      addConfigRule: {
        gatewayId: [
          { required: true, message: "请选择网关", trigger: "change" }
        ],
        equipmentId: [
          { required: true, message: "请选择设备", trigger: "change" }
        ],
        code: [{ required: true, message: "请选择编码", trigger: "change" }],
        alarmType: [
          { required: true, message: "请选择告警类型", trigger: "change" }
        ],
        threshold: [
          {
            validator: checkInt,
            required: true,
            // message: "请输入连接数",
            trigger: "blur"
          }
        ],
        triggerCondition: [
          { required: true, message: "请选择触发条件", trigger: "blur" }
        ],
        status: [{ required: true, message: "请选择开关", trigger: "blur" }]
      },
      type: "",
      variate: "",
      equipTree: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 新增监控变量
      // 站点数组
      roomOptions: [],
      // 网关数组
      gatewayOptions: [],
      // 设备数组
      equipmentOptions: [],
      // 变量数组
      variableOptions: [],
      // 变量编码数组
      codeOptions: [],
      // 告警类型数组
      typeOptions: [],
      // 触发条件
      triggerOptions: [],
      warnRank: [],
      warnVariate: [],
      configData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      searchId: "", //存储选中设备的值，作为查询的参数
      cascader: false, //联级组件的刷新使用
      delId: "", //记录当前要删除的id
      equipmentName: "", //头部显示的设备名称
      ifAdd: false, //是否添加状态
      code: "",
      titleText: "",
      changeStatus: false, //表格的禁用状态
      ifRemember: false, //记录是否保存当前的设备选择
      index: null, //当前色号被所在的设备下标，
      addFileForm: {}, //批量导入设备文件表单
      delMulConfigVisible: false,
      delMulConfigForm: {}, //批量删除表单
      delMulConfigRule: {
        id: [
          {
            required: true,
            message: "请选择编码",
            trigger: "blur"
          }
        ]
      },
      delMulConfigOptions: [], //批量可选项
      switchValueOpen: 1,
      switchValueClose: 0
    };
  },

  methods: {
    // 修改按钮
    tryEdit(row) {
      this.ifAdd = false;
      this.titleText = "修改告警触发配置";
      this.addConfigVisible = true;
      if (this.$refs.addConfigRef) {
        this.$refs.addConfigRef.resetFields();
      }
      // 获取下拉选项数据
      this.getType();
      this.getTrigger();
      this.getEquipment();
      this.$http
        .get("/equipment/variableMonitor/findById", {
          params: {
            id: row.id
          }
        })
        .then(res => {
          // return
          if (res.data.code == 0) {
            this.addConfigForm = res.data.data;
            this.addConfigForm.trigger = res.data.data.triggerConditionName;
            var index = this.triggerOptions.findIndex(item => {
              return item.id == res.data.data.triggerCondition;
            });
            console.log(index);
            this.addConfigForm.trigger = this.triggerOptions[index].name;
          }
        });
    },
    // 删除告警
    del(row) {
      this.delId = row.id;
      this.delWarnVisible = true;
    },
    // 告警开关
    warnSwitch() {
      this.monitorStatus = !this.monitorStatus;
      this.$http
        .get("equipment/variableMonitor/contorStatus", {
          params: {
            equipmentId: this.searchId,
            contor: this.monitorStatus ? 0 : 1
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$notify({
              title: "成功",
              message: "操作成功",
              type: "success"
            });
            this.getAllVariateMenu();
          }
        });
    },
    // 新建监控变量弹窗
    tryAddWarn() {
      this.$nextTick(() => {
        this.addConfigVisible = true;
        // 对象来不及生成
        if (this.$refs.addConfigRef !== undefined) {
          this.$refs.addConfigRef.resetFields();
        }
        this.addConfigForm = {
          gatewayId: null,
          equipmentId: null,
          code: null,
          type: null,
          trigger: null
        };
        this.ifAdd = true;
        this.titleText = "新增告警触发配置";
        // 获取数据
        this.getType();
        this.getTrigger();
      });
    },
    // 确认删除监控变量
    delWarn() {
      this.$http
        .get("equipment/variableMonitor/remove", {
          params: {
            id: this.delId
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.delWarnVisible = false;
            this.$notify({
              message: "删除成功",
              type: "success"
            });
            // 保存在第几页的操作，并不让页面在有值的情况下出现空数组
            if (this.configData.length == 1 && this.currentPage > 1) {
              this.total = 0; //清空总条数
              this.currentPage--;
            }
            if (this.configData.length == 1 && this.total == 1) {
              // 如果只有一个数组则重新请求所有站点设备
              this.searchId = null; //去除searchId干扰
              this.index = null;
              this.equipmentName = null;
              this.configData = [];
              this.total = 0;
              this.getAllVariateMenu();
            } else {
              this.configData = [];
              this.getequipVariate();
            }
          }
        });
    },
    // 新建编辑监控变量
    addConfigSubmit() {
      this.$refs.addConfigRef.validate(valid => {
        if (valid) {
          var obj = {
            gatewayId: this.addConfigForm.gatewayId,
            code: this.addConfigForm.code,
            equipmentId: this.addConfigForm.equipmentId,
            alarmType: this.addConfigForm.alarmType,
            triggerCondition: this.addConfigForm.triggerCondition,
            // status: 1,
            siteId: this.$store.state.site.siteId
          };
          // 判断该类型是否有阈值
          if (
            this.addConfigForm.threshold &&
            (this.addConfigForm.trigger == "数值大于A" ||
              this.addConfigForm.trigger == "数值小于A")
          ) {
            obj.threshold = this.addConfigForm.threshold;
          }
          // 添加监控变量
          if (!this.addConfigForm.id) {
            this.type = "";
            this.code = "";
            obj.status = 1;
            // 新增
            this.$http.post("equipment/variableMonitor/add", obj).then(res => {
              if (res.data.code == 0) {
                this.$notify({
                  message: "新建成功",
                  type: "success"
                });
                // this.$refs.addConfigRef.resetFields()
                this.addConfigVisible = false;
                this.searchId = this.addConfigForm.equipmentId;
                let index = this.equipmentOptions.findIndex((item, index) => {
                  return this.searchId === item.equipmentId;
                });
                this.equipmentName = this.equipmentOptions[index].name;
                // 通过设备id查已有监控变量
                this.$http
                  .get("equipment/variableMonitor/findByEqId", {
                    params: {
                      equipmentId: this.addConfigForm.equipmentId,
                      page: 0,
                      size: this.pageSize
                    }
                  })
                  .then(res => {
                    this.total = res.data.data.total;
                    this.currentPage = Math.ceil(this.total / this.pageSize);
                    this.getAllVariateMenu();
                  });
              }
            });
          } else {
            // 修改监控变量
            obj.id = this.addConfigForm.id;
            obj.status = this.addConfigForm.status;
            // return
            this.$http
              .post("equipment/variableMonitor/modify", obj)
              .then(res => {
                if (res.data.code == 0) {
                  this.$notify({
                    message: "编辑成功",
                    type: "success"
                  });
                  this.addConfigVisible = false;
                  this.getequipVariate();
                }
              });
          }
        }
      });
    },
    // 获取站点设备列表
    getAllVariateMenu() {
      // 当前站点不存在，不发请求
      if (!this.$store.state.site.siteId) {
        return;
      }
      this.monitorStatus = true;
      this.$http
        .get("equipment/variableMonitor/getMenus", {
          params: {
            siteId: this.$store.state.site.siteId
          }
        })
        .then(res => {
          var res = res.data.data;
          var tree = [];
          // 设计数据格式
          for (var i = 0; i < res.length; i++) {
            tree[i] = {};
            tree[i].label = res[i].name;
            tree[i].val = res[i].id;
            tree[i].id = res[i].id;
            tree[i].children = [];
            tree[i].icon = "el-icon-place";
            for (var j = 0; j < res[i].equipments.length; j++) {
              tree[i].children[j] = {};
              tree[i].children[j].val = res[i].equipments[j].equipmentId;
              tree[i].children[j].id = res[i].equipments[j].equipmentId;
              tree[i].children[j].label = res[i].equipments[j].name;
              tree[i].children[j].monitorStatus =
                res[i].equipments[j].monitorStatus;
            }
          }
          this.equipTree = tree;
          // if (tree.length > 0) {
          if (tree[0].children.length > 0) {
            this.equipmentName =
              this.equipmentName || this.equipTree[0].children[0].label;
            this.searchId = this.searchId || this.equipTree[0].children[0].val;
            // 获取树形数据后回到原来的选中的设备

            var index = this.equipTree[0].children.findIndex(item => {
              return item.id === this.searchId;
            });
            // this.monitorStatus =
            //   parseInt(this.index) == this.index
            //     ? Boolean(this.equipTree[0].children[this.index].monitorStatus)
            //     : Boolean(this.equipTree[0].children[0].monitorStatus);
            this.monitorStatus = index
              ? Boolean(this.equipTree[0].children[index].monitorStatus)
              : Boolean(this.equipTree[0].children[0].monitorStatus);
            this.getequipVariate();
          }
          this.$nextTick(() => {
            // 赋值当前高亮
            this.$refs.groupTree.setCurrentKey(this.searchId);
          });
        });
    },
    // 获取单个设备的所有受监控变量
    getequipVariate() {
      var obj = {
        equipmentId: this.searchId,
        page: this.currentPage - 1,
        size: this.pageSize
      };
      // 是否根据帅选条件发送请求
      if (this.type) {
        obj.alarmType = this.type;
      }
      if (this.code) {
        obj.code = this.code;
      }
      this.$http
        .get("equipment/variableMonitor/findByEqId", {
          params: obj
        })
        .then(res => {
          this.configData = res.data.data.variableMonitorVOS;
          this.total = res.data.data.total;
        });
    },
    // 点击列表菜单
    handleNodeClick(node) {
      this.ifRemember = true;
      // 只允许设备查询并且与当前设备不重复
      if (node.children || node.val == this.searchId) {
        return;
      }
      this.index = this.equipTree[0].children.findIndex(item => {
        return item.val == node.val;
      });
      this.equipmentName = node.label;
      this.monitorStatus = Boolean(node.monitorStatus);
      this.searchId = node.val;
      this.currentPage = 1;
      this.type = "";
      this.code = "";
      this.getequipVariate();
    },
    // 页码尺寸改变
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
    },
    // 当前页改变
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getequipVariate();
    },
    // 获取变量
    selectEquipment(val, id) {
      this.addConfigForm.equipmentId = val[val.length - 1];
    },
    // 下拉编码选择框
    getVariable(flag) {
      this.codeOptions = [];
      if (flag) {
        // 判断是否选中设备
        if (!this.addConfigForm.equipmentId) {
          this.$message("请先选中电表！");
          return;
        }
        this.$http
          .get("equipment/variable/findAllByEquipment", {
            params: {
              equipmentId: this.addConfigForm.equipmentId
            }
          })
          .then(res => {
            if (res.data.code == 0) {
              this.codeOptions = res.data.data;
            }
          });
      }
    },
    // 获取告警类型
    getType() {
      // 当前站点不存在，不发请求
      if (!this.$store.state.site.siteId) {
        return;
      }
      this.$http
        .get("equipment/alarm/alarmTypes", {
          params: {
            siteId: this.$store.state.site.siteId,
            page: 0,
            size: GLOBAL.max_page_size
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.typeOptions = res.data.data.alarmTypes;
          }
        });
    },
    // 获取告警条件
    getTrigger() {
      this.$http
        .get("equipment/alarm/allTriggerCondition", {
          params: {}
        })
        .then(res => {
          if (res.data.code == 0) {
            this.triggerOptions = res.data.data;
          }
        });
    },
    // 显示触发条件
    showTrigger() {
      // this.addConfigForm.alarmType
      var index = this.typeOptions.findIndex(item => {
        return item.id == this.addConfigForm.alarmType;
      });
      this.addConfigForm.trigger = this.typeOptions[index].triggerConditionName;
      this.addConfigForm.triggerCondition = this.typeOptions[
        index
      ].triggerCondition;
    },
    // 下拉告警类型获取数据
    getWarnType(flag) {
      if (flag) {
        this.getType();
      }
    },
    // 告警类型改变
    warnTypeChange(val) {
      this.getequipVariate();
    },
    // 获取设备下的编码
    getCode(flag) {
      this.codeOptions = [];
      if (flag && this.searchId) {
        this.$http
          .get("equipment/variable/findAllByEquipment", {
            params: {
              equipmentId: this.searchId
            }
          })
          .then(res => {
            if (res.data.code == 0) {
              this.codeOptions = res.data.data;
            }
          });
      }
    },
    // 表单中变量改变
    codeChange() {
      this.getequipVariate();
    },
    // 编辑新增告警弹窗关闭前清空
    visibleClose() {
      this.ifAdd = false;
      this.$refs.addConfigRef.clearValidate();
      this.addConfigForm = {
        gatewayId: null,
        equipmentId: null,
        code: null,
        type: null,
        trigger: null
      };
    },
    // 变量开关
    switch_change(index, row) {
      let param_obj = {
        code: row.code,
        equipmentId: row.equipmentId,
        alarmType: row.alarmType,
        triggerCondition: row.triggerCondition,
        status: row.status % 2, //值已经改变，不需要++
        siteId: this.$store.state.site.siteId,
        id: row.id
      };
      if (row.threshold) {
        param_obj.threshold = row.threshold;
      }
      this.$http
        .post("equipment/variableMonitor/modify", param_obj)
        .then(res => {
          if (res.data.code == 0) {
            this.$notify({
              message: "编辑成功",
              type: "success"
            });
            this.getequipVariate();
          }
        });
    },
    // 获取当前站点下设备列表
    getEquipment() {
      // 当前站点不存在，不发请求
      if (!this.$store.state.site.siteId) {
        return;
      }
      this.$http
        .get("equipment/getEqByRoom", {
          params: {
            roomId: this.$store.state.site.siteId,
            page: 0,
            size: GLOBAL.max_page_size
          }
        })
        .then(res => {
          this.equipmentOptions = res.data.data;
        });
    },
    // 批量删除配置
    delMulConfig() {
      this.delMulConfigVisible = true;
      this.getAllConfig();
    },
    // 批量删除弹窗表单内容格式化
    clearMoniorInfo() {
      this.delMulConfigForm.id = [];
    },
    // 提交批量删除
    delMulSubmit() {
      this.$refs.delMulConfigRef.validate(valid => {
        if (!valid) {
          return;
        }
        if (this.delMulConfigForm.id.length === this.total) {
          this.equipmentName = "";
          this.searchId = "";
          this.index = null;
        }
        let id = this.delMulConfigForm.id.join(",");
        this.$http
          .get("equipment/variableMonitor/remove", {
            params: {
              id: id
            }
          })
          .then(res => {
            if (res.data.code === 0) {
              this.total = 0; //清空总条数
              this.$notify({
                message: "删除成功",
                type: "success"
              });
              this.configData = [];
              this.delMulConfigVisible = false;
              this.currentPage = 1;
              this.getAllVariateMenu();
            }
          });
      });
    },
    // 获取所有的配置
    getAllConfig() {
      var obj = {
        equipmentId: this.searchId,
        page: 0,
        size: GLOBAL.max_page_size
      };
      // 是否根据帅选条件发送请求
      if (this.type) {
        obj.alarmType = this.type;
      }
      if (this.code) {
        obj.code = this.code;
      }
      this.$http
        .get("equipment/variableMonitor/findByEqId", {
          params: obj
        })
        .then(res => {
          this.delMulConfigOptions = res.data.data.variableMonitorVOS;
          // 确认数组数量不为0时赋值
          // if (this.monitorStatus.length > 0) {
          //   this.monitorStatus = this.configData[0].status ? true : false;
          // }
        });
    },
    // 获取所有网关
    getAllGateway(flag) {
      if (!flag) {
        return;
      }
      if (!this.$store.state.site.siteId) {
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
    // 网关修改
    gatewayChange() {
      this.addConfigForm.equipmentId = null;
      this.addConfigForm.code = null;
      this.$forceUpdate();
    },
    // 设备修改
    equipChange() {
      this.addConfigForm.code = null;
      this.$forceUpdate();
    },
    // 获取网关下的设备
    getEquipByGateway(flag) {
      if (flag) {
        this.equipmentOptions = [];
        if (!this.addConfigForm.gatewayId) {
          this.$message("请先选中网关!");
          return;
        }
        this.$http
          .get("equipment/equipmentList", {
            params: {
              page: 0,
              size: GLOBAL.max_page_size,
              gatewayId: this.addConfigForm.gatewayId
            }
          })
          .then(res => {
            if (res.data.code === 0) {
              this.equipmentOptions = res.data.data.equipments;
            }
          });
      }
    }
  },
  created() {
    // 获取菜单列表
    this.getAllVariateMenu();
    // 获取站点下的所有设备
    this.getEquipment();
    // 获取站点下所有网关
    this.getAllGateway(true);
  }
};
</script>

<style lang='less' scoped>
@import "../../assets/css/index.less";
.sec {
  height: calc(100% - 62px);
  display: flex;
  width: 100%;
}

.sec-left {
  box-sizing: border-box;
  width: 240px;
  height: 100%;
  // min-height: 300px;
  background-color: @table-bgc;
  padding: 5px 10px;
  overflow: auto;
}

.sec-right {
  flex: 1;
  width: 0;
  margin-left: 10px;
  height: 100%;
  // 解决element/flex中table的bug
  overflow: hidden;
}

.warn-table {
  margin-top: 10px;
  padding: 8px;
  background-color: @table-bgc;
  height: calc(100% - 87px);
  box-sizing: border-box;
  overflow: auto;
}

.inline-input {
  width: 300px;
  display: inline-block;
}

/* 背景颜色显示开关状态 */
.warn-btn {
  display: inline-block;
  padding: 4px 20px;
  color: #fff;
  text-align: center;
  border-radius: 5px;
}

.green {
  background-color: green;
}

.red {
  background-color: red;
}

.demo-ruleForm /deep/ .el-select,
.demo-ruleForm /deep/ .el-input {
  width: 250px;
}
</style>
