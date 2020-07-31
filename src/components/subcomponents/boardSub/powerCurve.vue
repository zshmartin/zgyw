<template>
  <!-- 今日用能曲线 -->
  <div class="wrapper">
    <div class="config" v-show="ifEdit">
      <el-button size="mini" @click="editBoard" type="text">配置</el-button>
      <el-button size="mini" @click="delBoard" type="text">删除</el-button>
    </div>
    <div
      style="height: 20px; background-color: #54657D; padding: 5px; color: #fff; font-weight: bold; border-bottom: 1px solid #ccc;"
    >
      <span>
        <i class="icon iconfont iconzhexiantu" style="color: #0eceec"></i>
        <span>{{JSON.parse(item.param).title}}</span>
      </span>
    </div>

    <div class="chart" id="line-chart" ref="chart"></div>
  </div>
</template>

<script>
import Echart from "Echarts";
import {deepClone} from '../../../utils/index.js';
export default {
  props: ["i", "item", "ifEdit"],
  data() {
    return {
      time: '',     //定时器
      scale: 1,
      code: "", //变量集合
      codeName: '',   //名称合集
      type: "",
      powerType: "",
      // codeShow: '',       //变量展示集合
      codeName: "", //自定义名称或默认名称集合
      // 曲线数据
      lineObj: {
        timeX: [], //横坐标
        series: []
      },
      xData: [],
      timeType: "",
      timeInterval: "", //日曲线为没小时的05分刷新数据
      timeTimeout: "", //每隔一个小时
      chart: "", ///图表实例
      noRepeat_render: null //用于防止曲线的重复刷新
    };
  },
  // mounted() {
  //   this.drawChart();
  // },
  computed: {
    ifReFrash() {}
  },
  watch: {
    item: {
      handler(newValue) {
        console.log(1)
        var arr = [];
        var arr1 = [];
        this.type = JSON.parse(newValue.param).timeType;
        this.powerType = JSON.parse(newValue.param).powerType;
        if (newValue.datas.data && newValue.datas.data.length) {
          for (var j = 0; j < newValue.datas.data.length; j++) {
            arr.push(newValue.datas.data[j].data);
            // 名称为空，则变量名补上
            arr1.push(
              newValue.datas.data[j].name
                ? newValue.datas.data[j].name
                : newValue.datas.data[j].variableName
            );
          }
          this.code = arr.join(",");
          this.codeName = arr1.join(",");
        }
      },
      deep: true
    },
    // 监听日期类型
    type() {
      this.getData()
    },
    // 监听能耗类型
    powerType() {
      this.getData()
    },
    // 监听变量
    code() {
      this.getData()
    },
    // 监听名称
    codeName() {
      this.getData()
    }
  },
  created() {},
  mounted() {},
  beforeDestroy() {
    // 关闭定时器
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
    if (this.timeTimeout) {
      clearTimeout(this.timeTimeout);
    }
  },
  methods: {
    // 控制获取数据频率
    getData() {
      if (this.time) {
        clearTimeout(this.time);
      }
      this.time = setTimeout(() => {
        this.frashChart();
      }, 1000);
    },
    // 重新刷数据
    frashChart() {
      // return 
      // 设置定时，防止重复绘图
      if (this.noRepeat_render) {
        clearTimeout(this.noRepeat_render);
      }
      this.noRepeat_render = setTimeout(() => {
        var time = new Date();
        var currentTime = "";
        // console.log(this.item);
        // console.log(time.toLocaleString().split('/').join(''))
        // var currentTime = JSON.parse(this.item.param).timeType + '_' + time.toLocaleString().split('/').join('')
        if (JSON.parse(this.item.param).timeType === "day") {
          // 获取的时间加8小时再使用toJSON就是北京时间
          currentTime =
            JSON.parse(this.item.param).timeType +
            "_" +
            new Date(Date.parse(new Date()) + 1000 * 60 * 8)
              .toJSON()
              .split("-")
              .join("")
              .slice(0, 8);
        } else if (JSON.parse(this.item.param).timeType === "month") {
          currentTime =
            JSON.parse(this.item.param).timeType +
            "_" +
            new Date(Date.parse(new Date()) + 1000 * 60 * 8)
              .toJSON()
              .split("-")
              .join("")
              .slice(0, 6);
        } else {
          currentTime =
            JSON.parse(this.item.param).timeType +
            "_" +
            new Date(Date.parse(new Date()) + 1000 * 60 * 8)
              .toJSON()
              .split("-")
              .join("")
              .slice(0, 4);
        }
        console.log(currentTime);
        if (this.code) {
          if (this.timeInterval) {
            clearInterval(this.timeInterval);
          }
          if (this.timeTimeout) {
            clearTimeout(this.timeTimeout);
          }
          this.getLine(currentTime);
          // 日报表设置另个定时器，非日报表不做定时器
          if (JSON.parse(this.item.param).timeType != "day") {
            return;
          }
          // 下一个整点零五分关闭一个定时器，开启另外一个定时器
          var nextClock = new Date();
          var now = new Date();
          nextClock.setHours(now.getHours() + 1);
          nextClock.setMinutes(5);
          nextClock.setSeconds(0);
          this.timeTimeout = setTimeout(() => {
            this.getLine(currentTime);
            this.timeInterval = setInterval(() => {
              this.getLine(currentTime);
            }, 1000 * 60 * 60);
          }, nextClock - now);
        } else {
          var timeType = JSON.parse(this.item.param).timeType || "day";
          var obj = this.getSeries(JSON.parse(this.item.param).timeType, []);
          this.lineObj.series = obj.series;
          this.lineObj.timeX = obj.arr;
          // return;
          // 重绘图表
          // this.chart.clear()
          this.drawChart();
        }
      }, 200);
    },
    // 获取数据格式
    getSeries(type, data) {
      var arr = [];
      var scale = 1; //显示缩放
      if (type === "month") {
        for (var i = 1; i <= 31; i++) {
          arr.push(i);
        }
        scale = 2;
      } else if (type === "day") {
        for (var i = 0; i <= 23; i++) {
          // 修改匹配规则
          var i1;
          if (i < 10) {
            i1 = "0" + i;
          } else {
            i1 = i;
          }
          arr.push(i1);
        }
        scale = 2;
      } else if (type === "year") {
        for (var i = 1; i <= 12; i++) {
          arr.push(i);
        }
        scale = 1;
      }
      var series = [];
      console.log(data);
      for (var j = 0; j < data.length; j++) {
        series[j] = {
          name: data[j].branch,
          type: "line",
          data: []
        };
        for (var k = 0; k < arr.length; k++) {
          var ifTrue = false;
          for (var l = 0; l < data[j].data.length; l++) {
            for (var key in data[j].data[l]) {
              if (data[j].data[l].time == arr[k]) {
                series[j].data.push(data[j].data[l].value);
                ifTrue = true;
                break;
              }
            }
          }
          if (!ifTrue) {
            series[j].data.push(null);
          }
        }
      }
      var obj = {
        series: series,
        arr: arr
      };
      return obj;
    },
    // 绘图
    drawChart() {
      if (this.chart) {
        this.chart.clear();
      }
      let chart = Echart.init(this.$refs.chart);
      this.chart = chart;

      // 监听屏幕变化自动缩放图表
      window.addEventListener("resize", function() {
        chart.resize();
      });
      chart.resize();
      // 绘制图表
      chart.setOption({
        // title: {
        //   text: "折线图堆叠"
        // },
        // color: ["#32A8E6", "#FF954A", "#45E2CF", "#EE5196", "#Eaf"], //默认颜色
        color: JSON.parse(this.item.param).color, //默认颜色
        tooltip: {
          trigger: "axis"
        },
        legend: {
          // data: ["邮件营销", "联盟广告", "视频广告", "直接访问", "搜索引擎"]
          // data: this.code.split(",")
          data: this.codeName.split(","),
          textStyle: {
            color: "#fff"
          }
          // data: ['aaa']
        },
        grid: {
          top: "25",
          left: "3%",
          right: "4%",
          bottom: "1%",
          containLabel: true
        },
        toolbox: {
          feature: {
            // saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          // data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
          data: this.lineObj.timeX,
          axisLine: {
            lineStyle: {
              color: "#fff"
            }
          }
        },
        yAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#fff"
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "rgba(100, 90, 122)"
            }
          }
        },
        series: this.lineObj.series
        // series: [
        //   {
        //     data: [120, 132, 101, 134, 90, 230, 210],
        //     name: "邮件营销",
        //     type: "line"
        //   }
        // ]
      });
    },
    
    // 请求数据
    getLine(currentTime) {
      var arr = [];
      var arr1 = [];
      this.type = JSON.parse(this.item.param).timeType;
      this.powerType = JSON.parse(this.item.param).powerType;
      if (this.item.datas.data && this.item.datas.data.length) {
        for (var j = 0; j < this.item.datas.data.length; j++) {
          arr.push(this.item.datas.data[j].data);
          // 名称为空，则变量名补上
          arr1.push(
            this.item.datas.data[j].name
              ? this.item.datas.data[j].name
              : this.item.datas.data[j].variableName
          );
        }
        this.code = arr.join(",");
        this.codeName = arr1.join(",");
      }
      this.$http
        .get("equipment/energyBranch/todayPowerCurve", {
          params: {
            // code: this.code,
            // type: JSON.parse(this.item.param).timeType,
            // tb: currentTime
            // boardId: this.item.id
            names: this.codeName,
            codes: this.code,
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            console.log(res);

            var obj = this.getSeries(
              "day",
              res.data.data
            );
            this.lineObj.series = obj.series;
            this.lineObj.timeX = obj.arr;
            // 重绘图表
            this.drawChart();
          }
        });
    },
    editBoard() {
      this.$emit("editBoard", this.i, this.item);
    },
    delBoard() {
      this.$emit("delBoard", this.i, this.item);
    }
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
@import "../../../assets/css/index.less";
.wrapper {
  width: 100%;
  height: 100%;
  background-color: #4e657a;
  .config {
    float: right;
    cursor: pointer;
  }
  .chart {
    height: calc(100% - 30px);
    background-size: 100% 100%;
  }
}
</style>