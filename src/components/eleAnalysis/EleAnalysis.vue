<template>
  <div id="ele-analysis">
    <MyBreadcrumb level1="能源管理" level2="电费分析"></MyBreadcrumb>
    <div class="content" v-if="showPage === 'home'">
      <div class="title">
        <div class="yearSelect">
          <el-date-picker
            v-model="yearValue"
            size="mini"
            type="year"
            :clearable="defaultTrue"
            placeholder="选择年"
          ></el-date-picker>
        </div>
      </div>
      <div class="chart">
        <!-- <polePrice :legend="legend" :dataObj="dataObj1"></polePrice> -->
      </div>
      <div class="table">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="time" label="月份"></el-table-column>
          <el-table-column prop="totalQuantity" label="总用电量"></el-table-column>
          <el-table-column prop="totalPrice" label="总电价"></el-table-column>
          <el-table-column prop="pingQuantity" label="平时电量"></el-table-column>
          <el-table-column prop="pingPrice" label="平时电价"></el-table-column>
          <el-table-column prop="pingPercentage" label="平时电量占百分比">
            <template slot-scope="scope">{{scope.row.pingPercentage + '%'}}</template>
          </el-table-column>
          <el-table-column prop="fengQuantity" label="峰时电量"></el-table-column>
          <el-table-column prop="fengPrice" label="峰时电价"></el-table-column>
          <el-table-column prop="fengPercentage" label="峰时电量占百分比">
            <template slot-scope="scope">{{scope.row.fengPercentage + '%'}}</template>
          </el-table-column>
          <el-table-column prop="guQuantity" label="谷时电量"></el-table-column>
          <el-table-column prop="guPrice" label="谷时电价"></el-table-column>
          <el-table-column prop="guPercentage" label="谷时电量占百分比">
            <template slot-scope="scope">{{scope.row.guPercentage + '%'}}</template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button @click="getDetail(scope.row)" type="text" size="small">详情</el-button>
              <el-button type="text" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 月份详情页面 -->
    <div class="detail" v-if="showPage === 'detail'">
      <div class="detail-title">
        <div class="info">
          <div class="point">
            <i class="el-icon-back" @click="backHome"></i>
          </div>
          <div class="right">
            <h3>月份电度详情</h3>
            <h4>广州中信</h4>
            <span>生成日期：2020-6-16</span>
            <div>
              <span>14:37:00</span>
              <span class="report">未出报告</span>
            </div>
          </div>
        </div>
        <div class="center">
          <div class="press sin">
            <p>电压等级</p>
            <p>10KV</p>
          </div>
          <div class="press sin">
            <p>变压器容量</p>
            <p>10KV</p>
          </div>
          <div class="press sin">
            <p>运行台数</p>
            <p>10KV</p>
          </div>
          <div class="press sin">
            <p>核定需量</p>
            <p>10KV</p>
          </div>
          <div class="press sin">
            <p>计费方式</p>
            <p>10KV</p>
          </div>
        </div>
        <div class="time">
          <div class="begin">
            <div>起始时间：2020-5-20 </div>
            <div>14:35:00</div>
          </div>
          <div class="end">
            <div>结束时间：2020-5-20 </div>
            <div>14:35:00</div>
          </div>
        </div>
      </div>
      <div class="block-show">
        <div class="block-sin">
          <div class="left"></div>
          <div class="right">
            <span>{{monthDataObj.totalPrice}}</span>
            <span>总电费（元）</span>
          </div>
        </div>
        <div class="block-sin">
          <div class="left"></div>
          <div class="right">
            <span>{{monthDataObj.totalQuantity}}</span>
            <span>总用电量（kWh）</span>
          </div>
        </div>
        <!-- <div class="block-sin">
          <div class="left"></div>
          <div class="right">
            <span>{{monthDataObj.totalPrice}}</span>
            <span>总无功电度（kvarh）</span>
          </div>
        </div>-->
        <div class="block-sin">
          <div class="left"></div>
          <div class="right">
            <div class="sin-left">
              <span>---</span>
              <span>功率因数</span>
            </div>
            <div class="sin-center"></div>
            <div class="sin-right">
              <span>---</span>
              <span>标准值</span>
            </div>
          </div>
        </div>
        <div class="block-sin">
          <div class="left"></div>
          <div class="right">
            <div class="sin-left">
              <span>---</span>
              <span>最大需量（KW）</span>
            </div>
            <div class="sin-center"></div>
            <div class="sin-right">
              <span>100</span>
              <span>核定需量</span>
            </div>
          </div>
        </div>
      </div>
      <div class="chart">
        <div class="pole">
          <div class="title">月度电度趋势</div>
          <div class="pole-show">
            <polePrice :legend="legend" :dataObj="dataObj"></polePrice>
          </div>
        </div>
        <div class="pie">
          <div class="title">电度电费</div>
          <div class="pie-show">
            <div class="left">
              <div class="header">
                <div class="text">电度</div>
              </div>
              <div class="chart-area">
                <pie :dataArr="piePriceType" :titleArr="titleArr"></pie>
              </div>
            </div>
            <div class="right">
              <div class="header">
                <div class="text">电费</div>
              </div>
              <div class="chart-area">
                <pie :dataArr="piePriceArr" :titleArr="titleArr1"></pie>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="list" v-if="equipTitle.length > 0">
        <el-tabs v-model="activeName" @tab-click="equipChange" class="select">
          <el-tab-pane
            v-for="(item, index) in equipTitle"
            :label="item.confName"
            :name="item.id.toString()"
            :key="index"
          ></el-tab-pane>
        </el-tabs>
        <div class="show">
          <div class="pie">
            <div class="title">电度电费</div>
            <div class="pie-show">
              <div class="left">
                <div class="header">
                  <div class="text">电度</div>
                </div>
                <div class="chart-area">
                  <pie :dataArr="equipPiePowerArr" :titleArr="titleArr"></pie>
                </div>
              </div>
              <div class="right">
                <div class="header">
                  <div class="text">电费</div>
                </div>
                <div class="chart-area">
                  <pie :dataArr="equipPiePriceArr" :titleArr="titleArr"></pie>
                </div>
              </div>
            </div>
          </div>
          <div class="table">
            <div class="title">电度电费</div>
            <div class="table-show">
              <div class="table-head">
                <div class="null"></div>
                <!-- <div class="prise">电价(元)</div> -->
                <div class="num">电度(kWh)</div>
                <div class="count">电费(元)</div>
              </div>
              <div class="row-sin">
                <div>平</div>
                <!-- <div>{{equipDetailData.ping}}</div> -->
                <div>{{equipDetailData.pingQuantity}}</div>
                <div>{{equipDetailData.pingPrice}}</div>
              </div>
              <div class="row-sin">
                <div>峰</div>
                <!-- <div>0.8</div> -->
                <div>{{equipDetailData.fengQuantity}}</div>
                <div>{{equipDetailData.fengPrice}}</div>
              </div>
              <div class="row-sin">
                <div>谷</div>
                <!-- <div>1</div> -->
                <div>{{equipDetailData.guQuantity}}</div>
                <div>{{equipDetailData.guPrice}}</div>
              </div>
            </div>
          </div>
          <div class="pole">
            <div class="title">月度电费趋势</div>
            <div class="pole-show">
              <polePrice :legend="legend" :dataObj="equipPoleData"></polePrice>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MyBreadcrumb from "../subcomponents/Mybreadcrumb";
import polePrice from "../subcomponents/pole-price";
import pie from "../subcomponents/pie";
export default {
  components: {
    MyBreadcrumb,
    polePrice,
    pie
  },
  data() {
    return {
      yearValue: "",
      dataObj: {},
      legend: [],
      tableData: [],
      showPage: "home", //当前显示的页面
      defaultTrue: true,
      activeName: "",
      monthDataObj: {},
      currentMonthData: {}, //详情月份数据
      // 详情数据
      dataArr: [],
      titleArr: [],
      dataArr1: [],
      titleArr1: [],
      dataObj1: {},
      piePriceArr: [], //饼状图电费
      piePriceType: ["平时点价", "峰时点价", "谷时点价"],
      piePowerArr: [], //饼状图电度
      equipPiePriceArr: [],
      equipPiePowerArr: [],
      equipTitle: [],
      equipId: "", //详情页面的选中设备编号
      equipDetailData: {}, //监控设备下的详情数据
      equipPoleData: {}
    };
  },
  computed: {
    siteId() {
      return this.$store.state.site.siteId;
    }
  },
  watch: {
    siteId(newValue) {
      this.showPage = 'home'
      let months = new Date().getMonth();
      for (let i = 0; i <= months; i++) {
        this.monthDetail(i, months);
      }
    }
  },
  created() {
    // setTimeout(() => {
    //   this.$forceUpdate();
    // }, 1000);
    let months = new Date().getMonth();
    for (let i = 0; i <= months; i++) {
      this.monthDetail(i, months);
    }
  },
  methods: {
    // 格式化成柱状图数据格式
    formatPoleData(row) {
      // return
      // 传入值row
      // 获取结算日
      let siteObj = this.$store.state.site.siteList.find(item => {
        return (item.id = this.$store.state.site.siteId);
      });
      let endDay = siteObj.electricityCycle;
      // 上个月月份
      var month =
        +this.monthDataObj.time.split("-")[1] > 0
          ? +this.monthDataObj.time.split("-")[1] - 1
          : 12;

      // 上个月年份
      var year =
        month == 12
          ? +this.monthDataObj.time.split("-")[0] - 1
          : +this.monthDataObj.time.split("-")[0];
      // 上个月总天数
      var lastMonthDay = new Date(
        new Date(year, month).getTime() - 1000 * 60 * 60 * 24
      ).getDate();
      // 上个月剩余缴费数组
      var lastMonthArr = [];
      for (let i = 1; i <= lastMonthDay; i++) {
        i > endDay && lastMonthArr.push(i);
      }
      // 当月份缴费数组
      let currentMonthArr = [];
      for (let i = 1; i <= endDay; i++) {
        currentMonthArr.push(i);
      }

      // 数组当前显示的恒左边
      let rowArr = lastMonthArr.concat(currentMonthArr);

      // 初始化空数据
      let arr = [];
      for (let i = 0; i < rowArr.length; i++) {
        arr.push(null);
      }

      let series = [
        {
          name: "平",
          type: "bar",
          stack: "总量",
          data: JSON.parse(JSON.stringify(arr)) //引入型数据类型
        },
        {
          name: "峰",
          type: "bar",
          stack: "总量",
          data: JSON.parse(JSON.stringify(arr))
        },
        {
          name: "谷",
          type: "bar",
          stack: "总量",
          data: JSON.parse(JSON.stringify(arr))
        }
      ];
      for (let i = 0; i < row.feesInfoVOList.length; i++) {
        let index = rowArr.findIndex(item => {
          return row.feesInfoVOList[i].day === item;
        });
        for (let j = 0; j < series.length; j++) {
          switch (j) {
            case 0:
              this.$set(
                series[j].data,
                index,
                row.feesInfoVOList[i].pingQuantity
              );
              console.log(row.feesInfoVOList[i].pingQuantity);
              break;
            case 1:
              this.$set(
                series[j].data,
                index,
                row.feesInfoVOList[i].fengQuantity
              );
              console.log(row.feesInfoVOList[i].fengQuantity);
              break;
            case 2:
              this.$set(
                series[j].data,
                index,
                row.feesInfoVOList[i].guQuantity
              );
              console.log(row.feesInfoVOList[i].guQuantity);
              break;
            default:
              break;
          }
        }
      }
      let obj = ["平", "峰", "谷"];
      let dataObj = {
        series: series,
        xNum: rowArr,
        trans: 1
      };
      return { legend: obj, dataObj: dataObj };
    },
    // 月份详情赋值拼接表格
    monthDetail(i, months) {
      if(!this.$store.state.site.siteId) {
        return 
      }
      var obj = {
        siteId: this.$store.state.site.siteId
      };
      if (i !== months) {
        obj.month = i;
      }
      this.$http
        .get("equipment/electricity/feesBySite", {
          params: obj
        })
        .then(res => {
          if (res.data.code === 0) {
            let obj = res.data.data;
            let year = new Date().getFullYear();
            obj.time = year + "-" + (i + 1);
            // this.monthDataObj = [];
            // this.monthDataObj.push(res.data.data);
            // this.currentMonthData = this.monthDataObj[0]
            this.$set(this.tableData, i, res.data.data);
          }
        });
    },
    // 获取月份详情展示数据
    getDetail(row) {
      // 获取页面下方标签类型
      this.getAllMonitorEquip();
      this.showPage = "detail";
      this.monthDataObj = row;

      // this.equipDetailData = res.data.data;

      let obj1 = this.formatPoleData(this.monthDataObj);
      setTimeout(() => {
        this.dataObj = obj1.dataObj;
        this.legend = obj1.legend;
        this.titleArr = obj1.legend;
        this.titleArr1 = obj1.legend;
        // 用电电价赋值
        this.piePriceArr = [
          { value: this.monthDataObj.pingPrice, name: "平时电价" },
          { value: this.monthDataObj.fengPrice, name: "峰时电价" },
          { value: this.monthDataObj.guPrice, name: "谷时电价" }
        ];
        // 用电电度赋值
        this.piePriceType = [
          { value: this.monthDataObj.pingQuantity, name: "平时电度" },
          { value: this.monthDataObj.fengQuantity, name: "峰时电度" },
          { value: this.monthDataObj.guQuantity, name: "谷时电度" }
        ];
      }, 10);
    },
    // 切换标签
    equipChange() {
      this.getEquipDetail();
    },
    // 返回首页
    backHome() {
      this.showPage = "home";
      // setTimeout(() => {
      //   this.dataObj1 = {
      //     series: [
      //       {
      //         data: [1, 1, 3]
      //       },
      //       {
      //         data: [1, 2, 3]
      //       },
      //       {
      //         data: [1, 1, 3]
      //       },
      //       {
      //         data: [1, 2, 3]
      //       }
      //     ],
      //     xNum: ["1", "2", "3"],
      //     trans: 1
      //   };
      // }, 1);
    },
    // 获取所有监控的变量
    getAllMonitorEquip() {
      this.$http
        .get("equipment/electricity/confBySite", {
          params: {
            site: this.$store.state.site.siteId
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.equipTitle = res.data.data;
            if (this.equipTitle.length > 0) {
              this.activeName = this.equipTitle[0].id.toString();
              this.getEquipDetail();
            }
          }
        });
    },
    // 获取监控变量下的详情
    getEquipDetail() {
      let obj = {
        confId: parseInt(this.activeName),
        siteId: this.$store.state.site.siteId
      };
      obj.month = +this.monthDataObj.time.split("-")[1];
      // }
      this.$http
        .get("equipment/electricity/feesInfo", {
          params: obj
        })
        .then(res => {
          if (res.data.code === 0) {
            this.equipDetailData = res.data.data;
            // 用电电价赋值
            this.equipPiePriceArr = [
              { value: this.equipDetailData.pingPrice, name: "平时电价" },
              { value: this.equipDetailData.fengPrice, name: "峰时电价" },
              { value: this.equipDetailData.guPrice, name: "谷时电价" }
            ];
            // 用电电度赋值
            this.equipPiePowerArr = [
              { value: this.equipDetailData.pingQuantity, name: "平时电度" },
              { value: this.equipDetailData.fengQuantity, name: "峰时电度" },
              { value: this.equipDetailData.guQuantity, name: "谷时电度" }
            ];
            let obj = this.formatPoleData(this.equipDetailData);
            setTimeout(() => {
              this.equipPoleData = obj.dataObj;
            }, 10);
          }
        });
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/css/index.less";
#ele-analysis {
  height: 100%;
  @dis-flex();
  @flex-c();
  // 首页
  .content {
    padding: 10px;
    @flex-1();
    background: @content-bgc;
    overflow: auto;
    .title {
      @dis-flex();
      .yearSelect {
        /deep/ .el-date-editor.el-input,
        /deep/ .el-date-editor.el-input__inner {
          width: 150px;
        }
      }
    }
    .chart {
      height: 300px;
    }
  }
  // 详情
  .detail {
    color: #ccc;
    @flex-1();
    overflow: auto;
    // 头部
    .detail-title {
      background: @content-bgc;
      padding: 6px 10px;
      margin-bottom: 10px;
      @dis-flex();
      .info {
        color: #fff;
        width: 20%;
        max-width: 280px;
        min-width: 220px;
        @dis-flex();
        align-items: center;
        .point {
          width: 40px;
          height: 40px;
          &:hover {
            cursor: pointer;
            color: skyblue;
          }
          .el-icon-back {
            // float: right;
            margin-left: 6px;
            transform: scale(1.5);
          }
        }
        .report {
          padding: 0 8px;
          display: inline-block;
          border: 1px solid #c44949;
          border-radius: 6px;
        }
      }
      .center {
        @dis-flex();
        @flex-1();
        align-items: center;
        .sin {
          @flex-1();
          @dis-flex();
          @flex-c();
          align-items: center;
        }
      }
      .time {
        color: #fff;
        width: 20%;
        max-width: 260px;
        @dis-flex();
        @flex-c();
        justify-content: center;
        // align-items: center;
        .begin {
          @dis-flex();
          @flex-r();
          flex-wrap: wrap;
          justify-content: flex-end;
        }
        .end {
          @dis-flex();
          @flex-r();
          flex-wrap: wrap;
          justify-content: flex-end;
        }
      }
    }
    // 方块
    .block-show {
      @dis-flex();
      margin-bottom: 10px;
      .block-sin {
        margin-left: 20px;
        @flex-1();
        height: 100px;
        @dis-flex();
        .left {
          // display: inline-block;
          background: #53687d;
          width: 30%;
          height: 100%;
        }
        .right {
          // display: inline-block;
          background: @content-bgc;
          width: 70%;
          height: 100%;
          @dis-flex();
          @flex-c();
          justify-content: center;
          align-items: center;
          span:nth-child(2) {
            text-align: center;
          }
        }
        // .right:nth-child(4),.right:nth-child(5) {
        //   @flex-r();
        // }
      }
      .block-sin:nth-child(4),
      .block-sin:nth-child(5) {
        .right {
          @flex-r();
          justify-content: space-around;
          .sin-left {
            @flex-1();
            @dis-flex();
            @flex-c();
            align-items: center;
            margin: 0 0px 10px 0;
          }
          .sin-center {
            width: 1px;
            height: 60%;
            background-color: #ccc;
            transform: rotate(205deg);
          }
          .sin-right {
            @flex-1();
            @dis-flex();
            @flex-c();
            align-items: center;
            margin: 10px 0 0 0px;
          }
        }
      }
      .block-sin:first-child {
        margin: 0;
      }
    }
    // 图表
    .chart {
      margin-bottom: 10px;
      @dis-flex();
      height: 300px;
      .pole {
        flex: 3;
        height: 100%;
        background: @content-bgc;
        margin-right: 10px;
        @dis-flex();
        @flex-c();
        .title {
          padding: 4px 0;
          text-align: center;
          background-color: #6b7e91;
        }
        .pole-show {
          @flex-1();
        }
      }
      .pie {
        flex: 2;
        width: 100%;
        background: @content-bgc;
        @dis-flex();
        @flex-c();
        .title {
          padding: 4px 0;
          text-align: center;
          background-color: #6b7e91;
        }
        .pie-show {
          @flex-1();
          @dis-flex();
          .left {
            @flex-1();
            @dis-flex();
            @flex-c();
            // position: relative;
            .header {
              padding: 4px 0;
              text-align: center;
              position: relative;
              height: 20px;
              .text {
                width: 100%;
                position: absolute;
                text-align: center;
                top: 36px;
              }
            }
            .chart-area {
              @flex-1();
            }
          }
          .right {
            @flex-1();
            @dis-flex();
            @flex-c();
            .header {
              padding: 4px 0;
              text-align: center;
              position: relative;
              height: 20px;
              .text {
                width: 100%;
                position: absolute;
                text-align: center;
                top: 36px;
              }
            }
            .chart-area {
              @flex-1();
              // transform: scale(1.2)
            }
          }
        }
      }
    }
    //标签切换
    .list {
      .show {
        height: 270px;
        @dis-flex();
        .pie {
          flex: 5;
          height: 100%;
          margin-right: 10px;
          background: @content-bgc;
          @dis-flex();
          @flex-c();
          .title {
            padding: 4px 0;
            text-align: center;
            background-color: #6b7e91;
          }
          .pie-show {
            @flex-1();
            @dis-flex();
            .left {
              @flex-1();
              @dis-flex();
              @flex-c();
              // position: relative;
              .header {
                padding: 4px 0;
                text-align: center;
                position: relative;
                height: 20px;
                .text {
                  width: 100%;
                  position: absolute;
                  text-align: center;
                  top: 36px;
                }
              }
              .chart-area {
                @flex-1();
              }
            }
            .right {
              @flex-1();
              @dis-flex();
              @flex-c();
              .header {
                padding: 4px 0;
                text-align: center;
                position: relative;
                height: 20px;
                .text {
                  width: 100%;
                  position: absolute;
                  text-align: center;
                  top: 36px;
                }
              }
              .chart-area {
                @flex-1();
                // transform: scale(1.2)
              }
            }
          }
        }
        .table {
          flex: 3;
          height: 100%;
          margin-right: 10px;
          background: @content-bgc;
          @dis-flex();
          @flex-c();
          .title {
            padding: 4px 0;
            text-align: center;
            background-color: #6b7e91;
          }
          .table-show {
            @flex-1();
            @dis-flex();
            @flex-c();
            .table-head {
              @flex-1();
              @dis-flex();
              text-align: center;
              align-items: center;
              .null {
                @flex-1();
              }
              .prise {
                flex: 2;
              }
              .num {
                flex: 2;
              }
              .count {
                flex: 2;
              }
            }
            .row-sin {
              @flex-1();
              @dis-flex();
              align-items: center;
              // margin-bottom: 6px;
              background-color: #425465;
              margin: 0 6px 6px;
              div {
                flex: 2;
                text-align: center;
              }
              div:first-child {
                flex: 1;
              }
            }
          }
        }
        .pole {
          flex: 5;
          height: 100%;
          background: @content-bgc;
          @dis-flex();
          @flex-c();
          .title {
            padding: 4px 0;
            text-align: center;
            background-color: #6b7e91;
          }
          .pole-show {
            @flex-1();
          }
        }
      }
    }
  }
}
</style>