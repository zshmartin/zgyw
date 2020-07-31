<template>
  <!-- 同比分析 -->
  <div class="analysis">
    <MyBreadcrumb level1="能源管理" level2="同比分析"></MyBreadcrumb>
    <div class="analysis-content" style>
      <div class="analysis-layout">
        <div class="layout-left">
          <div class="filter">
            <div class="label" style="padding-top: 15px;">
              <span>类别：</span>
              <el-radio-group v-model="energyType" size="medium">
                <el-radio-button
                  v-for="(item,index) in energyTypeOptions"
                  :key="index"
                  :label="item.id"
                >{{item.properties}}</el-radio-button>
              </el-radio-group>
            </div>
            <div class="label">
              <span>标签：</span>
              <el-radio-group
                v-model="type"
                size="medium"
                @change="typeChange"
                style="display: inline-block;"
              >
                <el-radio-button label="branch">支路</el-radio-button>
                <el-radio-button label="department">部门</el-radio-button>
              </el-radio-group>
            </div>

            <!-- 月 -->
            <div class="label" style="padding-top: 8px;">
              <span>日期：</span>
              <!-- 日期选择器  -->
              <div style="display: inline-block;">
                <!-- 年 -->
                <div class="date">
                  <el-date-picker
                    v-model="monthSelect"
                    align="right"
                    type="year"
                    placeholder="选择年"
                    :picker-options="pickerOptions_year"
                    :clearable="Boolean(false)"
                    size="mini"
                  ></el-date-picker>
                </div>
              </div>
            </div>
          </div>

          <div class="select">
            <div class="list">
              <div
                v-for="(item,index) in selectArr"
                :key="index"
                :class="{hover: index === mouseHover, 'selected': index === mouseClick}"
                @click="selectClick(index)"
                @mouseover="selectOn(index)"
                @mouseleave="selectLeave"
              >
                <span></span>
                <i class="el-icon-location"></i>
                <span>{{item}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="layout-right">
          <div class="right-top">
            <div class="pole">
              <pole :legend="legend" :dataObj="dataObj"></pole>
            </div>
          </div>
          <div class="right-bottom">
            <div class="list-show">
              <!-- 用于固定定位表格第一列 -->
              <table class="imagetable-fixed" style>
                <tr style>
                  <th style="padding: 4px 40px; ">名称</th>
                </tr>
                <tr v-for="(item,index) in dataObj.series" :key="index">
                  <td>{{index == 0 ? monthSelect.getFullYear() + '年' : monthSelect.getFullYear() -1 + '年'}}</td>
                </tr>
              </table>
              <table class="imagetable">
                <tr style>
                  <th class="th-h-w" style="">名称</th>
                  <th
                    v-for="(item,index) in dataObj.xNum"
                    :key="index"
                  >{{item + (timeSelect=='day' ? '时' : timeSelect == 'month' ? '日' : '月')}}</th>
                  <th>合计</th>
                </tr>
                <tr v-for="(item,index) in dataObj.series" :key="index">
                  <td>{{index == 0 ? monthSelect.getFullYear() + '年' : monthSelect.getFullYear() -1 + '年'}}</td>
                  <td
                    v-for="(item1,index) in item.data"
                    :key="index"
                  >{{item1 || item1 === 0 ? item1 : '-'}}</td>
                  <td>{{rowTotal(index) || rowTotal(index) === 0 ? rowTotal(index) : '-'}}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import pole from "../subcomponents/pole";
import { formatPoleData } from "../../utils/index";
import MyBreadcrumb from "../subcomponents/Mybreadcrumb";
export default {
  components: {
    pole,
    MyBreadcrumb
  },
  props: [],
  data() {
    return {
      pickerOptions_year: {
        disabledDate(time) {
          return (
            time.getTime() > Date.now() || time.getTime() < new Date(2019, 9, 1)
          );
        }
      },
      legend: ["今年", "去年"],
      timeSelect: "year",
      hourSelect: new Date(),
      daySelect: new Date(),
      monthSelect: new Date(),
      type: "branch",
      energyType: "",
      energyTypeOptions: [],
      selectArr: [],
      mouseClick: "",
      mouseHover: "",
      dataObj: {},
      dataTem: "", //暂时存储要穿给子组件的值
      tableObj: {
        tableHead: [1, 3, 5],
        series: [2, 4, 6]
      } //表格数据
    };
  },
  computed: {
    watchSiteChange() {
      return this.$store.state.site.siteId;
    }
  },
  watch: {
    // energyType: {
    //   handler(newValue) {
    //     // 类别发生变化，刷新数据
    //     // 清空选项
    //     this.selectArr = [];
    //     // 清空图表
    //     // this.dataObj = {};
    //     console.log(1)
    //     this.getSelectList();
    //   }
    // },
    type: {
      handler() {
        // console.log(1)
        this.getSelectList();
      }
    },
    timeSelect: {
      handler() {
        // console.log(1)
        this.getEnergyTrend();
      }
    },
    hourSelect: {
      handler() {
        this.getEnergyTrend();
      }
    },
    daySelect: {
      handler() {
        this.getEnergyTrend();
      }
    },
    monthSelect: {
      handler() {
        this.getEnergyTrend();
      }
    },
    watchSiteChange(newVal, oldVal) {
      this.getEnergyOptions_inSite();
    }
  },
  mounted() {
    this.getEnergyOptions_inSite();
  },
  methods: {
    typeChange() {
      this.getEnergyTrend();
    },
    // 获取站点的所有能源类型
    getEnergyOptions_inSite() {
      if (!this.$store.state.site.siteId) {
        // this.getEnergyTrend();
        this.getSelectList()
        return;
      }
      this.$http
        .get("equipment/energyBranch/getAllType", {
          params: {
            siteId: this.$store.state.site.siteId
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.energyTypeOptions = res.data.data;
            if (this.energyTypeOptions.length > 0) {
              this.energyType = this.energyTypeOptions[0].id;
            } else {
              this.energyType = null;
            }
            this.getSelectList()
          }
        });
    },
    // 鼠标点击
    selectClick(index) {
      this.mouseClick = index;
      this.getEnergyTrend();
      // this.rowStyle()
    },
    // 获取站点下的所有能源部门或能源分支
    getSelectList() {
      if (!this.energyType) {
        // this.dataObj = {
        //   series: [
        //     {
        //       data: [
        //         null,
        //         null,
        //         null,
        //         null,
        //         null,
        //         null,
        //         null,
        //         null,
        //         null,
        //         null,
        //         null,
        //         null
        //       ]
        //     },
        //     {
        //       data: [
        //         null,
        //         null,
        //         null,
        //         null,
        //         null,
        //         null,
        //         null,
        //         null,
        //         null,
        //         null,
        //         null,
        //         null
        //       ]
        //     }
        //   ],
        //   trans: 1,
        //   xNum: [
        //     "01",
        //     "02",
        //     "03",
        //     "04",
        //     "05",
        //     "06",
        //     "07",
        //     "08",
        //     "09",
        //     "10",
        //     "11",
        //     "12"
        //   ]
        // };
        this.selectArr = []
        this.mouseClick = null;
        this.getEnergyTrend()
        return;
      }
      if (this.type === "department") {
        this.$http
          .get("equipment/energyBranch/getAllDepartment", {
            params: {
              siteId: this.$store.state.site.siteId,
              energyType: this.energyType
            }
          })
          .then(res => {
            if (res.data.code === 0) {
              this.selectArr = res.data.data;
              if (this.selectArr.length > 0) {
                this.mouseClick = 0;
                this.getEnergyTrend();
              }
            }
          });
      } else {
        this.$http
          .get("equipment/energyBranch/getAllBranch", {
            params: {
              siteId: this.$store.state.site.siteId,
              energyType: this.energyType
            }
          })
          .then(res => {
            if (res.data.code === 0) {
              this.selectArr = res.data.data;
              if (this.selectArr.length > 0) {
                this.mouseClick = 0;
                this.getEnergyTrend();
              }
            }
          });
      }
    },
    // 鼠标移入
    selectOn(index) {
      this.mouseHover = index;
    },
    // 鼠标移出
    selectLeave() {
      this.mouseHover = null;
    },
    // 获取用能趋势
    getEnergyTrend() {
      var tb = "";
      var year;
      // 此处只显示年报表
      if (this.timeSelect == "day") {
        var year = this.hourSelect.getFullYear();
        var month =
          this.hourSelect.getMonth() > 8
            ? this.hourSelect.getMonth() + 1
            : "0" + (this.hourSelect.getMonth() + 1);
        var day =
          this.hourSelect.getDate() > 9
            ? this.hourSelect.getDate()
            : "0" + this.hourSelect.getDate();
        tb = "day_" + year + month + day;
      } else if (this.timeSelect == "month") {
        var year = this.daySelect.getFullYear();
        var month =
          this.daySelect.getMonth() > 8
            ? this.daySelect.getMonth() + 1
            : "0" + (this.daySelect.getMonth() + 1);
        // var day = this.daySelect.getDate() > 9 ? this.daySelect.getDate() : ('0' + this.daySelect.getDate())
        tb = "month_" + year + month;
      } else if (this.timeSelect == "year") {
        year = this.monthSelect.getFullYear();
        // var month = this.daySelect.getMonth() > 8 ? this.daySelect.getMonth() + 1 : ('0' + (this.daySelect.getMonth() + 1))
        // var day = this.daySelect.getDate() > 9 ? this.daySelect.getDate() : ('0' + this.daySelect.getDate())
        tb = "year_" + year;
      }
      // 未存在当前站点时的数据显示
      if (!this.$store.state.site.siteId || this.selectArr.length === 0) {
        this.dataObj = {
          series: [
            {
              data: [
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null
              ]
            },
            {
              data: [
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null
              ]
            }
          ],
          trans: 1,
          xNum: [
            "01",
            "02",
            "03",
            "04",
            "05",
            "06",
            "07",
            "08",
            "09",
            "10",
            "11",
            "12"
          ]
        };
        return;
      }
      // 2019之前的数据不存在
      if (year < 2019) {
        this.dataTem = formatPoleData(this.monthSelect, this.timeSelect, []);
        this.getHistoryEnergyTrend();
        return;
      }
      if (this.type == "department") {
        this.$http
          .get("equipment/energyBranch/departmentDataByDate", {
            params: {
              siteId: this.$store.state.site.siteId,
              type: this.timeSelect,
              tb: tb,
              department: this.selectArr[this.mouseClick],
              property: this.energyType
            }
          })
          .then(res => {
            if (res.data.code === 0) {
              this.dataTem = formatPoleData(
                this.monthSelect,
                this.timeSelect,
                res.data.data
              );
              this.getHistoryEnergyTrend();
            }
          });
      } else {
        this.$http
          .get("equipment/energyBranch/branchDataByDate", {
            params: {
              branch: this.selectArr[this.mouseClick],
              type: this.timeSelect,
              tb: tb,
              property: this.energyType
            }
          })
          .then(res => {
            if (res.data.code === 0) {
              this.dataTem = formatPoleData(
                this.monthSelect,
                this.timeSelect,
                res.data.data.data
              );
              this.getHistoryEnergyTrend();
            }
          });
      }
    },
    // -------------获取-----------------------历史---用能趋势
    getHistoryEnergyTrend() {
      var tb = "";
      var year;
      if (this.timeSelect == "day") {
        var year = this.hourSelect.getFullYear();
        var month =
          this.hourSelect.getMonth() > 8
            ? this.hourSelect.getMonth() + 1
            : "0" + (this.hourSelect.getMonth() + 1);
        var day =
          this.hourSelect.getDate() > 9
            ? this.hourSelect.getDate()
            : "0" + this.hourSelect.getDate();
        tb = "day_" + year + month + day;
      } else if (this.timeSelect == "month") {
        var year = this.daySelect.getFullYear();
        var month =
          this.daySelect.getMonth() > 8
            ? this.daySelect.getMonth() + 1
            : "0" + (this.daySelect.getMonth() + 1);
        // var day = this.daySelect.getDate() > 9 ? this.daySelect.getDate() : ('0' + this.daySelect.getDate())
        tb = "month_" + year + month;
      } else if (this.timeSelect == "year") {
        // 去年
        year = this.monthSelect.getFullYear() - 1;
        // var month = this.daySelect.getMonth() > 8 ? this.daySelect.getMonth() + 1 : ('0' + (this.daySelect.getMonth() + 1))
        // var day = this.daySelect.getDate() > 9 ? this.daySelect.getDate() : ('0' + this.daySelect.getDate())
        tb = "year_" + year;
      }
      if (year < 2019) {
        this.dataTem.series.push({
          data: [
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null
          ]
        });
        this.dataObj = this.dataTem;
        return;
      }
      if (this.type == "department") {
        this.$http
          .get("equipment/energyBranch/departmentDataByDate", {
            params: {
              siteId: this.$store.state.site.siteId,
              type: this.timeSelect,
              tb: tb,
              department: this.selectArr[this.mouseClick],
              property: this.energyType
            }
          })
          .then(res => {
            if (res.data.code === 0) {
              var a = formatPoleData(
                this.monthSelect,
                this.timeSelect,
                res.data.data
              );
              this.dataTem.series.push({
                data: a.series[0].data
              });
              this.dataObj = this.dataTem;
            }
          });
      } else {
        this.$http
          .get("equipment/energyBranch/branchDataByDate", {
            params: {
              branch: this.selectArr[this.mouseClick],
              type: this.timeSelect,
              tb: tb,
              property: this.energyType
            }
          })
          .then(res => {
            if (res.data.code === 0) {
              var a = formatPoleData(
                this.monthSelect,
                this.timeSelect,
                res.data.data
              );
              this.dataTem.series.push({
                data: a.series[0].data
              });
              // 模拟数据
              // this.dataObj = {
              //   series: [
              //     {
              //       data: [1,3,5,2,5,7,5,4,3,5,8,5]
              //     }, {
              //       data: [6,4,1,9,6,3,7,32,2,8,4,4]
              //     }
              //   ],
              //   trans: 1,
              //   xNum: [1,2,3,4,5,6,7,8,9,10,11,12]
              // }
              this.dataObj = this.dataTem;
            }
          });
      }
    },
    rowTotal(index) {
      return this.dataObj.series[index].data.reduce((first, second) => {
        if (second || second === 0) {
          return first + second;
        }
      }, null);
    }
  }
};
</script>

<style lang='less' scoped>
@import "../../assets/css/index.less";

.analysis {
  height: 100%;
  .analysis-content {
    height: calc(100% - 62px);
    overflow: auto;
    .analysis-layout {
      height: 100%;
      min-height: 500px;
      display: -webkit-flex;
      width: 100%;
      .layout-left {
        background-color: @table-bgc;
        height: calc(100%- 2px);
        border-radius: 6px;
        width: 300px;
        box-shadow: 0 0 4px #cac6c6;
        border-radius: 6px;
        margin: 1px;
        margin-right: 11px;
        .filter {
          height: 140px;
          border-bottom: 1px solid #ccc;
          margin-bottom: 8px;
          width: 288px;
          margin-left: 5px;
          .label {
            color: #ccc;
            /deep/ .el-radio-button__inner {
              padding: 5px 8px;
              margin-top: 8px;
            }
            /deep/ .el-input--suffix {
              width: 200px;
            }
          }
          // 列表
        }
        .select {
          height: calc(100% - 149px);
          color: #fff;
          .list {
            height: calc(100% - 30px);
            overflow: auto;
            margin-left: 5px;
            margin-right: 6px;
            div {
              margin: 0 0 5px 0;
            }
            .hover {
              background-color: rgba(39, 182, 205);
              cursor: pointer;
            }
            .selected {
              background-color: @radio-bgc;
              color: #fff;
            }
          }
        }
      }
      .layout-right {
        flex: 1;
        background-color: @table-bgc;
        height: calc(100% - 2px);
        border-radius: 6px;
        /* 用于解决el-table不会自适应宽度的bug */
        overflow: hidden;
        box-shadow: 0 0 4px #cac6c6;
        margin: 1px;
        .right-top {
          height: 50%;
          .pole {
            // height: calc(100% - 20px);
            height: 100%;
          }
        }
        .right-bottom {
          height: 50%;
          width: 100%;
          /* overflow: scroll; */
          max-height: calc(100% - 260px);
          padding: 0 6px 0px 6px;
          box-sizing: border-box;
          position: relative;
          .list-show {
            width: 100%;
            box-sizing: border-box;
            text-align: center;
            overflow: auto;
            /* 表格样式 */
            table.imagetable,
            table.imagetable-fixed {
              overflow-x: scroll;
              width: 100%;
              font-family: verdana, arial, sans-serif;
              font-size: 15px;
              color: #fff;
              border-width: 1px;
              border-collapse: collapse;
              th {
                border-width: 1px;
                padding: 4px;
                min-width: 50px;
                border-style: solid;
                border-color: #ccc;
                background-color: @table-th-bgc;
              }
              td {
                border-width: 1px;
                padding: 8px;
                min-width: 20px;
                border-style: solid;
                border-color: #ccc;
                background-color: @table-bgc;
              }
            }
            // 固定的表头
            table.imagetable-fixed {
              width: 131px;
              position: absolute;
              left: 6px;
              top: 0;
              box-shadow: 5px 0 3px -1px #aaa;
            }
            table.imagetable {
              .th-h-w {
                padding: 0 40px; width: 50px;
              }
            }
          }
        }
      }
    }
  }
}
</style>