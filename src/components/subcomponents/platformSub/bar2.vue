<template>
  <div class="bar" :id="idName"></div>
</template>

<script>
import echarts from "echarts";
export default {
  props: ["color"],
  data() {
    return {
      idName: 'my' + new Date().getTime()
    };
  },
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      var option = {
        grid: {
          x: 25,
          x2: 25,
          y: 25,
          y2: 35
        },
        xAxis: [
          {
            type: "category",
            axisLabel: {
              textStyle: {
                color: "#757575"
              }
            },
            offset: 10,
            boundaryGap: false,
            splitLine: {
              show: false
            },
            data: [
              "08/01",
              "08/02",
              "08/03",
              "08/04",
              "08/05",
              "08/06",
              "08/07"
            ],
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            }
          }
        ],
        yAxis: {
          splitLine: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          }
        },
        dataZoom: [
          {
            type: "inside"
          }
        ],
        series: [
          {
            type: "bar",
            barWidth: 8, //柱图宽度
            itemStyle: {
              normal: {
                barBorderRadius: 6,
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      // color: "#f45c3d" // 0% 处的颜色
                      color: this.color ? this.color[0] : "#f45c3d"
                    },
                    {
                      offset: 1,
                      // color: "#f9bf6b" // 100% 处的颜色
                      color: this.color ? this.color[1] : "#f9bf6b" 
                    }
                  ],
                  globalCoord: true // 缺省为 false
                },
                label: {
                  show: true,
                  position: "top",
                  textStyle: {
                    color: "#888888"
                  },
                  formatter: function(params) {
                    if (params.value == 0) {
                      return "";
                    } else {
                      return params.value;
                    }
                  }
                }
              }
            },
            data: [8, 30, 28, 36, 25, 12, 29]
          }
        ]
      };
      var byId = function(id) {
        return document.getElementById(id);
      };
      var lineChart = echarts.init(byId(this.idName));
      // lineChart.setOption(getOption());
      lineChart.setOption(option);
    }
  }
};
</script>

<style scoped>
.bar {
  width: 100%;
  height: 100%;
}
</style>