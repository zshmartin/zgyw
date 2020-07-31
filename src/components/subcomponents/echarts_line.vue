<template>
  <div class="echart">
    <!--------------------- 曲线图，用于变量曲线,设备参数监控 ------------------->
    <div class="title">
      <!-- <span>API</span> -->
      <el-tooltip :content="line_obj.name" placement="top-start" effect="light">
        <el-button type="text" style="color: #fff; font-size: 16px;">{{line_obj.name}}</el-button>
      </el-tooltip>
      <!-- <a href="javascript:void(0)" @click="delete_line" class="btn">删除</a> -->
      <div class="btn">
        <el-button @click="addToCompare" size="mini" type="warning">+ 添加对比</el-button>
        <el-button @click="check_line" size="mini" type="warning" icon="el-icon-edit">配置</el-button>
        <el-button @click="delete_line" size="mini" type="danger" icon="el-icon-delete">删除</el-button>
      </div>
    </div>
    <!-- <div class="chart" ref="statistics"></div> -->
    <div ref="myEchart" class="_chart"></div>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  props: ["line_obj"],
  data() {
    return {
      // statistics: {
      //   option: null,
      //   chart: null,
      //   element: null
      // }
      option: {}
    };
  },
  watch: {},
  mounted() {
    window.addEventListener("resize", this.onWindowResize);
    this.onWindowResize();
    let obj = this.$refs.myEchart;
    if (obj) {
      this.$nextTick(() => {
        this.initChart();
      });
    }
  },
  destory() {
    window.onresize = null;
  },
  methods: {
    onWindowResize() {
      this.$nextTick(() => {
        this.initChart();
      });
    },
    initChart() {
      if (this.myChart) {
        this.myChart.clear();
      }
      let myChart = echarts.init(this.$refs.myEchart);
      myChart.resize();
      window.addEventListener("resize", function() {
        myChart.resize();
      });
      this.myChart = myChart;
      this.option = {
        // color: [
        //   "rgba(247, 96, 77)",
        //   "rgba(215, 215, 104)",
        //   "rgba(56, 137, 252)",
        //   "rgba(168, 213, 130)",
        //   "rgba(157, 102, 204)"
        // ],
        // color: [
        //   'yellow','green','red'
        // ],
        color: this.line_obj.color,
        title: {
          text: this.line_obj.name,
          show: false
        },
        tooltip: {
          trigger: "axis"
        },
        // toolbox: {
        //   feature: {
        //     saveAsImage: {}
        //   }
        // },
        legend: {
          data: this.line_obj.code,
          textStyle: {
            color: "#fff"
          },
          itemHeight: 20,
          type: 'scroll',
          // data: ['258_10']
          // data: this.line_obj.code
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          top: "26",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          // splitNumber: 20,
          // min: "dataMin",
          // max: "dataMax",
          axisLabel: {
            show: true,
            // interval: this.line_obj.trans,
            textStyle: {
              color: "#ccc",
              fontSize: "12"
            }
          },
          // data: [1,2,3,4,5],
          data: this.line_obj.xData
          // data: [1,2,3,4,5],
        },
        yAxis: {
          type: "value",
          axisLabel: {
            show: true,
            // interval: this.line_obj.trans,
            textStyle: {
              color: "#ccc",
              fontSize: "12"
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "rgba(100, 90, 122)"
            }
          }
        },
        // series: [{
        //   // data: [[1,3],['01:30',8],[25,'64'],[100,16]],
        //   data: this.line_obj.data[0].data,
        //   // data: this.data1,
        //   type: 'line'
        // }]
        series: this.line_obj.data
        // series: [
        //   {
        //     name: '258_10',
        //     type: 'line',
        //     stack: '总量',
        //     data: [15,null,96,15,48,200,100]
        //   }
        // ]
      };

      this.myEchart = echarts.init(this.$refs.myEchart);
      if (this.myEchart) {
        this.myEchart.clear();
      }
      this.myEchart.setOption(this.option);
    },
    // 删除单个图表传值给父组件
    delete_line() {
      this.$emit("delete_line", this.line_obj.id);
    },
    check_line() {
      this.$emit("check_line", this.line_obj.id);
    },
    addToCompare() {
      this.$emit("addToCompare", this.line_obj);
    }
  }
};
</script>

<style scoped>
.echart {
  display: inline-block;
  /* background-color: #eee; */
  /* margin: 0 1px; */
  box-sizing: border-box;
  border-radius: 4px;
  width: 100%;
  height: 100%;
}

.title {
  height: 40px;
  position: relative;
}

.title .el-tooltip {
  /* margin-top: 10px; */
  width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border: none;
}

.title span {
  font-size: 26px;
}

.title .el-tooltip {
  width: 270px;
  text-align: left;
  padding-left: 10px;
}

.title .btn {
  right: 20px;
  position: absolute;
  top: 10px;
}

._chart {
  border-right: 0;
  border-left: 0;
  /* width: 680px;
  height: 250px; */
  width: 100%;
  height: calc(100% - 48px);
  /* background-color: white; */
}
</style>
