<template>
  <div class="data-view">
    <div class="platform-screen" :style="scaleFun">
      <div id="header">
        <dv-border-box-7
          style="box-shadow: rgba(255, 165, 0, 0.3) 0px 0px 20px inset;"
          :color="['rgba(255, 165, 0,0.3)','rgb(255, 165, 0)']"
        >
          <dv-decoration-8 class="header-left-decoration" />
          <dv-decoration-5 dur="8" class="header-center-decoration" />
          <div class="header-right-decoration">
            <dv-decoration-8 class :reverse="true" />
            <h3>{{time}}</h3>
          </div>
          <h1 class="center-title">智工运维综合数据</h1>
        </dv-border-box-7>
      </div>
      <div id="content">
        <!-- 左边 -->
        <div class="c-left">
          <!-- 左上 -->
          <div class="c-l-top">
            <div class="warn-count">
              <dv-border-box-7
                style="box-shadow: rgba(255, 165, 0, 0.3) 0px 0px 20px inset;"
                :color="['rgba(255, 165, 0, 0.3)','rgb(255, 165, 0, 0.3)']"
              >
                <div class="inner">
                  <div class="block" style="height: 100%;">
                    <!-- <span class="demonstration">默认 Hover 指示器触发</span> -->
                    <el-carousel arrow="never" :interval="intervalTIme">
                      <el-carousel-item v-for="item in 3" :key="item">
                        <div style="width: 100%; height: 100%; position: relative;">
                          <div style="positon: static; width: 100%; height: 100%;">
                            <!-- <dv-water-level-pond :config="resource1" style="width:150px;height:200px" /> -->
                            <water :resource="item === 1 ? resourceInfo.cpu : item === 2 ? resourceInfo.disk : resourceInfo.memory"></water>
                            <!-- {{item}}
                            <water :resource="item === 1 ? 100 : 0"></water> -->
                            <!-- <pie></pie> -->
                          </div>
                        </div>
                      </el-carousel-item>
                    </el-carousel>
                    <!-- <water></water> -->
                    <!-- <dv-water-level-pond :config="resource1" style="width:150px;height:200px" /> -->
                  </div>
                </div>
              </dv-border-box-7>
            </div>
            <!-- 站点告警列表 -->
            <div class="site-warnList" ref="warnScroll">
              <dv-border-box-7
                style="box-shadow: rgba(255, 165, 0, 0.3) 0px 0px 20px inset;"
                :color="['rgba(255, 165, 0,0.3)','rgb(255, 165, 0)']"
              >
                <div class="inner">
                  <dv-scroll-board :config="siteWarnList" />
                </div>
              </dv-border-box-7>
            </div>
            <!-- 公司和运维人员 -->
            <div class="com-work">
              <dv-border-box-7
                style="box-shadow: rgba(255, 165, 0, 0.3) 0px 0px 20px inset;"
                :color="['rgba(255, 165, 0,0.3)','rgb(255, 165, 0)']"
              >
                <div class="inner">
                  <svg>
                    <rect id="two" height="100%" width="100%" />
                    <rect id="twos" height="100%" width="100%" />
                  </svg>
                  <div class="layout">
                    <div class="company">
                      <div class="com-left">
                        <i class="el-icon-office-building"></i>
                      </div>
                      <div class="com-center"></div>

                      <div class="com-right">
                        <span>运维公司</span>
                        <span>{{operationObj.companys}}家</span>
                      </div>
                    </div>
                    <div class="worker">
                      <div class="work-left">
                        <i class="el-icon-s-custom"></i>
                      </div>
                      <div class="work-center"></div>

                      <div class="work-right">
                        <span>运维人员</span>
                        <span>{{operationObj.users}}名</span>
                      </div>
                    </div>
                  </div>
                </div>
              </dv-border-box-7>
            </div>
          </div>
          <!-- 左下 耗能排名 -->
          <div class="c-l-bottom inner">
            <dv-border-box-7
              style="box-shadow: rgba(255, 165, 0, 0.3) 0px 0px 20px inset;"
              :color="['rgba(255, 165, 0,0.3)','rgb(255, 165, 0)']"
            >
              <!-- <dv-scroll-ranking-board :config="siteRank" style="height: 330px; width: 100%;" /> -->
              <!-- <dv-conical-column-chart :config="siteRank"/> -->
              <dv-scroll-ranking-board :config="siteRank" />
            </dv-border-box-7>
          </div>
        </div>
        <!-- 中间 -->
        <div class="c-center">
          <!-- 中上 地图 -->
          <div class="c-c-top">
            <div class="total-warn">
              <div class="data-show">
                <dv-border-box-6>
                  <span style>总站点&nbsp;</span>
                  <span style>{{runInfo.sites | numFormat}}&nbsp;</span>
                </dv-border-box-6>
              </div>
            </div>
            <div class="serve">
              <div class="data-show">
                <dv-border-box-6>
                  <span style>已为您运行&nbsp;</span>
                  <span style>{{runInfo.rumTime | numFormat}}&nbsp;天</span>
                </dv-border-box-6>
              </div>
            </div>
            <div class="map-area">
              <div class="baidumap" id="allmap"></div>
            </div>
          </div>
          <!-- 中下 站点信息列表 -->
          <div class="c-c-bottom">
            <div class="inner">
              <dv-border-box-7
                style="box-shadow: rgba(255, 165, 0, 0.3) 0px 0px 20px inset;"
                :color="['rgba(255, 165, 0,0.3)','rgb(255, 165, 0)']"
              >
                <dv-scroll-board :config="siteList" />
              </dv-border-box-7>
            </div>
          </div>
        </div>
        <!-- 右边 -->
        <div class="c-right">
          <!-- 右上 信息统计-->
          <div class="c-r-top inner">
            <div class="total-site">
              <dv-border-box-7
                style="box-shadow: rgba(255, 165, 0, 0.3) 0px 0px 20px inset;"
                :color="['rgba(255, 165, 0,0.3)','rgb(255, 165, 0)']"
              >
                <dv-decoration-9 :color="['skyblue','pink']" :dur="during" style>
                  <div class="block">
                    <div class="val">{{warnTotal}}</div>
                    <div class="decoration">本月告警数</div>
                  </div>
                </dv-decoration-9>
              </dv-border-box-7>
            </div>
            <div class="total-site">
              <dv-border-box-7
                style="box-shadow: rgba(255, 165, 0, 0.3) 0px 0px 20px inset;"
                :color="['rgba(255, 165, 0,0.3)','rgb(255, 165, 0)']"
              >
                <dv-decoration-9 :color="['skyblue','orange']" :dur="during" style>
                  <div class="block">
                    <div class="val">100</div>
                    <div class="decoration">本月工单数</div>
                  </div>
                </dv-decoration-9>
              </dv-border-box-7>
            </div>
            <div class="total-site">
              <dv-border-box-7
                style="box-shadow: rgba(255, 165, 0, 0.3) 0px 0px 20px inset;"
                :color="['rgba(255, 165, 0,0.3)','rgb(255, 165, 0)']"
              >
                <dv-decoration-9 :color="['skyblue','yellowgreen']" :dur="during" style>
                  <div class="block">
                    <div class="val">{{monitor}}</div>
                    <div class="decoration">检测节点</div>
                  </div>
                </dv-decoration-9>
              </dv-border-box-7>
            </div>
          </div>
          <!-- 右中 曲线图 -->
          <div class="c-r-center">
            <div class="warn-line inner">
              <dv-border-box-7
                style="box-shadow: rgba(255, 165, 0, 0.3) 0px 0px 20px inset;"
                :color="['rgba(255, 165, 0,0.3)','rgb(255, 165, 0)']"
              >
                <h4>当月告警趋势</h4>
                <div class="area-line">
                  <areaLine></areaLine>
                </div>
              </dv-border-box-7>
            </div>
            <div class="deal-line inner">
              <dv-border-box-7
                style="box-shadow: rgba(255, 165, 0, 0.3) 0px 0px 20px inset;"
                :color="['rgba(255, 165, 0,0.3)','rgb(255, 165, 0)']"
              >
                <h4>当月工单趋势</h4>
                <div class="bar">
                  <gradientBar></gradientBar>
                </div>
              </dv-border-box-7>
            </div>
          </div>
          <!-- 右下 站点在各时间段能耗列表 -->
          <div class="c-r-bottom">
            <div class="inner">
              <dv-border-box-7
                style="box-shadow: rgba(255, 165, 0, 0.3) 0px 0px 20px inset;"
                :color="['rgba(255, 165, 0,0.3)','rgb(255, 165, 0)']"
              >
                <dv-scroll-board :config="siteEnergyList" />
              </dv-border-box-7>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BMap from "BMap";
import BMapSymbolSHAPEPOINT from "BMap_Symbol_SHAPE_POINT";
import pie from "../subcomponents/platformSub/pie";
import bar from "../subcomponents/platformSub/bar";
import { deepClone } from "../../utils/index";
import areaChart from "../subcomponents/platformSub/area";
import gradientBar from "../subcomponents/platformSub/bar-gradient";
import water from '../subcomponents/platformSub/water'
import echartsLiquidfill from 'echarts-liquidfill'      //水位图
export default {
  components: {
    pie,
    bar,
    areaLine: areaChart,
    gradientBar,
    water,
  },
  data() {
    return {
      // windowWidth: this.$store.state.screenSize.width,
      // windowHeight: this.$store.state.screenSize.height,
      intervalTIme: 6000,         //水位图滚动时间
      defaultFalse: false,
      window: null,
      height: null,
      windowWidth: 1920,
      windowHeight: 1080,
      scale: 0.6,         //页面缩放比例
      time: "",
      during: 15,
      interval: null,
      sitePosition: [],
      // 运维数据对象
      operationObj: {
        companys: 0,
        users: 0
      },
      // 站点告警列表
      siteWarnList: {
        header: ["站点名称", "告警数量"],
        waitTime: 3000,
        headerBGC: "rgba(100,100,100,0.4)",
        oddRowBGC: "rgba(65, 50, 138,0.4)",
        evenRowBGC: "rgba(57, 14, 65,0.4)",
        data: [
          ["行1列3", "5"],
          ["行2列3", "60"],
          ["行3列3", "41"],
          ["行3列3", "35"],
          ["行3列3", "87"],
          ["行3列3", "412"]
        ],
        index: true,
        columnWidth: [50],
        align: ["center"]
      },

      //站点列表
      siteList: {
        header: ["站点名称", "所属公司", "网关数", "设备总数", "变量总数"],
        waitTime: 3000,
        headerBGC: "rgba(100,100,100,0.4)",
        oddRowBGC: "rgba(65, 50, 138,0.4)",
        evenRowBGC: "rgba(57, 14, 65,0.4)",
        data: [
          // ["站点1", "行1列2", "行1列3", "不在线",100],
        ],
        index: true,
        columnWidth: [50],
        align: ["center"]
      },
      siteRank: {
        // waitTime: 5000,
        data: [
          // {
          //   name: "深圳站点",
          //   value: 2684
          // },
        ],
        showValue: true
      },
      siteEnergyList: {
        header: ["站点名称", "总耗能", "总电费", "峰", "平", "谷"],
        waitTime: 3000,
        headerBGC: "rgba(100,100,100,0.4)",
        oddRowBGC: "rgba(65, 50, 138,0.4)",
        evenRowBGC: "rgba(57, 14, 65,0.4)",
        data: [
          // ["站点1", "行1列2", "站点1", "行1列2", "行1列3", "不在线"],
        ],
        index: true,
        columnWidth: [50],
        align: ["center"]
      },
      warnTotal: 0, //告警统计
      monitor: 0, // 总检测节点
      resourceInfo: {

      },          //资源占用情况
      // 运行时间及站点数
      runInfo: {
        rumTime: 0,
        sites: 0
      },
    };
  },
  computed: {
    scaleFun() {
      return `transform: scale(${this.scale}); width: ${this.windowWidth}px; height: ${this.windowHeight}px`;
    }
  },
  created() {
    this.getSiteList();
    this.getEnergySort();
    this.getWarnTotal();
    this.getEachWarn();
    this.getOperationTotal();
    this.getOperation();
    this.getAllSiteARunTime()
  },
  mounted() {
    window.addEventListener("resize", this.computedScale);
    this.computedScale();
    this.getTimeStr();
    this.getMap();
    // this.getScreenSize();
  },
  beforeDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  },
  methods: {
    // getScreenSize() {
    //   var windowWidth = window.screen.width; //屏幕宽
    //   var windowHeight = window.screen.height; //屏幕高
    //   var screenSize = {
    //     width: windowWidth,
    //     height: windowHeight
    //   };
    //   this.$store.commit("saveScreenSize", screenSize);
    // },
    // 赋值边框样式,无效
    flushBorderStyle() {
      var arr = document.getElementsByClassName("dv-border-box-7");
      console.log(arr.length);
      for (var i = 0; i < arr.length; i++) {
        arr[i].style =
          "background-color: transparent;box-shadow: rgba(128, 128, 128, 0.3) 0px 0px 120px inset;border: 1px solid rgba(128, 128, 128, 0.3);";
        console.log(arr[i].style);
      }
      console.log(arr[0].style);
    },
    // 获取站点列表
    getSiteList() {
      this.$http
        .get("equipment/largeScreen/allSite", {
          params: {}
        })
        .then(res => {
          if (res.data.code === 0) {
            var obj = deepClone(this.siteList); //深拷贝
            var arr = [];
            var resp = res.data.data;
            for (var i = 0; i < resp.length; i++) {
              var arr1 = [];
              arr1.push(resp[i].name);
              arr1.push(resp[i].companyName);
              arr1.push(resp[i].alarmCount);
              arr1.push(resp[i].equipmentCount);
              arr1.push(resp[i].varCount);
              arr.push(arr1);
            }
            obj.data = arr;
            // 只能通过直接赋值方式才能更新到视图，文档说明
            this.siteList = obj;
            // 赋值百度地图站点显示数据
            this.sitePosition = resp;
            this.getMap();
          }
        });
    },
    // 查询当月平台站点能耗排行
    getEnergySort() {
      // return
      this.$http
        .get("equipment/largeScreen/energySort", {
          params: {}
        })
        .then(res => {
          if (res.data.code === 0) {
            // this.siteRank.data = res.data.data
            var arr = res.data.data;
            arr = arr.map(item => {
              item.value = item.energy;
              return item;
            });
            var obj = {
              // waitTime: 5000,
              data: arr
            };
            this.siteRank = obj;
            // this.siteRank = {
            //   data: [
            //     {
            //       name: '站点1',
            //       value: 0,
            //     }
            //   ]
            // }
          }
        });
    },
    // 统计平台当月告警总数
    getWarnTotal() {
      this.$http
        .get("equipment/largeScreen/alarmTotal", {
          params: {}
        })
        .then(res => {
          if (res.data.code === 0) {
            this.warnTotal = res.data.data.alarms;
            this.monitor = res.data.data.vars;
          }
        });
    },
    // 获取组织和运维数
    getOperationTotal() {
      this.$http
        .get("equipment/largeScreen/getCompanyInfo", {
          params: {}
        })
        .then(res => {
          if (res.data.code === 0) {
            this.operationObj = res.data.data;
          }
        });
    },
    // 计算当前屏幕下的缩放比例
    computedScale() {
      var windowWidth = window.screen.width; //屏幕宽
      var pageWidth = document.getElementsByClassName("data-view")[0]
        .offsetWidth;
      this.scale = pageWidth / this.windowWidth;
    },
    // 获取各站点告警数量
    getEachWarn() {
      this.$http
        .get("equipment/largeScreen/getAlarmForSite", {
          params: {}
        })
        .then(res => {
          if (res.data.code === 0) {
            // this.siteWarnList = res.data.data
            var arr = res.data.data;
            var arrData = [];
            // 格式话数据
            arr.forEach((item, index) => {
              arrData[index] = [];
              arrData[index][0] = item.site;
              arrData[index][1] = item.alarms;
            });
            this.siteWarnList.data = arrData;
            // dataV文档备注需要重新赋值，页面才能刷新
            this.siteWarnList = JSON.parse(JSON.stringify(this.siteWarnList));
          }
        });
    },
    getOperation() {
      this.$http
        .get("equipment/largeScreen/resourcesInfo", {
          params: {}
        })
        .then(res => {
          if(res.data.code === 0) {
            this.resourceInfo = res.data.data
            this.resourceInfo.disk.unshift('disk')
            this.resourceInfo.cpu.unshift('cpu')
            this.resourceInfo.memory.unshift('memory')
          }
        });
    },
    // 获取总站点及运行时间
    getAllSiteARunTime() {
      this.$http.get('equipment/largeScreen/runInfo',{
        params: {

        }
      }).then(res => {
        if(res.data.code === 0) {
          this.runInfo = res.data.data
        }
      })
    },
    getTimeStr() {
      if (this.interval) {
        clearInterval(this.interval);
      }
      this.interval = setInterval(() => {
        var date = new Date();
        var str = new Date(Date.parse(date) + 8 * 60 * 60 * 1000).toJSON();
        str = str.slice(0, 19);
        // console.log(str);
        var arr = str.split("T");
        this.time = arr.join(" ");
      }, 1000);
    },
    // 绘图
    getMap() {
      // 获取中心站点定位
      var index = this.sitePosition.findIndex(item => {
        return item.id === this.$store.state.site.siteId;
      });
      console.log(index);
      // alert(this.$store.state.site.siteId,index)
      if (index > -1) {
        var x = this.sitePosition[index].longitude
          ? this.sitePosition[index].longitude
          : 116.397657;
        var y = this.sitePosition[index].latitude
          ? this.sitePosition[index].latitude
          : 39.91582;
      } else {
        x = 116.397657;
        y = 39.91582;
      }
      // ); // 创建信息窗口对象
      this.map = new BMap.Map("allmap", { mapType: BMAP_HYBRID_MAP });
      let map = this.map; //赋值全局变量，供页面所有函数使用

      var point = new BMap.Point(x, y); //设置中心点
      map.centerAndZoom(point, 5);
      // return
      for (var i = 0; i < this.sitePosition.length; i++) {
        // var points = new BMap.Point(
        //   this.sitePosition[i].longitude,
        //   this.sitePosition[i].latitude
        // );        //创建坐标点
        let data = this.sitePosition[i];

        this.markerFun(data);
      }
      map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
      map.addControl(
        new BMap.NavigationControl({
          anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
          type: BMAP_NAVIGATION_CONTROL_ZOOM
        })
      ); //平移缩放控件
      map.addControl(new BMap.ScaleControl({ offset: new BMap.Size(200, 20) })); //比例尺控件,位置移动
      map.addControl(new BMap.OverviewMapControl()); //缩略图控件
      // map.addControl(new BMap.MapTypeControl());
      map.setCurrentCity("深圳"); // 仅当设置城市信息时，MapTypeControl的切换功能才能可用
    },
    // 函数 创建多个标注
    markerFun(data) {
      // 默认北京地址
      var points = new BMap.Point(
        data.longitude ? data.longitude : 116.397657,
        data.latitude ? data.latitude : 39.91582
      ); //创建坐标点
      console.log(points);
      var markers = new BMap.Marker(points); //创建标注
      this.map.addOverlay(markers); //添加到地图上

      // 弹窗主题内容
      let content = `
                <div>
                  <div style="display: flex;align-items: center;justify-content: space-between;">
                    <div>
                      <span style="white-space:nowrap">所属公司：</span>
                    </div>
                    <div style="white-space:nowrap; overflow: hidden;">
                      ${data.companyName}
                    </div>
                  </div>
                  <div style="display: flex;align-items: center;justify-content: space-between;">
                    <span>站点名称：</span>
                    <span>${data.name}</span>
                  </div>
                  
                  <div style="display: flex;align-items: center;justify-content: space-between;"> 
                    <span>站点下设备数：</span>
                    <span>${data.equipmentCount}</span>
                  </div>
                  <div style="display: flex;align-items: center;justify-content: space-between;"> 
                    <span>站点下告警数：</span>
                    <span>${data.alarmCount}</span>
                  </div>
                </div>
                
              `;
      // 弹窗头部
      let header = `
                <div style="text-align: center;">
                  <span>详情</span>
                </div>
              `;
      var opts = {
        width: 310, // 信息窗口宽度
        height: 140, // 信息窗口高度
        title: "<h4>" + header + "</h4>", // 信息窗口标题
        enableMessage: true, //设置允许信息窗发送短息
        message: ""
      };
      var infoWindow = new BMap.InfoWindow(content, opts); // 创建信息窗口对象

      var showOpts = {
        position: points,
        offset: new BMap.Size(-20, 10)
      };

      var label = new BMap.Label(data.name, showOpts); // 创建文本标注对象]\
      label.setStyle({
        color: "red",
        fontSize: "12px",
        height: "20px",
        lineHeight: "20px",
        fontFamily: "微软雅黑",
        border: "none"
      });
      this.map.addOverlay(label);

      markers.addEventListener("onclick", function(event) {
        console.log(event, data);
        this.map.openInfoWindow(infoWindow, points); //打开窗口
      }); //注册鼠标移入事件
      // markers.addEventListener("doubleclick", function() {
      //   this.map.closeInfoWindow(infoWindow, points);
      // }); //注册鼠标移出事件
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/css/index.less";
.data-view {
  width: 100%;
  height: 100%;
  background-color: black;
  color: #fff;
  box-sizing: border-box;
  .platform-screen {
    width: 1920px;
    height: 1080px;
    // background-image: url("../../../static/img/platform-screen/bg1.png");
    position: fixed;
    top: 0;
    left: 0;
    overflow: hidden;
    transform-origin: left top;
    z-index: 999;
    padding: 10px;
    box-sizing: border-box;
    @dis-flex();
    @flex-c();
    #header {
      background: rgba(40, 13, 59, 0.5);
      width: 100%;
      height: 100px;
      padding-bottom: 10px;
      box-sizing: border-box;
      .dv-border-box-7 {
        & /deep/ .border-box-content {
          position: relative;
          @dis-flex();
          justify-content: space-between;
          .header-left-decoration {
            height: 60px;
            width: 25%;
          }
          .header-center-decoration {
            width: 40%;
            height: 60px;
            margin-top: 30px;
          }
          .header-right-decoration {
            height: 60px;
            width: 25%;
            position: relative;
            h3 {
              position: absolute;
              top: 45px;
              left: 20px;
            }
          }
          .center-title {
            position: absolute;
            font-size: 30px;
            font-weight: 700;
            left: 50%;
            top: 15px;
            transform: translateX(-50%);
          }
        }
      }
    }
    #content {
      @flex-1();
      @dis-flex();
      padding-bottom: 10px;
      box-sizing: border-box;
      overflow: hidden;
      .inner {
        background: rgba(40, 13, 59, 0.5);
        height: 100%;
      }
      .c-left {
        width: 15%;
        height: 100%;
        padding-right: 10px;
        box-sizing: border-box;
        // background-color: none;
        @dis-flex();
        @flex-c();
        .c-l-top {
          height: 70%;
          @dis-flex();
          @flex-c();
          .warn-count {
            @flex-1();
            // 走马灯
            /deep/ .el-carousel {
              height: 100%;
            }
            /deep/ .el-carousel__container {
              height: 100%;
            }
            .el-carousel__item h3 {
              color: #475669;
              font-size: 14px;
              opacity: 0.75;
              line-height: 150px;
              margin: 0;
            }
          }
          .site-warnList {
            @flex-1();
            margin: 10px 0;
          }
          .com-work {
            @flex-1();
            .layout {
              height: 100%;
              width: 100%;
              position: absolute;
              top: 0;
              left: 0;
              @dis-flex();
              @flex-c();
              padding: 3px;
              box-sizing: border-box;
              .company {
                @flex-1();
                margin: 5px 10px;
                background-color: #121635;
                @dis-flex();
                align-items: center;
                .com-left {
                  width: 30%;
                  height: 100%;
                  @dis-flex();
                  justify-content: center;
                  align-items: center;
                  i {
                    font-size: 50px;
                    color: #293fb6;
                  }
                }
                .com-center {
                  height: 80%;
                  width: 1px;
                  background-color: #1f4160;
                  margin: 0 20px;
                }
                .com-right {
                  @flex-1();
                  @dis-flex();
                  @flex-c();
                  align-items: center;
                  span:first-child {
                    color: orange;
                  }
                }
              }
              .worker {
                @flex-1();
                margin: 5px 10px;
                background-color: #121635;
                @dis-flex();
                align-items: center;
                .work-left {
                  width: 30%;
                  height: 100%;
                  @dis-flex();
                  justify-content: center;
                  align-items: center;
                  i {
                    font-size: 50px;
                    color: #293fb6;
                  }
                }
                .work-center {
                  height: 80%;
                  width: 1px;
                  background-color: #1f4160;
                  margin: 0 20px;
                }
                .work-right {
                  @flex-1();
                  @dis-flex();
                  @flex-c();
                  align-items: center;
                  span:first-child {
                    color: orange;
                  }
                }
              }
            }
          }
          // 公共样式
          .inner {
            position: relative;
            height: 100%;
            svg {
              height: 100%;
              width: 100%;
              margin-bottom: 20px;
              cursor: default;
              #two {
                fill: transparent;
                stroke: rgba(255, 165, 0, 0.3);
                stroke-width: 6px;
                stroke-dasharray: 50 450;
                stroke-dashoffset: 50;
                animation: dong2 6s ease-in-out infinite alternate;
              }
              #twos {
                fill: transparent;
                stroke: rgba(255, 165, 0, 0.3);
                stroke-width: 6px;
                stroke-dasharray: 50 450;
                stroke-dashoffset: -200;
                animation: dong2 6s ease-in-out infinite alternate;
              }
              @keyframes dong2 {
                100% {
                  stroke-dasharray: 500 0;
                  stroke-width: 6px;
                  stroke: rgba(255, 165, 0, 0.3);
                }
              }
            }
            .show {
              height: 100%;
              width: 100%;
              position: absolute;
              top: 0;
              left: 0;
              // text-align: center;
              @dis-flex();
              @flex-c();
              padding: 3px;
              box-sizing: border-box;
              // @flex-pc();
              p {
                color: white;
                font-size: 20px;
                background-color: #121635;
                text-align: center;
                padding: 6px;
                border-bottom: 1px solid rgba(255, 165, 0, 0.3);
              }
              .data1 {
                @flex-1();
                @dis-flex();
                @flex-c();
                @flex-pc();
                @flex-sc();
                color: yellow;
                font-size: 50px;
                .line {
                  border-bottom: 1px solid yellow;
                  width: 100px;
                }
                .line1 {
                  border-bottom: 1px solid yellow;
                  margin-top: 6px;
                  width: 60px;
                }
              }
            }
          }
        }
        .c-l-bottom {
          // height: 40%;
          @flex-1();
          height: 0;
          // padding: 10px;
          box-sizing: border-box;
          margin-top: 10px;
          & /deep/ .border-box-content {
            padding: 0 6px;
            box-sizing: border-box;
          }
        }
      }
      .c-center {
        @flex-1();
        height: 100%;
        .c-c-top {
          height: 70%;
          background: rgba(50, 13, 59, 0.8);
          // padding: 20px;
          box-sizing: border-box;
          position: relative;
          .total-warn {
            position: absolute;
            @dis-flex();
            justify-content: left;
            top: 20px;
            left: 20px;
            z-index: 888;
            .data-show {
              margin-left: 20px;
              font-size: 26px;
              color: #f2dbcc;
              background-color: rgba(56, 108, 169, 0.4);
              /deep/ .border-box-content {
                padding: 15px;
              }
            }
          }
          .serve {
            position: absolute;
            @dis-flex();
            justify-content: left;
            bottom: 40px;
            left: 20px;
            z-index: 888;
            .data-show {
              margin-left: 20px;
              font-size: 26px;
              color: #a5d2fa;
              background-color: rgba(56, 108, 169, 0.4);
              /deep/ .border-box-content {
                padding: 15px;
              }
            }
          }
          .map-area {
            height: 100%;
            width: 100%;
            .baidumap {
              height: 100%;
              width: 100%;
              .anchorBL {
                display: none;
              }
            }
          }
        }
        .c-c-bottom {
          height: 30%;
          box-sizing: border-box;
          padding: 10px 0 0;
          // background: pink;
          .inner {
            height: 100%;
            // background: rgba(40, 13, 59, 0.5);
          }
        }
      }
      .c-right {
        width: 40%;
        height: 100%;
        box-sizing: border-box;
        padding-left: 10px;
        // padding: 10px;
        @dis-flex();
        @flex-c();
        .c-r-bottom {
          height: 30%;
          padding-top: 10px;
          // @flex-1();
          box-sizing: border-box;
          padding: 10px 0 0;
          // background: pink;
          .inner {
            height: 100%;
            // background: rgba(40, 13, 59, 0.5);
          }
        }
        .c-r-center {
          height: 50%;
          @dis-flex();
          @flex-c();
          margin-top: 10px;
          .warn-line {
            // margin-top: 10px;
            // @flex-1();
            height: calc(50% - 5px);
            .dv-border-box-7 {
              box-sizing: border-box;
              & /deep/ .border-box-content {
                padding: 20px;
                box-sizing: border-box;
                @dis-flex();
                @flex-c();
                .area-line {
                  @flex-1();
                }
              }
            }
          }
          .deal-line {
            margin-top: 10px;
            // @flex-1();
            height: calc(50% - 5px);
            .dv-border-box-7 {
              box-sizing: border-box;
              & /deep/ .border-box-content {
                padding: 20px;
                box-sizing: border-box;
                @dis-flex();
                @flex-c();
                .bar {
                  @flex-1();
                }
              }
            }
          }
        }
        .c-r-top {
          @flex-1();
          @dis-flex();
          .value {
            padding-top: 20px;
            height: 100%;
            width: 100%;
            @dis-flex();
            @flex-pc();
            @flex-sc();
            font-size: 36px;
          }
          // 公共样式
          .inner {
            position: relative;
            svg {
              height: 100%;
              width: 100%;
              margin-bottom: 20px;
              cursor: default;
              #two {
                fill: transparent;
                stroke: rgba(255, 165, 0, 0.3);
                stroke-width: 6px;
                stroke-dasharray: 50 450;
                stroke-dashoffset: 50;
                animation: dong2 6s ease-in-out infinite alternate;
              }
              #twos {
                fill: transparent;
                stroke: rgba(255, 165, 0, 0.3);
                stroke-width: 6px;
                stroke-dasharray: 50 450;
                stroke-dashoffset: -200;
                animation: dong2 6s ease-in-out infinite alternate;
              }
              @keyframes dong2 {
                100% {
                  stroke-dasharray: 500 0;
                  stroke-width: 6px;
                  stroke: rgba(255, 165, 0, 0.3);
                }
              }
            }
            .show {
              height: 100%;
              width: 100%;
              position: absolute;
              top: 0;
              left: 0;
              // text-align: center;
              @dis-flex();
              @flex-c();
              padding: 3px;
              box-sizing: border-box;
              // @flex-pc();
              p {
                color: white;
                font-size: 20px;
                background-color: #121635;
                text-align: center;
                padding: 6px;
                border-bottom: 1px solid rgba(255, 165, 0, 0.3);
              }
              .data1 {
                @flex-1();
                @dis-flex();
                @flex-c();
                @flex-pc();
                @flex-sc();
                color: yellow;
                font-size: 50px;
                .line {
                  border-bottom: 1px solid yellow;
                  width: 100px;
                }
                .line1 {
                  border-bottom: 1px solid yellow;
                  margin-top: 6px;
                  width: 60px;
                }
              }
            }
          }

          .total-site {
            @flex-1();
            .dv-border-box-7 {
              padding: 10px;
              box-sizing: border-box;
              .block {
                .val {
                  text-align: center;
                  font-size: 32px;
                  color: orange;
                }
                .decoration {
                  text-align: center;
                }
              }
            }
          }
          .total-site:nth-child(2) {
            margin: 0 10px;
          }
        }
      }
    }
  }
}
</style>

<style lang='less'>
/* 百度地图样式 */
/*地图标题*/
//------------------------------------百度地图样式不能加scoped
#allmap .BMap_pop .BMap_bubble_title {
  color: white;
  font-size: 13px;
  font-weight: bold;
  text-align: left;
  padding-left: 5px;
  padding-top: 5px;
  border-bottom: 1px solid gray;
  background-color: #0066b3;
  min-height: 30px;
}
/* 消息内容 */
#allmap .BMap_bubble_content {
  background-color: white;
  padding: 10px 15px;
  padding-bottom: 10px;
}
/* 内容 */

#allmap .BMap_pop div:nth-child(9) {
  top: 16px !important;
  border-radius: 7px;
}
/* 删除按键 */
#allmap .BMap_pop img {
  top: 28px !important;
  left: 296px !important;
}
#allmap .BMap_top {
  display: none;
}
#allmap .BMap_bottom {
  display: none;
}
#allmap .BMap_center {
  display: none;
  background-color: red;
}
/* 隐藏边角 */
#allmap .BMap_pop > div:nth-child(1) > div:nth-child(1) {
  display: none;
}
#allmap .BMap_pop > div:nth-child(5) > div:nth-child(1) {
  display: none;
}
#allmap .BMap_pop > div:nth-child(3) > div:nth-child(1) {
  display: none;
}

#allmap .BMap_pop div:nth-child(7) {
  display: none;
}
// 箭头符号
#allmap .BMap_pop div:nth-child(8) {
  // display: none;
  top: 130px !important;
}
</style>