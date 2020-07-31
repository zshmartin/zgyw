<template>
  <!-- 同比分析 -->
  <div class="reading">
    <MyBreadcrumb level1="能源管理" level2="抄表"></MyBreadcrumb>
    <div class="wrap">
      <div class="meter-reading" ref="reading">
        <!-- <div> -->
        <div class="meterReading-left">
          <div class="filter">
            <div class="label" style="padding-top: 24px;">
              <span>类别：</span>
              <el-radio-group v-model="energyType" size="medium">
                <el-radio-button
                  v-for="(item,index) in energyTypeOptions"
                  :key="index"
                  :label="item.id"
                >{{item.properties}}</el-radio-button>
                <!-- <el-radio-button label="road">支路</el-radio-button> -->
              </el-radio-group>
            </div>
            <div class="label" style="margin-top: 8px;">
              <span>标签：</span>
              <el-radio-group v-model="type" size="medium" style="display: inline-block;">
                <el-radio-button label="branch">支路</el-radio-button>
                <el-radio-button label="department">部门</el-radio-button>
              </el-radio-group>
            </div>
          </div>

          <div class="select">
            <div style class="select-list">
              <el-checkbox-group
                v-model="checkList"
                @change="selectChange"
                style="padding: 8px 5px;"
              >
                <div v-for="(item,index) in selectArr" :key="index">
                  <el-checkbox :label="item"></el-checkbox>
                </div>
              </el-checkbox-group>
            </div>
          </div>
        </div>

        <div class="meterReading-right">
          <div class="time-select" style>
            <el-date-picker
              v-model="value1"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="middle"
              :picker-options="pickerOptions"
              :clearable="false"
              @change="timeChange"
            ></el-date-picker>
            <el-button
              class="confirm"
              @click="tableToExcel"
              icon="el-icon-upload2"
              style="float: right"
            >导出表格</el-button>
            <!-- <download-excel
              class="export-excel-wrapper"
              :data="tableData"
              :fields="json_fields"
              name="抄表.xls"
            >
              <el-button type="primary" size="small">导出EXCEL</el-button>
            </download-excel>-->
          </div>
          <div class="table-area" style>
            <el-table
              class
              :data="tableData"
              :height="currentHeight"
              v-loading="loading"
              border
              style="width: 100%"
            >
              <el-table-column
                align="center"
                fixed
                prop="name"
                width="220"
                :label="type === 'department' ? '部门名称' : '支路名称'"
              >
                <template slot-scope="scope">{{scope.row.name}}</template>
              </el-table-column>
              <el-table-column prop="oldValue" :label="value2[0]" width="190">
                <template
                  slot-scope="scope"
                >{{typeof(scope.row.oldValue) == 'number' ? Math.round(scope.row.oldValue * 1000) / 1000 : '-'}}</template>
              </el-table-column>
              <el-table-column prop="value" :label="value2[1]" width="190">
                <template
                  slot-scope="scope"
                >{{typeof(scope.row.value) == 'number' ? Math.round(scope.row.value * 1000) / 1000 : '-'}}</template>
              </el-table-column>
              <el-table-column label="差值">
                <template
                  slot-scope="scope"
                >{{(typeof(scope.row.value) == 'number' && typeof(scope.row.oldValue) == 'number') ? Math.round(scope.row.value * 1000 - scope.row.oldValue * 1000) / 1000 : '-'}}</template>
              </el-table-column>
              <el-table-column prop="unit" label="单位"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import pole from "../subcomponents/pole";
import MyBreadcrumb from "../subcomponents/Mybreadcrumb";
export default {
  components: {
    pole,
    MyBreadcrumb
  },
  props: [],
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return (
            time.getTime() > Date.now() || time.getTime() < new Date(2019, 9, 1)
          );
        }
      },
      type: "branch", //标签
      energyType: "", //能源类别
      energyTypeOptions: [],
      tableData: [], //格式化厚的数据列表
      json_fields: {},
      checkList: [],
      selectArr: [],
      //时间间隔为24小时
      value1: [new Date(new Date() - 60 * 60 * 24 * 1000), new Date()],
      value2: [null, null], //存储格式化后的时间格式
      temData: [], //用于存储临时列表数据
      loading: false, //表格加载动画
      tableHeight: "", //表格高度，用于固定表头使用
      currentHeight: 300 //最终显示出来的表格高度
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
        this.getSelectList();
      }
    },
    // 标签
    type() {
      this.selectArr = [];
      this.getSelectList();
    },
    // 监控临时数据诗句是否为最终合理数据
    temData: {
      handler(newValue) {
        if (newValue.length === this.checkList.length) {
          for (var i = 0; i < this.temData.length; i++) {
            var diff =
              this.temData[i].value && this.temData[i].oldValue
                ? this.temData[i].value - this.temData[i].oldValue
                : "-";
            this.temData[i].diff = diff;
          }
          this.tableData = this.temData;
          this.json_fields = {
            名称: "name",
            开始时间: "oldValue",
            单位: "unit",
            结束时间: "value",
            差值: "diff"
            //             branch:"测试站点1#支路1"
            // name:"测试站点1#支路1"
            // oldValue:8190.33
            // unit:"kWh"
            // value:8190.33
          };
          this.computedTableHeight();
        }
      },
      deep: true
    },
    watchSiteChange(newVal, oldVal) {
      this.getEnergyOptions_inSite();
      this.getSelectList();
    }
  },
  mounted() {
    this.getEnergyOptions_inSite();
    // window.resize()
    window.addEventListener("resize", this.computedTableHeight);
    // this.tableToExcel()
  },
  beforeDestroy() {
    // 注销窗口的大小变化事件
    window.removeEventListener("resize", this.computedTableHeight);
  },
  methods: {
    // 计算表格高度
    computedTableHeight() {
      this.$nextTick(() => {
        this.tableHeight = document.getElementsByClassName(
          "table-area"
        )[0].offsetHeight;
        var emptyHeight;
        var tableHeight;
        if (document.getElementsByClassName("el-table__empty-block")[0]) {
          emptyHeight = document.getElementsByClassName(
            "el-table__empty-block"
          )[0].offsetHeight;
        }
        if (document.getElementsByClassName("el-table__body")[0]) {
          tableHeight = document.getElementsByClassName("el-table__body")[0]
            .offsetHeight;
        }
        // 表格内容高度
        var bodyHeight = emptyHeight ? emptyHeight : tableHeight;
        // 头部高度定为48px，高度超出需要设置高度使用el-table固定高度
        var height = 48 + bodyHeight + 1;
        this.currentHeight =
          this.tableHeight > height ? height : this.tableHeight;
        // window.onresize();
        this.$forceUpdate();
      });
    },
    // 获取站点的所有能源类型
    getEnergyOptions_inSite() {
      if (!this.$store.state.site.siteId) {
        // this.type();
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
          }
        });
    },
    // 获取站点下的所有能源部门或能源分支
    getSelectList() {
      if (!this.energyType) {
        this.tableData = [];
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
                this.checkList = this.selectArr;
                this.tableData = [];
                this.temData = [];
                for (var i = 0; i < this.checkList.length; i++) {
                  var obj = {
                    name: this.checkList[i]
                  };
                  this.temData.push(obj);
                }
                this.getReport();
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
                this.checkList = this.selectArr;
                this.tableData = [];
                this.temData = [];

                this.getReport();
              }
            }
          });
      }
    },
    // 获取时间节点后面的的数据
    getReport() {
      if (this.checkList.length === 0) {
        this.tableData = [];
        return;
      }
      this.loading = true;
      var this_ = this;
      var timeObj = formatTime(this.value1[1]);
      function formatTime(time) {
        var year = time.getFullYear();
        var month =
          time.getMonth() > 8
            ? time.getMonth() + 1
            : "0" + (time.getMonth() + 1);
        var day = time.getDate() > 9 ? time.getDate() : "0" + time.getDate();

        var hour =
          time.getHours() > 9 ? time.getHours() : "0" + time.getHours();
        var minute =
          time.getMinutes() > 9 ? time.getMinutes() : "0" + time.getMinutes();
        var second =
          time.getSeconds() > 9 ? time.getSeconds() : "0" + time.getSeconds();
        var time1 = {
          time:
            year +
            "-" +
            month +
            "-" +
            day +
            " " +
            hour +
            ":" +
            minute +
            ":" +
            second,
          tb: "day_" + year + month + day
        };
        this_.value2[1] = time1.time;
        return time1;
      }

      if (this.type === "department") {
        // for (let i = 0; i < this.checkList.length; i++) {
        var i = 0;
        var this_ = this;
        fnc();
        function fnc() {
          this_.$http
            .get("equipment/energyBranch/checkEnergyByDepartment", {
              params: {
                department: this_.checkList[i],
                time: timeObj.time,
                tb: timeObj.tb,
                siteId: this_.$store.state.site.siteId,
                property: this_.energyType
              }
            })
            .then(res => {
              if (res.data.code === 0) {
                if (res.data.data.length == 0) {
                  this_.temData = [];
                  return;
                }
                this_.$set(this_.temData[i], "value", res.data.data.value);
                this_.$set(this_.temData[i], "unit", res.data.data.unit);
                if (i < this_.checkList.length - 1) {
                  i++;
                  fnc();
                }
              }
            });
        }
        this.getHistortReport();
      } else {
        this.$http
          .get("equipment/energyBranch/checkEnergyByBatch", {
            params: {
              branchs: this.checkList.join(","),
              time: timeObj.time,
              tb: timeObj.tb,
              siteId: this.$store.state.site.siteId,
              property: this.energyType
            }
          })
          .then(res => {
            if (res.data.code === 0) {
              this.temData = res.data.data;
              for (var i = 0; i < this.temData.length; i++) {
                this.$set(this.temData[i], "name", this.temData[i].branch);
              }
              this.getHistortReport();
            }
          });
      }
    },
    // 获取时间节点前面的数据
    getHistortReport() {
      if (this.checkList.length === 0) {
        this.tableData = [];
        return;
      }
      var this_ = this;
      var timeObj = formatTime(this_.value1[0]);
      function formatTime(time) {
        var year = time.getFullYear();
        var month =
          time.getMonth() > 8
            ? time.getMonth() + 1
            : "0" + (time.getMonth() + 1);
        var day = time.getDate() > 9 ? time.getDate() : "0" + time.getDate();

        var hour =
          time.getHours() > 9 ? time.getHours() : "0" + time.getHours();
        var minute =
          time.getMinutes() > 9 ? time.getMinutes() : "0" + time.getMinutes();
        var second =
          time.getSeconds() > 9 ? time.getSeconds() : "0" + time.getSeconds();
        var time1 = {
          time:
            year +
            "-" +
            month +
            "-" +
            day +
            " " +
            hour +
            ":" +
            minute +
            ":" +
            second,
          tb: "day_" + year + month + day
        };
        this_.value2[0] = time1.time;
        return time1;
      }

      if (this.type === "department") {
        var i = 0;
        fnc();
        function fnc() {
          this_.$http
            .get("equipment/energyBranch/checkEnergyByDepartment", {
              params: {
                department: this_.checkList[i],
                time: timeObj.time,
                tb: timeObj.tb,
                siteId: this_.$store.state.site.siteId,
                property: this_.energyType
              }
            })
            .then(res => {
              if (res.data.code === 0) {
                if (res.data.data.length == 0) {
                } else {
                  this_.$set(this_.temData[i], "oldValue", res.data.data.value);
                }

                if (i < this_.checkList.length - 1) {
                  i++;
                  fnc();
                } else {
                  this_.loading = false;
                }
              }
            });
        }
      } else {
        this_.$http
          .get("equipment/energyBranch/checkEnergyByBatch", {
            params: {
              branchs: this_.checkList.join(","),
              time: timeObj.time,
              tb: timeObj.tb,
              siteId: this_.$store.state.site.siteId,
              property: this.energyType
            }
          })
          .then(res => {
            if (res.data.code === 0) {
              // this_.temData = res.data.data
              for (var i = 0; i < this_.temData.length; i++) {
                this_.$set(
                  this_.temData[i],
                  "oldValue",
                  res.data.data[i].value
                );
              }
              this.$forceUpdate();
              this.loading = false;
            }
          });
      }
    },
    // 选中项改变
    selectChange() {
      this.tableData = [];
      this.temData = [];
      if (this.type === "department") {
        for (var i = 0; i < this.checkList.length; i++) {
          var obj = {
            name: this.checkList[i]
          };
          this.temData.push(obj);
        }
      }
      this.getReport();
      this.getHistortReport();
    },
    // 选中时间改变
    timeChange() {
      this.tableData = [];
      this.temData = [];
      if (this.type === "department") {
        for (var i = 0; i < this.checkList.length; i++) {
          var obj = {
            name: this.checkList[i]
          };
          this.temData.push(obj);
        }
      }
      this.getReport();
      this.getHistortReport();
    },
    //前端json导出表格
    tableToExcel() {
      //要导出的json数据（实例）
      // var jsonData = [
      //   {
      //     name: "路人甲",
      //     phone: "123456789",
      //     email: "000@123456.com"
      //   }
      // ];
      //列标题，逗号隔开，每一个逗号就是隔开一个单元格
      let name = this.type === "department" ? "部门名称" : "支路名称";
      let startTime = this.value2[0];
      let endTime = this.value2[1];
      let str = `${name},${startTime},${endTime},差值,单位\n`;
      //增加\t为了不让表格显示科学计数法或者其他格式
      for (let i = 0; i < this.tableData.length; i++) {
        // 支路或部门名称
        str += `${this.tableData[i].name + "\t"},`;
        var oldValue =
          typeof this.tableData[i].oldValue == "number"
            ? Math.round(this.tableData[i].oldValue * 1000) / 1000
            : "-";
        // 左边时间
        str += `${oldValue + "\t"},`;
        var value =
          typeof this.tableData[i].value == "number"
            ? Math.round(this.tableData[i].value * 1000) / 1000
            : "-";
        // 右边时间
        str += `${value + "\t"},`;
        var diff =
          typeof this.tableData[i].value == "number" &&
          typeof this.tableData[i].oldValue == "number"
            ? Math.round(
                this.tableData[i].value * 1000 -
                  this.tableData[i].oldValue * 1000
              ) / 1000
            : "-";
        // 差值
        str += `${diff + "\t"},`;
        // 单位
        str += `${this.tableData[i].unit}`;
        str += "\n";
      }
      // return;
      //encodeURIComponent解决中文乱码
      let uri = "data:text/csv;charset=utf-8,\ufeff" + encodeURIComponent(str);
      //通过创建a标签实现
      var link = document.createElement("a");
      link.href = uri;
      //对下载的文件命名
      link.download = "抄表数据.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      this.$notify({
        message: "表格已经导出",
        type: "success"
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/css/index.less";

.reading {
  height: 100%;
  .wrap {
    height: calc(100% - 62px);
    overflow: auto;
    .meter-reading {
      height: 100%;
      min-height: 500px;
      display: -webkit-flex;
      width: 100%;
      .meterReading-left {
        background-color: @table-bgc;
        height: calc(100% - 2px);
        border-radius: 6px;
        width: 300px;
        display: inline-block;
        box-sizing: border-box;
        margin: 1px;
        margin-right: 11px;
        box-shadow: 0 0 4px #cac6c6;
        .filter {
          border-bottom: 1px solid #ccc;
          width: 288px;
          height: 108px;
          margin-left: 5px;
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
        .select {
          height: calc(100% - 108px);
          .select-list {
            height: calc(100% - 30px);
            overflow: auto;
            /* 支路或者部门的列表的样式 */
            /deep/ .el-checkbox {
              padding-bottom: 5px;
            }
            /deep/ .el-checkbox__input {
              padding-bottom: 3px;
            }
            /deep/ .el-checkbox__label {
              font-size: 16px;
            }
          }
        }
      }
      .meterReading-right {
        flex: 1;
        width: calc(100% - 306px);
        display: inline-block;
        box-sizing: border-box;
        height: calc(100% - 2px);
        border-radius: 6px;
        /* 用于解决el-table不会自适应宽度的bug */
        overflow: hidden;
        background-color: @table-bgc;
        box-shadow: 0 0 4px #cac6c6;
        margin: 1px;
        .time-select {
          padding: 12px 5px 10px 5px;
          /* 日期选择框拉长 */
          /deep/ .el-range-editor {
            width: 450px;
          }
        }
        .table-area {
          height: calc(100% - 58px);
          padding: 0 5px;
        }
      }
    }
  }
}
</style>

