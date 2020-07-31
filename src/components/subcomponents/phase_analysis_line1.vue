<template>
  <div class="echart">
    <!--------------------- 用于三相不平衡分析曲线 ------------------->
    <div ref="myEchart" class="_chart"></div>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  props: ["line_obj"],
  data() {
    return {
      option: {},
      ifMoreLine: false,        //是否是abc相电压
    };
  },
  watch: {
    line_obj: {
      handler(newValue, oldValue) {
        if (this.myChart) {
          if(newValue.data.length > 1) {
            this.ifMoreLine = true
          }
          this.$nextTick( () => {
            this.initChart();
          })
        }
      },
      deep: true
    }
  },
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
        color: [
          "#409cff"
        ],
        title: {
          // text: this.line_obj.name,
          subtext: '%',
          show: true,
          left: 20,
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: this.line_obj.code,
          // data: ['a','b','c'],
          textStyle: {
            color: "#fff"
          },
          itemHeight: 20
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          top: '42',
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
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
          // max: 100,
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
  /* position: relative; */
}

.title {
  /* height: 40px; */
  /* position: absolute;
  top: 0;
  left: 0; */
}

.title .el-tooltip {
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
  height: calc(100%);
  /* background-color: white; */
}
</style>
