<template>
<!-- 用于电能质量的实时监测 -->
  <div class="gradient" ref="bar"></div>
</template>

<script>
import echarts from "echarts";
export default {
  props: ['harmonicContentVoltage','harmonicContentElectric'],
  data() {
    return {
      myChart: null,
    };
  },
  watch: {
    harmonicContentVoltage: {
      handler() {
        this.initChart('voltage')
      },
      deep: true,
    },
    harmonicContentElectric: {
      handler() {
        this.initChart('electric')
      },
      deep: true,
    },
  },
  mounted() {
    // let obj = this.$refs.bar;
    // if (obj) {
    //   this.initChart();
    // }
  },
  methods: {
    initChart(type) {
      console.log(type)
      var legendArr;
      if(type === 'voltage') {
        legendArr = [
          'A',
          'B',
          'C',
        ]
      }else {
        legendArr = [
          'A',
          'B',
          'C',
        ]
      }
      var dataAxis = [
        "第1次谐波",
        "第2次谐波",
        "第3次谐波",
        "第4次谐波",
        "第5次谐波",
        "第6次谐波",
        "第7次谐波",
        "第8次谐波",
        "第9次谐波",
        "第10次谐波",
        "第11次谐波",
        "第12次谐波",
        "第13次谐波",
        "第14次谐波",
        "第15次谐波",
        "第16次谐波",
        "第17次谐波",
        "第18次谐波",
        "第19次谐波",
        "第20次谐波",
        "第21次谐波",
        "第22次谐波",
        "第23次谐波",
        "第24次谐波",
        "第25次谐波",
        "第26次谐波",
        "第27次谐波",
        "第28次谐波",
        "第29次谐波",
        "第30次谐波",
        "第31次谐波"
      ];
      var yMax = 500;
      var dataShadow = [];
      let option = {
        title: {
          text: type === 'electric' ? '电流谐波 / A' : '电压谐波 / V',
          // subtext: "Feature Sample: Gradient Color, Shadow, Click Zoom"
          textStyle: {
            color: "#ccc",
            fontSize: 14,
          }
        },
        color: ['rgb(211, 212, 104)', 'rgb(78, 212, 183)', 'rgb(247, 96, 77)'],
        legend: {
          data: legendArr,
          textStyle: {
            color: '#ccc'
          }
        },
        tooltip: {
          // 当tooltip的trigger为‘axis’时，显示多项数据内容数组
          trigger: "axis",
          
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
          data: dataAxis,
          axisLabel: {
            show: true,
            // inside: true,
            textStyle: {
              color: "#fff"
            }
          },
          // axisTick: {
          //   show: false
          // },
          // axisLine: {
          //   show: false
          // },
          z: 10
        },
        yAxis: {
          type: 'value',
          // axisLine: {
          //   show: false
          // },
          // axisTick: {
          //   show: false
          // },
          axisLabel: {
            textStyle: {
              color: "#999"
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "rgba(100, 90, 122)"
            }
          }
        },
        // 数据缩放
        dataZoom: [
          {
            type: "inside"
          }
        ],
        series: this.harmonicContentVoltage ? this.harmonicContentVoltage : this.harmonicContentElectric,
        // series: [
        //   {
        //     name: "A",
        //     type: "bar",
        //     data: [320, null, 301, 334, 390]
        //   },
        //   {
        //     name: "B",
        //     type: "bar",
        //     data: [220, 182, 191, null, 290]
        //   },
        //   {
        //     name: "C",
        //     type: "bar",
        //     data: [150, 232, 201, 154, 190]
        //   }
        // ]
      };
      for (var i = 0; i < dataAxis.length; i++) {
        dataShadow.push(yMax);
      }
      let myChart = echarts.init(this.$refs.bar);
      this.myChart = myChart
      if(this.myChart) {
        this.myChart.clear()
      }
      myChart.resize();
      window.addEventListener("resize", function() {
        myChart.resize();
      });
      myChart.setOption(option);
      // Enable data zoom when user click bar.
      var zoomSize = 6;
      myChart.on("click", function(params) {
        console.log(dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)]);
        myChart.dispatchAction({
          type: "dataZoom",
          startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
          endValue:
            dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
        });
      });
    }
  }
};
</script>

<style>
.gradient {
  width: 100%;
  height: 100%;
}
</style>