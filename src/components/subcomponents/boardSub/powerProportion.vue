<template>
<!-- 用能占比 -->
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

    <div class="chart" ref="chart"></div>
  </div>
</template>

<script>
import watchSize from "../../../utils/watchSize";
import Echart from "Echarts";

export default {
  props: ["i", "item", "ifEdit"],
  data() {
    return {
      timeType: "",
      code: "", //变量集合
      powerType: "",
      scale: 1,
      type: "",
      // codeShow: '',       //变量展示集合
      codeName: "", //自定义名称或默认名称集合
      lineColor: "",
      // 曲线数据
      lineObj: {
        timeX: [], //横坐标
        series: []
      },
      xData: [],
      code: "",

      
      timeInterval: "", //日曲线为没小时的05分刷新数据
      timeTimeout: "", //每隔一个小时
      chart: "", ///图表实例
      noRepeat_render: null, //用于防止曲线的重复刷新
      pieData: [], //饼状数据
      time: '',       //定时器
    };
  },
  watch: {
    item: {
      handler(newValue) {
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
          this.codeName = arr1.join(',')
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
      console.log(this.code)
      this.getData()
    },
    codeName() {
      console.log(this.code)
      this.getData()
    }
  },
  computed: {
    ifReFrash() {}
  },
  created() {},
  mounted() {
    watchSize.bind(this.$refs.chart, () => {
      this.drawChart();
    });
  },
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
    drawChart() {
      // 基于准备好的dom，初始化echarts实例
      let chart = Echart.init(this.$refs.chart);
      console.log(chart);
      // 监听屏幕变化自动缩放图表
      window.addEventListener("resize", function() {
        chart.resize();
      });
      chart.resize();
      // 绘制图表
      chart.setOption({
        // 调色盘颜色列表。如果系列没有设置颜色，则会依次循环从该列表中取颜色作为系列颜色
        color: ["#32A8E6", "#FF954A", "#45E2CF", "#EE5196", "#Eaf"],
        // 图表主标题
        title: {
          // text: "用户访问来源", // 主标题文本，支持使用 \n 换行
          top: 10 / this.scale, // 定位 值: 'top', 'middle', 'bottom' 也可以是具体的值或者百分比
          left: "center", // 值: 'left', 'center', 'right' 同上
          textStyle: {
            // 文本样式
            fontSize: 26 / this.scale,
            fontWeight: 600 / this.scale,
            color: "#fff"
          }
        },
        // 提示框组件
        tooltip: {
          trigger: "item", // 触发类型, 数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用。
          textStyle: {
            color: "#fff" // 文字颜色
          },
          // 提示框浮层内容格式器，支持字符串模板和回调函数两种形式
          // 饼图、仪表盘、漏斗图: {a}（系列名称），{b}（数据项名称），{c}（数值）, {d}（百分比）
          // formatter: "{a} <br/>{b}: {c}万次"
          formatter: "{a}<br/>{b}: {d}%  {c}"
        },
        // 图例组件
        // legend: {
        //   orient: "vertical", // 图例列表的布局朝向 水平排列：horizontal  垂直排列：vertical
        //   top: 10 / this.scale, // 图例组件离容器上侧的距离
        //   left: 5 / this.scale, // 图例组件离容器左侧的距离
        //   itemWidth: 18 / this.scale, // 图例标记的图形宽度
        //   itemHeight: 15 / this.scale, // 图例标记的图形高度
        //   // 图例项的 icon  值: 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
        //   icon: "roundRect",
        //   textStyle: {
        //     // 文本样式
        //     fontSize: 14 / this.scale,
        //     color: "#fff"
        //   },
        //   // 图例的数据数组
        //   data: ["直接访问", "邮件营销", "联盟广告", "视频广告", "搜索引擎"]
        // },
        series: [
          {
            type: "pie", // 外圈
            name: "", // 系列名称，用于tooltip的显示，legend 的图例筛选
            // radius: ['40%', '60%'], // 饼图的半径 数组的第一项是内半径，第二项是外半径
            center: ["50%", "53%"], // 饼图的中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标
            hoverAnimation: true, // 是否开启 hover 在扇区上的放大动画效果
            // 图形样式 饼图的白色边框
            itemStyle: {
              borderWidth: 3 / this.scale, // 描边线宽。为 0 时无描边
              borderColor: "#fff" // 图形的描边颜色 支持的颜色格式同 color，不支持回调函数
            },
            // 饼图图形上的文本标签
            // label: {
            //   show: true, // 默认 false
            //   position: "outline", // 标签的位置 'outside', 'inside', 'inner'同'inside', 'center'
            //   color: "#fff", // 文字的颜色
            //   fontSize: 15 / this.scale, // 文字的字体大小
            //   fontWeight: 600 / this.scale, // 文字字体的粗细
            //   // 提示框浮层内容格式器，支持字符串模板和回调函数两种形式
            //   // 饼图、仪表盘、漏斗图: {a}（系列名称），{b}（数据项名称），{c}（数值）, {d}（百分比）
            //   formatter: "{b}:{d}%"
            // },
            // 标签的视觉引导线样式，在 label 位置 设置为'outside'的时候会显示视觉引导线。
            labelLine: {
              show: false, // 是否显示视觉引导线
              length: 3 // 视觉引导线第一段的长度
            },
            // 系列中的数据内容数组
            // data: [
            //   {
            //     value: 100,
            //     name: "直接访问"
            //   },
            //   {
            //     value: 200,
            //     name: "邮件营销"
            //   },
            //   {
            //     value: 200,
            //     name: "联盟广告"
            //   },
            //   {
            //     value: 180,
            //     name: "视频广告"
            //   },
            //   {
            //     value: 320,
            //     name: "搜索引擎"
            //   }
            // ]
            data: this.pieData
          }
        ]
      });
    },
    // 控制获取数据频率
    getData() {
      if (this.time) {
        clearTimeout(this.time);
      }
      this.time = setTimeout(() => {
        this.getProportion();
      }, 1000);
    },
    getProportion() {
      if (this.code && this.type && this.powerType) {
        this.$http
          .get("equipment/energyBranch/powerProportion", {
            params: {
              // boardId: this.item.id,
              // type: JSON.parse(this.item.param).timeType
              names: this.codeName,
              codes: this.code,
              type: JSON.parse(this.item.param).timeType
            }
          })
          .then(res => {
            if (res.data.code === 0) {
              this.pieData = res.data.data;
              this.pieData.map(item => {
                return (item.value = item.data);
              });
              this.drawChart()
            }
          });
      }
    },
    editBoard() {
      this.$emit("editBoard", this.i, this.item);
    },
    delBoard() {
      this.$emit("delBoard", this.i, this.item);
    }
  }
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