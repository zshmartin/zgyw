<template>
  <!-- 能源统计 -->
  <div class="energy-statistics" style="height: 100%;">
    <MyBreadcrumb level1="能源管理" level2="能源统计"></MyBreadcrumb>
    <div class="scroll layout-scroll" style>
      <div class="statistics-layout">
        <div class="statistics-left">
          <div class="select radiu-margin">
            <div class="filter" style>
              <div class="left-title" style>
                <span style>筛选条件</span>
              </div>
              <div class="label" style>
                <span>类别：</span>
                <el-radio-group v-model="energyType" size="mini">
                  <el-radio-button
                    v-for="(item,index) in energyTypeOptions"
                    :key="index"
                    :label="item.id"
                  >{{item.properties}}</el-radio-button>
                </el-radio-group>
              </div>
              <div class="label" style="margin-top: 10px;">
                <span>标签：</span>
                <el-radio-group v-model="type" size="mini">
                  <el-radio-button label="branch">支路</el-radio-button>
                  <el-radio-button label="department">部门</el-radio-button>
                </el-radio-group>
              </div>
              <div class="label" style="margin-top: 10px;">
                <span>支路：</span>
                <el-select v-model="branch" style="width: 200px;" size="mini">
                  <el-option
                    v-for="(item,index) in selectArr"
                    :key="index"
                    :value="item"
                    :label="item"
                  ></el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="total-statistics radiu-margin">
            <div class="left-title" style>
              <span style="color: white; padding-left: 10px;">本月用{{getEnergyType}}</span>
            </div>
            <div
              style="display: -webkit-flex; flex-direction: column; justify-content: center;align-items: center; height: calc(100% - 30px);"
            >
              <label
                class="value"
                style="color: rgba(39,182,205);font-size: 46px;padding-right: 10px;"
              >{{monthEnergy >= 100000000 ? (monthEnergy / 1000).toFixed(2) : monthEnergy}}</label>
              <label
                class="value"
                style="font-size: 20px;color: #fff;"
              >{{monthEnergy >= 100000000 ? 'mWh' : getEnergyUnit}}</label>
            </div>
          </div>
          <div class="top-statistics radiu-margin">
            <div class="left-title" style>
              <span style="color: white; padding-left: 10px;">今日用{{getEnergyType}}</span>
            </div>
            <div
              style="display: -webkit-flex; flex-direction: column; justify-content: center;align-items: center; height: calc(100% - 40px);"
            >
              <!--  #4aa9e5 原本的颜色-->
              <label
                class="value"
                style="color: rgba(39,182,205);font-size: 46px;padding-right: 10px;"
              >{{dayEnergy >= 100000000 ? (dayEnergy / 1000).toFixed(2) : dayEnergy}}</label>
              <label
                class="value"
                style="font-size: 20px;color: #fff;"
              >{{dayEnergy >= 100000000 ? 'mWh' : getEnergyUnit}}</label>
            </div>
          </div>
        </div>
        <div class="statistics-right">
          <div class="statistics-right-line">
            <div class="line radiu-margin">
              <div class="left-title">
                <span style>支路今日用能曲线图</span>
              </div>
              <div style="height: calc(100% - 30px)">
                <poly_line :dataObj="dataObj"></poly_line>
              </div>
            </div>
          </div>
          <div class="statistics-right-report">
            <div class="report radiu-margin">
              <div class="left-title" style>
                <span style>用能报表</span>
              </div>
              <div class="selectDiv">
                <el-radio-group v-model="timeSelect" size="mini">
                  <el-radio-button label="day">日</el-radio-button>
                  <el-radio-button label="month">月</el-radio-button>
                  <el-radio-button label="year">年</el-radio-button>
                </el-radio-group>
              </div>
              <div style="margin-bottom: 10px"></div>
              <div class="pole" style>
                <Pole :dataObj="obj" :legend="legend"></Pole>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script scoped>
import poly_line from "../subcomponents/polyline";
import MyBreadcrumb from "../subcomponents/Mybreadcrumb";
import Pole from "../subcomponents/pole";
import { formatEnergyData } from "../../utils/index";
export default {
  components: {
    poly_line,
    MyBreadcrumb,
    Pole //柱状图组件
  },
  props: [],
  data() {
    return {
      dataObj: {},
      type: "branch",
      energyType: "",
      energyTypeOptions: [],
      selectArr: [],
      branch: "",
      monthEnergy: "",
      dayEnergy: "",
      time: new Date(),
      timeSelect: null,
      tableData: [],
      historyData: [],
      table_data: {},
      obj: {},
      legend: ["今日", "昨日"],
      xNum: []
    };
  },
  computed: {
    watchSiteChange() {
      return this.$store.state.site.siteId;
    },
    // 获取显示类型
    getEnergyType() {
      if (this.energyTypeOptions.length === 0) {
        return "电";
      }
      var index = this.energyTypeOptions.findIndex(item => {
        return item.id === this.energyType;
      });
      return this.energyTypeOptions[index].properties.split("").pop();
    },
    // 获取显示单位
    getEnergyUnit() {
      if (this.energyTypeOptions.length === 0) {
        return "kWh";
      }
      var index = this.energyTypeOptions.findIndex(item => {
        return item.id === this.energyType;
      });
      return this.energyTypeOptions[index].unit;
    }
  },
  watch: {
    energyType(newValue, oldValue) {
      this.getSelectList();
    },
    type(newValue, oldValue) {
      this.getSelectList();
    },
    branch(newValue, oldValue) {
      // alert('branch')
      // return
      //
      // if(!newValue) {
      //   return
      // }
      this.getMonthEnergy();
      this.getDayEnergy();
      // this.getLineValue();
      this.getReportValue();
    },
    watchSiteChange(newValue, oldValue) {
      this.branch = null;
      this.getEnergyOptions_inSite();
      this.getSelectList();
      // this.getReportValue();
      // this.getHistoryValue();
      // this.getMonthEnergy();
      // this.getDayEnergy();
    },
    timeSelect(newValue, oldValue) {
      let arr = [];
      if (this.timeSelect === "day") {
        for (var i = 0; i < 24; i++) {
          arr.push(i < 10 ? "0" + i : i);
        }
        this.legend = ["今日", "昨日"];
      } else if (this.timeSelect === "month") {
        for (var i = 1; i < 32; i++) {
          arr.push(i < 10 ? "0" + i : i);
        }
        this.legend = ["本月", "上月"];
      } else {
        for (var i = 1; i < 13; i++) {
          arr.push(i < 10 ? "0" + i : i);
        }
        this.legend = ["今年", "去年"];
      }
      this.xNum = arr;
      this.getReportValue();
    }
  },
  methods: {
    // 获取站点的所有能源类型
    getEnergyOptions_inSite() {
      if (!this.$store.state.site.siteId) {
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
              // 初始化值
              this.dataObj = formatEnergyData(this.time, "day", []);
            }
          }
        });
    },
    // 获取站点下的所有能源部门或能源分支
    getSelectList() {
      // 清空当前数据，防止重复影响数据监听
      this.branch = null;
      this.selectArr = [];
      if (!this.energyType) {
        return;
      }
      if (this.type === "department") {
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
                this.branch = this.selectArr[0];
              }
            }
          });
      }
    },
    getMonthEnergy() {
      let year = this.time.getFullYear();
      let month =
        this.time.getMonth() + 1 < 10
          ? "0" + (this.time.getMonth() + 1)
          : this.time.getMonth() + 1;

      if (!this.branch) {
        this.monthEnergy = null;
        return;
      }
      this.$http
        .get("equipment/energyBranch/totalBranchEnergy", {
          params: {
            branch: this.branch,
            type: "month",
            tb: "month_" + year + month,
            property: this.energyType
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.monthEnergy = res.data.data;
          }
        });
    },
    getDayEnergy() {
      let year = this.time.getFullYear();
      let month =
        this.time.getMonth() + 1 < 10
          ? "0" + (this.time.getMonth() + 1)
          : this.time.getMonth() + 1;
      let day =
        this.time.getDate() < 10
          ? "0" + this.time.getDate()
          : this.time.getDate();
      if (!this.branch) {
        this.dayEnergy = null;
        return;
      }
      this.$http
        .get("equipment/energyBranch/totalBranchEnergy", {
          params: {
            branch: this.branch,
            type: "day",
            tb: "day_" + year + month + day,
            // tb: 'day_20200304',
            property: this.energyType
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.dayEnergy = res.data.data;
          }
        });
    },
    getReportValue() {
      // if(!this.branch){
      //   return
      // }
      let obj = {};
      if (this.timeSelect == "day") {
        let year = this.time.getFullYear();
        let month =
          this.time.getMonth() + 1 < 10
            ? "0" + (this.time.getMonth() + 1)
            : this.time.getMonth() + 1;
        let day =
          this.time.getDate() < 10
            ? "0" + this.time.getDate()
            : this.time.getDate();
        obj = {
          branch: this.branch,
          type: this.timeSelect,
          tb: "day_" + year + month + day
          // tb: 'day_20200304'
        };
      } else if (this.timeSelect == "month") {
        let year = this.time.getFullYear();
        let month =
          this.time.getMonth() + 1 < 10
            ? "0" + (this.time.getMonth() + 1)
            : this.time.getMonth() + 1;
        obj = {
          branch: this.branch,
          type: this.timeSelect,
          tb: "month_" + year + month
        };
      } else {
        let year = this.time.getFullYear();
        obj = {
          branch: this.branch,
          type: this.timeSelect,
          tb: "year_" + year
        };
      }
      obj.property = this.energyType;
      if (!this.branch) {
        this.tableData = formatEnergyData(this.time, this.timeSelect, []).arr;
        this.getHistoryValue();
        return;
      }
      this.$http
        .get("equipment/energyBranch/branchDataByDate", {
          params: obj
        })
        .then(res => {
          if (res.data.code == 0) {
            if (this.timeSelect == "day") {
              this.dataObj = formatEnergyData(
                this.time,
                "day",
                res.data.data.data
              );
              this.tableData = this.dataObj.arr;
            } else if (this.timeSelect == "month") {
              this.tableData = formatEnergyData(
                this.time,
                "month",
                res.data.data.data
              ).arr;
            } else {
              this.tableData = formatEnergyData(
                this.time,
                "year",
                res.data.data.data
              ).arr;
            }
            this.getHistoryValue();
          }
        });
    },
    getHistoryValue() {
      let obj = {};
      if (this.timeSelect == "day") {
        // var day1 = this.time
        // 前24小时的时间撮
        var day1 = new Date();
        day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000);
        let day = day1.getDate() < 10 ? "0" + day1.getDate() : day1.getDate();
        let month =
          day1.getMonth() < 9
            ? "0" + (day1.getMonth() + 1)
            : day1.getMonth() + 1;
        let year = day1.getFullYear();
        obj = {
          branch: this.branch,
          type: "day",
          tb: "day_" + year + month + day
          // tb: 'day_20200303'
        };
      } else if (this.timeSelect == "month") {
        let month = this.time.getMonth();
        let year;
        if (month == 0) {
          month = 12;
          year = this.time.getFullYear() - 1;
        } else {
          month = month < 10 ? "0" + month : month;
          year = this.time.getFullYear();
        }
        obj = {
          branch: this.branch,
          type: "month",
          tb: "month_" + year + month
        };
      } else {
        let year = this.time.getFullYear() - 1;
        obj = {
          branch: this.branch,
          type: "year",
          tb: "year_" + year
        };
      }
      obj.property = this.energyType;
      if (!this.branch) {
        this.historyData = formatEnergyData(this.time, this.timeSelect, []).arr;
        this.obj = {
          series: [
            {
              data: this.tableData
            },
            {
              data: this.historyData
            }
          ],
          xNum: this.xNum
        };
        return;
      }
      // return
      this.$http
        .get("equipment/energyBranch/branchDataByDate", {
          params: obj
        })
        .then(res => {
          if (res.data.code == 0) {
            this.historyData = formatEnergyData(
              this.time,
              this.timeSelect,
              res.data.data.data
            ).arr;
            this.obj = {
              series: [
                {
                  data: this.tableData
                },
                {
                  data: this.historyData
                }
              ],
              xNum: this.xNum
            };
            // let obj = {};
            // obj.name =
            //   this.timeSelect === "day"
            //     ? ["今日", "昨日"]
            //     : this.timeSelect === "month"
            //     ? ["本月", "上月"]
            //     : ["今年", "去年"];
            // obj.series = [];
            // obj.series[0] = this.dataObj.arr;
            // obj.series[1] = this.historyData;
            // obj.tableHead = this.dataObj.arrX;
            // // this.table_data = obj;
            // this.table_data = {
            //   name: [1, 2],
            //   series: {
            //     data: [1, 3, 4]
            //   },
            //   tableHead: [1, 2, 3]
            // };
          }
        });
    }
  },
  created() {
    this.timeSelect = "day";
    this.getEnergyOptions_inSite();
    this.getReportValue();
    this.getHistoryValue();
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/css/index.less";

.energy-statistics {
  height: 100%;
  .layout-scroll {
    height: calc(100% - 62px);
    overflow: auto;
    .statistics-layout {
      min-height: 500px;
      height: 100%;
      width: 100%;
      display: -webkit-flex;
      /* 左边 */
      .statistics-left {
        width: 300px;
        height: 100%;
        // 标题背景色--公用
        .left-title {
          height: 30px;
          background-color: @board-title;
          display: -webkit-flex;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
          border-bottom: 1px solid #ccc;
        }
        /* 边角下边距 */
        .radiu-margin {
          border-radius: 6px;
          box-sizing: border-box;
          margin: 1px;
        }
        & > .select {
          height: 180px;
          background-color: @table-bgc;
          margin-bottom: 10px;
          box-shadow: 0 0 4px #cac6c6;
          .filter {
            color: #ccc;
            .left-title {
              margin-bottom: 20px;
              span {
                color: white;
                padding-left: 10px;
              }
            }
            .label {
              margin-left: 15px;
              .el-select {
                margin-left: 6px;
              }
            }
            /* 用能报表的日月年组件往内缩进6px */
            & /deep/ .el-radio-group {
              padding-left: 6px;
            }
          }
        }
        // 本月用电
        .total-statistics {
          height: 35%;
          background-color: @table-bgc;
          margin-bottom: 10px;
          box-shadow: 0 0 4px #cac6c6;
        }
        // 今日用电
        .top-statistics {
          height: calc(65% - 204px);
          background-color: @table-bgc;
          margin-bottom: none;
          box-shadow: 0 0 4px #cac6c6;
        }
      }
      .statistics-right {
        flex: 1;
        height: 100%;
        overflow: hidden;
        width: 60%;
        box-shadow: 0px 13px 8px -15px #cac6c6;
        .left-title {
          height: 30px;
          background-color: @board-title;
          display: -webkit-flex;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
          border-bottom: 1px solid #ccc;
        }
        /* 边角下边距 */
        .radiu-margin {
          border-radius: 6px;
          box-sizing: border-box;
          margin: 1px;
        }
        // 曲线图
        .statistics-right-line {
          flex: 1;
          height: calc(50%);
          overflow: hidden;
          margin: 0.5px 0px 10px 12px;
          box-shadow: 0 0 4px #cac6c6;
          .line {
            height: calc(100%);
            background-color: @table-bgc;
            box-shadow: 0 0 4px #cac6c6;
            .left-title {
              span {
                color: white;
                padding-left: 10px;
              }
            }
          }
        }
        // 柱状图
        .statistics-right-report {
          height: calc(50% - 12px);
          overflow: hidden;
          margin: 0.5px 0px 0px 12px;
          box-shadow: 0 0 4px #cac6c6;
          .report {
            height: calc(100%);
            margin-bottom: none;
            background-color: @table-bgc;
            box-shadow: 0 0 4px #cac6c6;
            .left-title {
              margin-bottom: 10px;
              span {
                color: white;
                padding-left: 10px;
              }
            }
            .selectDiv {
              margin-left: 8px;
            }
            .pole {
              height: calc(100% - 69px);
            }
          }
        }
      }
    }
  }
}
</style>