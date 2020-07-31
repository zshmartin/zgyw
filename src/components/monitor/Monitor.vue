<template>
  <div class="monitor">
    <MyBreadcrumb level1="站点监控" level2="设备参数监控" />
    <div id="section">
      <!-- 左边栏 -->
      <div class="aside scroll">
        <el-tree
          :data="tree"
          :props="defaultProps"
          :current-node-key="currentSelectId"
          ref="groupTree"
          node-key="id"
          :default-expand-all="defautTrue"
          :highlight-current="defautTrue"
          @node-click="handleNodeClick"
          :expand-on-click-node="false"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>
              <i :class="data.icon"></i>
              <span>{{ node.label }}</span>
            </span>
          </span>
        </el-tree>
      </div>
      <!-- 右边内容 -->
      <div class="main scroll">
        <el-tabs type="border-card" @tab-click="tabChange" v-show="treeNodeId != 3">
          <el-tab-pane label="实时数据">
            <div class="none-block">
              <div>
                <span style="color: #ccc;">请选择设备</span>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
        <el-tabs type="border-card" v-model="selectTab" @tab-click="tabChange" v-show="treeNodeId == 3">
          <el-tab-pane style="margin-left: 10px; font-size: 14px;" name="data">
            <span slot="label">
              <i class="el-icon-date">&nbsp;实时数据</i>
            </span>
            <!-- 实时数据 -->
            <el-tabs v-model="activeName" @tab-click="handleClick" class="select">
              <el-tab-pane label="模拟量" name="first">
                <div class="simulate">
                  <el-table :data="simulate_arr" border style="width: 100%">
                    <el-table-column prop="simplifiedCode" label="变量编码"></el-table-column>
                    <el-table-column prop="name" label="变量名称" width="180"></el-table-column>
                    <el-table-column prop="value" label="实时值">
                      <template slot-scope="scope">{{scope.row.value ? scope.row.value : null}}</template>
                    </el-table-column>
                    <el-table-column prop="unit" label="单位"></el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="scope">
                        <el-button @click="editValue(scope.row)" type="text" size="small">编辑</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-tab-pane>
              <el-tab-pane label="状态量" name="second">
                <div class="simulate">
                  <el-table :data="simulate_arr" border style="width: 100%">
                    <el-table-column prop="simplifiedCode" label="编码" width="180"></el-table-column>
                    <el-table-column prop="name" label="编码" width="180"></el-table-column>
                    <el-table-column prop="value" label="值">
                      <template slot-scope="scope">{{scope.row.value ? scope.row.value : null}}</template>
                    </el-table-column>
                    <el-table-column prop="unit" label="单位"></el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="scope">
                        <el-button @click="editValue(scope.row)" type="text" size="small">编辑</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-tab-pane>
          <el-tab-pane name="warn">
            <span slot="label">
              <i class="el-icon-bell">&nbsp;事件记录</i>
            </span>
            <div class="event">
              <el-table
                :data="tableData"
                style="width: 100%"
                border
                v-loading="eventLoading"
                :default-sort="{prop: 'date', order: 'descending'}"
              >
                <el-table-column prop="time" label="时间" width="210">
                  <template slot-scope="scope">{{scope.row.time}}</template>
                </el-table-column>
                <el-table-column prop="name" label="事件" width="180"></el-table-column>
                <el-table-column prop="alarmTypeName" label="告警类型"></el-table-column>
                <el-table-column prop="level" label="告警级别">
                  <template slot-scope="scope">
                    <button class="one-type warn-btn" v-if="scope.row.level == 1">一级</button>
                    <button class="two-type warn-btn" v-else-if="scope.row.level == 2">二级</button>
                    <button class="three-type warn-btn" v-else-if="scope.row.level == 3">三级</button>
                    <button class="four-type warn-btn" v-else-if="scope.row.level == 4">四级</button>
                    <button class="five-type warn-btn" v-else-if="scope.row.level == 5">五级</button>
                    <button class="six-type warn-btn" v-else-if="scope.row.level == 6">六级</button>
                  </template>
                </el-table-column>
                <el-table-column prop="handleStatus" label="处理状态">
                  <template slot-scope="scope">
                    <span v-if="scope.row.handleStatus == 0">未处理</span>
                    <span v-if="scope.row.handleStatus == 1">处理中</span>
                    <span v-if="scope.row.handleStatus == 2">已处理</span>
                  </template>
                </el-table-column>
                <el-table-column prop="handleInfo" label="处理信息" width="200">
                  <template slot-scope="scope">
                    <span>{{scope.row.handleInfo}}</span>
                    <div style="display: inline-block">
                      <span v-if="scope.row.handleUser">&nbsp;-&nbsp;</span>
                      <span style="color: skyblue">{{scope.row.handleUser}}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="confirmStatus" label="确认状态">
                  <template slot-scope="scope">
                    <span v-if="scope.row.confirmStatus == 0">未确认</span>
                    <span v-if="scope.row.confirmStatus == 1">已确认</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane name="trend">
            <span slot="label">
              <i class="el-icon-s-data">&nbsp;历史趋势</i>
            </span>
            <div class="data">
              <div class="time">
                <!-- 单选框 -->
                <el-radio-group v-model="timeSelect" class="time-select" size="large" style=";">
                  <el-radio-button label="day">日</el-radio-button>
                  <el-radio-button label="month">月</el-radio-button>
                  <el-radio-button label="year">年</el-radio-button>
                </el-radio-group>

                <!-- 日期选择器  -->
                <div class="date" v-show="timeSelect=='day'">
                  <el-date-picker
                    v-model="hourSelect"
                    align="right"
                    type="date"
                    placeholder="选择日期"
                    :picker-options="pickerOptions"
                    :clearable="Boolean(false)"
                    :disabled="trendLoading == true"
                  ></el-date-picker>
                </div>
                <!-- 月 -->
                <!-- <div class="date" v-show="timeSelect=='day'"> -->
                <div class="date" v-show="timeSelect=='month'">
                  <el-date-picker
                    v-model="daySelect"
                    type="month"
                    placeholder="选择月"
                    format="yyyy-MM"
                    :clearable="Boolean(false)"
                    :disabled="trendLoading == true"
                  ></el-date-picker>
                </div>
                <!-- 年 -->
                <!-- <div class="date" v-show="timeSelect=='month'"> -->
                <div class="date" v-show="timeSelect=='year'">
                  <el-date-picker
                    v-model="monthSelect"
                    align="right"
                    type="year"
                    placeholder="选择年"
                    :clearable="Boolean(false)"
                    :disabled="trendLoading == true"
                  ></el-date-picker>
                </div>
              </div>
              <div class="tab-his">
                <el-tabs v-model="activeLine" @tab-click="lineChange" style="display: block;">
                  <el-tab-pane
                    v-for="item in propertyOptions"
                    :key="item.id"
                    :label="item.properties"
                    :name="item.id.toString()"
                  ></el-tab-pane>
                </el-tabs>
              </div>

              <!-- {{line_total.code}} -->
              <div class="chart-line"></div>
              <!-- <div class="line-area"> -->
                <ChartLine
                  class="line-area"
                  :line_total="line_total"
                  v-if="line_total.code && line_total.code.length > 0"
                ></ChartLine>
              <!-- </div> -->

              <div
                v-else
                v-loading="trendLoading"
                element-loading-background="rgba(67, 92, 112, 0.5)"
                element-loading-text="加载中..."
                class="loading"
                style
              >
                <div v-if="!trendLoading">暂无数据</div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label" name="report">
              <i class="el-icon-notebook-2">&nbsp;数据报表</i>
            </span>
            <div class="data-table">
              <!-- 时间选项 -->
              <div class="time">
                <!-- 单选框 -->
                <el-radio-group class="time-select" v-model="timeSelect1" size="large">
                  <el-radio-button label="day">日</el-radio-button>
                  <el-radio-button label="month">月</el-radio-button>
                  <el-radio-button label="year">年</el-radio-button>
                </el-radio-group>

                <!-- 日期选择器  -->
                <div class="date" v-show="timeSelect1=='day'">
                  <el-date-picker
                    v-model="hourSelect1"
                    align="right"
                    type="date"
                    placeholder="选择日期"
                    :picker-options="pickerOptions"
                    :clearable="Boolean(false)"
                    :disabled="loading == true"
                  ></el-date-picker>
                </div>
                <!-- 月 -->
                <!-- <div class="date" v-show="timeSelect=='day'"> -->
                <div class="date" v-show="timeSelect1=='month'">
                  <el-date-picker
                    v-model="daySelect1"
                    type="month"
                    placeholder="选择月"
                    format="yyyy-MM"
                    :clearable="Boolean(false)"
                    :disabled="loading == true"
                  ></el-date-picker>
                </div>
                <!-- 年 -->
                <!-- <div class="date" v-show="timeSelect=='month'"> -->
                <div class="date" v-show="timeSelect1=='year'">
                  <el-date-picker
                    v-model="monthSelect1"
                    align="right"
                    type="year"
                    placeholder="选择年"
                    :clearable="Boolean(false)"
                    :disabled="loading == true"
                  ></el-date-picker>
                </div>
                <div class="export" style="float: right;">
                  <el-button
                    class="confirm"
                    icon="el-icon-upload2"
                    v-loading="exportLoading"
                    element-loading-background="rgba(67, 92, 112, 0.5)"
                    :disabled="filt_data.length === 0 || exportLoading"
                    @click="exportReport"
                  >导出表格</el-button>
                </div>
              </div>
              <!-- 单选项 -->
              <div class="report-radio">
                <el-radio-group v-model="propertySelect" @change="getPropertyChange">
                  <el-radio
                    v-for="item in propertyOptions"
                    :key="item.id"
                    :label="item.id"
                  >{{item.properties}}</el-radio>
                </el-radio-group>
              </div>
              <div class="table-area">
                <table
                  class="table"
                  v-if="filt_data.length > 0"
                  v-loading="reportLoading"
                  element-loading-background="rgba(67, 92, 112, 0.5)"
                  element-loading-text="加载中..."
                >
                  <tr>
                    <th style="width: 100px;">时间</th>
                    <th v-for="item in filt_data" :key="item.id">{{item.name}}</th>
                  </tr>
                  <tr
                    v-for="(item, index) in arr"
                    :key="item.id"
                    :class="{'sin': (index % 2 == 0), 'double': (index % 2 != 0)}"
                  >
                    <td>{{item}} {{timeSelect1 == 'day' ? '时' : (timeSelect1 == 'month' ? '日' : '月')}}</td>
                    <!-- 值不存在时用-代替 -->
                    <td v-for="item1 in filt_data" :key="item1.id">
                      <!-- {{(item1.data[item.index])+1?item1.data[item.index]:'-'}} -->
                      {{item1.data[index] || item1.data[index] === 0 ? item1.data[index] : '-'}}
                      <!-- {{(item1.data[index])}} -->
                    </td>
                  </tr>
                </table>
                <div
                  v-else
                  style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;"
                  v-loading="reportLoading"
                  element-loading-background="rgba(67, 92, 112, 0.5)"
                  element-loading-text="加载中..."
                >
                  <div style="color: #ccc;">暂无数据</div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!-- 编辑模拟量当前值弹窗 -->
    <el-dialog
      :visible.sync="editValueVisible"
      title="编辑当前值"
      :close-on-click-modal="false"
      width="500px"
    >
      <el-form
        :model="editValueForm"
        :rules="editValueRules"
        ref="editValueRef"
        label-width="80px"
        class="variate-form"
        size="small"
      >
        <el-form-item
          label="当前值"
          prop="value"
          class="inline-input-width"
          v-if="activeName == 'first'"
        >
          <el-input v-model.trim="editValueForm.value"></el-input>
        </el-form-item>
        <el-select v-model="editValueForm.value" placeholder="请选择" no-data-text="无数据" v-else>
          <el-option v-for="item in options" :key="item.val" :label="item.label" :value="item.val"></el-option>
        </el-select>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="editValueVisible = false">取 消</el-button>
        <el-button class="confirm" @click="submitValue">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
  
<script>
const filt_select = ["电流", "电度", "电压", "频率"];
const data_select = ["电流", "电度", "电压", "频率", "温度"];
import MyBreadcrumb from "../subcomponents/Mybreadcrumb";
import ChartLine from "../subcomponents/monitor_chartLine";
import GLOBAL from "../../utils/global_variable"; //引入全局变量
import {
  formatMonitorPoint,
  formatMonitorData,
  formatEquipMonitorrData,
  getTimeArr,
} from "../../utils";
export default {
  components: {
    MyBreadcrumb,
    ChartLine,
  },
  data() {
    return {
      tree: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      currentSelectId: 0,
      defautTrue: true,
      activeName: "first",
      options: [
        {
          label: "1",
          val: 1
        },
        {
          label: "0",
          val: 0
        }
      ],
      // 实时数据
      check_data_select: [], //实时数据选中项
      datas: data_select, //实时数据筛选项
      isIndeterminate: false,
      checkAll: false,
      data_data: [], //实时数据表格
      selectEquipment: null,
      editValueForm: {
        value: ""
      },
      codeString: "", //实时更新当前值的编码集
      idString: "", //实时更新当前的编号集
      editValueRules: {},
      editValueVisible: false,
      //模拟量
      simulate_arr: [],
      status_arr: ["ap145"], //状态量
      // 事件记录表格数据
      tableData: [],
      totalWarn: 0,
      line_total: [],
      eventLoading: false,
      // 历史趋势----------------------------------
      timeSelect: "day", //年月日筛选方式
      hourSelect: new Date(),
      daySelect: new Date(),
      monthSelect: new Date(),
      trendLoading: false, //历史趋势曲线图加载中
      // 时间限制
      loading: false,
      pickerOptions: {
        disabledDate(time) {
          return (
            time.getTime() > Date.now() || time.getTime() < new Date(2019, 9, 1)
          );
        }
      },
      activeLine: "1", //当前显示的曲线
      propertyOptions: [],
      // 数据报表----------------------------------
      exportLoading: false, //导出按钮状态
      reportLoading: false, //加载中
      timeSelect1: "day",
      hourSelect1: new Date(),
      daySelect1: new Date(),
      monthSelect1: new Date(),
      // arr: getTimeArr("day", "monitor"),
      arr: [],
      checkAll2: false,
      check_filt_select: [], //数据爆表的选中项
      filts: filt_select, //数据报表的筛选项
      isIndeterminate2: false,
      filt_data: [],
      propertySelect: "",
      treeNodeId: 1, //当前显示的树节点层级
      nowTime: new Date().toJSON(), //当前数据显示的时间
      codeOptions: [],
      timeInterval: null,
      selectTab: '',
    };
  },
  computed: {
    get_current_site() {
      return this.$store.state.site.siteId;
    }
  },
  watch: {
    get_current_site(newId, oldId) {
      this.treeNodeId = null;
      this.getGroup(newId);
    },
    timeSelect(newVal, oldVal) {
      this.timeSelect = newVal;
      // 保证时间数据最新
      if (this.timeSelect == "min") {
        this.hourSelect = new Date();
      } else if (this.timeSelect == "day") {
        this.daySelect = new Date();
      } else {
        this.monthSelect = new Date();
      }

      this.getLine();
    },
    timeSelect1(newVal, oldVal) {
      this.timeSelect1 = newVal;
      // 保证时间数据最新
      if (this.timeSelect1 == "min") {
        this.hourSelect1 = new Date();
      } else if (this.timeSelect1 == "day") {
        this.daySelect1 = new Date();
      } else {
        this.monthSelect1 = new Date();
      }
      this.arr = getTimeArr(newVal, "monitor");
      this.getReport();
    },
    // 监听三种数据变化，请求数据
    hourSelect() {
      this.getLine();
    },
    daySelect() {
      this.getLine();
    },
    monthSelect() {
      this.getLine();
    },
    hourSelect1() {
      this.getReport();
    },
    daySelec1() {
      this.getReport();
    },
    monthSelect1() {
      this.getReport();
    },
    selectTab(newValue) {
      if(newValue === 'trend') {
        // 重新给曲线赋值以解决尺寸的bug
        let arr = JSON.parse(JSON.stringify(this.line_total))
        this.line_total = []
        this.$nextTick( () => {
          this.line_total = arr
        })
      }
    }
  },
  beforeDestroy() {
    // 清除定时器
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  },
  methods: {
    // 获取属性数据
    // 节点点击
    handleNodeClick(data, node, event) {
      this.treeNodeId = node.level;
      if (this.treeNodeId == 3) {
        this.arr = [];
        this.selectEquipment = node.data.equipmentId;
        this.getSimulateValue(this.selectEquipment);
        this.arr = getTimeArr(this.timeSelect1, "monitor");
        if (this.timeInterval) {
          clearInterval(this.timeInterval);
        }
        this.selectTab = 'data'
        // 获取事件告警
        this.getWarnEvent(this.selectEquipment);
        // 曲线获取
        this.getLine();
        // 报表获取
        this.getReport();
      }
    },
    // 获取事件告警
    getWarnEvent(id) {
      this.eventLoading = true;
      this.$http
        .get("equipment/alarmEvent/findAll", {
          params: {
            equipmentId: id,
            confirmStatus: 0,
            page: 0,
            pageSize: 15,
            roomId: this.$store.state.site.siteId,
            begin: "2019-01-01 0:0:0:135",
            end:
              new Date().getFullYear() +
              "-" +
              (new Date().getMonth() + 1) +
              "-" +
              new Date().getDate() +
              " " +
              // "0:0:0:135"
              new Date().getHours() +
              ":" +
              new Date().getMinutes() +
              ":" +
              new Date().getSeconds() +
              ":000"
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.tableData = res.data.data.alarmEventVOS;
            this.totalWarn = res.data.data.total;
            this.eventLoading = false;
          }
        })
        .catch(res => {
          this.eventLoading = false;
        });
    },
    // 获取表单
    getSimulateValue(id) {
      this.$http
        .get("equipment/variable/findAllByEquipment", {
          params: {
            equipmentId: id,
            variabelType: this.activeName == "first" ? 0 : 1
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.simulate_arr = res.data.data;
          }
          this.codeString = "";
          this.idString = "";
          this.simulate_arr.forEach(item => {
            this.codeString = this.codeString + item.code + ",";
            this.idString = this.idString + item.equipmentId + ",";
          });
          if (this.timeInterval) {
            clearInterval(this.timeInterval);
          }
          // 数据不为空才发请求获取当前值
          if (this.codeString != "") {
            this.getValue();
            this.timeInterval = setInterval(() => {
              this.getValue();
            }, 10000);
          }
        });
    },
    // 获取当前值
    getValue() {
      this.$http
        .get("equipment/variable/liveData", {
          params: {
            equipmentId: this.selectEquipment,
            variableType: this.activeName == "first" ? 0 : 1
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            for (var i = 0; i < this.simulate_arr.length; i++) {
              for (var j = 0; j < res.data.data.length; j++) {
                for (var k in res.data.data[j]) {
                  if (this.simulate_arr[i].code == k) {
                    this.simulate_arr[i].value = res.data.data[j][k];
                  }
                }
              }
            }
          }
        });
      return;
      // this.$http
      //   .get("equipment/variable/getValue", {
      //     params: {
      //       variableList: this.codeString.slice(0, this.codeString.length - 1),
      //       equipmentIds: this.idString.slice(0, this.idString.length - 1)
      //       // type: this.activeName == "first" ? 0 : 1
      //     }
      //   })
      //   .then(res => {
      //     if (res.data.code == 0) {
      //       for (var i = 0; i < this.simulate_arr.length; i++) {
      //         for (var j = 0; j < res.data.data.length; j++) {
      //           for (var k in res.data.data[j]) {
      //             if (this.simulate_arr[i].code == k) {
      //               this.simulate_arr[i].value = res.data.data[j][k];
      //             }
      //           }
      //         }
      //       }
      //     }
      //   });
    },
    handleClick(tab, event) {
      this.getSimulateValue(this.selectEquipment);
      if (this.timeInterval) {
        clearInterval(this.timeInterval);
      }
    },
    formatter(row, column) {
      return row.address;
    },
    // 标签页改变
    tabChange(tab, event) {
    },
    // 实时数据筛选项改变
    handle_data_select_change(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.datas.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.datas.length;
    },
    // 实时数据全选全不选
    handleCheckAllChange(val) {
      this.check_data_select = val ? data_select : [];
      this.isIndeterminate2 = false;
    },
    // 数据报表全选全不选
    handleCheckAllChange2(val) {
      this.check_filt_select = val ? filt_select : [];
      this.isIndeterminate2 = false;
    },
    handle_filt_select_change(value) {
      let checkedCount = value.length;
      this.checkAll2 = checkedCount === this.filts.length;
      this.isIndeterminate2 =
        checkedCount > 0 && checkedCount < this.filts.length;
    },
    // 历史趋势时间改变
    lineDateChange() {},
    // 历史趋势曲线筛选改变
    lineChange() {
      this.line_total = {};
      this.getLine();
    },
    // 表格对齐方法
    cellStyle(row, colum, rowIndex, columIndex) {
      return "text-align: center";
    },
    // 表头对齐方式
    rowClass() {
      return "text-align: center; margin-right: 1.5px;";
    },
    // 查看站点下的分类
    getGroup(id) {
      this.$http
        .get("equipment/classify/findAllByRoom", {
          params: {
            roomId: id
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            var groupArr = res.data.data;
            var str = "";
            groupArr.forEach(item => {
              str = str + item.id + ",";
            });
            if (str.length == 0) {
              this.tree = [
                {
                  name: this.$store.state.site.siteName,
                  id: 0
                }
              ];
              return;
            }
            this.$http
              .get("equipment/classifyEquipment/findAllByClassify", {
                params: {
                  classifyIds: str.slice(0, str.length - 1)
                }
              })
              .then(res => {
                if (res.data.code == 0) {
                  var res1 = res.data.data;
                  for (var i = 0; i < groupArr.length; i++) {
                    if (res1[i].ClassifyEquipmentVO.length) {
                      for (
                        var j = 0;
                        j < res1[i].ClassifyEquipmentVO.length;
                        j++
                      ) {
                        res1[i].ClassifyEquipmentVO[j].id = -res1[i]
                          .ClassifyEquipmentVO[j].id;
                      }
                      groupArr[i].children = res1[i].ClassifyEquipmentVO;
                    }
                    groupArr[i].icon = "el-icon-folder-opened";
                  }
                  var tree1 = [
                    {
                      name: this.$store.state.site.siteName,
                      id: 0
                    }
                  ];
                  if (groupArr.length > 0) {
                    tree1[0].children = [];
                    tree1[0].icon = "el-icon-place";
                    tree1[0].children = groupArr;
                  }
                  this.tree = tree1;
                  this.$nextTick(() => {
                    this.$refs.groupTree.setCurrentKey(this.currentSelectId);
                  });
                  this.$forceUpdate(); //强制更新页面
                }
              })
              .catch(res => {});
          }
        })
        .catch(res => {});
    },
    // 编辑变量
    editValue(row) {
      this.editValueVisible = true;
      this.$http
        .get("/equipment/variable/detail", {
          params: {
            code: row.code
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.editValueForm = res.data.data.variable;

            if (this.activeName != "first") {
              this.editValueForm.value = row.value ? 1 : 0;
            } else {
              this.editValueForm.value = row.value;
            }
          }
        })
        .catch(res => {});
    },
    // 当前值修改提交
    submitValue() {
      var form = this.editValueForm;
      // return
      if (this.activeName == "first") {
        this.$http
          .post("/equipment/variable/update", {
            id: form.id,
            name: form.name,
            code: form.code,
            equipmentId: form.equipmentId,
            daId: form.daId,
            relative: form.relative,
            companyId: form.companyId,
            type: form.type,
            corn: form.corn,
            init: form.init,
            base: form.base,
            coefficient: form.coefficient,
            unit: form.unit,
            variableType: form.variableType,
            area: form.area,
            dataName: form.dataName,
            value: form.value
          })
          .then(res => {
            if (res.data.code == 0) {
              this.$notify({
                title: "成功",
                message: "修改成功",
                type: "success"
              });
            }
            this.editValueVisible = false;
          })
          .catch(res => {});
      } else {
        this.$http
          .post("/equipment/variable/update", {
            id: form.id,
            name: form.name,
            code: form.code,
            equipmentId: form.equipmentId,
            daId: form.daId,
            relative: form.relative,
            companyId: form.companyId,
            type: form.type,
            corn: form.corn,
            offset: form.offset,
            base: form.base,
            coefficient: form.coefficient,
            variableType: form.variableType,
            area: form.area,
            dataName: form.dataName,
            value: form.value
          })
          .then(res => {
            if (res.data.code == 0) {
              this.$notify({
                title: "成功",
                message: "修改成功",
                type: "success"
              });
            }
            this.editValueVisible = false;
          })
          .catch(res => {});
      }
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
            this.propertySelect = this.propertyOptions[0].id;
          }
        });
    },
    // 获取曲线
    getLine() {
      this.line_total = {};
      this.trendLoading = true;
      let time;
      let obj;
      let time_star_string = "";
      let time_end_string = "";
      let ifCancel = false;
      let date = new Date("2019", "08");
      // return
      // 查看日
      // if (this.timeSelect == "min") {
      if (this.timeSelect == "day") {
        time = this.hourSelect;
        if (this.hourSelect < date) {
          ifCancel = true;
        }

        let year = this.hourSelect.getFullYear();
        let month =
          this.hourSelect.getMonth() + 1 < 10
            ? "0" + (this.hourSelect.getMonth() + 1)
            : this.hourSelect.getMonth() + 1;
        let day =
          this.hourSelect.getDate() < 10
            ? "0" + this.hourSelect.getDate()
            : this.hourSelect.getDate();
        // time = this.timeSelect + '_' +
        obj = {
          equipmentId: this.selectEquipment,
          tb: this.timeSelect + "_" + year + month + day,
          type: this.timeSelect + "_curve" //后端需求
        };
        // 查看月
      } else if (this.timeSelect == "month") {
        time = this.daySelect;
        if (this.daySelect < date) {
          ifCancel = true;
        }
        let year = this.daySelect.getFullYear();
        let month =
          this.daySelect.getMonth() + 1 < 10
            ? "0" + (this.daySelect.getMonth() + 1)
            : this.daySelect.getMonth() + 1;
        // let month = this.daySelect.getMonth() + 1
        obj = {
          equipmentId: this.selectEquipment,
          tb: this.timeSelect + "_" + year + month,
          type: this.timeSelect
        };
        // 查看年
      } else {
        time = this.monthSelect;
        if (this.monthSelect < date) {
          ifCancel = true;
        }
        let year = this.monthSelect.getFullYear();
        obj = {
          equipmentId: this.selectEquipment,
          tb: this.timeSelect + "_" + year,
          type: this.timeSelect
        };
      }
      // return
      // getcurrentTimeArr(time,this.timeSelect)

      // 零时拦截
      if (ifCancel) {
        this.line_total = [];
        this.total = 0;
        this.trendLoading = false;
        return;
      }
      this.trendLoading = true;
      // 设置定时器
      let timeout = setTimeout(() => {
        this.trendLoading = false;
      }, 15000);
      obj.properties = parseInt(this.activeLine);
      // return
      this.$http
        .get("equipment/variable/getByProperties", {
          params: obj
        })
        .then(res => {
          this.trendLoading = false;
          if (res.data.code == 0) {
            this.line_total = formatMonitorPoint(res.data.data);
            console.log(this.line_total)
            this.line_total = formatMonitorData(
              time,
              this.timeSelect,
              this.line_total
            );
          }
        })
        .catch(res => {
          this.trendLoading = false;
          clearTimeout(timeout);
        });
    },
    // 获取报表
    getReport() {
      let time;
      let obj;
      let time_star_string = "";
      let time_end_string = "";
      let ifCancel = false;
      let date = new Date("2019", "08");
      // return
      // 查看日
      // if (this.timeSelect == "min") {
      if (this.timeSelect1 == "day") {
        time = this.hourSelect;
        if (this.hourSelect1 < date) {
          ifCancel = true;
        }

        let year = this.hourSelect1.getFullYear();
        let month =
          this.hourSelect1.getMonth() + 1 < 10
            ? "0" + (this.hourSelect1.getMonth() + 1)
            : this.hourSelect1.getMonth() + 1;
        let day =
          this.hourSelect1.getDate() < 10
            ? "0" + this.hourSelect1.getDate()
            : this.hourSelect1.getDate();
        // time = this.timeSelect + '_' +
        obj = {
          equipmentId: this.selectEquipment,
          tb: this.timeSelect1 + "_" + year + month + day,
          type: this.timeSelect1 + "_form" //后端需求
        };
        // 查看月
      } else if (this.timeSelect1 == "month") {
        time = this.daySelect1;
        if (this.daySelect1 < date) {
          ifCancel = true;
        }
        let year = this.daySelect1.getFullYear();
        let month =
          this.daySelect1.getMonth() + 1 < 10
            ? "0" + (this.daySelect1.getMonth() + 1)
            : this.daySelect1.getMonth() + 1;
        // let month = this.daySelect.getMonth() + 1
        obj = {
          equipmentId: this.selectEquipment,
          tb: this.timeSelect1 + "_" + year + month,
          type: this.timeSelect1
        };
        // 查看年
      } else {
        time = this.monthSelect1;
        if (this.monthSelect1 < date) {
          ifCancel = true;
        }
        let year = this.monthSelect1.getFullYear();
        obj = {
          equipmentId: this.selectEquipment,
          tb: this.timeSelect1 + "_" + year,
          type: this.timeSelect1
        };
      }
      // return
      // getcurrentTimeArr(time,this.timeSelect)

      // 零时拦截
      if (ifCancel) {
        this.line_total = [];
        this.total = 0;
        this.loading = false;
        this.exportLoading = false;
        return;
      }
      this.reportLoading = true;
      // 设置定时器
      let timeout = setTimeout(() => {
        this.loading = false;
      }, 15000);
      obj.properties = this.propertySelect;
      // return
      this.$http
        .get("equipment/variable/getByProperties", {
          params: obj
        })
        .then(res => {
          this.reportLoading = false;
          if (res.data.code == 0) {
            let a = formatMonitorPoint(res.data.data);
            let b = formatEquipMonitorrData(time, this.timeSelect1, a);
            this.filt_data = b.data;
          }
        })
        .catch(res => {
          this.reportLoading = false;
          clearTimeout(timeout);
        });
    },
    getPropertyChange() {
      this.getReport();
    },
    // 导出报表
    exportReport() {
      this.exportLoading = true;
      this.$notify({
        message: "开始导出"
      });
      let tb;
      if (this.timeSelect1 === "day") {
        let year = this.hourSelect1.getFullYear();
        let month =
          this.hourSelect1.getMonth() + 1 < 10
            ? "0" + (this.hourSelect1.getMonth() + 1)
            : this.hourSelect1.getMonth() + 1;
        let day =
          this.hourSelect1.getDate() < 10
            ? "0" + this.hourSelect1.getDate()
            : this.hourSelect1.getDate();
        tb = "day_" + year + month + day;
      } else if (this.timeSelect1 === "month") {
        let year = this.daySelect1.getFullYear();
        let month =
          this.daySelect1.getMonth() + 1 < 10
            ? "0" + (this.daySelect1.getMonth() + 1)
            : this.daySelect1.getMonth() + 1;

        tb = "month_" + year + month;
      } else {
        let year = this.daySelect1.getFullYear();
        tb = "year_" + year;
      }
      let obj = {
        equipmentId: this.selectEquipment,
        properties: this.propertySelect,
        tb: tb,
        type: this.timeSelect1
      };
      this.$http({
        methods: "GET",
        url: "equipment/dataReport/exportExcel",
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
              message: "报表已导出",
              type: "success"
            });
            this.exportLoading = false;
          }, 1000);
        })
        .catch(res => {
          this.exportLoading = false;
        });
    }
    // // 获取所有的公司
    // getCompanys() {
    //   this.$http
    //     .get("sysmanage/company/findAll", {
    //       params: {
    //         name: "",
    //         page: 0,
    //         size: GLOBAL.max_page_size,
    //       }
    //     })
    //     .then(res => {});
    // }
  },
  created() {
    if (this.$store.state.site.siteId) {
      this.getProperty();
      this.getGroup(this.$store.state.site.siteId);
    }
  },
  beforeDestroy() {
    // 清除定时器
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/css/index.less";
.monitor {
  height: 100%;
  #section {
    height: calc(100% - 62px);
    .aside {
      height: 100%;
      max-width: 260px;
      min-width: 260px;
      box-sizing: border-box;
      float: left;
      background-color: rgba(67, 92, 112);
      padding: 10px;
      overflow: auto;
      .el-tree {
        background: none;
        color: #ccc;
      }
    }
    .main {
      margin-left: 10px;
      /* background-color: pink; */
      height: 100%;
      float: left;
      width: calc(100% - 270px);
      overflow: auto;
      background-color: rgba(67, 92, 112);
      & /deep/ .el-tab-pane {
        height: 100%;
      }
      /* 四个标签样式 */
      & /deep/ .el-tabs--border-card {
        background: none;
        border: none;
        height: 100%;
        // @dis-flex();
        // @flex-1();
        // @flex-c();
        .el-tabs__content {
          height: calc(100% - 54px);
          // height: 0;
          // @flex-1();
          // overflow: auto;
          padding-bottom: 0;
        }
      }
      & /deep/ .el-tabs--border-card > .el-tabs__header {
        background: none;
        border: none;
      }
      &
        /deep/
        .el-tabs--border-card
        > .el-tabs__header
        .el-tabs__item.is-active {
        border-right-color: rgba(67, 92, 112);
        border-left-color: rgba(67, 92, 112);
        background: none;
      }
      & /deep/ .el-tabs--border-card > .el-tabs__header .el-tabs__item {
        border-right-color: rgba(67, 92, 112);
        border-left-color: rgba(67, 92, 112);
        background: rgba(84, 101, 125);
        margin-right: 3px;
      }
      // 空白实时
      .none-block {
        width: 100%;
        height: 400px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      // 实时数据的标签页样式
      & /deep/ .select {
        height: 100%;
        .el-tabs__header {
          background-color: rgba(67, 92, 112);
        }
        .el-tabs__content {
          overflow: auto;
          .simulate {
            padding: 20px 0 6px 20px;
            box-sizing: border-box;
            .row {
              margin-top: 6px;
              color: #ccc;
              .nature {
                width: 220px;
                display: inline-block;
                text-align: right;
              }
              .val {
                margin-left: 20px;
                display: inline-block;
                margin-right: 3px;
              }
              .icon {
                font-size: 20px;
                color: skyblue;
              }
            }
            .odd {
              background-color: rgba(78, 101, 122);
            }
          }
        }
      }
      & /deep/ .event {
        height: 100%;
        overflow: auto;
      }
      // 历史趋势
      & /deep/ .data {
        height: 100%;
        // display: flex;
        @dis-flex();
        @flex-c();
        overflow-y: auto;
        // flex-direction: column;
        .time {
          .time-select {
            margin-right: 10px;
          }
          .date {
            display: inline-block;
          }
          .time /deep/ .is-active .el-radio-button__inner {
            background-color: @radio-bgc;
            border-color: @radio-bgc;
          }
        }
        .tab-his {
          .el-tabs__item {
            color: #ccc;
          }

          .tab-his /deep/ .el-tabs__item.is-active {
            color: #409eff;
          }
        }
        // .chart-line {

        // }
        // 可视化展示区域
        .loading {
          // width: 600px;
          // height: 350px;
          // flex: 1;
          @flex-1();
          height: 0;
          overflow: auto;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #ccc;
        }
        .line-area {
          @flex-1();
          height: 0;
          overflow: auto;
        }
      }
      // 数据报表
      & /deep/ .data-table {
        // overflow: auto;
        height: 100%;
        display: flex;
        flex-direction: column;
        .time {
          .time-select {
            margin-right: 10px;
          }
          .date {
            display: inline-block;
          }
        }
        .report-radio {
          display: inline-block;
          box-sizing: border-box;
          padding: 10px 0;
          .el-radio {
            color: #ccc;
          }
        }

        // 表格显示
        .table-area {
          // height: calc(100% - 74px);
          flex: 1;
          overflow: auto;
          .table {
            font-size: 16px;
            color: #ccc;
            border-width: 1px;
            border-collapse: collapse;
            text-align: center;
            width: 100%;
            th {
              border-width: 1px;
              padding: 4px;
              border-style: solid;
              border-color: #888888;
            }
            td {
              border-width: 1px;
              padding: 4px;
              border-style: solid;
              border-color: #888888;
            }
            .sin {
              background-color: rgb(78, 101, 122);
            }
            /* 移入变色 */
            tr:hover {
              background-color: @table-hover;
            }
          }
        }
      }
    }
  }
}
</style>


// 全局样式
<style >
.main /deep/ .el-tabs__item:focus.is-active.is-focus:not(:active) {
  -webkit-box-shadow: none !important;
  box-shadow: none !important;
}
</style>