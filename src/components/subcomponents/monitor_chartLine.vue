<template>
<!-- 使用于设备参数监控的曲线图显示 -->
  <div
    style="display: inline-block; margin-right: 10px; margin-bottom: 10px; width: 100%; min-height: 300px; height: 100%;"
  >
    <div class="testEcharts" ref="statistics"></div>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  props: ["line_total"],
  data() {
    return {
      statistics: {
        option: null,
        chart: null,
        element: null
      },
      option: {},
      myChart: null,
    };
  },
  watch: {
    line_total: {
      handler(newVal, oldVal) {
        this.initData();
      },
      deep: true
    }
  },
  mounted() {
    window.addEventListener("resize", this.onWindowResize);
    this.onWindowResize();
  },
  beforeDestroy() {
    window.resize = null;
  },
  methods: {
    onWindowResize() {
      this.initData();
      this.myChart.resize();
    },
    initData() {
      if(this.myChart) {
        this.myChart.clear()
      }
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
        color: this.line_total.color,
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: this.line_total.code,
          textStyle: {
            color: "#fff"
          },
          itemHeight: 20
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        calculable: false,
        xAxis: {
          type: "category",
          boundaryGap: false,
          axisLabel: {
            show: true,
            textStyle: {
              color: "#ccc",
              fontSize: "12"
            }
          },
          data: this.line_total.xData
        },
        yAxis: {
          type: "value",
          axisLabel: {
            show: true,
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

        series: this.line_total.data
      };
      this.myChart = echarts.init(this.$refs.statistics)
      if(this.myChart) {
        // this.$nextTick( () => {
          this.myChart.clear()
        // })
      }
      this.myChart.setOption(this.option)
    },
    // 删除单个图表传值给父组件
    delete_line() {
      this.$emit("delete_line", this.line_obj.id);
    },
    check_line() {
      this.$emit("check_line", this.line_obj.id);
    }
  }
};
</script>
<style scoped>
.title {
  height: 50px;
  position: relative;
}

.title .el-tooltip {
  margin-top: 10px;
  width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border: none;
}

.title span {
  font-size: 26px;
}

.title .btn {
  right: 20px;
  position: absolute;
  top: 10px;
}

.testEcharts {
  border-right: 0;
  border-left: 0;
  /* width: 700px;
  height: 350px; */
  width: 100%;
  height: 100%;
}
</style>
