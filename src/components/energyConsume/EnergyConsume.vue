<template>
  <!-- 总能耗 -->
  <div class="energy-consume">
    <MyBreadcrumb level1="能源管理" level2="总耗能"></MyBreadcrumb>
    <div style class="scroll content">
      <div class="content-layout">
        <div class="consume-left">
          <div class="select radiu-margin" style>
            <div class="left-title">
              <span style>筛选条件</span>
            </div>
            <div class="contentOne">
              <!-- 筛选条件中类型 -->
              <div class="select type" style>
                <span>类型：</span>
                <el-radio-group v-model="timeSelect" size="mini">
                  <el-radio-button label="day">日</el-radio-button>
                  <el-radio-button label="month">月</el-radio-button>
                  <el-radio-button label="year">年</el-radio-button>
                </el-radio-group>
              </div>

              <!-- 筛选条件中的日期 -->
              <div class="select date">
                <div class="label" style>日期：</div>
                <div class="date" v-show="timeSelect=='day'">
                  <el-date-picker
                    v-model="hourSelect"
                    :picker-options="pickerOptions_day"
                    align="right"
                    type="date"
                    placeholder="选择日期"
                    :clearable="Boolean(false)"
                    style="margin-left: 2px; width: 200px;"
                    size="mini"
                  ></el-date-picker>
                </div>
                <div class="date" v-show="timeSelect=='month'">
                  <el-date-picker
                    v-model="daySelect"
                    :picker-options="pickerOptions_month"
                    type="month"
                    placeholder="选择月"
                    format="yyyy-MM"
                    :clearable="Boolean(false)"
                    style="margin-left: 2px; width: 200px;"
                    size="mini"
                  ></el-date-picker>
                </div>
                <div class="date" v-show="timeSelect=='year'">
                  <el-date-picker
                    v-model="monthSelect"
                    :picker-options="pickerOptions_year"
                    align="right"
                    type="year"
                    placeholder="选择年"
                    :clearable="Boolean(false)"
                    style="margin-left: 2px; width: 200px;"
                    size="mini"
                  ></el-date-picker>
                </div>
              </div>
            </div>
          </div>
          <div class="total-consume radiu-margin">
            <div class="left-title" style>
              <span style>总耗能</span>
            </div>
            <div class="value-layout" style>
              <!-- <div class="labelData"> -->
              <!-- 数字颜色color: #4aa9e5 -->
              <label class="value" style>
                {{totalEnergy}}
                <label style>吨标准煤</label>
                <!-- 字体颜色 -->
              </label>
            </div>
          </div>
          <div class="top-consume scroll radiu-margin">
            <div class="left-title" style>
              <span style>各能源占比</span>
            </div>
            <div class="pie" style>
              <Pie :dataArr="dataArr" :titleArr="titleArr"></Pie>
            </div>
          </div>
        </div>
        <!-- 右边菜单 -->
        <div class="consume-right">
          <!-- 用能曲线图 -->
          <div class="consume-right-line" style>
            <div class="line radiu-margin">
              <div class="left-title">
                <span style>用能曲线图</span>
              </div>
              <div class="poly-line" style>
                <poly_line :dataObj="dataObj"></poly_line>
              </div>
            </div>
            <!-- <div style="height: 6px;width: 1500px;"></div> -->
          </div>
          <!-- 用能报表 -->
          <div class="consume-right-report" style>
            <div class="report radiu-margin">
              <div class="left-title">
                <span style>各能源同比/环比</span>
              </div>
              <div class="scroll table" style>
                <el-table :data="compareArr" style="width: 100%">
                  <el-table-column prop="property" label="能源类型"></el-table-column>
                  <el-table-column prop="name" label="能源用途">
                    <span>用能</span>
                  </el-table-column>
                  <el-table-column prop="energyValue" label="能源量">
                    <template slot-scope="scope">{{scope.row.energyValue}} {{scope.row.unit}}</template>
                  </el-table-column>
                  <el-table-column prop="result" label="能源量（吨标准煤）" width="150"></el-table-column>
                  <el-table-column prop="energyValueByYear" label="同比（吨标准煤）" width="150">
                    <template slot-scope="scope">
                      {{formatCompareValue(scope.row)}}
                    </template>
                  </el-table-column>
                  <el-table-column prop="energyValueByChain" label="环比（吨标准煤）" width="150">
                    <template slot-scope="scope">
                      {{formatChainValue(scope.row)}}
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- </div> -->
    </div>
  </div>
</template>

<script>
import poly_line from "../subcomponents/polyline";
import MyBreadcrumb from "../subcomponents/Mybreadcrumb";
import Pie from "../subcomponents/pie";
import {
  formatEnergyData,
  getTimeArr,
  formatEnergyFilt
} from "../../utils/index";
export default {
  components: {
    poly_line,
    MyBreadcrumb,
    Pie
  },
  props: [],
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
      dataObj: {},
      tableData: [],
      // 本月设备用电量top10数据
      electricityData: [],
      // 时间的数值
      timeSelect: "day",
      hourSelect: new Date(),
      daySelect: new Date(),
      monthSelect: new Date(),
      // 总能耗
      totalEnergy: "",
      loading: "false",
      arr: [],
      historyData: [],
      dataArr: [], //饼状图数据集合
      titleArr: [], //饼状图标题集合
      compareArr: [] //同比环比数据
    };
  },
  computed: {
    watchSiteChange() {
      return this.$store.state.site.siteId;
    }
  },
  watch: {
    timeSelect(newVal, oldVal) {
      this.timeSelect = newVal;
      // 保证时间数据最新
      if (this.timeSelect == "day") {
        this.hourSelect = new Date();
      } else if (this.timeSelect == "month") {
        this.daySelect = new Date();
      } else {
        this.monthSelect = new Date();
      }
      // this.getTotalEnergy();
      // this.getLineValue();
    },
    hourSelect() {
      this.getTotalEnergy();
      this.getLineValue();
      this.getTopValue();
      this.getEnergyData();
    },
    daySelect() {
      this.getTotalEnergy();
      this.getLineValue();
      this.getTopValue();
      this.getEnergyData();
    },
    monthSelect() {
      this.getTotalEnergy();
      this.getLineValue();
      this.getTopValue();
      this.getEnergyData();
    },
    watchSiteChange(newVal, oldVal) {
      this.getTotalEnergy();
      this.getLineValue();
      this.getTopValue();
      this.getEnergyData();
    }
  },
  mounted() {
    if (!this.$store.state.site.siteId) {
      this.getLineValue();
    }
  },
  methods: {
    // 环比比求值并返回，格式：xx.xx(xx%)
    formatChainValue(data) {
      var valueA,valueB
      valueA = parseFloat(data.result)
      valueB = parseFloat(data.energyValueByChain)
      if(valueA && valueB) {
        console.log(valueA,valueB)
        var result = (valueA - valueB) / valueB * 100
        result = Math.round(result * 100) / 100       //处理四舍五入
        return valueB +  ' (' + result.toFixed(2) + '%)'      //保留两位小数点
      }else {
        return data.energyValueByChain
      }
    },
    // 同比求值并返回， 格式：xx.xx(xx%)
    formatCompareValue(data) {
      var valueA,valueB
      valueA = parseFloat(data.result)
      valueB = parseFloat(data.energyValueByYear)
      if(valueA && valueB) {
        console.log(valueA,valueB)
        var result = (valueA - valueB) / valueB * 100
        result = Math.round(result * 100) / 100       //处理四舍五入
        return valueB + ' (' +  result.toFixed(2) + '%)'      //保留两位小数点
      }else {
        return data.energyValueByYear
      }
    },
    getTotalEnergy: function() {
      this.totalEnergy = null;
      if (!this.$store.state.site.siteId) {
        return;
      }
      this.loading = true;
      if (this.timeSelect == "day") {
        let year = this.hourSelect.getFullYear();
        let month =
          this.hourSelect.getMonth() + 1 < 10
            ? "0" + (this.hourSelect.getMonth() + 1)
            : this.hourSelect.getMonth() + 1;
        let day =
          this.hourSelect.getDate() < 10
            ? "0" + this.hourSelect.getDate()
            : this.hourSelect.getDate();
        let obj = {
          tb: this.timeSelect + "_" + year + month + day,
          // tb: this.timeSelect + "_" + '20200304' ,
          siteId: this.$store.state.site.siteId,
          type: this.timeSelect
        };
        this.$http
          .get("equipment/energyBranch/totalEnergy", {
            params: obj
          })
          .then(res => {
            // 让小数点保留两位四舍五入
            this.totalEnergy =
              // res.data.data == 0 ? 0 : parseFloat(res.data.data).toFixed(2);
              res.data.data.totalEnergy;
          });
      } else if (this.timeSelect == "month") {
        let year = this.daySelect.getFullYear();
        let month =
          this.daySelect.getMonth() + 1 < 10
            ? "0" + (this.daySelect.getMonth() + 1)
            : this.daySelect.getMonth() + 1;
        let obj = {
          tb: this.timeSelect + "_" + year + month,
          siteId: this.$store.state.site.siteId,
          type: this.timeSelect
        };
        this.$http
          .get("equipment/energyBranch/totalEnergy", {
            params: obj
          })
          .then(res => {
            this.totalEnergy = res.data.data.totalEnergy;
          });
      } else if (this.timeSelect == "year") {
        let year = this.monthSelect.getFullYear();
        let obj = {
          tb: this.timeSelect + "_" + year,
          siteId: this.$store.state.site.siteId,
          type: this.timeSelect
        };
        this.$http
          .get("equipment/energyBranch/totalEnergy", {
            params: obj
          })
          .then(res => {
            if (res.data.code == 0) {
              this.totalEnergy = res.data.data.totalEnergy;
            }
          });
      }
    },
    // 获取用量值及计算比例
    getTopValue() {
      this.dataArr = [];
      if (!this.$store.state.site.siteId) {
        return;
      }
      let obj = {};
      if (this.timeSelect == "day") {
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
          type: this.timeSelect,
          tb: "day_" + year + month + day
          // tb: "day_20200304"
        };
      } else if (this.timeSelect == "month") {
        let year = this.daySelect.getFullYear();
        let month =
          this.daySelect.getMonth() + 1 < 10
            ? "0" + (this.daySelect.getMonth() + 1)
            : this.daySelect.getMonth() + 1;
        obj = {
          type: this.timeSelect,
          tb: "month_" + year + month
        };
      } else {
        let year = this.monthSelect.getFullYear();
        obj = {
          type: this.timeSelect,
          tb: "year_" + year
        };
      }
      obj.siteId = this.$store.state.site.siteId;
      this.$http
        .get("equipment/energyBranch/ranking", {
          params: obj
        })
        .then(res => {
          var data = res.data.data;
          this.dataArr = [];
          this.titleArr = [];
          if (res.data.code == 0) {
            if (data.length > 0) {
              for (var i = 0; i < data.length; i++) {
                // 出现负值，说明数据有问题，不显示处理
                if (data[i].result < 0) {
                  this.dataArr = [];
                  return;
                }
                // 数据正常
                this.dataArr[i] = {};
                this.dataArr[i].value = data[i].result;
                this.dataArr[i].name = data[i].property;
                this.titleArr.push(data[i].property);
              }
            }
          }
        });
    },
    getLineValue() {
      if (this.timeSelect == "day") {
        let year = this.hourSelect.getFullYear();
        let month =
          this.hourSelect.getMonth() + 1 < 10
            ? "0" + (this.hourSelect.getMonth() + 1)
            : this.hourSelect.getMonth() + 1;
        let day =
          this.hourSelect.getDate() < 10
            ? "0" + this.hourSelect.getDate()
            : this.hourSelect.getDate();
        let obj = {
          tb: this.timeSelect + "_" + year + month + day,
          siteId: this.$store.state.site.siteId,
          type: this.timeSelect
        };
        // 无当前站点情况下
        if (!this.$store.state.site.siteId) {
          this.dataObj = formatEnergyData(this.hourSelect, "day", []);
          this.tableData = this.dataObj.arr;
          return;
        }
        this.$http
          .get("equipment/energyBranch/siteDataByDate", {
            params: obj
          })
          .then(res => {
            this.dataObj = formatEnergyData(
              this.hourSelect,
              "day",
              res.data.data
            );
            this.tableData = this.dataObj.arr;
            this.arr = getTimeArr(this.timeSelect);
          });
      } else if (this.timeSelect == "month") {
        let year = this.daySelect.getFullYear();
        let month =
          this.daySelect.getMonth() + 1 < 10
            ? "0" + (this.daySelect.getMonth() + 1)
            : this.daySelect.getMonth() + 1;
        let obj = {
          tb: this.timeSelect + "_" + year + month,
          siteId: this.$store.state.site.siteId,
          type: this.timeSelect
        };
        // 无当前站点情况下
        if (!this.$store.state.site.siteId) {
          this.dataObj = formatEnergyData(this.daySelect, "month", []);
          this.tableData = this.dataObj.arr;
          // alert(1)
          return;
        }
        this.$http
          .get("equipment/energyBranch/siteDataByDate", {
            params: obj
          })
          .then(res => {
            this.dataObj = formatEnergyData(
              this.daySelect,
              "month",
              res.data.data
            );
            this.tableData = this.dataObj.arr;
            this.arr = getTimeArr(this.timeSelect);
          });
      } else if (this.timeSelect == "year") {
        let year = this.monthSelect.getFullYear();
        let obj = {
          tb: this.timeSelect + "_" + year,
          siteId: this.$store.state.site.siteId,
          type: this.timeSelect
        };
        // 无当前站点情况下
        if (!this.$store.state.site.siteId) {
          this.dataObj = formatEnergyData(this.monthSelect, "year", []);
          this.tableData = this.dataObj.arr;
          return;
        }
        this.$http
          .get("equipment/energyBranch/siteDataByDate", {
            params: obj
          })
          .then(res => {
            if (res.data.code == 0) {
              this.dataObj = formatEnergyData(
                this.monthSelect,
                "year",
                res.data.data
              );
              this.tableData = this.dataObj.arr;
              this.arr = getTimeArr(this.timeSelect);
            }
          });
      }
    },
    // 获取能源数据当前
    getEnergyData() {
      this.compareArr = [];
      if (!this.$store.state.site.siteId) {
        return;
      }
      var obj = this.getTimeObj("byNow");
      // return
      this.$http
        .get("equipment/energyBranch/comparedEnergy", {
          params: {
            siteId: this.$store.state.site.siteId,
            time: obj.allTime,
            tb: obj.time,
            type: this.timeSelect
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.compareArr = res.data.data.data;
            this.compareArr.push({
              property: "总能耗",
              energyValue: "-",
              result: res.data.data.totalResult
            });
            this.getEnergyDataByYear();
          }
        });
    },
    // 获取同比数据
    getEnergyDataByYear() {
      var obj = this.getTimeObj("byYear");
      // return
      this.$http
        .get("equipment/energyBranch/comparedEnergy", {
          params: {
            siteId: this.$store.state.site.siteId,
            time: obj.allTime,
            tb: obj.time,
            type: this.timeSelect
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            // this.compareArr = res.data.data;
            for (var i = 0; i < res.data.data.data.length; i++) {
              this.$set(
                this.compareArr[i],
                "energyValueByYear",
                res.data.data.data[i].result
              );
            }
            this.$set(
              this.compareArr[this.compareArr.length - 1],
              "energyValueByYear",
              res.data.data.totalResult
            );
            this.getEnergyDateByChain();
          }
        });
    },
    // 获取环比数据
    getEnergyDateByChain() {
      var obj = this.getTimeObj("byChain");
      // return
      this.$http
        .get("equipment/energyBranch/comparedEnergy", {
          params: {
            siteId: this.$store.state.site.siteId,
            time: obj.allTime,
            tb: obj.time,
            type: this.timeSelect
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            // this.compareArr = res.data.data;
            for (var i = 0; i < res.data.data.data.length; i++) {
              this.$set(
                this.compareArr[i],
                "energyValueByChain",
                res.data.data.data[i].result
              );
            }
            this.$set(
              this.compareArr[this.compareArr.length - 1],
              "energyValueByChain",
              res.data.data.totalResult
            );
          }
        });
    },
    // 获取请求参数
    getTimeObj(data) {
      let date;
      if (this.timeSelect === "day") {
        date = this.hourSelect;
        // 非当天的最后一秒
        let date1 =
          Date.parse(date) + 8 * 60 * 60 * 1000 + 24 * 60 * 60 * 1000 - 1;
        // return
        if (date1 > Date.parse(new Date())) {
          // alert('beyond')
          date = new Date();
          // ---------------当天
          let str = "";
          if (data === "byNow") {
            str = new Date(Date.parse(date) + 8 * 60 * 60 * 1000).toJSON();
          } else if (data === "byYear") {
            var year = date.getFullYear() - 1;
            var month = date.getMonth();
            var day = date.getDate();
            var hour = date.getHours();
            var min = date.getMinutes();
            var sec = date.getSeconds();
            var date2 = new Date(year, month, day, hour, min, sec);
            str = new Date(Date.parse(date2) + 8 * 60 * 60 * 1000).toJSON();
          } else {
            str = new Date(Date.parse(date) - 16 * 60 * 60 * 1000).toJSON();
          }
          str = str.slice(0, 19);
          let arr = str.split("T");
          let obj;
          obj = {
            allTime: arr.join(" "),
            time: "day_" + arr[0].split("-").join("")
          };
          return obj;
        } else {
          // 非当天
          let str;
          if (data === "byNow") {
            str = new Date(
              Date.parse(date) + 8 * 60 * 60 * 1000 + 24 * 60 * 60 * 1000 - 1
            ).toJSON();
          } else if (data === "byYear") {
            var year = date.getFullYear() - 1;
            var month = date.getMonth();
            var day = date.getDate();
            var hour = "23";
            var min = "59";
            var sec = "59";
            var date2 = new Date(year, month, day, hour, min, sec);
            str = new Date(Date.parse(date2) + 8 * 60 * 60 * 1000).toJSON();
          } else {
            str = new Date(
              Date.parse(date) + 8 * 60 * 60 * 1000 - 1
            ).toJSON();
          }
          str = str.slice(0, 19);
          let arr = str.split("T");
          let obj;
          obj = {
            allTime: arr.join(" "),
            time: "day_" + arr[0].split("-").join("")
          };
          return obj;
        }
      } else if (this.timeSelect === "month") {
        date = this.daySelect;
        if (
          date.getFullYear() === new Date().getFullYear() &&
          date.getMonth() === new Date().getMonth()
        ) {
          // 重选当前月份，需要选中日期
          date = new Date();
        }
        var year = date.getFullYear();
        var month = date.getMonth();
        var day = date.getDate();
        var obj = {};
        // 当前月份
        if (
          new Date().getMonth() == date.getMonth() &&
          new Date().getFullYear() == date.getFullYear()
        ) {
          date = new Date();
          if (data === "byNow") {
            // 当前
            str = new Date(Date.parse(date) + 8 * 60 * 60 * 1000).toJSON();
            str = str.slice(0, 10);
            obj = {
              allTime: str,
              time:
                "month_" +
                str
                  .slice(0, 7)
                  .split("-")
                  .join("")
            };
          } else if (data === "byYear") {
            // 同比
            var str = new Date(
              Date.parse(new Date(year - 1, month, day + 1))
            ).toJSON();
            str = str.slice(0, 10);
            obj = {
              allTime: str,
              time:
                "month_" +
                str
                  .slice(0, 7)
                  .split("-")
                  .join("")
            };
          } else {
            // 环比
            if (month === 0) {
              year--;
              month = "11";
            } else {
              month--;
            }
            var str = new Date(
              Date.parse(new Date(year, month, day + 1))
            ).toJSON();
            str = str.slice(0, 10);
            obj = {
              allTime: str,
              time:
                "month_" +
                str
                  .slice(0, 7)
                  .split("-")
                  .join("")
            };
          }
        } else {
          if (data === "byNow") {
            // 当前
            str = new Date(Date.parse(date) + 8 * 60 * 60 * 1000).toJSON();
            str = str.slice(0, 7);
            obj = {
              allTime: str + "-31",
              time: "month_" + str.split("-").join("")
            };
          } else if (data === "byYear") {
            // 同比
            var str = new Date(
              Date.parse(new Date(year - 1, month + 1, day))
            ).toJSON();
            str = str.slice(0, 7);
            obj = {
              allTime: str + "-31",
              time: "month_" + str.split("-").join("")
            };
          } else {
            // 环比
            if (month === 0) {
              year--;
              month = 11;
            } else {
              month--;
            }
            var str = new Date(
              Date.parse(new Date(year, month + 1, day))
            ).toJSON();
            str = str.slice(0, 7);
            obj = {
              allTime: str + "-31",
              time: "month_" + str.split("-").join("")
            };
          }
        }
        return obj;
      } else {
        var obj = {};
        date = this.monthSelect;
        if (date.getFullYear() === new Date().getFullYear()) {
          // 当前年份需要加上月份
          date = new Date();
        }
        var year = date.getFullYear();
        var month =
          date.getMonth() + 1 > 9
            ? date.getMonth() + 1
            : "0" + (date.getMonth() + 1);
        var ifCurrent = year === new Date().getFullYear();
        if (data === "byNow") {
          obj = {
            allTime: year + (ifCurrent ? "-" + month : "-12"),
            time: "year_" + year
          };
        } else {
          obj = {
            allTime: year - 1 + (ifCurrent ? "-" + month : "-12"),
            time: "year_" + (year - 1)
          };
        }
        return obj;
      }
    }
  },
  created: function() {
    if (this.$store.state.site.siteId) {
      this.getTotalEnergy();
      this.getTopValue();
      this.getLineValue();
      this.getEnergyData();
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/css/index.less";

.energy-consume {
  height: 100%;
  .content {
    height: calc(100% - 62px);
    overflow: auto;
    .content-layout {
      display: -webkit-flex;
      overflow: auto;
      height: 100%;
      min-height: 500px;
      /* 左边 */
      .consume-left {
        width: 30%;
        max-width: 320px;
        min-width: 278px;
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
          margin-bottom: 4px;
          box-sizing: border-box;
          margin: 1px;
        }
        // 筛选条件
        & > .select {
          height: 160px;
          color: #ccc;
          margin-bottom: 10px;
          box-shadow: 0 0 4px #cac6c6;
          .left-title span {
            color: white;
            padding-left: 10px;
          }
          /* 筛选条件的内容div */
          .contentOne {
            background-color: @table-bgc;
            height: 130px;
            border-radius: 6px;
            // 类型
            .type {
              padding-left: 15px;
              height: 40px;
              padding-top: 20px;
            }
            // 日期
            .date {
              .label {
                float: left;
                margin-left: 15px;
                display: inline;
                line-height: 25px;
                height: 36px;
              }
            }
          }
        }
        // 总能耗
        .total-consume {
          height: 30%;
          background-color: @table-bgc;
          margin-bottom: 10px;
          box-shadow: 0 0 4px #cac6c6;
          .left-title {
            span {
              color: white;
              padding-left: 10px;
            }
          }
          .value-layout {
            height: calc(100% - 30px);
            display: flex;
            justify-content: center;
            align-items: center;
            .value {
              color: rgba(39, 182, 205);
              font-size: 50px;
              text-align: center;
              label {
                display: block;
                font-size: 18px;
                color: #fff;
                margin-top: 8px;
                text-align: center;
              }
            }
          }
        }
        // top能耗
        .top-consume {
          height: calc(70% - 184px);
          background-color: @table-bgc;
          margin-bottom: none;
          box-shadow: 0 0 4px #cac6c6;
          padding: 1px;
          overflow: auto;
          .left-title {
            span {
              color: white;
              padding-left: 10px;
            }
          }
          .pie {
            height: calc(100% - 79px);
            min-height: 200px;
          }
        }
      }
      .consume-right {
        flex: 1;
        height: 100%;
        overflow: hidden;
        width: 60%;
        box-shadow: 1px 13px 8px -15px #cac6c6;
        /* 边角下边距 */
        .radiu-margin {
          border-radius: 6px;
          margin-bottom: 4px;
          box-sizing: border-box;
          margin: 1px;
        }
        // 标题背景色
        .left-title {
          height: 30px;
          background-color: @board-title;
          display: -webkit-flex;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
          border-bottom: 1px solid #ccc;
        }
        // 曲线图
        .consume-right-line {
          flex: 1;
          height: 60%;
          overflow: hidden;
          margin: 1px 1px 10px 12px;
          width: calc(100% - 13px);
          box-shadow: 0 0 4px #cac6c6;
          .line {
            height: calc(100%);
            background-color: @table-bgc;
            box-shadow: 0 0 4px #cac6c6;
            span {
              color: white;
              padding-left: 10px;
            }
            .poly-line {
              height: calc(100% - 30px);
            }
          }
        }
        // 能源同环比
        .consume-right-report {
          height: calc(40% - 13px);
          overflow: hidden;
          margin: 1px 1px 1px 12px;
          width: calc(100% - 13px);
          box-shadow: 0 0 4px #cac6c6;
          .report {
            height: calc(100%);
            margin-bottom: none;
            background-color: @table-bgc;
            box-shadow: 0 0 4px #cac6c6;
            span {
              color: white;
              padding-left: 10px;
            }
            .table {
              height: 90%;
              padding: 0;
              width: calc(100%);
              overflow: auto;
            }
          }
        }
      }
    }
  }
}
</style>