<template>
  <div class="energy-report">
    <MyBreadcrumb level1="能源管理" level2="能源报表"></MyBreadcrumb>
    <div class="energy-layout" style>
      <div class="energy-config">
        <!-- 左边筛选栏 -->
        <div class="select">
          <div class="filter">
            <div class="label" style>
              <span>类别：</span>
              <el-radio-group v-model="energyType" size="medium">
                <el-radio-button
                  v-for="(item,index) in energyTypeOptions"
                  :key="index"
                  :label="item.id"
                >{{item.properties}}</el-radio-button>
              </el-radio-group>
            </div>
            <div class="label" style="margin-top: 8px;">
              <span>标签：</span>
              <el-radio-group v-model="type" size="medium" @change="typeChange">
                <el-radio-button label="branch">支路</el-radio-button>
                <el-radio-button label="department">部门</el-radio-button>
              </el-radio-group>
            </div>
            <div class="label" style="margin-top: 8px;">
              <span>类型：</span>
              <!-- 单选框 -->
              <el-radio-group v-model="timeSelect" size="large">
                <el-radio-button label="day">日报</el-radio-button>
                <el-radio-button label="month">月报</el-radio-button>
                <el-radio-button label="year">年报</el-radio-button>
              </el-radio-group>
            </div>

            <!-- 月 -->
            <div class="label" style="margin-top: 8px;">
              <span>日期：</span>

              <!-- 日期选择器  -->
              <div style="display: inline-block;">
                <div class="date" v-show="timeSelect=='day'">
                  <el-date-picker
                    v-model="hourSelect"
                    align="right"
                    type="date"
                    placeholder="选择日期"
                    :picker-options="pickerOptions_day"
                    :clearable="Boolean(false)"
                    size="mini"
                  ></el-date-picker>
                </div>
                <div class="date" v-show="timeSelect=='month'">
                  <el-date-picker
                    v-model="daySelect"
                    type="month"
                    placeholder="选择月"
                    format="yyyy-MM"
                    size="mini"
                    :picker-options="pickerOptions_month"
                    :clearable="Boolean(false)"
                  ></el-date-picker>
                </div>
                <!-- 年 -->
                <div class="date" v-show="timeSelect=='year'">
                  <el-date-picker
                    v-model="monthSelect"
                    align="right"
                    size="mini"
                    type="year"
                    placeholder="选择年"
                    :picker-options="pickerOptions_year"
                    :clearable="Boolean(false)"
                  ></el-date-picker>
                </div>
              </div>
            </div>
          </div>
          <div class="select-list scroll">
            <el-checkbox-group v-model="checkList" @change="selectChange">
              <div v-for="(item,index) in selectArr" :key="index">
                <el-checkbox :label="item"></el-checkbox>
              </div>
            </el-checkbox-group>
          </div>
        </div>
        <!-- 右边展示栏 -->
        <div class="list">
          <div class="line">
            <poly_lineMore :dataObj="dataObj"></poly_lineMore>
          </div>
          <div class="table-show">
            <div class="list-show">
              <Table_fixed
                :tableHeight="tableHeight"
                :tableObj="tableObj"
                :timeSelect="timeSelect"
                ref="fixed"
                class="table"
              ></Table_fixed>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatEnergyDataMore } from "../../utils/index";
import poly_lineMore from "../subcomponents/polylineMore";
import MyBreadcrumb from "../subcomponents/Mybreadcrumb";
import Table_fixed from "../subcomponents/table_fixed";
export default {
  components: {
    poly_lineMore,
    MyBreadcrumb,
    Table_fixed
  },
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
      hourSelect: new Date(),
      daySelect: new Date(),
      monthSelect: new Date(),
      type: "branch",
      selectArr: [],
      energyType: "",
      energyTypeOptions: [], //站点下存在的能源类型
      timeSelect: "day", //报表类型
      checkList: [],
      tableObj: {},
      tableHeight: null
    };
  },
  computed: {
    watchSiteChange() {
      return this.$store.state.site.siteId;
    }
  },
  watch: {
    energyType: {
      handler(newValue) {
        // 类别发生变化，刷新数据

        // this.getSelectList();
      }
    },
    type: {
      handler(newValue) {
        this.getSelectList();
      }
    },
    timeSelect: {
      handler() {
        this.getTrend();
      }
    },
    hourSelect: {
      handler() {
        this.getTrend();
      }
    },
    daySelect: {
      handler() {
        this.getTrend();
      }
    },
    monthSelect: {
      handler() {
        this.getTrend();
      }
    },
    watchSiteChange(newVal, oldVal) {
      this.getEnergyOptions_inSite();
    }
  },
  mounted() {
    this.getEnergyOptions_inSite();
    window.addEventListener("resize", this.getTableHeight);
  },
  beforeDestroy() {
    // 注销窗口的大小变化事件
    window.removeEventListener("resize", this.getTableHeight);
  },
  methods: {
    // 获取留给table的总高度
    getTableHeight() {
      this.tableHeight = document.getElementsByClassName(
        "list-show"
      )[0].offsetHeight;
    },
    typeChange() {},
    // 获取站点的所有能源类型
    getEnergyOptions_inSite() {
      // return
      // 无当前站点
      if (!this.$store.state.site.siteId) {
        this.getTrend();
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
              this.getSelectList()
            } else {
              this.energyType = null;
              // 缓存数据的清除
              this.checkList = [];
              this.selectArr = [];
              // return
              this.getTrend();
            }
          }
        });
    },
    // 获取日月年统计支路、部门能耗趋势
    getTrend() {
      // alert(1)
      var tb = "";
      var time;
      if (this.timeSelect == "day") {
        time = this.hourSelect;
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
        time = this.daySelect;
        var year = this.daySelect.getFullYear();
        var month =
          this.daySelect.getMonth() > 8
            ? this.daySelect.getMonth() + 1
            : "0" + (this.daySelect.getMonth() + 1);
        tb = "month_" + year + month;
      } else if (this.timeSelect == "year") {
        time = this.monthSelect;
        var year = this.monthSelect.getFullYear();
        tb = "year_" + year;
      }
      // 多选项为空，不请求数据
      if (this.checkList.length == 0) {
        this.dataObj = formatEnergyDataMore(time, this.timeSelect, []);
        let obj = JSON.parse(JSON.stringify(this.dataObj));
        this.tableObj = {
          tableHead: obj.xNum,
          name: obj.yNum,
          series: obj.series
        };
        // 调用子组件方法
        this.$refs.fixed.computedHeight();
        this.$forceUpdate();
        return;
      }

      if (this.type == "department") {
        let arr = [];
        for (let i = 0; i < this.checkList.length; i++) {
          this.$http
            .get("equipment/energyBranch/departmentDataByDate", {
              params: {
                siteId: this.$store.state.site.siteId,
                type: this.timeSelect,
                department: this.checkList[i],
                property: this.energyType,
                tb: tb
              }
            })
            .then(res => {
              if (res.data.code === 0) {
                var obj = {};
                obj.data = res.data.data;
                obj.branch = this.checkList[i];
                arr.push(obj);
                // return;
                if (arr.length === this.checkList.length) {
                  this.dataObj = formatEnergyDataMore(
                    time,
                    this.timeSelect,
                    arr
                  );
                  this.tableObj = {
                    tableHead: this.dataObj.xNum,
                    name: this.dataObj.yNum,
                    series: this.dataObj.series
                  };
                  // 调用子组件方法
                  this.$refs.fixed.computedHeight();
                }
              }
            });
        }
      } else if (this.type == "branch") {
        // ------------------------------支路
        this.$http
          .get("equipment/energyBranch/batchBranchDataByDate", {
            params: {
              type: this.timeSelect,
              tb: tb,
              // branch: this.selectData
              branchs: this.checkList.join(","),
              property: this.energyType
            }
          })
          .then(res => {
            this.dataObj = formatEnergyDataMore(
              time,
              this.timeSelect,
              res.data.data
            );
            this.tableObj = {
              tableHead: this.dataObj.xNum,
              name: this.dataObj.yNum,
              series: this.dataObj.series
              // 模拟数据
              // series: [
              //   {
              //     data: [
              //       0.8,0.8,0.7,0.8,0.8,0.7,0.8,1.2,2.6,4.1,3.2,3.5,2.8,4.6,7,2.3,2.9,3.4,3.2,2.6,1,0.9,0.9,0.9
              //     ],
              //     name: '111',
              //     type: 'line',
              //   }
              // ]
            };
            // this.$nextTick(() => {
            this.tableHeight = document.getElementsByClassName(
              "list-show"
            )[0].offsetHeight;
            // 调用子组件方法
            this.$refs.fixed.computedHeight();
            // });
          });
      }
    },
    // 获取站点下的所有能源部门或能源分支

    getSelectList() {
      if (!this.energyType) {
        // // 清空选项
        // this.selectArr = []
        // this.checkList = []
        // // 清空图表
        // // this.dataObj = {}
        // // this.dataObj = formatEnergyDataMore(time, this.timeSelect, []);
        // // 清空表格
        // this.tableObj = {}
        // return;
        this.getTrend();
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
                this.checkList = [this.selectArr[0]];
              }
              this.getTrend();
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
                this.checkList = [this.selectArr[0]];
              }
              this.getTrend();
            }
          });
      }
    },
    // 选中值改变，右边展示数据刷新
    selectChange() {
      this.getTrend();
    },
    // 报表合计值计算
    getAll(data) {
      return data.reduce((first, second) => {
        return first + second;
      }, 0);
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/css/index.less";

.energy-report {
  height: 100%;
  .energy-layout {
    height: calc(100% - 62px);
    overflow: auto;
    .energy-config {
      width: 100%;
      height: 100%;
      min-height: 500px;
      display: -webkit-flex;
      background-color: f6f6f6;
      /* 左边样式 */
      .select {
        width: 300px;
        overflow: hidden;
        margin-right: 11px;
        padding: 6px;
        box-sizing: border-box;
        background-color: @table-bgc;
        box-shadow: 0 0 4px #cac6c6;
        border-radius: 6px;
        margin: 1px 11px 1px 1px;
        // 筛选区域
        .filter {
          height: 160px;
          border-bottom: 1px solid #ccc;
          padding-top: 10px;
          .label {
            color: #ccc;
            /deep/ .el-radio-button__inner {
              padding: 5px 8px;
            }
            /deep/ .el-input--suffix {
              width: 138px;
            }
          }
        }
        // 列表
        .select-list {
          height: calc(100% - 160px);
          padding-top: 6px;
          overflow: auto;
          div {
            cursor: pointer;
            /* 支路或者部门查询列表的间隔样式 */
            /deep/ .el-checkbox {
              padding-bottom: 5px;
              .el-checkbox__input {
                padding-bottom: 3px;
              }
              .el-checkbox__label {
                font-size: 16px;
              }
            }
          }
        }
      }
      /* 右边区域样式 */
      .list {
        flex: 1;
        height: calc(100% - 2px);
        overflow: scroll;
        background-color: @table-bgc;
        padding: 4px;
        box-sizing: border-box;
        overflow: hidden;
        box-shadow: 0 0 4px #cac6c6;
        border-radius: 6px;
        margin: 1px;
        .line {
          height: 50%;
        }
        .table-show {
          height: calc(50% - 15px);
          .list-show {
            margin: 15px 6px 0px 6px;
            width: calc(100% - 12px);
            height: 100%;
            box-sizing: border-box;
          }
        }
      }
    }
  }
}
</style>