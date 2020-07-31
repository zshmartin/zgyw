<template>
  <!-- 用于总能耗、能源统计 -->
  <div :class="classPrefix">
    <div ref="myEchart" :class="classPrefix+'_chart'"></div>
  </div>
</template>

<script type="text/babel">
import echarts from "echarts";
export default {
  props: ["dataObj"],
  data() {
    return {
      classPrefix: "polyline",
      myChart: "",
      xNum: [
        // "张三组",
        // "李四组",
        // "王五组"
        // "刘四组",
        // "张三组",
        // "李四组",
        // "王电饭锅五组",
        // "刘四组",
        // "王五2组",
        // "刘四2组"
      ],
      // yNum: ["阶段1评审", "阶段2评审", "阶段3评审", "阶段4评审", "阶段5评审"],
      yNum: [],
      series: [
        {
          name: "阶段1评审",
          type: "line",
          // data: [20, 32, 1, 34, 20, 30, 10, 21, 34, 2]
          data: [null, null, null, null, null, null, null, null, null, null]
        }
        // {
        //   name: "阶段2评审",
        //   type: "line",
        //   data: [22, 52, 31, 34, 39, 30, 10, 42, 23, 1]
        // },
        // {
        //   name: "阶段3评审",
        //   type: "line",
        //   stack: "评审3",
        //   data: [10, 22, 1, 54, 50, 30, 10, 12, 21, 42]
        // },
        // {
        //   name: "阶段4评审",
        //   type: "line",
        //   stack: "评审4",
        //   data: [34, 32, 13, 34, 70, 30, 20, 12, 12, 4]
        // },
        // {
        //   name: "阶段5评审",
        //   type: "line",
        //   stack: "评审5",
        //   data: [30, 12, 1, 34, 20, 30, 10, 56, 12, 12]
        // }
      ] // 折线图数据
      // series: [
      //   {
      //     type: 'line',
      //     // data: [1,3,5]
      //     data: [null,null,null]
      //   }
      // ]
    };
  },
  watch: {
    dataObj: {
      handler(newValue) {
        // alert(1);
        this.myChart.clear();
        console.log(newValue);
        this.xNum = this.dataObj.arrX;
        // this.series = this.dataObj.arr
        this.series = [
          {
            type: "line",
            data: this.dataObj.arr
          }
        ];
        this.initChart();
      },
      deep: true
    }
  },
  methods: {
    // 图表初始化数据
    initChart() {
      let myChart = echarts.init(this.$refs.myEchart);
      myChart.resize();
      window.addEventListener("resize", function() {
        myChart.resize();
      });
      this.myChart = myChart;
      myChart.setOption({
        tooltip: {
          trigger: "axis"
        },
        // legend: {
        //   data: this.yNum
        // },
        grid: {
          left: "3%",
          right: "6%",
          bottom: "3%",
          top: "12%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.xNum,
          axisLabel: {
            interval: this.dataObj ? this.dataObj.trans : 1,
            // rotate: -60,
            textStyle: {
              color: "#ccc",
              fontSize: "12"
            }
          }
        },
        yAxis: {
          type: "value",
          axisLabel: {
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