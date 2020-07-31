<template>
  <!-- 事件告警 -->
  <div class="event-warn" style>
    <!-- 面包屑 -->
    <MyBreadcrumb level1="告警管理" level2="告警处理" />
    <!-- 顶部下拉选项 -->
    <div class="sel">
      <!-- 所有设备 -->
      <el-select
        v-model="equipment"
        clearable
        @visible-change="getEquip"
        @change="equipChange"
        filterable
        placeholder="设备"
        size="mini"
        style="width: 150px;"
        :disabled="loading==true || !$store.state.site.siteId"
      >
        <el-option
          v-for="item in optionsEquip"
          :key="item.equipmentId"
          :label="item.name"
          :value="item.equipmentId"
        ></el-option>
      </el-select>
      <el-select
        v-model="warnType"
        clearable
        filterable
        placeholder="警告类型"
        size="mini"
        style="width: 150px; margin-right: 10px;"
        @visible-change="getType"
        @change="typeChange"
        :disabled="loading==true"
      >
        <el-option
          v-for="item in warnTypeOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>
      <el-checkbox v-model="warnChecked" @change="checkboxChange" :disabled="loading==true">已确认</el-checkbox>
      <!-- 时间选项 -->
      <div class="block" style>
        <el-date-picker
          v-model="value3"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd HH:mm:ss"
          @change="dateChange"
          :picker-options="pickerOptions"
          :disabled="loading==true"
          :clearable="false"
        ></el-date-picker>
      </div>
      <div class="edit-btn" style>
        <el-button
          class="confirm"
          icon="el-icon-upload2"
          size="small"
          :disabled="!Boolean(warnOptions.length) || exportLoading"
          v-loading="exportLoading"
          @click="exportFile"
        >导出事件</el-button>
      </div>
    </div>
    <div class="scroll warn-block">
      <div class="shadow" style>
        <el-table :data="warnOptions" style size="small" v-loading="loading">
          <!-- <el-table-column prop="id" label="告警ID" width="180"></el-table-column> -->
          <el-table-column prop="time" label="时间" width="210">
            <template slot-scope="scope">{{scope.row.time}}</template>
          </el-table-column>
          <el-table-column prop="name" label="事件" width="180"></el-table-column>
          <el-table-column prop="roomName" label="所属站点"></el-table-column>
          <el-table-column prop="equipmentName" label="所属设备"></el-table-column>
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
          <el-table-column prop="handleInfo" label="处理信息">
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
          <el-table-column label="详情" width="100">
            <template slot-scope="scope">
              <!-- <el-button @click="searchDetail(scope.row)" type="text" size="small">编辑</el-button> -->
              <el-tooltip class="item" effect="dark" offset="-20" content="编辑" placement="top-start">
                <el-button
                  icon="el-icon-edit"
                  class="confirm"
                  size="mini"
                  @click="searchDetail(scope.row)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="130">
            <template slot-scope="scope">
              <!-- <el-button
            v-if="scope.row.confirmStatus == 0"
            @click="affirm(scope.row)"
            type="text"
            size="small"
          >确认</el-button>
              <el-button v-else type="text" disabled size="small">已确认</el-button>-->
              <el-tooltip class="item" effect="dark" offset="-20" content="确认" placement="top-start">
                <el-button
                  v-if="scope.row.confirmStatus == 0"
                  class="confirm"
                  icon="el-icon-check"
                  size="mini"
                  @click="affirm(scope.row)"
                >
                  <!-- <i class="icon iconfont iconconfirm1"></i> -->
                </el-button>
              </el-tooltip>

              <!-- el-icon-finished  class="confirm" icon="el-icon-finished"-->
              <el-button v-if="scope.row.confirmStatus != 0" type="info" size="mini" disabled>已确认</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div style="height: 32px;">
          <div class="block">
            <el-pagination
              class="page-float"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 20, 50]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalWarn"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      class="warn-detail-dialog"
      :visible.sync="warnDetailVisible"
      title="告警详情"
      width="800px"
    >
      <div class="section">
        <p class="test-left">发生时间</p>
        <span class="test-right">{{searchWarnObject.time}}</span>
      </div>
      <div class="section">
        <p class="test-left">事件</p>
        <span class="test-right">{{searchWarnObject.name}}</span>
      </div>
      <div class="section">
        <p class="test-left">站点-设备</p>
        <span class="test-right">{{searchWarnObject.roomName}} - {{searchWarnObject.equipmentName}}</span>
      </div>
      <div class="section">
        <p class="test-left">告警级别</p>
        <span class="test-right" v-if="searchWarnObject.level == 1">一级</span>
        <span class="test-right" v-if="searchWarnObject.level == 2">二级</span>
        <span class="test-right" v-if="searchWarnObject.level == 3">三级</span>
        <span class="test-right" v-if="searchWarnObject.level == 4">四级</span>
        <span class="test-right" v-if="searchWarnObject.level == 5">五级</span>
      </div>
      <!-- 确认 -->
      <div
        class="section sec-block"
        v-if="searchWarnObject.confirmStatus == 1"
        style=" border-top: 1px solid #d5cdbf;"
      >
        <p class="test-left" style="position: absolute;">确认信息</p>
        <el-input
          type="textarea"
          disabled
          v-model.trim="searchWarnObject.confirmInfo"
          cols="40"
          rows="3"
          class="input-area"
          style
        ></el-input>
      </div>
      <div class="section">
        <p class="test-left">确认人</p>
        <span class="test-right">{{searchWarnObject.confirmUser}}</span>
      </div>
      <div class="section sec-block" style="border-top: 1px solid #ddd46b;">
        <p class="test-left" style="position: absolute;">处理信息</p>
        <el-input
          v-if="active == 3"
          disabled
          type="textarea"
          v-model.trim="searchWarnObject.handleInfo"
          cols="40"
          rows="3"
          class="input-area"
        ></el-input>
        <el-input
          v-else
          type="textarea"
          class="input-area"
          v-model.trim="searchWarnObject.handleInfo"
          cols="40"
          rows="3"
        ></el-input>
      </div>
      <div class="section" v-if="active > 1">
        <p class="test-left">处理人</p>
        <span class="test-right">{{searchWarnObject.handleUser}}</span>
      </div>
      <div class="section" v-if="active > 1">
        <p class="test-left">处理时间</p>
        <span class="test-right">{{searchWarnObject.handleTime}}</span>
        <!-- <span class="test-right">{{searchWarnObject.handleTime }}</span> -->
      </div>
      <div class="section">
        <span class="test-left">处理进度</span>
        <div class="test-right" style>
          <el-steps :active="searchWarnObject.handleStatus" finish-status="success">
            <el-step title="未处理"></el-step>
            <el-step title="处理中"></el-step>
            <el-step title="已处理"></el-step>
            <el-button size="mini" style="height: 30px; margin: 15px 0 0 30px;" @click="next">下一步</el-button>
          </el-steps>
        </div>

        <!-- <el-button style="margin-top: 12px;" @click="next">下一步</el-button> -->
      </div>
      <div class="submit" style>
        <el-button @click="handleWarn" class="confirm">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 确认框 -->
    <el-dialog
      :visible.sync="affirmVisible"
      width="400px"
      title="确认警告"
      custom-class="arrirm-bgc"
      style="backcoground-color: skyblue"
      modal
      modal-append-to-body
      :close-on-click-modal="false"
      :show-close="true"
      @close="clear_confirm"
    >
      <div style="padding: 6px;">
        <el-input
          type="textarea"
          name
          id
          v-model.trim="warnText"
          cols="45"
          rows="6"
          style="resize: vertical; background-color: #3b57664f;"
          placeholder="请输入确认信息"
        ></el-input>
      </div>
      <el-button
        style="background: rgba(245, 166, 35); border: none; color: #fff; margin-left: 124px;"
        @click="warnSubmit"
      >确 定</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { getFullDate } from "../../utils/index";
import MyBreadcrumb from "../subcomponents/Mybreadcrumb";
import GLOBAL from "../../utils/global_variable";
export default {
  components: {
    MyBreadcrumb
  },
  inject: ["reload"], //注入依赖
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return (
            time.getTime() > Date.now() || time.getTime() < new Date(2019, 9, 1)
          );
        }
      },
      currentPage: 1,
      totalWarn: 1,
      pageSize: 10,
      equipment: "", // 设备
      warnType: "", //告警类型
      warnHandle: 1, //告警处理
      warnChecked: false, //是否确认
      warnOptions: [],
      optionsEquip: [],
      warnTypeOptions: [],
      warnHandleOptions: [],
      value3: [], //事件段数组
      warnDetailVisible: false,
      affirmVisible: false,
      searchWarnObject: {},
      warnText: "", //确认的信息
      affirmId: "", //确认的id
      active: 1, //记录处理前的状态
      loading: false,
      exportLoading: false
    };
  },
  computed: {
    watchSiteChange() {
      return this.$store.state.site.siteId;
    },
    // 计算文本框的值
    watchmsgChange() {
      return this.searchWarnObject.handleInfo;
    }
  },
  watch: {
    watchSiteChange(newVal, oldVal) {
      // this.$router.go(0)
      // this.reload();
      this.searchAllWarn();
    },
    // 监控站点值变化，对设备选项和值清空处理
    site: function(old) {
      this.equipment = "";
      this.optionsEquip = [];
    },
    // 监听文本框的值
    watchmsgChange() {
      if (
        this.searchWarnObject.handleStatus == this.active &&
        this.active == 1 &&
        this.searchWarnObject.handleInfo
      ) {
        this.searchWarnObject.handleStatus++;
      }
    }
  },
  methods: {
    // ------------------分页大小改变----------------
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.searchAllWarn();
    },
    // ------------------当前页改变----------------------
    handleCurrentChange(val) {
      this.currentPage = val;
      this.searchAllWarn();
    },
    // 查询单个事件详情
    searchDetail(row) {
      this.$http
        .get("equipment/alarmEvent/findOne", {
          params: {
            id: row.id
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.searchWarnObject = res.data.data;
            this.searchWarnObject.handleStatus++;
            this.active = this.searchWarnObject.handleStatus;
          }
        });
      this.warnDetailVisible = true;
    },
    // 弹出确认框
    affirm(row) {
      this.affirmId = row.id;
      this.affirmVisible = true;
    },
    // --------------------查询初始化时间数据-------------
    searchAllWarn() {
      this.getEvent();
    },
    formatTime(date) {
      return  new Date(date.getTime() + 8 * 60 * 60 * 1000).toJSON().replace('T', ' ').replace('Z','').replace('.', ':')
    },
    // -------------------获取表格数据----------------------
    getEvent() {
      // 当前站点不存在，不发请求
      if (!this.$store.state.site.siteId) {
        return;
      }
      this.loading = true;
      // console.log(this.value3[0].toJSON().replace('T', ' '))
      var obj = {
        roomId: this.$store.state.site.siteId,
        confirmStatus: this.warnChecked ? 1 : 0,
        page: this.currentPage - 1,
        size: this.pageSize,
        begin: this.formatTime(this.value3[0]),
        end: this.formatTime(this.value3[1])
      };
      // 动态添加筛选条件
      if (this.equipment != "") {
        obj.equipmentId = this.equipment;
      }
      if (this.warnType != "") {
        obj.alarmType = this.warnType;
      }
      let timeout = setTimeout(() => {
        this.loading = false;
      }, 15000);
      this.$http
        .get("equipment/alarmEvent/findAll", {
          params: obj
        })
        .then(res => {
          this.loading = false;
          if (res.data.code == 0) {
            this.warnOptions = res.data.data.alarmEventVOS;
            this.totalWarn = res.data.data.total;
            // this.warnOptions = [
            //   {
            //     id: 10109,
            //     name: '1111',
            //     roomName: '2222',
            //   },
            //   {
            //     id: 10110,
            //     name: '3333',
            //     roomName: '4444',
            //   },
            //   {
            //     id: 10109,
            //     name: '1111',
            //     roomName: '2222',
            //   },
            //   {
            //     id: 10110,
            //     name: '3333',
            //     roomName: '4444',
            //   },
            // ]
            // 通过中央事件刷新布局页面刷新当前告警数量
            this.$root.Bus.$emit("freshTotalWarn");
          }
        })
        .catch(res => {
          this.loading = false;
        });
    },
    //---------------确认告警-----------------------
    warnSubmit() {
      this.$http
        .get("equipment/alarmEvent/confirm", {
          params: {
            id: this.affirmId,
            confirmInfo: this.warnText
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$notify({
              message: "告警确认成功！",
              type: "success"
            });
            this.affirmVisible = false;
            this.currentPage = 1;
            this.getEvent();
          }
        });
    },
    // -------------------------------时间段改变-------------
    dateChange() {
      this.currentPage = 1;
      this.getEvent();
    },
    // --------------------根据站点获取设备-----------------------
    getEquip(flag) {
      this.$http
        .get("/equipment/getEqByRoom", {
          params: {
            roomId: this.$store.state.site.siteId
          }
        })
        .then(res => {
          this.optionsEquip = res.data.data;
        });
    },
    // ------------------设备改变--------------------------
    equipChange() {
      this.currentPage = 1;
      this.getEvent();
    },
    // 获取告警类型
    getType(flag) {
      if (flag) {
        this.$http
          .get("equipment/alarm/alarmTypes", {
            params: {
              siteId: this.$store.state.site.siteId,
              page: 0,
              size: GLOBAL.max_page_size
            }
          })
          .then(res => {
            this.warnTypeOptions = res.data.data.alarmTypes;
          });
      }
    },
    // ---------------告警类型改变-------------------------
    typeChange() {
      this.currentPage = 1;
      this.getEvent();
    },
    // 确认状态改变
    checkboxChange(val) {
      this.currentPage = 1;
      this.getEvent();
    },
    // 进度处理
    next() {
      if (this.searchWarnObject.handleStatus++ > 2)
        this.searchWarnObject.handleStatus = 3;
    },
    // 处理告警
    handleWarn() {
      // 判断处理进度是否发生改变
      if (
        this.searchWarnObject.handleStatus != this.active ||
        (this.searchWarnObject.handleInfo &&
          this.searchWarnObject.handleStatus == 2)
      ) {
        // 提交处理进度前先判断确认状态是否为已确认
        if (this.searchWarnObject.confirmStatus == 0) {
          this.$notify({
            title: "提醒",
            message: "处理告警前请先确认告警！否组无法处理当前告警进度",
            type: "warning"
          });
          return;
        }
        this.$http
          .get("equipment/alarmEvent/handle", {
            params: {
              id: this.searchWarnObject.id,
              handleInfo: this.searchWarnObject.handleInfo,
              handleStatus: this.searchWarnObject.handleStatus - 1
            }
          })
          .then(res => {
            if (res.data.code == 0) {
              this.$notify({
                message: "操作成功",
                type: "success"
              });
              this.searchAllWarn();
              this.warnDetailVisible = false;
            }
          });
      } else {
        this.warnDetailVisible = false;
      }
    },
    clear_confirm() {
      this.warnText = null;
    },
    // 导出事件列表
    exportFile() {
      this.$notify({
        message: "开始导出"
      });
      this.exportLoading = true;
      let obj = {
        siteId: this.$store.state.site.siteId,
        begin: this.formatTime(this.value3[0]),
        end: this.formatTime(this.value3[1]),
        confirmStatus: this.warnChecked ? 1 : 0
      };
      // 动态添加筛选条件
      if (this.equipment != "") {
        obj.equipmentId = this.equipment;
      }
      if (this.warnType != "") {
        obj.alarmType = this.warnType;
      }
      this.$http({
        methods: "GET",
        url: "equipment/alarmEvent/exportExcel",
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
              message: "事件导出成功",
              type: 'success'
            });
            this.exportLoading = false;
          }, 1000);
        })
        .catch(err => {
          this.exportLoading = false;
        });
    }
  },
  created() {
    // 返回时间对象，需要格式话成字符串
    this.value3 = getFullDate(new Date());
    this.searchAllWarn();
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/css/index.less";
.event-warn {
  height: 100%;
  @dis-flex();
  @flex-c();
  .sel {
    .block {
      display: inline-block;
      margin-left: 20px;
      margin-right: 20px;
    }
    .edit-btn {
      float: right;
    }
  }
  .warn-block {
    width: 100%;
    margin-top: 8px;
    padding: 8px;
    background-color: rgb(67, 92, 112);
    box-sizing: border-box;
    @flex-1();
    height: 0;
    overflow-y: auto;
    .shadow {
      box-shadow: rgb(202, 198, 198) 0px 0px 4px;
      padding: 4px;
      .page-float {
        float: right;
      }
    }
  }
  // 弹窗
  .warn-detail-dialog {
    .sec-block {
      margin-top: 6px;
      border-top: 1px solid #d5cdbf;
      text-align: top;
      position: relative;
      padding-top: 6px;
    }
    .section {
      padding-left: 15px;
      font-size: 16px;
      .test-left {
        width: 140px;
        text-align: center;
        display: inline-block;
        padding: 6px;
      }
      .test-right {
        width: calc(100% - 167px);
        display: inline-block;
        /deep/ .el-step__title.is-process {
          color: skyblue;
        }
      }
      /deep/ .input-area {
        margin-left: 152px;
        resize: none;
        font-size: 16px;
        width: auto;
      }
    }
    .submit {
      border-top: 1px solid pink;
      padding-top: 6px;
      @dis-flex();
      @flex-pc();
    }
  }
}
</style>
