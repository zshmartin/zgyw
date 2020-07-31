<template>
  <!-- 大屏水位图 -->
  <div ref="chart" class="area"></div>
</template>

<script>
import echarts from "echarts";
export default {
  props: ["resource"],
  data() {
    return {
      option: {
        backgroundColor: "rgba(40, 13, 59, 0.5)",
        graphic: [
          {
            type: "group",
            left: "center",
            top: "60%",
            children: [
              {
                type: "text",
                z: 100,
                left: "10",
                top: "middle",
                style: {
                  fill: "#aab2fa",
                  text: "流量统计",
                  font: "20px Microsoft YaHei"
                }
              }
            ]
          }
        ],
        series: [
          {
            type: "liquidFill",
            radius: "70%",
            center: ["50%", "40%"],
            // data: [0.48],
            data: this.resource
              ? this.resource.length > 2
                ? [this.resource[3] / 100]
                : [this.resource[1] / 100]
              : [0.48],
            color: ["rgb(60, 105, 141)"],
            amplitude: "8%",
            waveLength: "80%",
            phase: "auto",
            period: "auto",
            direction: "right",
            shape: "circle",
            waveAnimation: true,
            animationEasing: "linear",
            animationEasingUpdate: "linear",
            animationDuration: 2000,
            animationDurationUpdate: 1000,
            outline: {
              show: false,
              borderDistance: 8,
              itemStyle: {
                color: "none",
                borderColor: "#294D99",
                borderWidth: 8,
                shadowBlur: 20,
                shadowColor: "rgba(0, 0, 0, 0.25)"
              }
            },

            backgroundStyle: {
              // color: "#E3F7FF"
              color: "rgb(138, 138, 150)"
            },

            itemStyle: {
              opacity: 0.95,
              shadowBlur: 50,
              shadowColor: "rgba(0, 0, 0, 0.4)"
            },
            label: {
              show: true,
              color: "#294D99",
              insideColor: "#fff",
              fontSize: 50,
              fontWeight: "bold",
              align: "center",
              baseline: "middle",
              position: "inside"
            },
            emphasis: {
              itemStyle: {
                opacity: 0.8
              }
            }
          }
        ]
      }
    };
  },
  watch: {
    // 接受传值，更新数据
    resource(newVal) {
      this.option.series[0].data = newVal
        ? newVal.length > 2
          ? [newVal[3] / 100]
          : [newVal[1] / 100]
        : [0.48];
      this.option.graphic[0].children[0].style.text = newVal ? newVal[0] : ''
      this.initChart();
    }
  },
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      // 解决图表只剩下100px的问题
      setTimeout(() => {
        let myChart = echarts.init(this.$refs.chart);
        myChart.setOption(this.option);
      }, 100);
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