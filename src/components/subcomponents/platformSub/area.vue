<template>
<!-- 曲线图加颜色渐变 -->
  <div ref="chart" class="area"></div>
</template>

<script>
import echarts from "echarts";
export default {
  data() {
    return {
      option: {
        color: ["rgb(45, 124, 162)"],
        // 鼠标悬停显示的信息
        tooltip: {
          // 当tooltip的trigger为‘axis’时，显示多项数据内容数组
          trigger: "axis"
        },
        grid: {
          left: "3%",
          right: "2%",
          bottom: "3%",
          top: "12%",
          containLabel: true
          // show: true,
          // borderColor: 'rgba(200,200,200,0.3)',
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          axisLabel: {
            interval: this.dataObj ? this.dataObj.trans : 1,
            textStyle: {
              color: "#ccc",
              fontSize: "12"
            }
            // rotate: -60
          }
        },
        yAxis: {
          type: "value",
          axisLabel: {
            interval: this.dataObj ? this.dataObj.trans : 1,
            textStyle: {
              color: "#ccc",
              fontSize: "12"
            }
            // rotate: -60
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "rgba(100, 90, 122)"
            }
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        },
        // 数据缩放
        dataZoom: [
          {
            type: "inside"
          }
        ],
        series: [
          {
            data: [820, 932, 901, 934, 1290, 656, 1320],
            type: "line",
            areaStyle: {},
            smooth: true,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(42, 122, 212)"
                },
                {
                  offset: 1,
                  color: "rgb(200, 200, 200)"
                }
              ])
            },
            markLine: {
              /*以下设置一行后，平均线就没有开始和结束标记了（即看不见箭头了）*/
              // symbol: "none",
              data: [
                {
                  name: "平均线",
                  // 支持 'average', 'min', 'max'
                  type: "average",
                  lineStyle: {
                    normal: {
                      color: "rgb(58, 100, 160)",
                      width: 2,
                      type: "dashed"
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    };
  },
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      let myChart = echarts.init(this.$refs.chart);
      myChart.setOption(this.option);
    }
  }
};
</script>

<style lang="less" scoped>
.area {
  width: 100%;
  height: 100%;
}
</style>