
<template>
  <div class="filt">
    <!-- 面包屑 -->
    <MyBreadcrumb level1="数据管理" level2="设备参数报表" v-if="!filt_status" />
    <div class="show-page" v-if="!filt_status">
      <div id="nav">
        <div class="tab" v-if="variableArr.length">
          <el-tabs
            v-model="currentReportId"
            type="border-card"
            @tab-click="switchReport"
            style="display: block;"
          >
            <el-tab-pane
              v-for="item in variableArr"
              :key="item.id"
              :label="item.name"
              :name="item.id.toString()"
            ></el-tab-pane>
          </el-tabs>
        </div>

        <div class="null" v-show="variableArr.length == 0 && loading == false">
          <span>当前无报表数据</span>
        </div>
        <div class="filter" v-if="variableArr.length">
          <el-select v-model="currentReportId" @change="switchReport" filterable placeholder="请选择">
            <el-option
              v-for="item in variableArr"
              :key="item.id"
              :label="item.name"
              :value="item.id.toString()"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div id="select" v-if="variableArr">
        <div class="left">
          <el-select
            v-model="timeSelect"
            style="width: 135px"
            :disabled="loading == true || variableArr.length == 0"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :value="item.value"
              :label="item.name"
            ></el-option>
          </el-select>
          <el-date-picker
            v-model="hourSelect"
            type="date"
            placeholder="选择日期"
            v-if="timeSelect=='day'"
            :picker-options="pickerOptions_day"
            :clearable="false"
            style="width: 135px"
            :disabled="loading == true || variableArr.length == 0"
          ></el-date-picker>
          <el-date-picker
            v-model="daySelect"
            type="month"
            placeholder="选择月"
            v-if="timeSelect=='month'"
            :picker-options="pickerOptions_month"
            :clearable="false"
            style="width: 135px"
            :disabled="loading == true || variableArr.length == 0"
          ></el-date-picker>
          <el-date-picker
            v-model="monthSelect"
            type="year"
            placeholder="选择年"
            v-if="timeSelect=='year'"
            :picker-options="pickerOptions_year"
            :clearable="false"
            style="width: 135px"
            :disabled="loading == true || variableArr.length == 0"
          ></el-date-picker>
        </div>
        <div class="right">
          <el-button
            size="small"
            class="confirm"
            icon="el-icon-plus"
            :disabled="!$store.state.site.siteId"
            @click="add_filt"
          >新增</el-button>

          <el-button
            size="small"
            class="confirm"
            icon="el-icon-edit"
            :disabled="loading == true || variableArr.length == 0"
            @click="try_edit"
          >配置</el-button>
          <el-button
            size="small"
            class="confirm"
            icon="el-icon-upload2"
            :disabled="loading == true || variableArr.length == 0 || exportLoading"
            v-loading="exportLoading"
            element-loading-background="rgba(67, 92, 112, 0.5)"
            @click="exportFile"
          >导出</el-button>
          <el-button
            size="small"
            class="del"
            icon="el-icon-delete"
            :disabled="loading == true || variableArr.length == 0"
            @click="try_delete"
          >删除</el-button>
        </div>
      </div>
      <div
        id="content"
        v-loading="loading"
        element-loading-background="rgba(67, 92, 112, 0.5)"
        element-loading-text="加载中..."
      >
        <table class="table">
          <tr>
            <th style="width: 100px;">时间</th>
            <th v-for="item in tableData" :key="item.id">{{item.name}}</th>
            <th v-if="tableData.length === 0"></th>
          </tr>
          <tr
            v-for="item in arr"
            :key="item.id"
            :class="{'sin': (item.index % 2 == 0), 'double': (item.index % 2 != 0)}"
          >
            <td>{{item.value}} {{timeSelect == 'day' ? '时' : (timeSelect == 'month' ? '日' : '月')}}</td>
            <!-- 值不存在时用-代替 -->
            <td v-for="item1 in tableData" :key="item1.id">
              <!-- {{(item1.data[item.index])+1?item1.data[item.index]:'-'}} -->
              {{(item1.data[item.index] || item1.data[item.index] === 0 ? item1.data[item.index] : '-')}}
              <!-- {{(item1.data[item.index])}} -->
            </td>
            <td v-if="tableData.length === 0"></td>
          </tr>
        </table>
      </div>
    </div>
    <!-- 新增报表页面 -->
    <div class="add-filt" v-if="filt_status">
      <p>添加报表配置</p>
      <div class="content">
        <div class="top">
          <div class="belong">
            <span>所属站点</span>
            <el-input
              v-model="companyName"
              readonly
              placeholder="请输入内容"
              size="medium"
              style="width: 220px;"
            ></el-input>
          </div>
          <div class="create">
            <span>创建报表</span>
            <el-input
              v-model.trim="edit_filtName"
              placeholder="请输入报表名称"
              size="medium"
              style="width: 220px;"
            ></el-input>
          </div>
        </div>
        <div class="line"></div>

        <div class="bottom">
          <span>监控项</span>
          <div class="select">
            <div class="single" v-for="(item, index) in watchArr" :key="index">
              <el-select
                v-model="item.gatewayId"
                placeholder="请选择网关"
                @change="gatewayChange(index)"
                @visible-change="getAllGateway"
                style="margin-right: 16px;"
              >
                <el-option
                  v-for="(item1,index1) in gateway_options"
                  :key="index1"
                  :label="item1.name"
                  :value="item1.gatewayId"
                ></el-option>
              </el-select>
              <el-select
                v-model="item.equip"
                placeholder="请选择设备"
                @change="equipChange(index)"
                @visible-change="getEquipByGateway($event,index)"
                style="margin-right: 16px;"
                filterable
              >
                <el-option
                  v-for="item2 in item.equip_options"
                  :key="item2.equipmentId"
                  :label="item2.name"
                  :value="item2.equipmentId"
                ></el-option>
              </el-select>
              <el-select
                v-model="item.code"
                placeholder="请选择编码"
                @visible-change="getOptions($event,index)"
                filterable
              >
                <el-option
                  v-for="item3 in item.variate_options"
                  :key="item3.id"
                  :label="item3.simplifiedCode"
                  :value="item3.code"
                ></el-option>
              </el-select>
              <el-button
                size="mini"
                type="danger"
                @click="delWatch(item.index)"
                v-if="watchArr.length !== 1"
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
            style="background-color: rgba(245, 166, 35); color: #fff; border: none;"
            @click="add_filt_submit"
          >发布</el-button>
        </div>
      </div>
    </div>
    <!------------------------------------ 删除报表确认弹窗 -->
    <el-dialog
      title="提示"
      :visible.sync="deleteVisible"
      modal
      :close-on-click-modal="false"
      width="500px"
    >
      <div style="width: 30px;float: left;margin: -7px 8px 5px -8px;">
        <i :class="{icon: true, 'iconfont': true, 'iconjinggao1': true}"></i>
      </div>
      <span>是否确认删除此报表？</span>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="deleteVisible = false">取 消</el-button>
        <el-button class="dang" @click="delete_filt">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 配置弹窗 -->
    <el-dialog
      title="配置选项"
      :visible.sync="configVisible"
      :close-on-click-modal="false"
      class="config-window"
      width="994px"
    >
      <div class="top">
        <span>修改趋势名称：</span>
        <el-input v-model.trim="edit_filtName"></el-input>
      </div>
      <div class="new">
        <div class="single" v-for="(item,index) in watchArr" :key="index">
          <el-select
            v-model="item.gatewayId"
            placeholder="请选择网关"
            @change="gatewayChange(index)"
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
            @change="equipChange(index)"
            @visible-change="getEquipByGateway($event,index)"
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
            @visible-change="getOptions($event,index)"
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
          <el-button
            size="mini"
            type="danger"
            @click="delWatch(index)"
            v-if="watchArr.length !== 1"
          >
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
    <!-- 新增文件表单 -->
    <!-- <el-dialog
      title="导入文件"
      :visible.sync="importFileVisible"
      :close-on-click-modal="false"
      width="500px"
    >
      <el-form :model="addFileForm" label-width="100px" class="form">
        <el-form-item label="选择文件" prop="file" style="position: relative;">
          <input
            @change="selectFile($event)"
            type="file"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          />
        </el-form-item>
        <div class="form-footer" style="display: flex; justify-content: center">
          <el-button class="cancel" @click="importFileVisible = false">取 消</el-button>
          <el-button class="confirm" @click.prevent="fileSubmit">确 定</el-button>
        </div>
      </el-form>
    </el-dialog>-->
  </div>
</template>

<script>
import MyBreadcrumb from "../subcomponents/Mybreadcrumb";
import GLOBAL from "../../utils/global_variable";
import {
  getTimeArr,
  formatFilt,
  distinct,
} from "../../utils/index";

export default {
  components: {
    MyBreadcrumb
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
      variate: "北京",
      options: [
        {
          value: "year",
          name: "年报表"
        },
        {
          value: "month",
          name: "月报表"
        },
        {
          value: "day",
          name: "日报表"
        }
      ],
      timeSelect: "day",
      tableData: [],
      // arr: [], //当前显示的时间数组
      arr: getTimeArr(this.timeSelect),
      hourSelect: new Date(),
      daySelect: new Date(),
      monthSelect: new Date(),
      // arr: [],
      edit_filtName: "",
      companyName: this.$store.state.site.siteName,
      watchArr: [
        {
          gatewayId: "",
          equip: "",
          equip_options: [],
          variate_options: [],
          index: 0,
          code: ""
        }
      ],
      gateway_options: [], //所有网关
      filt_status: false,
      deleteVisible: false, //删除弹窗
      configVisible: false, //配置弹窗
      request: true, //是否请求中，数据更新慢
      createTime: "",
      loading: false, //表格加载
      exportLoading: false, //导出按钮加载状态
      // importFileVisible: false,
      fileList: [],
      // addFileForm: {},
      all_equipments: [], //站点下的所有设备
      energyOptions: [], //能源类别
      // 分页
      tatalReport: 0, //总报表数
      currentReportId: "", //当前显示的报表id
      variableArr: [] //报表的总数据
    };
  },
  computed: {
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
      this.get_filt_detail();
    },
    daySelect() {
      this.get_filt_detail();
    },
    monthSelect() {
      this.get_filt_detail();
    },
    watchSiteChange(newVal, oldVal) {
      // this.get_filt_detail();
      this.get_filt()
    }
  },
  mounted() {
    // this.webSocketConnection();
    this.get_filt();
    this.arr = getTimeArr(this.timeSelect);
    this.get_all_equipments();
    this.get_all_variate();
    this.getAllGateway(true);
  },
  methods: {
    // 添加监控项
    addWatch(item) {
      if (item.code) {
        this.index++;
        var obj = {
          equip: "",
          gatewayId: "",
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
      // var arr_index = this.watchArr.findIndex(item => {
      //   return item.index == index;
      // });
      this.watchArr.splice(index, 1);
    },
    // 获取所有网关
    getAllGateway(flag) {
      if(!this.$store.state.site.siteId) {
        return 
      }
      if (flag) {
        this.$http
          .get("equipment/gatewayList", {
            params: {
              roomId: this.$store.state.site.siteId
            }
          })
          .then(res => {
            if (res.data.code === 0) {
              this.gateway_options = res.data.data.gateways;
            }
          });
      }
    },
    // 通过网关获取设备
    getEquipByGateway(flag, index) {
      if (flag) {
        if (!this.watchArr[index].gatewayId) {
          this.$message("请先选中网关!");
          return;
        }
        this.$http
          .get("equipment/equipmentList", {
            params: {
              page: 0,
              size: GLOBAL.max_page_size,
              gatewayId: this.watchArr[index].gatewayId
            }
          })
          .then(res => {
            if (res.data.code === 0) {
              this.watchArr[index].equip_options = res.data.data.equipments;
            }
          });
      }
    },
    // 获取变量编码数组列表
    getOptions(flag, index) {
      if (flag) {
        this.$http
          .get("equipment/variable/findAllByEquipment", {
            params: {
              equipmentId: this.watchArr[index].equip
            }
          })
          .then(res => {
            if (res.data.code == 0) {
              this.watchArr[index].variate_options = res.data.data;
            }
          });
      }
    },
    // 网关值改变
    gatewayChange(index) {
      this.watchArr[index].equip = null;
      this.watchArr[index].code = null;
    },
    // 设备值改变
    equipChange(index) {
      this.watchArr[index].code = "";
    },
    // 添加报表配置
    add_filt() {
      this.filt_status = true;
      this.watchArr = [
        {
          room: "",
          equip: "",
          room_options: [],
          equip_options: [],
          variate_options: [],
          index: 0,
          code: ""
        }
      ];
      this.edit_filtName = "";
    },
    back_line() {
      this.filt_status = false;
      this.edit_filtName = "";
    },
    // 提交新增报表
    add_filt_submit() {
      if (this.edit_filtName) {
      } else {
        this.$message("请输入正确的报表名称");
        return;
      }
      var string = "";
      let ready = true;
      let arr = [];
      this.watchArr.forEach(item => {
        if (item.code) {
          arr.push(item.code);
        } else {
          this.$message("请选择正确的编码数据");
          ready = false;
        }
      });
      if (ready == false) {
        return;
      }
      string = distinct(arr).join(",");
      this.$http
        .post("equipment/variableForm/add", {
          codes: string,
          name: this.edit_filtName,
          siteId: this.$store.state.site.siteId
        })
        .then(res => {
          if (res.data.code == 0) {
            this.filt_status = false;
            this.$notify({
              title: "成功",
              message: "新增成功",
              type: "success"
            });
            this.get_filt("add");
          }
        });
    },
    // 查看单个报表
    get_filt_detail() {
      this.loading = true;
      this.arr = getTimeArr(this.timeSelect);
      // 当前查询的时间
      let time;
      let obj;
      let time_star_string = " 00:00:00";
      let time_end_string = " 23:59:59";
      let ifCancel = false;
      let date = new Date("2019", "08");
      // 查看日
      if (this.timeSelect == "day") {
        time = this.hourSelect;
        if (time < date) {
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
          id: parseInt(this.currentReportId),
          tb: "day_" + year + month + day,
          type: this.timeSelect
        };
        // 查看月
      } else if (this.timeSelect == "month") {
        time = this.daySelect;
        if (time < date) {
          ifCancel = true;
        }
        let year = this.daySelect.getFullYear();
        let month =
          this.daySelect.getMonth() + 1 < 10
            ? "0" + (this.daySelect.getMonth() + 1)
            : this.daySelect.getMonth() + 1;
        obj = {
          id: parseInt(this.currentReportId),
          tb: "month_" + year + month,
          type: this.timeSelect
        };
        // 查看年
      } else {
        time = this.monthSelect;
        if (time < date) {
          ifCancel = true;
        }
        let year = this.monthSelect.getFullYear();
        let month =
          this.monthSelect.getMonth() + 1 < 10
            ? "0" + (this.monthSelect.getMonth() + 1)
            : this.monthSelect.getMonth() + 1;
        let day =
          this.monthSelect.getDate() < 10
            ? "0" + this.monthSelect.getDate()
            : this.monthSelect.getDate();
        obj = {
          tb: "year_" + year,
          id: parseInt(this.currentReportId),
          type: this.timeSelect
        };
      }
      // 零时拦截
      if (ifCancel) {
        this.tableData = [];
        this.loading = false;
        this.$notify({
          title: "提醒",
          message: "当前选中时间无数据"
        });
        return;
      }
      let timeout = setTimeout(() => {
        this.loading = false;
      }, 15000);

      this.$http
        .get("equipment/variableForm/getById", {
          params: obj
        })
        .then(res => {
          clearTimeout(timeout);
          this.loading = false;
          clearTimeout(timeout);
          if (res.data.code == 0) {
            if (res.data.data.variableFormVO.data.length > 0) {
              this.tableData = formatFilt(
                this.timeSelect,
                res.data.data.variableFormVO.data
              );
            } else {
              // 为空情况下占位
              this.tableData = [{ code: "", data: [] }];
            }
          }
        })
        .catch(res => {
          clearTimeout(timeout);
          this.loading = false;
          clearTimeout(timeout);
        });
    },
    // 查询头部报表
    get_filt(data) {
      // data代表当前查询头部后当前报表的高亮选择情况分类，新增、编辑、(删除、查询)
      // 当前站定存在才请求数据
      if (!this.$store.state.site.siteId) {
        return;
      }
      this.variableArr = [];
      this.$http
        .get("equipment/variableForm/findAll", {
          params: {
            siteId: this.$store.state.site.siteId
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.variableArr = res.data.data;
            if (this.variableArr.length > 0) {
              if (data === "add") {
                this.currentReportId = this.variableArr[
                  this.variableArr.length - 1
                ].id.toString();
              } else if (data === "edit") {
                var temId = this.currentReportId;
                this.currentReportId = "";
                this.currentReportId = temId;
              } else {
                this.currentReportId = this.variableArr[0].id.toString();
              }
              this.get_filt_detail();
            } else {
              // 清空报表表格
              this.tableData = [{ code: "", data: [] }];
            }
          }
        });
    },
    // 切换报表
    switchReport() {
      this.get_filt_detail();
    },
    // 删除报表弹窗
    try_delete() {
      this.deleteVisible = true;
    },
    // 删除报表
    delete_filt() {
      this.$http
        .get("equipment/variableForm/remove", {
          params: {
            id: parseInt(this.currentReportId)
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
            this.get_filt();
          }
        });
    },
    // 配置图表弹窗
    try_edit() {
      this.watchArr = [
        {
          equip: "",
          gatewayId: "",
          equip_options: [],
          variate_options: [],
          code: ""
        }
      ];
      this.configVisible = true;
      this.$http
        .get("equipment/variableForm/detail", {
          params: {
            id: parseInt(this.currentReportId)
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.edit_filtName = res.data.data.name;
            this.createTime = res.data.data.createTime;
            let str1 = this.createTime.slice(0, 10);
            let str2 = this.createTime.slice(11, 19);
            this.createTime = str1 + " " + str2;
            let arr = [];
            arr.length = res.data.data.codes.length;
            if (res.data.data.codes.length > 0) {
              for (var i = 0; i < res.data.data.codes.length; i++) {
                arr[i] = {};
                arr[i].gatewayId = res.data.data.codes[i].gatewayId;
                arr[i].equip = res.data.data.codes[i].equipmentId;
                arr[i].code = res.data.data.codes[i].code;
                // arr[i].index = this.index++;
                // arr[i].equip_options = this.all_equipments;
                // arr[i].variate_options = this.all_variate;
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

                // this.sinEquipOptions = [
                //   {
                //     name: item.datas.data[0].equipmentName,
                //     equipmentId: item.datas.data[0].equipmentId
                //   }
                // ];
                // this.sinVariableOptions = [
                //   {
                //     code: item.datas.data[0].code,
                //     simplifiedCode: item.datas.data[0].simplifiedCode
                //   }
                // ];
              }
              this.watchArr = arr;
            } else {
              arr[0] = {};
              arr[0].equip = null;
              arr[0].code = null;
              arr[0].equip_options = [];
              arr[0].variate_options = [];

              // arr[0].equip_options = this.all_equipments;
              // arr[0].variate_options = this.all_variate;
              this.watchArr = arr;
            }
          }
        });
    },
    // 获取所有设备
    get_all_equipments() {
      return;
      this.$http
        .get("equipment/getEqByRoom", {
          params: {
            roomId: this.$store.state.site.siteId
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
      this.$http
        .get("equipment/variable/allVariable", {
          params: {
            companyId: this.$store.state.site.searchCompanyId
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.all_variate = res.data.data;
          }
        });
    },

    // 配置提交
    modify() {
      let string = "";
      if (this.edit_filtName === "") {
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
      // 数组去重不重复提交相同变量
      string = distinct(arr).join(",");
      this.$http
        .post("equipment/variableForm/modify", {
          id: parseInt(this.currentReportId),
          code: string,
          name: this.edit_filtName,
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
            this.get_filt("edit");
          }
        });
    },
    exportFile() {
      this.$notify({
        message: "开始导出"
      });
      this.exportLoading = true;
      let time;
      let obj;
      let time_star_string = " 00:00:00";
      let time_end_string = " 23:59:59";
      let ifCancel = false;
      let date = new Date("2019", "08");
      // 查看日
      if (this.timeSelect == "day") {
        time = this.hourSelect;
        if (time < date) {
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
          id: this.currentReportId,
          tb: "day_" + year + month + day,
          type: this.timeSelect
        };
        // 查看月
      } else if (this.timeSelect == "month") {
        time = this.daySelect;
        if (time < date) {
          ifCancel = true;
        }
        let year = this.daySelect.getFullYear();
        let month =
          this.daySelect.getMonth() + 1 < 10
            ? "0" + (this.daySelect.getMonth() + 1)
            : this.daySelect.getMonth() + 1;
        obj = {
          id: this.currentReportId,
          tb: "month_" + year + month,
          type: this.timeSelect
        };
        // 查看年
      } else {
        time = this.monthSelect;
        if (time < date) {
          ifCancel = true;
        }
        let year = this.monthSelect.getFullYear();
        let month =
          this.monthSelect.getMonth() + 1 < 10
            ? "0" + (this.monthSelect.getMonth() + 1)
            : this.monthSelect.getMonth() + 1;
        let day =
          this.monthSelect.getDate() < 10
            ? "0" + this.monthSelect.getDate()
            : this.monthSelect.getDate();
        obj = {
          tb: "year_" + year,
          id: this.currentReportId,
          type: this.timeSelect
        };
      }

      const fileName =
        obj.tb +
        (obj.type == "day"
          ? "日报表"
          : obj.type == "month"
          ? "月报表"
          : "年报表") +
        ".xlsx";

      // axios使用封装过后的请求设置请求头responseType：'blob'不生效，建议使用axios（{}）
      this.$http({
        methods: "GET",
        url: "equipment/variableForm/exportExcel",
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
    },

    // websocket连接测试
    webSocketConnection() {
      return;
      var websocket = null;

      //判断当前浏览器是否支持WebSocket  ,主要此处要更换为自己的地址
      if ("WebSocket" in window) {
        websocket = new WebSocket("ws://192.168.101.8:9000/webSocket/" + 68);
      } else {
        alert("Not support websocket");
      }

      //连接发生错误的回调方法
      websocket.onerror = function() {
        setMessageInnerHTML("error");
      };

      //连接成功建立的回调方法
      websocket.onopen = function(event) {
        setMessageInnerHTML("open");
      };

      //接收到消息的回调方法
      websocket.onmessage = function(event) {
        console.log(event);
        // alert(1)
        setMessageInnerHTML(event);
      };

      //连接关闭的回调方法
      websocket.onclose = function() {
        setMessageInnerHTML("close");
      };

      //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
      window.onbeforeunload = function() {
        websocket.close();
      };

      //将消息显示在网页上
      function setMessageInnerHTML(innerHTML) {
        console.log(innerHTML.data);
        // document.getElementById("message").innerHTML += innerHTML + "<br/>";
      }

      //关闭连接
      function closeWebSocket() {
        websocket.close();
      }

      //发送消息
      function send() {
        var message = document.getElementById("text").value;
        websocket.send(message);
      }
    }
  },
};
</script>

<style lang="less" scoped>
@import "../../assets/css/index.less";
.filt {
  height: 100%;
  .show-page {
    height: calc(100% - 62px);
    background-color: @content-bgc;
    padding: 6px;
    box-sizing: border-box;
    // 报表头部展示
    #nav {
      height: 59px;
      @dis-flex();
      display: flex;
      // display: -webkit-flex;
      // display: -moz-flex;
      // display: -ms-flexflex;
      // display: -o-flex;

      /* 换成卡片化标签页Tabs的样式 */
      .tab {
        @flex-1();
        width: 0;
        & /deep/ .el-tabs--border-card {
          background-color: rgba(67, 92, 112);
          background: none;
          border: none;
          box-shadow: 0 0 4px #aaa;
          margin-right: 4px;
          @flex-c();
          height: 0;
          & > .el-tabs__header {
            background-color: rgba(67, 92, 112);
            border: none;
            .el-tabs__item {
              border-right-color: #435c70;
              border-left-color: #435c70;
              background: #54657d;
              margin-right: 3px;
              &.is-active {
                border-right-color: #435c70;
                border-left-color: #435c70;
                background: none;
              }
            }
          }
          .el-tabs__content {
            @flex-1();
            height: 0;
            .el-tab-pane {
              height: 100%;
              overflow: auto;
            }
          }
        }
        /deep/ .el-tabs__header {
          margin: 0;
        }
      }

      .null {
        @flex-1();
        height: 59px;
        display: -webkit-flex;
        justify-content: center;
        align-items: center;
        background-color: @board-title;
        span {
          color: #ccc;
        }
      }
      .filter {
      }
    }
    // 时间筛选
    #select {
      display: -webkit-flex;
      justify-content: space-between;
      padding-top: 6px;
      padding-bottom: 6px;
      .left {
        width: 50%;
      }
    }
    #content {
      height: calc(100% - 104px);
      overflow: auto;

      .table {
        font-size: 16px;
        color: #555555;
        border-width: 1px;
        border-color: #999999;
        border-collapse: collapse;
        text-align: center;
        width: 100%;
        th {
          background: @table-th-bgc;
          border-width: 1px;
          padding: 4px;
          border-style: solid;
          border-color: #ccc;
          color: #fff;
        }
        td {
          border-width: 1px;
          padding: 4px;
          border-style: solid;
          border-color: #ccc;
          color: #ccc;
        }
        /* 表格隔行变色 */
        .double {
          background-color: @table-bgc;
        }
        /* 移入变色 */
        tr:hover {
          background-color: @table-hover;
        }
      }
    }
  }
  .add-filt {
    background-color: @beside-color;
    color: #ccc;
    height: 100%;
    // min-height: 500px;
    // overflow: auto;
    @dis-flex();
    @flex-c();
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
        margin-left: 100px;
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
