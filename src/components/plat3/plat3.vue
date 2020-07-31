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
        <div class="c-left">
          <!-- <dv-border-box-7 style="box-shadow: rgba(255, 165, 0, 0.3) 0px 0px 20px inset;" >
            <div class="total-site">
              <dv-decoration-9 :color="['skyblue','yellow']" dur="15" style>
                <div class="block">
                  <div class="val">100</div>
                  <div class="decoration">总站点</div>
                </div>
              </dv-decoration-9>
            </div>
            <div class="point">
              <dv-decoration-4 style />
            </div>
            <div class="time-real">
              <dv-decoration-9 :color="['skyblue','pink']" dur="15" style>
                <div class="block">
                  <div class="val">15</div>
                  <div class="decoration">实时负荷</div>
                </div>
              </dv-decoration-9>
            </div>
            <div class="point">
              <dv-decoration-4 style />
            </div>
            <div class="warn-total">
              <dv-decoration-9 :color="['skyblue','orange']" dur="15" style>
                <div class="block">
                  <div class="val">69</div>
                  <div class="decoration">总告警数</div>
                </div>
              </dv-decoration-9>
            </div>
            <div class="point">
              <dv-decoration-4 style />
            </div>
            <div class="order-total">
              <dv-decoration-9 :color="['skyblue','yellowgreen']" dur="15" style>
                <div class="block">
                  <div class="val">64</div>
                  <div class="decoration">总工单数</div>
                </div>
              </dv-decoration-9>
            </div>
          </dv-border-box-7>-->
          <div class="c-l-top">
            <!-- <div class="total-site">
              <dv-border-box-7 style="box-shadow: rgba(255, 165, 0, 0.3) 0px 0px 20px inset;" >
                <dv-decoration-9 :color="['skyblue','yellow']" dur="15" style>
                  <div class="block">
                    <div class="val">100</div>
                    <div class="decoration">总站点</div>
                  </div>
                </dv-decoration-9>
              </dv-border-box-7>
            </div>-->
            <div class="total-site">
              <dv-border-box-7
                style="box-shadow: rgba(255, 165, 0, 0.3) 0px 0px 20px inset;"
                :color="['rgba(255, 165, 0,0.3)','rgb(255, 165, 0)']"
              >
                <dv-decoration-9 :color="['skyblue','pink']" :dur="during" style>
                  <div class="block">
                    <div class="val">100</div>
                    <div class="decoration">总工单数</div>
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
                    <div class="decoration">总告警数</div>
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
                    <div class="val">100</div>
                    <div class="decoration">实时负荷</div>
                  </div>
                </dv-decoration-9>
              </dv-border-box-7>
            </div>
          </div>
          <div class="c-l-bottom">
            <dv-border-box-7
              style="box-shadow: rgba(255, 165, 0, 0.3) 0px 0px 20px inset;"
              :color="['rgba(255, 165, 0,0.3)','rgb(255, 165, 0)']"
            >
              <dv-scroll-ranking-board :config="siteRank" style="height: 330px; width: 100%;" />
            </dv-border-box-7>
          </div>
        </div>
        <div class="c-center">
          <div class="c-c-top">
            <div class="total-warn">
              <div class="data-show">
                <dv-border-box-6>
                  <span style>总站点&nbsp;</span>
                  <span style>{{energySite | numFormat}}&nbsp;</span>
                </dv-border-box-6>
              </div>
            </div>
            <div class="serve">
              <div class="data-show">
                <dv-border-box-6>
                  <span style>已为您运行&nbsp;</span>
                  <span style>{{energyTotal | numFormat}}&nbsp;天</span>
                </dv-border-box-6>
              </div>
            </div>
            <div class="map-area">
              <div class="baidumap" id="allmap"></div>
            </div>
          </div>
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
        <div class="c-right">
          <div class="c-r-bottom">
            <div class="warn">
              <dv-border-box-7
                style="box-shadow: rgba(255, 165, 0, 0.3) 0px 0px 20px inset;"
                :color="['rgba(255, 165, 0, 0.3)','rgb(255, 165, 0, 0.3)']"
              >
                <div class="inner">
                  <svg>
                    <rect id="two" height="100%" width="100%" />
                    <rect id="twos" height="100%" width="100%" />
                  </svg>
                  <div class="show">
                    <p>本月告警统计</p>
                    <div class="data1">
                      <div>{{warnTotal}}</div>
                      <div class="line"></div>
                      <div class="line1"></div>
                    </div>
                  </div>
                </div>
              </dv-border-box-7>
            </div>
            <div class="order">
              <dv-border-box-7
                style="box-shadow: rgba(255, 165, 0, 0.3) 0px 0px 20px inset;"
                :color="['rgba(255, 165, 0,0.3)','rgb(255, 165, 0)']"
              >
                <div class="inner">
                  <svg>
                    <rect id="two" height="100%" width="100%" />
                    <rect id="twos" height="100%" width="100%" />
                  </svg>
                  <div class="show">
                    <p>今日工单统计</p>
                    <div class="data1">
                      <div>35</div>
                      <div class="line"></div>
                      <div class="line1"></div>
                    </div>
                  </div>
                </div>
              </dv-border-box-7>
            </div>
            <div class="deal">
              <dv-border-box-7
                style="box-shadow: rgba(255, 165, 0, 0.3) 0px 0px 20px inset;"
                :color="['rgba(255, 165, 0,0.3)','rgb(255, 165, 0)']"
              >
                <div class="inner">
                  <svg>
                    <rect id="two" height="100%" width="100%" />
                    <rect id="twos" height="100%" width="100%" />
                  </svg>
                  <div class="show">
                    <p class>本月处理工单数</p>
                    <div class="data1">
                      <div>62</div>
                      <div class="line"></div>
                      <div class="line1"></div>
                    </div>
                  </div>
                </div>
              </dv-border-box-7>
            </div>
          </div>
          <div class="c-r-center">
            <div class="site-top">
              <dv-border-box-7
                style="box-shadow: rgba(255, 165, 0, 0.3) 0px 0px 20px inset;"
                :color="['rgba(255, 165, 0,0.3)','rgb(255, 165, 0)']"
              >
                <div class="inner">
                  <div class="title">
                    <div class="left">
                      <p>站点耗能Top10</p>
                    </div>
                    <div class="right">
                      <p>\03</p>
                    </div>
                  </div>
                  <div class="rank">
                    <dv-scroll-ranking-board
                      :config="siteRank"
                      style="height: 359px; width: 100%;"
                    />
                  </div>
                </div>
              </dv-border-box-7>
            </div>
            <div class="warn-total">
              <dv-border-box-7
                style="box-shadow: rgba(255, 165, 0, 0.3) 0px 0px 20px inset;"
                :color="['rgba(255, 165, 0,0.3)','rgb(255, 165, 0)']"
              >
                <div class="inner">
                  <div class="title">
                    <div class="left">
                      <p>本月告警数</p>
                    </div>
                    <div class="right">
                      <p>\04</p>
                    </div>
                  </div>
                  <div class="bar">
                    <bar :color="['rgb(34, 232, 166)','rgb(57, 103, 169)']"></bar>
                  </div>
                  <div class="data">
                    <div class="data1">
                      <p>总告警数量</p>
                      <div>
                        <span>368</span>
                        <span>次</span>
                      </div>
                    </div>
                    <div class="data2">
                      <p>同比增长</p>
                      <div>
                        <span>+</span>
                        <span>16%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </dv-border-box-7>
            </div>
          </div>
          <div class="c-r-top">
            <div class="energy-per">
              <dv-border-box-7
                style="box-shadow: rgba(255, 165, 0, 0.3) 0px 0px 20px inset;"
                :color="['rgba(255, 165, 0,0.3)','rgb(255, 165, 0)']"
              >
                <div class="inner">
                  <div class="title">
                    <div class="left">
                      <p>各用能占比</p>
                    </div>
                    <div class="right">
                      <p>\01</p>
                    </div>
                  </div>
                  <div class="pie">
                    <pie></pie>
                  </div>
                  <div class="data">
                    <div class="data1">
                      <p>总能耗</p>
                      <div>
                        <span>1558</span>
                        <span>t</span>
                      </div>
                    </div>
                    <div class="data2">
                      <p>同比增长</p>
                      <div>
                        <span>+</span>
                        <span>15%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </dv-border-box-7>
            </div>
            <div class="load-trend">
              <dv-border-box-7
                style="box-shadow: rgba(255, 165, 0, 0.3) 0px 0px 20px inset;"
                :color="['rgba(255, 165, 0,0.3)','rgb(255, 165, 0)']"
              >
                <div class="inner">
                  <div class="title">
                    <div class="left">
                      <p>实时负荷趋势</p>
                    </div>
                    <div class="right">
                      <p>\02</p>
                    </div>
                  </div>
                  <div class="bar">
                    <bar :color="['#444','rgb(57, 103, 169)']"></bar>
                  </div>-
                  <div class="data">
                    <div class="data1">
                      <p>总负荷</p>
                      <div>
                        <span>256974</span>
                        <span>t</span>
                      </div>
                    </div>
                    <div class="data2">
                      <p>同比增长</p>
                      <div>
                        <span>-</span>
                        <span>5.96%</span>
                      </div>
                    </div>
                  </div>
                </div>
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
export default {
  components: {
    pie,
    bar
  },
  data() {
    return {
      // windowWidth: this.$store.state.screenSize.width,
      // windowHeight: this.$store.state.screenSize.height,
      window: null,
      height: null,
      windowWidth: 1920,
      windowHeight: 1080,
      scale: 0.6,
      time: "",
      during: 15,
      interval: null,
      energyTotal: 1254,
      energySite: 15,
      sitePosition: [],
      //站点列表
      siteList: {
        header: ["站点名称", "所属公司", "网关数", "设备总数", "变量总数"],
        waitTime: 3000,
        headerBGC: "rgba(100,100,100,0.4)",
        oddRowBGC: "rgba(65, 50, 138,0.4)",
        evenRowBGC: "rgba(57, 14, 65,0.4)",
        data: [
          ["站点1", "行1列2", "行1列3", "不在线"],
          ["站点2", "行2列2", "行2列3", "不在线"],
          ["站点3", "行3列2", "行3列3", "在线"],
          ["站点4", "行3列2", "行3列3", "在线"],
          ["站点5", "行3列2", "行3列3", "在线"],
          ["站点6", "行3列2", "行3列3", "在线"]
        ],
        index: true,
        columnWidth: [50],
        align: ["center"]
      },
      siteRank: {
        waitTime: 5000,
        data: [
          {
            name: "深圳站点",
            value: 2684
          },
          {
            name: "北京站点",
            value: 3698
          },
          {
            name: "苏州站点",
            value: 1259
          },
          {
            name: "广州站点",
            value: 3321
          },
          {
            name: "西安站点",
            value: 982
          },
          {
            name: "西藏站点",
            value: 1222
          },
          {
            name: "内蒙古站点",
            value: 666
          }
        ]
      },
      warnTotal: 0 //告警统计
    };
  },
  computed: {
    scaleFun() {
      return `transform: scale(${this.scale}); width: ${this.windowWidth}px; height: ${this.windowHeight}px`;
    }
  },
  // beforeRouteEnter(to,from,next) {
  //   next(vm => {
  //     // var windowWidth = window.screen.width;      //屏幕宽
  //     // var windowHeight = window.screen.height;      //屏幕高
  //     // var screenSize = {
  //     //   width: windowWidth,
  //     //   height: windowHeight,
  //     // }
  //     // vm.$store.commit("saveScreenSize", screenSize);
  //     // vm.window = window.screen.width;      //屏幕宽
  //     // vm.height = window.screen.height;      //屏幕高
  //   })
  // },
  created() {
    this.getSiteList();
    this.getEnergySort();
    this.getWarnTotal();
  },
  mounted() {
    window.addEventListener("resize", this.computedScale);
    this.computedScale();
    this.getTimeStr();
    this.getMap();
    this.getScreenSize();
  },
  beforeDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  },
  methods: {
    // scaleFun() {
    //   return `transform: scale(${this.scale}); width: ${this.windowWidth}px; height: ${this.windowHeight}px`;
    // },
    getScreenSize() {
      var windowWidth = window.screen.width; //屏幕宽
      var windowHeight = window.screen.height; //屏幕高
      var screenSize = {
        width: windowWidth,
        height: windowHeight
      };
      this.$store.commit("saveScreenSize", screenSize);
    },
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
              arr.push(arr1);
            }
            obj.data = arr;
            // 只能通过直接赋值方式才能更新到视图，文档说明
            this.siteList = obj;
          }
        });
    },
    // 查询当月平台站点能耗排行
    getEnergySort() {
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
              waitTime: 5000,
              data: arr
            };
            this.siteRank = obj;
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
            this.warnTotal = res.data.data.total;
          }
        });
    },
    computedScale() {
      this.windowWidth = this.$store.state.screenSize.width; //屏幕宽
      var pageWidth = document.getElementsByClassName("data-view")[0]
        .offsetWidth;
      this.scale = pageWidth / this.windowWidth;
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
    // 获取头部信息
    getSiteTotal() {
      this.$http
        .get("equipment/spreadSite", {
          params: {
            companyId: this.$store.state.site.companyId,
            roleId: this.$store.state.userInfo.roleId,
            siteLists: this.ids
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.sitePosition = res.data.data.siteVOList;
            this.getMap();
          }
        });
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
  // 边框样式修改
  // /deep/.dv-border-box-7 {
  //   background-color: transparent;
  //   box-shadow: rgba(128, 128, 128, 0.3) 0px 0px 120px inset!important;
  //   border: 1px solid rgba(128, 128, 128, 0.3);
  // }
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
    // display: -webkit-flex; /* 新版本语法: Chrome 21+ */
    // display: flex; /* 新版本语法: Opera 12.1, Firefox 22+ */
    // display: -webkit-box; /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
    // display: -moz-box; /* 老版本语法: Firefox (buggy) */
    // display: -ms-flexbox; /* 混合版本语法: IE 10 */
    @dis-flex();
    @flex-c();
    #header {
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
      // -webkit-flex: 1; /* Chrome */
      // -ms-flex: 1; /* IE 10 */
      // flex: 1; /* NEW, Spec - Opera 12.1, Firefox 20+ */
      // -webkit-box-flex: 1; /* OLD - iOS 6-, Safari 3.1-6 */
      // -moz-box-flex: 1; /* OLD - Firefox 19- */
      @flex-1();
      @dis-flex();
      padding-bottom: 10px;
      box-sizing: border-box;
      .c-left {
        width: 15%;
        height: 100%;
        padding-right: 10px;
        box-sizing: border-box;
        @dis-flex();
        @flex-c();
        .c-l-top {
          height: 64%;
          @dis-flex();
          @flex-c();
          .total-site {
            & + .total-site {
              margin-top: 10px;
            }
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
          height: 64%;
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
          height: 36%;
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
        .inner {
          background: rgba(40, 13, 59, 0.5);
          height: 100%;
        }
        .c-r-top {
          height: 36%;
          @dis-flex();
          .energy-per {
            width: 40%;
            height: 100%;
            box-sizing: border-box;
            padding: 10px 10px 0 0;
            .inner {
              padding: 10px;
              box-sizing: border-box;
              @dis-flex();
              @flex-c();
              .title {
                @dis-flex();
                justify-content: space-between;
                .left {
                  p {
                    font-size: 20px;
                  }
                }
                .right {
                  p {
                    font-size: 32px;
                    color: skyblue;
                  }
                }
              }
              .pie {
                height: 55%;
                box-sizing: border-box;
                padding: 5% 0;
              }
              .data {
                @dis-flex();
                @flex-1();
                justify-content: space-between;
                .data1 {
                  height: 100%;
                  @dis-flex();
                  @flex-c();
                  justify-content: space-between;
                  background: rgba(13, 57, 105, 0.3);
                  width: 49%;
                  padding: 10px;
                  box-sizing: border-box;
                  color: rgb(1, 159, 225);
                  div {
                    font-size: 28px;
                  }
                  > div span:first-child {
                    color: rgb(224, 230, 236);
                  }
                }
                .data2 {
                  height: 100%;
                  @dis-flex();
                  @flex-c();
                  justify-content: space-between;
                  background: rgba(13, 57, 105, 0.3);
                  width: 49%;
                  padding: 10px;
                  box-sizing: border-box;
                  color: rgb(1, 159, 225);
                  div {
                    font-size: 28px;
                  }
                  > div span:first-child {
                    color: rgb(255, 78, 0);
                  }
                }
              }
            }
          }
          .load-trend {
            width: 60%;
            height: 100%;
            box-sizing: border-box;
            padding-top: 10px;
            .inner {
              padding: 10px;
              box-sizing: border-box;
              @dis-flex();
              @flex-c();
              .title {
                @dis-flex();
                justify-content: space-between;
                .left {
                  p {
                    font-size: 20px;
                  }
                }
                .right {
                  p {
                    font-size: 32px;
                    color: skyblue;
                  }
                }
              }
              .bar {
                height: 55%;
              }
              .data {
                @dis-flex();
                @flex-1();
                justify-content: space-between;
                .data1 {
                  height: 100%;
                  @dis-flex();
                  @flex-c();
                  justify-content: space-between;
                  background: rgba(13, 57, 105, 0.3);
                  width: 49%;
                  padding: 10px;
                  box-sizing: border-box;
                  color: rgb(1, 159, 225);
                  div {
                    font-size: 28px;
                  }
                  > div span:first-child {
                    color: rgb(224, 230, 236);
                  }
                }
                .data2 {
                  height: 100%;
                  @dis-flex();
                  @flex-c();
                  justify-content: space-between;
                  background: rgba(13, 57, 105, 0.3);
                  width: 49%;
                  padding: 10px;
                  box-sizing: border-box;
                  color: rgb(1, 159, 225);
                  div {
                    font-size: 28px;
                  }
                  > div span:first-child {
                    color: rgb(36, 254, 180);
                  }
                }
              }
            }
          }
        }
        .c-r-center {
          height: 44%;
          @dis-flex();
          .site-top {
            width: 32%;
            height: 100%;
            box-sizing: border-box;
            padding: 10px 10px 0 0;
            .inner {
              padding: 10px;
              box-sizing: border-box;
              .title {
                @dis-flex();
                justify-content: space-between;
                .left {
                  p {
                    font-size: 20px;
                  }
                }
                .right {
                  p {
                    font-size: 32px;
                    color: skyblue;
                  }
                }
              }
              .rank {
                overflow: hidden;
                height: calc(100% - 42px);
              }
            }
          }
          .warn-total {
            width: 68%;
            height: 100%;
            box-sizing: border-box;
            padding: 10px 0 0;
            .inner {
              padding: 10px;
              box-sizing: border-box;
              @dis-flex();
              @flex-c();
              .title {
                @dis-flex();
                justify-content: space-between;
                .left {
                  p {
                    font-size: 20px;
                  }
                }
                .right {
                  p {
                    font-size: 32px;
                    color: skyblue;
                  }
                }
              }
              .bar {
                height: 65%;
              }
              .data {
                @dis-flex();
                @flex-1();
                justify-content: space-between;
                .data1 {
                  height: 100%;
                  @dis-flex();
                  @flex-c();
                  justify-content: space-between;
                  background: rgba(13, 57, 105, 0.3);
                  width: 49%;
                  padding: 10px;
                  box-sizing: border-box;
                  color: rgb(1, 159, 225);
                  div {
                    font-size: 28px;
                  }
                  > div span:first-child {
                    color: rgb(224, 230, 236);
                  }
                }
                .data2 {
                  height: 100%;
                  @dis-flex();
                  @flex-c();
                  justify-content: space-between;
                  background: rgba(13, 57, 105, 0.3);
                  width: 49%;
                  padding: 10px;
                  box-sizing: border-box;
                  color: rgb(1, 159, 225);
                  div {
                    font-size: 28px;
                  }
                  > div span:first-child {
                    color: #ff4e00;
                  }
                }
              }
            }
          }
        }
        .c-r-bottom {
          height: 20%;
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
          .warn {
            @flex-1();
          }
          .order {
            @flex-1();
            margin: 0 10px;
          }
          .deal {
            @flex-1();
          }
        }
      }
    }
  }
}
</style>