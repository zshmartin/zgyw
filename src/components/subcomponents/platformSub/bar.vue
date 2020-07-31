<template>
  <div :class="classPrefix">
    <div ref="myEchart" :class="classPrefix+'_chart'"></div>
  </div>
</template>

<script type="text/babel">
import echarts from "echarts";
export default {
  // props: ["dataObj"],
  props: ['color'],
  data() {
    return {
      classPrefix: "polyline",
      myChart: "",
      xNum: ["张三组", "张四组", "张五组", "张六组", "张七组", "张八组"],
      yNum: ["阶段1评审", "阶段2评审"],
      yNum: [],
      // 内容数据
      series: []
    };
  },
  watch: {
    // dataObj(newValue, oldValue) {
    //   // 清除实例
    //   this.myChart.clear();
    //   console.log(newValue);
    //   this.xNum = this.dataObj.xNum;
    //   this.yNum = this.dataObj.yNum;
    //   this.series = this.dataObj.series;
    //   this.initChart();
    // }
  },
  methods: {
    // 图表初始化数据
    initChart() {
      // 内容数据
      this.series = [
        {
          type: "bar", //类型
          barWidth: 24, //修改柱状图的宽度
          label: {
            //图形上的文本标签
            normal: {
              show: true,
              // formatter: '{c}',
              formatter: function(v) {
                var val = v.data;
                if (val == 0) {
                  return "";
                }
                return val;
              }
            }
          },
          // 柱状图形显示的颜色
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(
                0,
                1,
                0,
                0,
                [
                  {
                    offset: 0,
                    color: this.color ? this.color[0] : "white"  // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: this.color ? this.color[1] : "orange" // 100% 处的颜色
                  }
                ],
                false
              )
            }
          },
          data: [15, 30, 35, 20, 40, 25]
        }
      ];
      let myChart = echarts.init(this.$refs.myEchart);
      myChart.resize();
      window.addEventListener("resize", function() {
        myChart.resize();
      });
      this.myChart = myChart;
      myChart.setOption({
        // 鼠标悬停显示的信息
        tooltip: {
          // 当tooltip的trigger为‘axis’时，显示多项数据内容数组
          trigger: "axis",
          axisPointer: {
            //默认为直线，可选为：'line' | 'shadow'
            type: "shadow" //阴影
          }
          // formatter: "{b} <br> 合格率: {c}%"
        },
        color: ["skyblue", "orange"],
        legend: {
          data: this.yNum,
          textStyle: {
            color: "#fff"
          }
        },
        grid: {
          left: "3%",
          right: "6%",
          bottom: "3%",
          top: "12%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: true,
          data: this.xNum,
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
          },
          dataZoom: [
            {
              type: "inside"
            }
          ],
          
          // min: 0,
          // max: 100,
          // interval: 20,
          // axisLabel: {
          //   formatter: "{value} %"
          // }
        },
        series: this.series
      });
    }
  },
  mounted() {
    let obj = this.$refs.myEchart;
    if (obj) {
      this.initChart();
    }
  }
};
</script>

<style scoped>
.polyline {
  width: 100%;
  height: 100%;
}
.polyline_chart {
  /* &_chart{ 
  height: 380px;
  width: 520px;
  } */
  width: 100%;
  height: 100%;
}
</style>