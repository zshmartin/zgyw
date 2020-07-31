<template>
  <!-- 用于同比分析、电费分析、能源统计、抄表-->
  <div ref="myEchart" class="_chart"></div>
</template>

<script>
import echarts from "echarts";
export default {
  props: ["dataObj", "legend"],
  data() {
    return {
      myChart: "",
      classPrefix: "polyline",
      series: [
        // {
        //   name: "蒸发量",
        //   type: "bar",
        //   data: [
        //     2.0,
        //     4.9,
        //     7.0,
        //     23.2,
        //     25.6,
        //     76.7,
        //     135.6,
        //     162.2,
        //     32.6,
        //     20.0,
        //     6.4,
        //     3.3
        //   ],
        //   markPoint: {
        //     data: [
        //       { type: "max", name: "最大值" },
        //       { type: "min", name: "最小值" }
        //     ]
        //   },
        //   markLine: {
        //     data: [{ type: "average", name: "平均值" }]
        //   }
        // },
        // {
        //   name: "降水量",
        //   type: "bar",
        //   data: [
        //     2.6,
        //     5.9,
        //     9.0,
        //     26.4,
        //     28.7,
        //     70.7,
        //     175.6,
        //     182.2,
        //     48.7,
        //     18.8,
        //     6.0,
        //     2.3
        //   ],
        //   markPoint: {
        //     data: [
        //       { type: "max", name: "最大值" },
        //       { type: "min", name: "最小值" }
        //     ]
        //   },
        //   markLine: {
        //     data: [{ type: "average", name: "平均值" }]
        //   }
        // }
      ],
      // legend: ["蒸发量", "降水量"],
      // legend: [],
      // xAxis: [
      //   "1月",
      //   "2月",
      //   "3月",
      //   "4月",
      //   "5月",
      //   "6月",
      //   "7月",
      //   "8月",
      //   "9月",
      //   "10月",
      //   "11月",
      //   "12月"
      // ]
      xAxis: []
    };
  },
  watch: {
    dataObj(newValue) {
      // this.legend = ["今年", "去年"];
      this.xAxis = newValue.xNum;
      this.series = [
        {
          name: this.legend[0],
          type: "bar",
          data: newValue.series[0].data,
          markPoint: {
            data: [
              { type: "max", name: "最大值" },
              { type: "min", name: "最小值" }
            ]
          },
          markLine: {
            data: [{ type: "average", name: "平均值" }]
          }
        },
        {
          name: this.legend[1],
          type: "bar",
          data: newValue.series[1].data,
          // data: [1,300,56],
          markPoint: {
            data: [
              { type: "max", name: "最大值" },
              { type: "min", name: "最小值" }
            ]
          },
          markLine: {
            data: [{ type: "average", name: "平均值" }]
          }
        }
      ];
      // return;

      this.initChart();
      // }
    }
    // dataObj(newValue, oldValue) {

    // }
  },
  methods: {
    // 图表初始化数据
    initChart() {
      if (this.myChart) {
        this.myChart.clear();
      }
      // this.$refs.myEchart.style.width = window.innerWidth / 2 - 20 + 'px';
      let myChart = echarts.init(this.$refs.myEchart);
      this.myChart = myChart;
      window.addEventListener("resize", function() {
        myChart.resize();
      });
      this.myChart.resize();

      // alert(1)
      this.myChart.setOption({
        // title: {
        //   text: "某地区蒸发量和降水量",
        //   subtext: "纯属虚构"
        // },
        color: [
          "rgba(247, 96, 77,1)",
          "rgba(215, 215, 104,1)",
          "rgba(56, 137, 252,1)",
          "rgba(168, 213, 130,1)",
          "rgba(157, 102, 204,1)"
        ],
        tooltip: {
          trigger: "axis"
        },
        legend: {
          // data: ["蒸发量", "降水量"]
          data: this.legend,
          textStyle: {
            color: "rgba(255,255,255)"
          }
        },
        grid: {
          left: "3%",
          right: "6%",
          bottom: "12%",
          top: "12%",
          containLabel: true
        },
        toolbox: {
          show: true,
          feature: {
            // dataView: { show: true, readOnly: false },
            // magicType: { show: true, type: ["line", "bar"] },
            // restore: { show: true },
            // saveAsImage: { show: true }
          }
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            data: this.xAxis,
            axisLabel: {
              // interval: this.dataObj ? this.dataObj.trans : 1,
              textStyle: {
                color: "rgba(204,204,204)",
                fontSize: "12"
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: {
              textStyle: {
                color: "rgba(204,204,204)",
                fontSize: "12"
              }
            }
          }
        ],
        series: this.series
      });
    }
  },
  mounted() {
    let obj = this.$refs.myEchart;
    if (obj) {
      this.initChart();
    }
    // setTimeout(() => {
    //   this.series = [
    //     {
    //       type: 'line',
    //       data: [100,45,67]
    //     }
    //   ]
    //   this.initChart()
    // },3000)
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.myChart.resize);
  }
};
</script>

<style scoped>
.polyline {
  width: 100%;
  height: 100%;
}
._chart {
  /* &_chart{ 
  height: 380px;
  width: 520px;
  } */
  width: 100%;
  height: 100%;
}
</style>