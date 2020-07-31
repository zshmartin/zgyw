
<template>
  <!--为echarts准备一个具备大小的容器dom-->
  <div id="main" style="width: 100%;height: 100%;"></div>
</template>
<script>
import echarts from "echarts";
export default {
  // props: ["dataArr", "titleArr"],
  name: "",
  data() {
    return {
      charts: "",
      opinion: ["电", "水", "天然气", "石油"],
      opinionData: [
        { value: 335, name: "电" },
        { value: 310, name: "水" },
        { value: 234, name: "天然气" },
        { value: 135, name: "石油" },
      ]
      // opinion: [],
      // opinionData: []
    };
  },
  watch: {
    dataArr() {
      this.opinion = this.titleArr;
      this.opinionData = this.dataArr;
      this.drawPie("main");
    }
  },
  methods: {
    drawPie(id) {
      if (this.charts) {
        this.charts.clear();
      }
      this.charts = echarts.init(document.getElementById(id));
      var _this = this;
      window.addEventListener("resize", function() {
        _this.charts.resize();
      });
      this.charts.resize();
      this.charts.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a}<br/>{b}:{c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          x: "left",
          data: this.opinion,
          textStyle: {
            color: "#ccc"
          }
        },
        series: [
          {
            name: "能耗类型",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "right"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "30",
                  fontWeight: "blod"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: this.opinionData,
            itemStyle: {
              emphasis: {},
              normal: {
                color: function(params) {
                  var colorList = [
                    "rgb(215, 215, 104)",
                    "rgb(56, 137, 252)",
                    "rgb(247, 96, 77)",
                    "rgb(168, 213, 130)",
                    "rgb(157, 102, 204)"
                  ];
                  return colorList[params.dataIndex];
                }
              }
            }
          }
        ]
      });
    }
  },
  //调用
  mounted() {
    this.$nextTick(function() {
      this.drawPie("main");
    });
  }
};
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
