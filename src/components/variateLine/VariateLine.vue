<template>
  <div class="variate-line">
    <MyBreadcrumb level1="数据管理" level2="设备参数历史曲线" v-if="!add_line" />
    <div class="select-area" v-if="!add_line">
      <!-- 单选框 -->
      <el-radio-group
        v-model="timeSelect"
        size="middle"
        style="margin-right: 10px;"
        :disabled="loading == true || line_total.length==0"
      >
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
          :picker-options="pickerOptions_day"
          :clearable="Boolean(false)"
          :disabled="line_total.length==0"
        ></el-date-picker>
      </div>
      <!-- 月 -->
      <div class="date" v-show="timeSelect=='month'">
        <el-date-picker
          v-model="daySelect"
          type="month"
          placeholder="选择月"
          format="yyyy-MM"
          :picker-options="pickerOptions_month"
          :clearable="Boolean(false)"
          :disabled="line_total.length==0 "
        ></el-date-picker>
      </div>
      <!-- 年 -->
      <div class="date" v-show="timeSelect=='year'">
        <el-date-picker
          v-model="monthSelect"
          align="right"
          type="year"
          placeholder="选择年"
          :picker-options="pickerOptions_year"
          :clearable="Boolean(false)"
          :disabled="line_total.length==0"
        ></el-date-picker>
      </div>
      <div class="input">
        <el-input
          placeholder="输入名称将自动搜索"
          suffix-icon="el-icon-search"
          v-throttle="search"
          v-model.trim="inputValue"
        ></el-input>
      </div>
      <!-- <el-select v-model="muiValue" placeholder="请选择需要监控的曲线" multiple>
        <el-option
          v-for="(item, index) in muiOptions"
          :key="index"
          :label="item.name"
          :value="item.id"
        >
          <span style="float: left">{{ item.name }}</span>
          <i
            class="el-icon-delete"
            style="margin-right: 20px; margin-top: 10px; float: right; color: #ccc; font-size: 13px"
            @click.stop="delMul(item)"
          ></i>
        </el-option>
      </el-select>-->
      <!-- <el-tag v-for="tag in muiOptions" :key="tag.name" closable >{{tag.name}}</el-tag> -->
      <div class="tag">
        <div class="sin-tag" v-for="(item,index) in muiOptions" :key="index">
          <span class="text">{{item.name}}</span>
          <i class="icon iconfont iconbaseline-close-px" @click="delCompareSin(index)"></i>
        </div>
      </div>
      <el-button class="confirm" @click="compareLine" v-show="muiOptions.length">比对</el-button>
      <!-- 无站点情况下不能新增曲线 -->
      <el-button @click="try_add_line" class="confirm add" :disabled="!watchSiteChange">+ &nbsp;新增</el-button>
      <!-- 导入导出 -->
      <div style="display: inline-block;"></div>
    </div>
    <!-- 图表显示区域 -->
    <div class="chart scroll" v-if="!add_line">
      <div
        class="chart-show"
        v-loading="loading"
        element-loading-background="rgba(67, 92, 112, 0.5)"
        element-loading-text="加载中..."
      >
        <div
          :class="{single: true, 'left': index % 2 == 0, 'right': index % 2 != 0, 'top': index < 2, 'buttom': index > 1}"
          v-for="(item,index) in 4"
          :key="index"
          style="min-height: 200px;"
        >
          <!-- 根据当页的曲线数量进行渲染 -->
          <lineEcharts
            v-if="line_total[index]"
            :line_obj="line_total[index]"
            @delete_line="delete_line"
            @check_line="check_line"
            @addToCompare="addToCompare"
            v-show="!loading"
          ></lineEcharts>
        </div>
      </div>

      <!-- 分页 -->
      <el-pagination
        class="page"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[4]"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>

    <!-- 新增曲线页面 -->
    <div class="add-line" v-if="add_line">
      <p>添加监控曲线</p>
      <div class="content">
        <div class="top">
          <div class="belong">
            <span>所属站点</span>
            <el-input
              v-model="getSiteName"
              readonly
              placeholder="请输入内容"
              style="width: 220px;"
              size="medium"
            ></el-input>
          </div>
          <div class="create">
            <span>创建曲线</span>
            <el-input
              v-model.trim="lineName"
              placeholder="请输入曲线名称"
              style="width: 220px;"
              size="medium"
            ></el-input>
          </div>
        </div>
        <div class="line"></div>
        <div class="bottom">
          <span>监控项</span>
          <div class="select">
            <div class="single" v-for="item in watchArr" :key="item.index">
              <el-select
                v-model="item.gatewayId"
                placeholder="请选择网关"
                @change="gatewayChange(item.index)"
                @visible-change="getAllGateway"
                style="margin-right: 16px;"
              >
                <el-option
                  v-for="item in gateway_options"
                  :key="item.equipmentId"
                  :label="item.name"
                  :value="item.gatewayId"
                ></el-option>
              </el-select>
              <el-select
                v-model="item.equip"
                placeholder="请选择设备"
                @change="equipChange(item.index)"
                @visible-change="getEquipByGateway($event,item.index)"
                style="margin-right: 16px;"
                filterable
              >
                <el-option
                  v-for="item in item.equip_options"
                  :key="item.equipmentId"
                  :label="item.name"
                  :value="item.equipmentId"
                ></el-option>
              </el-select>
              <el-select
                v-model="item.code"
                placeholder="请选择编码"
                @visible-change="getOptions($event,item.index)"
                filterable
              >
                <el-option
                  v-for="item in item.variate_options"
                  :key="item.code"
                  :label="item.simplifiedCode"
                  :value="item.code"
                ></el-option>
              </el-select>
              <el-button
                size="mini"
                type="danger"
                @click="delWatch(item.index)"
                v-if="watchArr.length != 1"
              >
                <i class="icon iconfont iconicon_shanchu-mian mini"></i>&nbsp;删除
              </el-button>
              <el-button
                size="mini"
                type="success"
                @click="addWatch(item)"
                v-if="item==watchArr[watchArr.length-1]"
              >+ &nbsp;添加</el-button>
            </div>
          </div>
          <el-button
            style="background-color: green; color: #fff; border: none;"
            @click="back_line"
          >取消</el-button>
          <el-button
            style="background-color: rgba(245, 166, 35); border: none; color: #fff;"
            @click="add_line_submit"
          >发布</el-button>
        </div>
      </div>
    </div>
    <!-- 弹窗 -->
    <el-dialog
      title="配置选项"
      :visible.sync="configVisible"
      :close-on-click-modal="false"
      class="config-window"
      width="968px"
    >
      <div class="top">
        <span>曲线名称：</span>
        <el-input v-model.trim="edit_lineName"></el-input>
      </div>

      <div class="new">
        <div class="single" v-for="(item, index) in watchArr" :key="item.id">
          <el-select
            v-model="item.gatewayId"
            placeholder="请选择网关"
            @change="gatewayChange(item.index)"
            @visible-change="getAllGateway"
            style="margin-right: 16px;"
          >
            <el-option
              v-for="item in gateway_options"
              :key="item.equipmentId"
              :label="item.name"
              :value="item.gatewayId"
            ></el-option>
          </el-select>
          <el-select
            v-model="item.equip"
            placeholder="请选择设备"
            @change="equipChange(item.index)"
            @visible-change="getEquipByGateway($event,item.index)"
            style="margin-right: 16px;"
            filterable
          >
            <el-option
              v-for="item in item.equip_options"
              :key="item.equipmentId"
              :label="item.name"
              :value="item.equipmentId"
            ></el-option>
          </el-select>
          <el-select
            v-model="item.code"
            placeholder="请选择编码"
            @visible-change="getOptions($event,item.index)"
            style="margin-right: 6px;"
            filterable
          >
            <el-option
              v-for="item in item.variate_options"
              :key="item.code"
              :label="item.simplifiedCode"
              :value="item.code"
            ></el-option>
          </el-select>
          <el-button size="mini" type="danger" v-if="watchArr.length != 1" @click="delWatch(index)">
            <i class="icon iconfont iconicon_shanchu-mian mini"></i>&nbsp;删除
          </el-button>
          <el-button
            size="mini"
            type="success"
            @click="addWatch(item)"
            v-if="item==watchArr[watchArr.length-1]"
          >
            <i class="icon iconfont iconadd mini"></i>&nbsp;添加
          </el-button>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="configVisible = false">取 消</el-button>
        <el-button class="confirm" @click="modify">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 确认删除 -->
    <el-dialog title="提示" :close-on-click-modal="false" :visible.sync="deleteVisible" width="30%">
      <div style="width: 30px;float: left;margin: -7px 8px 5px -8px;">
        <i :class="{icon: true, 'iconfont': true, 'iconjinggao1': true}"></i>
      </div>
      <span>是否确认删除该图表？</span>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="deleteVisible = false">取 消</el-button>
        <el-button class="dang" @click="delete_clear_line">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import lineEcharts from "../subcomponents/echarts_line";
import MyBreadcrumb from "../subcomponents/Mybreadcrumb";
import GLOBAL from "../../utils/global_variable";
import {mapState,mapGetters} from 'vuex'
import {
  findArrIndex,
  getLineData,
  getXDateArr,
  getcurrentTimeArr,
  formatPoint,
  distinct,
} from "../../utils/index";

export default {
  components: {
    lineEcharts,
    MyBreadcrumb,
  },
  inject: ["reload"], //注入依赖
  data() {
    return {
      pickerOptions_day: {
        disabledDate(time) {
          return (
            time.getTime() > Date.now() || time.getTime() < new Date(2019, 9, 1)
          );
        }
      },
      pickerOptions_month: {
        disabledDate(time) {
          return (
            time.getTime() > Date.now() || time.getTime() < new Date(2019, 9, 1)
          );
        }
      },
      pickerOptions_year: {
        disabledDate(time) {
          return (
            time.getTime() > Date.now() || time.getTime() < new Date(2019, 9, 1)
          );
        }
      },
      selectMuiOptions: [], //头部多选项
      muiValue: "",
      muiOptions: [],
      xAxis: [],
      type: "day",
      yAxis: {
        fireData: [0, 0, 0, 0, 0, 0, 0],
        faultData: [0, 0, 0, 0, 0, 0, 0],
        abnormalData: [0, 0, 0, 0, 0, 0, 0],
        dangerData: [0, 0, 0, 0, 0, 0, 0],
        falseData: [0, 0, 0, 0, 0, 0, 0]
      },
      arr: [{}, {}, {}],
      // timeSelect: "min", //年月日筛选方式
      timeSelect: "day", //年月日筛选方式
      calscValue: "avg", //取值计算方式
      // 取值计算方式数组
      calscOptions: [
        { value: "avg", label: "平均值" },
        { value: "max", label: "最大值" },
        { value: "min", label: "最小值" }
      ],
      dateSelect: "", //选中指定日期查询
      add_line: false, //是否新增曲线操作
      siteName: this.$store.state.site.siteName,
      lineName: "",
      index: 0, //作为添加曲线索引标记
      // 监控项数据列表
      watchArr: [
        {
          room: this.$store.state.site.siteId,
          equip: "",
          room_options: [],
          equip_options: [],
          variate_options: [],
          index: 0,
          code: ""
        }
      ],
      gateway_options: [], //所有网关
      currentPage: 1, //当前页
      pageSize: 4, //页码大小
      total: 0, //总数据
      // 曲线数据数组
      lineArr: [],
      line_total: [], //需要传值的总数据
      hourSelect: new Date(),
      daySelect: new Date(),
      monthSelect: new Date(),
      inputValue: "",
      configVisible: false,
      deleteVisible: false,
      deleteId: "",
      modifyId: "",
      createTime: null,
      lineName: "",
      edit_lineName: "",
      config_line_arr: [
        {
          equip: "",
          variate_options: [],
          index: 0,
          code: ""
        }
      ],
      levelArr: [], //用于编辑图表层级信息存储
      all_variate: [], //所有变量
      all_equipments: [], //所有设备数组
      all_rooms: [], //所有站点
      loading: false,
      importFileVisible: false, //批量导入设备弹窗
      addFileForm: {} //批量导入设备文件表单
    };
  },
  computed: {
    ...mapGetters(['getSiteName']),
    watchSiteChange() {
      return this.$store.state.site.siteId;
    }
  },
  watch: {
    // 两种均可
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
    watchSiteChange() {
      this.add_line = false;
      this.getLine();
    }
  },
  created() {
    this.getLine();
  },
  destory() {},
  methods: {
    // 添加监控项
    addWatch(item) {
      if (item.code) {
        this.index++;
        var obj = {
          equip: "",
          room: "",
          gatewayId: null,
          room_options: [],
          equip_options: [],
          variate_options: [],
          index: this.index,
          code: ""
        };
        this.watchArr.push(obj);
      }
    },
    // 删除监控项
    delWatch(index) {
      this.watchArr.splice(index, 1);
    },

    // 获取设备
    get_equipOptions(flag, index) {
      var arrIndex = findArrIndex(this.watchArr, "index", index);
      if (flag) {
        this.$http
          .get("equipment/getEqByRoom", {
            params: {
              page: 0,
              // size: 1000,
              size: GLOBAL.max_page_size,
              roomId: this.$store.state.site.siteId
            }
          })
          .then(res => {
            if (res.data.code == 0) {
              this.watchArr[arrIndex].equip_options = res.data.data;
            }
          });
      }
    },
    // 通过网关获取设备
    getEquipByGateway(flag, index) {
      if (flag) {
        var arrIndex = findArrIndex(this.watchArr, "index", index);
        if (!this.watchArr[arrIndex].gatewayId) {
          this.$message.warning("请先选中网关!");
          return;
        }
        this.$http
          .get("equipment/equipmentList", {
            params: {
              page: 0,
              size: GLOBAL.max_page_size,
              gatewayId: this.watchArr[arrIndex].gatewayId
            }
          })
          .then(res => {
            if (res.data.code === 0) {
              this.watchArr[arrIndex].equip_options = res.data.data.equipments;
            }
          });
      }
    },
    // 获取变量编码数组列表
    getOptions(flag, index) {
      if (flag) {
        var arrIndex = findArrIndex(this.watchArr, "index", index);
        if (!this.watchArr[arrIndex].equip) {
          this.$message.warning("请先选中设备!");
          return;
        }
        this.$http
          .get("equipment/variable/findAllByEquipment", {
            params: {
              equipmentId: this.watchArr[arrIndex].equip
            }
          })
          .then(res => {
            if (res.data.code == 0) {
              this.watchArr[arrIndex].variate_options = res.data.data;
            }
          });
      }
    },
    // 提交编码曲线
    add_line_submit() {
      if (this.lineName) {
      } else {
        this.$message("请输入正确的曲线名称");
        return;
      }
      var string = "";
      let ready = true;
      let arr = [];
      this.watchArr.forEach(item => {
        if (item.code) {
          arr.push(item.code);
        } else {
          this.$message("请填写正确的编码格式");
          ready = false;
        }
      });
      if (ready == false) {
        return;
      }
      // 数组去重,不提交重复的
      arr = distinct(arr);
      string = arr.join(",");
      this.$http
        .post("equipment/variableCurve/add", {
          codes: string,
          name: this.lineName,
          siteId: this.$store.state.site.siteId
        })
        .then(res => {
          if (res.data.code == 0) {
            this.add_line = false;
            this.$notify({
              title: "成功",
              message: "新增成功",
              type: "success"
            });
            this.getLine();
          }
        });
    },
    // 获取所有曲线
    getLine() {
      // 当前站定存在才请求数据
      if (!this.$store.state.site.siteId) {
        return;
      }
      this.loading = true;
      this.line_total = [];
      // 当前查询的时间
      let time;
      let obj;
      // let time_star_string = " 00:00:00";
      // let time_end_string = " 23:59:59";
      let ifCancel = false;
      let date = new Date("2019", "08");
      // return
      // 查看日
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
        obj = {
          siteId: this.$store.state.site.siteId,
          tb: this.timeSelect + "_" + year + month + day,
          page: this.currentPage - 1,
          size: this.pageSize,
          type: this.timeSelect
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
        obj = {
          siteId: this.$store.state.site.siteId,
          tb: this.timeSelect + "_" + year + month,
          page: this.currentPage - 1,
          size: this.pageSize,
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
          siteId: this.$store.state.site.siteId,
          tb: this.timeSelect + "_" + year,
          page: this.currentPage - 1,
          size: this.pageSize,
          type: this.timeSelect
        };
      }

      // 零时拦截
      if (ifCancel) {
        this.line_total = [];
        this.total = 0;
        this.loading = false;
        this.$notify({
          title: "提醒",
          message: "当前选中时间无数据"
        });
        this.get_all_equipments();
        this.get_all_variate();
        this.getAllGateway();
        return;
      }
      obj.name = this.inputValue;
      // 设置定时器
      let timeout = setTimeout(() => {
        this.loading = false;
      }, 15000);
      this.$http
        .get("equipment/variableCurve/fuzzyQuery", {
          params: obj
        })
        .then(res => {
          if (res.data.code == 0) {
            clearTimeout(timeout);
            var temp = formatPoint(res.data.data.variableCurveVOS);
            this.line_total = getLineData(
              time,
              this.timeSelect,
              temp
            );
            this.total = res.data.data.total;
            this.loading = false;
            this.$forceUpdate();
            this.get_all_equipments();
            this.get_all_variate();
            this.getAllGateway();
          }
        })
        .catch(res => {
          this.loading = false;
          clearTimeout(timeout);
        });
    },
    try_add_line() {
      this.add_line = true;
      this.lineName = "";
      this.watchArr = [
        {
          equip: "",
          room: "",
          room_options: [],
          equip_options: [],
          variate_options: [],
          index: 0,
          code: ""
        }
      ];
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getLine();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getLine();
    },
    back_line() {
      this.add_line = false;
      this.getLine();
    },
    // 接受子组件传值删除单个图表
    delete_line(id) {
      // 对比选项限制
      let arr = this.muiOptions.map(item => {
        return item.id;
      });
      if (arr.some(item => item === id)) {
        this.$notify({
          message: "当前曲线已在对比选项中，无法操作",
          type: "warning"
        });
        return;
      }
      this.deleteId = id;
      this.deleteVisible = true;
    },
    // 确认删除
    delete_clear_line() {
      this.$http
        .get("equipment/variableCurve/remove", {
          params: {
            id: this.deleteId
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success"
            });
            this.deleteVisible = false;

            if (this.line_total.length == 1 && this.total !== 1) {
              this.currentPage--;
            }
            this.getLine();
          }
        });
    },
    // 单个图表详情
    check_line(id) {
      // 对比选项删除
      let arr = this.muiOptions.map(item => {
        return item.id;
      });
      if (arr.some(item => item === id)) {
        this.$notify({
          message: "当前曲线已在对比选项中，无法操作",
          type: "warning"
        });
        return;
      }
      this.modifyId = id;
      this.configVisible = true;
      var this_ = this;
      // function detail() {
      this_.watchArr = [
        {
          equip: "",
          room: "",
          room_options: [],
          equip_options: [],
          variate_options: [],
          // index: 0,
          code: ""
        }
      ];
      this_.$http
        .get("equipment/variableCurve/detail", {
          params: {
            id: id
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this_.edit_lineName = res.data.data.name;
            this_.createTime = res.data.data.createTime;
            let str1 = this_.createTime.slice(0, 10);
            let str2 = this_.createTime.slice(11, 19);
            this_.createTime = str1 + " " + str2;
            let arr = [];
            arr.length = res.data.data.codes.length;

            if (res.data.data.codes.length > 0) {
              for (var i = 0; i < res.data.data.codes.length; i++) {
                arr[i] = {};
                arr[i].gatewayId = res.data.data.codes[i].gatewayId;
                arr[i].equip = res.data.data.codes[i].equipmentId;
                arr[i].code = res.data.data.codes[i].code;
                arr[i].index = this_.index++;
                arr[i].room_options = this_.all_rooms;
                arr[i].equip_options = [
                  {
                    name: res.data.data.codes[i].equipmentName,
                    equipmentId: res.data.data.codes[i].equipmentId
                  }
                ];
                arr[i].variate_options = [
                  {
                    code: res.data.data.codes[i].code,
                    simplifiedCode: res.data.data.codes[i].simplifiedCode
                  }
                ];
              }
              this_.watchArr = arr;
            } else {
              arr[0] = {};
              arr[0].equip = null;
              arr[0].code = null;
              // arr[0].equip_options = this_.all_equipments;
              // arr[0].variate_options = this_.all_variate;
              arr[0].equip_options = [];
              arr[0].variate_options = [];
              this_.watchArr = arr;
            }
          }
        });
      // }
    },
    // 添加至比对列表
    addToCompare(obj) {
      // 对比选项限制
      let arr = this.muiOptions.map(item => {
        return item.id;
      });
      if (arr.some(item => item === obj.id)) {
        this.$notify({
          message: "当前曲线已在对比选项中",
          type: "warning"
        });
        return;
      }
      if (this.muiOptions.length < 4) {
        this.muiOptions.push(obj);
      } else {
        this.$notify({
          message: "最多添加四个曲线",
          type: "warning"
        });
      }
    },
    // 获取所有设备
    get_all_equipments() {
      let index = findArrIndex(
        this.$store.state.site.siteList,
        "id",
        this.$store.state.site.siteId
      );
      let id = this.$store.state.site.siteList[index].companyId;
      this.$http
        .get("equipment/equipment/allEquipment", {
          params: {
            companyId: id
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.all_equipments = res.data.data;
            this.all_equipments.map(item => {
              item.equip = item.equipmentId;
            });
          }
        });
    },
    // 获取所有的变量
    get_all_variate() {
      return;
      let index = findArrIndex(
        this.$store.state.site.siteList,
        "id",
        this.$store.state.site.siteId
      );
      let id = this.$store.state.site.siteList[index].companyId;
      this.$http
        .get("equipment/variable/allVariable", {
          params: {
            companyId: id
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.all_variate = res.data.data;
          }
        });
    },
    // 站点值改变
    roomChange(index) {
      var arrIndex = findArrIndex(this.watchArr, "index", index);
      this.watchArr[arrIndex].equip = "";
      this.watchArr[arrIndex].code = "";
    },
    // 网关值改变
    gatewayChange(index) {
      var arrIndex = findArrIndex(this.watchArr, "index", index);
      this.watchArr[arrIndex].equip = null;
      this.watchArr[arrIndex].code = null;
    },
    // 设备值改变
    equipChange(index) {
      var arrIndex = findArrIndex(this.watchArr, "index", index);
      this.watchArr[arrIndex].code = "";
    },
    modify() {
      let string = "";
      if (this.edit_lineName === "") {
        this.$message("请输入曲线名称");
        return;
      }
      let ready = true;
      let arr = [];
      this.watchArr.forEach(item => {
        if (!item.code) {
          ready = false;
        } else {
          arr.push(item.code);
        }
      });
      if (!ready) {
        this.$message("请输入正确的数据格式");
        return;
      }
      string = distinct(arr).join(",");
      this.$http
        .post("equipment/variableCurve/modify", {
          id: this.modifyId,
          code: string,
          name: this.edit_lineName,
          siteId: this.$store.state.site.siteId,
          createTime: this.createTime
        })
        .then(res => {
          if (res.data.code == 0) {
            this.configVisible = false;
            this.$notify({
              title: "成功",
              message: "编辑成功",
              type: "success"
            });
            this.getLine();
          }
        });
    },
    // 配置图表请求编码
    getOptions1(flag, index) {
      if (flag) {
        var arrIndex = findArrIndex(this.config_line_arr, "index", index);
        this.$http
          .get("equipment/variable/findAllByEquipment", {
            params: {
              equipmentId: this.config_line_arr[arrIndex].equip
            }
          })
          .then(res => {
            if (res.data.code == 0) {
              this.config_line_arr[arrIndex].variate_options = res.data.data;
            }
          });
      }
    },

    // 导出模板
    exportModel() {
      this.$http({
        methods: "GET",
        url: "equipment/variableCurve/exportModel",
        responseType: "blob"
      })
        .then(res => {
          const link = document.createElement("a");
          const blob = new Blob([res.data], {
            type: "application/vnd.ms-excel"
          });
          // const blob = new Blob([res.data], {
          //   type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          // });
          let fileName = "模板" + ".xlsx";
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          this.$notify({
            message: "模板已导出"
          });
        })
        .catch(err => {
          this.$notify({
            message: "模板导出失败"
          });
        });
    },
    // 导入文件
    importFile() {
      // 重置内容
      // this.$delete(this.addFileForm, "file");
      this.importFileVisible = true;
      this.$nextTick(() => {
        let file = this.$refs.input1;
        file.value = "";
        this.$delete(this.addFileForm, "file");
      });
    },
    // 获取所有网关
    getAllGateway() {
      // return;
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
            this.gateway_options = res.data.data.gateways;
            this.$forceUpdate();
          }
        });
    },
    // 节流搜索
    search() {
      this.currentPage = 1;
      this.getLine();
    },
    // 删除比对项
    delMul(item) {
      this.muiOptions.splice(item.index, 1);
      let index = this.muiValue.find(value => {
        return value === item.id;
      });

      console.log(index);
      if (index) {
        this.muiValue.splice(item.index, 1);
      }
    },
    // 删除标签对比项
    delCompareSin(index) {
      console.log(this.muiOptions);
      this.muiOptions.splice(index, 1);
      if (this.muiOptions.length > 0) {
        this.compareLine();
      } else {
        this.getLine();
      }
    },
    // 开始比对查询曲线
    compareLine() {
      this.inputValue = ""; //对比后清空输入框值
      this.currentPage = 1;
      this.loading = true;
      let time, obj;
      if (this.timeSelect == "day") {
        time = this.hourSelect;
        let year = this.hourSelect.getFullYear();
        let month =
          this.hourSelect.getMonth() + 1 < 10
            ? "0" + (this.hourSelect.getMonth() + 1)
            : this.hourSelect.getMonth() + 1;
        let day =
          this.hourSelect.getDate() < 10
            ? "0" + this.hourSelect.getDate()
            : this.hourSelect.getDate();
        obj = {
          siteId: this.$store.state.site.siteId,
          tb: this.timeSelect + "_" + year + month + day,
          type: this.timeSelect
        };
        // 查看月
      } else if (this.timeSelect == "month") {
        time = this.daySelect;
        // if (this.daySelect < date) {
        //   ifCancel = true;
        // }
        let year = this.daySelect.getFullYear();
        let month =
          this.daySelect.getMonth() + 1 < 10
            ? "0" + (this.daySelect.getMonth() + 1)
            : this.daySelect.getMonth() + 1;
        obj = {
          siteId: this.$store.state.site.siteId,
          tb: this.timeSelect + "_" + year + month,
          type: this.timeSelect
        };
        // 查看年
      } else {
        time = this.monthSelect;
        // if (this.monthSelect < date) {
        //   ifCancel = true;
        // }
        let year = this.monthSelect.getFullYear();
        obj = {
          siteId: this.$store.state.site.siteId,
          tb: this.timeSelect + "_" + year,
          type: this.timeSelect
        };
      }
      // console.log(time, obj)
      //   return
      // obj.ids = this.muiValue.join(",");
      let arr = this.muiOptions.map(item => {
        return item.id;
      });
      obj.ids = arr.join(",");
      this.$http
        .get("equipment/variableCurve/curveComparison", {
          params: obj
        })
        .then(res => {
          if (res.data.code === 0) {
            this.loading = false;
            this.line_total = formatPoint(res.data.data.variableCurveVOS);
            this.line_total = getLineData(
              time,
              this.timeSelect,
              this.line_total
            );
          }
        });
    }
  },
  mounted() {
    window.onresize = () => {
      let chartBox = document.getElementsByClassName("chart")[0];
    };
    window.onresize();
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/css/index.less";
.variate-line {
  width: 100%;
  height: 100%;
  /* 顶部筛选区域 */
  .select-area {
    height: 50px;
    position: relative;
    // vertical-align: center;
    @dis-flex();
    align-items: center;
    .add {
      position: absolute;
      right: 0;
      border: none;
      padding: 12px 26px;
    }
    /* 日期选择器 */
    .date {
      & /deep/ .el-date-editor {
        width: 136px;
        .el-input__inner {
          height: 40px !important;
        }
      }
    }
    .input {
      width: 156px;
      margin: 0 8px;
    }
    .tag {
      .sin-tag {
        display: inline-block;
        background-color: #94a9c7;
        border-radius: 4px;
        margin-right: 8px;
        position: relative;
        width: 66px;
        span.text {
          display: inline-block;
          width: 50px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: center;
        }
        i.iconfont {
          display: inline-block;
          border-radius: 8px;
          position: absolute;
          right: 0;
          top: 4px;
          // margin-bottom: 5px;
          // vertical-align: center;
          &:hover {
            cursor: pointer;
            background-color: aquamarine;
          }
        }
      }
    }
  }
  // 滚动
  .chart {
    width: 100%;
    height: calc(100% - 56px - 50px);
    overflow-y: auto;
    overflow-x: hidden;
    // 图表
    .chart-show {
      height: calc(100% - 52px);
      display: float;
      min-height: 500px;
      .single {
        margin: 0;
        height: calc(50% - 4px);
        width: calc(50% - 4px);
        box-sizing: border-box;
        background-color: rgba(67, 92, 112);
        float: left;
        &.left {
          margin-right: 4px;
        }
        &.right {
          margin-left: 4px;
        }
        &.top {
          margin-bottom: 8px;
        }
        &.bottom {
          margin-top: 4px;
        }
      }
    }
    // 分页
    & /deep/ .page {
      display: flex;
      justify-content: flex-end;
      // padding-right: 50px;
      //   background-color: rgba(67, 92, 112);
      //   margin: 10px 0;
      //   .el-pagination__total {
      //     color: #fff;
      //   }
      //   .el-pager li {
      //     background: none;
      //   }
      //   .el-pagination__jump {
      //     color: #fff;
      //     .el-input__inner {
      //       background-color: @board-bgc;
      //       color: #fff;
      //     }
      //   }
    }
  }
  .add-line {
    background-color: @beside-color;
    color: #ccc;
    height: 100%;
    @dis-flex();
    @flex-c();
    // min-height: 500px;
    // overflow: hidden;
    p {
      background-color: #54657d;
      display: block;
      padding: 6px;
      margin: 6px;
    }
    .content {
      @flex-1();
      height: 0;
      overflow: auto;

      .top {
        padding-left: 30px;
        margin-top: 10px;
        .belong {
          font-size: 14px;
          margin-bottom: 20px;
        }
        .create {
          font-size: 14px;
          margin-bottom: 20px;
        }
        // .line {
        //   height: 2px;
        //   background-color: white;
        // }
      }
      .line {
        height: 2px;
        background-color: #e9eef3;
        margin-left: 30px;
      }
      .bottom {
        position: relative;
        padding-left: 30px;
        padding-bottom: 30px;
        margin-top: 10px;
        span {
          position: absolute;
          top: 10px;
          display: inline-block;
          margin-bottom: 10px;
        }
        .select {
          margin-left: 80px;
          margin-bottom: 40px;
          .single {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin-bottom: 10px;
            margin-bottom: 5px;
            margin-bottom: 5px;
            .el-select {
              width: 200px;
              margin-right: 15px;
            }
            .el-cascader .el-input {
              background-color: red;
            }
          }
        }
      }
    }
  }
  /* 弹窗 */
  .config-window {
    .top {
      text-align: left;
      padding-bottom: 5px;
      border-bottom: 1px solid #f1ecec;
      & /deep/ .el-input {
        display: inline-block;
        width: 200px;
        .el-input__inner {
          height: 34px;
        }
      }
    }
    .new {
      margin-top: 10px;
      .single {
        text-align: left;
        margin-left: 74px;
        margin-bottom: 5px;
        .el-select {
          display: inline-block;
          width: 200px;
        }
      }
    }
  }
}
</style>
