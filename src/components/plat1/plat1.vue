<template>
  <div class="data-view">
    <div class="platform-screen" :style="scaleFun">
      <div class="header">
        <h1 class="header-title">大屏数据可视化</h1>
      </div>
      <div class="content">
        <div class="left">
          <div class="left-top">
            <dv-border-box-10 :color="['rgba(81,225,28,0.2)','rgba(81,225,28,0.2)']" class>
              <div class="total">
                <div class="title">
                  <h3>&nbsp;&nbsp;运行监控</h3>
                </div>
                <div class="line"></div>
                <div class="round-show">
                  <div class="total-site">
                    <dv-decoration-9 :color="['skyblue','yellow']" :dur="duration" style>15</dv-decoration-9>
                  </div>
                  <div class="total-warn">
                    <dv-decoration-9 :color="['skyblue','pink']" :dur="duration" style>112</dv-decoration-9>
                  </div>
                  <div class="total-sum">
                    <dv-decoration-9 :color="['skyblue','orange']" :dur="duration" style>56</dv-decoration-9>
                  </div>
                </div>
                <div class="decoration">
                  <div class="single site">
                    <span>总监控站点数</span>
                    <span>统计总站点</span>
                  </div>
                  <div class="single warn">
                    <span>总告警数</span>
                    <span>统计告警总数用于反映设备安全程度</span>
                  </div>
                  <div class="single order">
                    <span>总工单数</span>
                    <span>用于反映用户的对该系统的需求程度</span>
                  </div>
                </div>
              </div>
            </dv-border-box-10>
          </div>
          <div class="left-center">
            <dv-border-box-10 :color="['rgba(81,225,28,0.2)','rgba(81,225,28,0.2)']">
              <div class="warn">
                <div class="title">
                  <h3>&nbsp;&nbsp;站点列表</h3>
                </div>
                <div class="line"></div>
                <div class="bar">
                  <!-- <areaChart></areaChart> -->
                  <dv-scroll-ranking-board :config="siteRank" style="height: 256px; width: 100%;" />
                </div>
              </div>
            </dv-border-box-10>
          </div>
          <div class="left-bottom">
            <dv-border-box-10 :color="['rgba(81,225,28,0.2)','rgba(81,225,28,0.2)']">
              <div class="energy">
                <div class="title">
                  <h3>&nbsp;&nbsp;实时负荷</h3>
                </div>
                <div class="line"></div>
                <div class="line-chart">
                  <!-- <bar1></bar1> -->
                  <areaChart></areaChart>
                </div>
              </div>
            </dv-border-box-10>
          </div>
        </div>
        <div class="center">
          <div class="center-top">
            <h3 style=" ">总能耗</h3>
            <div class="scroll-num" style>
              <div
                class="number-animate"
                style
                v-for="(item,index) in numFormat(number).split('')"
                :key="index"
              >
                <!-- 数字显示 -->
                <div v-if="item !== ','" :class="classObj(item,index)" style>
                  <span
                    class="number-animate-span"
                    style
                    v-for="(item1, index) in 10"
                    :key="index"
                  >{{index}}</span>
                </div>
                <!-- 逗号 -->
                <div v-else style class="dot">
                  <span class="number-animate-span" style>,</span>
                </div>
              </div>
              <div style="font-size: 30px; color: rgb(77, 114, 167)">t</div>
            </div>
            <!-- <div style="position: absolute; top: 100px; left: 0; width: 100%;">
              <dv-decoration-2 dur=10 style="height: 5px; width: 100%;" />
            </div>-->
          </div>
          <div class="center-center">
            <dv-border-box-6>
              <bdMap></bdMap>
              <!-- <dv-border-box-10  :color="['rgba(81,225,28,0.2)','rgba(81,225,28,0.2)']"></dv-border-box-10> -->
            </dv-border-box-6>
          </div>
          <div class="center-bottom">
            <div class="center-bottom-left">
              <dv-border-box-10 :color="['rgba(81,225,28,0.2)','rgba(81,225,28,0.2)']">
                <h3>本月告警</h3>
                <bar2 :color="['#444','rgb(57, 103, 169)']"></bar2>
              </dv-border-box-10>
            </div>
            <div class="center-bottom-right">
              <dv-border-box-10 :color="['rgba(81,225,28,0.2)','rgba(81,225,28,0.2)']">
                <h3>本月工单</h3>
                <bar2 :color="['rgb(34, 232, 166)','rgb(57, 103, 169)']"></bar2>
              </dv-border-box-10>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="right-top">
            <dv-border-box-10 :color="['rgba(81,225,28,0.2)','rgba(81,225,28,0.2)']">
              <div class="single warn">
                <p>本月告警</p>
                <p>26</p>
              </div>
              <div class="single order">
                <p>本月工单</p>
                <p>64</p>
              </div>
              <div class="single detail">
                <p>本月已处理工单</p>
                <p>13</p>
              </div>
            </dv-border-box-10>
          </div>
          <div class="right-center">
            <div class="right-center-left">
              <dv-border-box-10 :color="['rgba(81,225,28,0.2)','rgba(81,225,28,0.2)']">
                <h3>用能top10</h3>
                <div class="com">
                  <dv-conical-column-chart :config="config" />
                </div>
              </dv-border-box-10>
            </div>
            <div class="right-center-right">
              <dv-border-box-10 :color="['rgba(81,225,28,0.2)','rgba(81,225,28,0.2)']">
                <h3>各用能占比</h3>
                <div class="com">
                  <bar3></bar3>
                </div>
              </dv-border-box-10>
            </div>
          </div>
          <div class="right-bottom border-b">
            <div class="block-layout">
              <dv-border-box-10 :color="['rgba(81,225,28,0.2)','rgba(81,225,28,0.2)']">
                <h3>本月用能曲线</h3>
                <div class="com">
                  <!-- <dv-conical-column-chart :config="config" /> -->
                  <gradientBar></gradientBar>
                </div>
              </dv-border-box-10>
            </div>
          </div>
        </div>
      </div>
      <div class="foot"></div>
    </div>
  </div>
</template>


<script>
import BMap from "BMap";
import BMapSymbolSHAPEPOINT from "BMap_Symbol_SHAPE_POINT";
import bar from "../subcomponents/platformSub/bar";
import bar1 from "../subcomponents/platformSub/bar1";
import bar2 from "../subcomponents/platformSub/bar2";
import bar3 from "../subcomponents/platformSub/bar3";
import pie from "../subcomponents/platformSub/pie";
import areaChart from "../subcomponents/platformSub/area";
import bdMap from "../subcomponents/platformSub/map";
import gradientBar from "../subcomponents/platformSub/bar-gradient";
import { numFormat } from "../../utils/index";
export default {
  components: {
    bar,
    pie,
    areaChart,
    bar1,
    bar2,
    bar3,
    gradientBar,
    bdMap
  },
  data() {
    return {
      windowWidth: this.$store.state.screenSize.width,
      windowHeight: this.$store.state.screenSize.height,
      duration: 15,
      sitePosition: [],
      scale: 0.6, //缩放比例
      ifScroll: false,
      oldNum: "1597634895",
      number: "1674358641", //滚动数字值
      config: {
        data: [
          {
            name: "周口",
            value: 55
          },
          {
            name: "南阳",
            value: 120
          },
          {
            name: "西峡",
            value: 71
          },
          {
            name: "驻马店",
            value: 66
          },
          {
            name: "新乡",
            value: 80
          },
          {
            name: "信阳",
            value: 35
          },
          {
            name: "漯河",
            value: 15
          }
        ],
        showValue: true
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
      }
    };
  },
  computed: {
    ids() {
      var arr = [];
      for (var i = 0; i < this.$store.state.site.siteList.length; i++) {
        arr.push(this.$store.state.site.siteList[i].id);
      }
      return arr.join(",");
    },
    scaleFun() {
      return `transform: scale(${this.scale}); width: ${this.windowWidth}px; height: ${this.windowHeight}px`;
    }
  },
  watch: {
    scale(newValue) {
      // this.scaleFun()
    }
  },
  mounted() {
    // console.log(this.$store.state.site.searchCompanyId)
    if (
      this.$store.state.site.searchCompanyId === 0 ||
      this.$store.state.site.searchCompanyId
    ) {
      this.getSiteTotal();
    }
    window.addEventListener("resize", this.computedScale);
    this.computedScale();
    // this.webSocketConnection()
    // 模拟数据定时更改
    setInterval(() => {
      var num = parseInt(Math.random() * 10000000000);
      this.oldNum = this.number;
      this.number = num;
    }, 10000);
  },
  methods: {
    numFormat(num) {
      return numFormat(num);
    },
    classObj(item, index) {
      console.log(item);
      var value = item - this.oldNum[index];
      return "scroll-" + item + " item-scroll";
    },
    computedScale() {
      this.windowWidth = this.$store.state.screenSize.width; //屏幕宽
      var pageWidth = document.getElementsByClassName("data-view")[0]
        .offsetWidth;
      this.scale = pageWidth / this.windowWidth;
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
            return;
            this.getMap();
          }
        });
    },
    // 绘图
    getMap() {
      return;
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
      this.map = new BMap.Map("allmap");
      let map = this.map; //赋值全局变量，供页面所有函数使用

      var point = new BMap.Point(x, y); //设置中心点
      map.centerAndZoom(point, 9);
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
      map.addControl(
        new BMap.MapTypeControl({
          mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP]
        })
      );
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
    },
    searchDetail(index) {
      if (index === 0) {
        this.$router.push({ path: "/layout/siteManage" });
      } else if (index === 1) {
        this.$router.push({ path: "/layout/eventWarn" });
      }
    }
    // websocket连接测试
    // webSocketConnection() {
    //   return
    //   var websocket = null;

    //   //判断当前浏览器是否支持WebSocket  ,主要此处要更换为自己的地址
    //   if ("WebSocket" in window) {
    //     websocket = new WebSocket('ws://192.168.101.8:8082/webSocket/djedfjd56454');
    //   } else {
    //     alert("Not support websocket");
    //   }

    //   //连接发生错误的回调方法
    //   websocket.onerror = function() {
    //     setMessageInnerHTML("error");
    //   };

    //   //连接成功建立的回调方法
    //   websocket.onopen = function(event) {
    //     setMessageInnerHTML("open");
    //   };

    //   //接收到消息的回调方法
    //   websocket.onmessage = function(event) {
    //     setMessageInnerHTML(event.data);
    //   };

    //   //连接关闭的回调方法
    //   websocket.onclose = function() {
    //     setMessageInnerHTML("close");
    //   };

    //   //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
    //   window.onbeforeunload = function() {
    //     websocket.close();
    //   };

    //   //将消息显示在网页上
    //   function setMessageInnerHTML(innerHTML) {
    //     console.log(innerHTML)
    //     // document.getElementById("message").innerHTML += innerHTML + "<br/>";
    //   }

    //   //关闭连接
    //   function closeWebSocket() {
    //     websocket.close();
    //   }

    //   //发送消息
    //   function send() {
    //     var message = document.getElementById("text").value;
    //     websocket.send(message);
    //   }
    // }
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
    // width: 1920px;
    // height: 1080px;
    // background-image: url("../../../static/img/platform-screen/bg2.png");
    background-color: rgb(0, 23, 55);
    // background-color: red;
    position: fixed;
    top: 0;
    left: 0;
    overflow: hidden;
    transform-origin: left top;
    z-index: 999;
    display: flex;
    flex-direction: column;
    .header {
      height: 48px;
      position: relative;
      background-image: url("../../../static/img/platform-screen/header.png");
      background-position-x: 0px;
      background-position-y: 0px;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      overflow: hidden;
      .header-title {
        line-height: 42px;
        font-size: 22px;
      }
      .header-title {
        margin: 0;
        padding: 0;
        text-align: center;
        font-weight: 400;
        color: #e9c29d;
      }
    }
    .content {
      flex: 1;
      display: flex;
      .left {
        height: 100%;
        width: 30%;
        box-sizing: border-box;
        padding-left: 10px;
        .left-top {
          height: 35%;
          padding-bottom: 10px;
          box-sizing: border-box;
          // 运行监控
          .total {
            padding: 20px;
            height: 100%;
            display: flex;
            flex-direction: column;
            .title {
              padding-bottom: 6px;
            }
            .line {
              height: 2px;
              background-image: linear-gradient(
                90deg,
                #2a445f,
                #407197,
                #2a445f
              );
            }
            .round-show {
              height: 40%;
              display: flex;

              .total-site {
                width: 33%;
                padding: 15px;
                box-sizing: border-box;
              }
              .total-warn {
                width: 33%;
                padding: 15px;
                box-sizing: border-box;
              }
              .total-sum {
                flex: 1;
                padding: 15px;
                box-sizing: border-box;
              }
            }
            .decoration {
              flex: 1;
              padding: 20px;
              .single {
                margin-bottom: 15px;
              }
              .site {
                span:first-child {
                  color: yellow;
                }
              }
              .warn {
                span:first-child {
                  color: pink;
                }
              }
              .order {
                span:first-child {
                  color: orange;
                }
              }
            }
          }
        }
        .left-center {
          height: 35%;
          padding-bottom: 10px;
          box-sizing: border-box;
          .warn {
            padding: 20px;
            box-sizing: border-box;
            height: 100%;
            // display: flex;
            // flex-direction: column;
            .title {
              padding-bottom: 6px;
            }
            .line {
              height: 2px;
              background-image: linear-gradient(
                90deg,
                #2a445f,
                #407197,
                #2a445f
              );
            }
            .bar {
              height: 100%;
              // height: 40%;
              @flex-1();
              // padding: 10px;
              box-sizing: border-box;
              margin-top: 10px;
              & /deep/ .border-box-content {
                padding: 0 6px;
                box-sizing: border-box;
              }
            }
          }
        }
        .left-bottom {
          height: 30%;
          .energy {
            padding: 20px;
            box-sizing: border-box;
            height: 100%;
            @dis-flex();
            @flex-c();
            .title {
              padding-bottom: 6px;
            }
            .line {
              height: 2px;
              background-image: linear-gradient(
                90deg,
                #2a445f,
                #407197,
                #2a445f
              );
            }
            .line-chart {
              @flex-1();
              height: 2px;
              // background-image: linear-gradient(
              //   90deg,
              //   #2a445f,
              //   #407197,
              //   #2a445f
              // );
            }
          }
        }
      }
      .center {
        flex: 1;
        padding: 0 10px 0 10px;
        box-sizing: border-box;
        .center-top {
          height: 14%;
          position: relative;
          h3 {
            position: absolute;
            top: 8px;
            left: 22px;
          }
          .scroll-num {
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: "Farrington7B_Qiqi";
            .number-animate {
              line-height: 45px;
              height: 45px;
              font-size: 40px;
              overflow: hidden;
              display: inline-block;
              position: relative;
              // color: rgb(77, 114, 167);
              color: rgb(11, 248, 255);
              .item-scroll {
                // background: #222;
                width: 40px;
                // color: yellow;
                // border-left: 1px solid #fff;
                text-align: center;
                float: left;
                position: relation;
                top: 0;
                .number-animate-span {
                  float: left;
                  width: 100%;
                  height: 45px;
                  line-height: 1;
                  font-weight: bold;
                }
              }
              // 逗号
              .dot {
                // background: #222;
                width: 40px;
                // color: yellow;
                // border-left: 1px solid #fff;
                text-align: center;
                float: left;
                position: relation;
                top: 0;
                span {
                  float: left;
                  width: 100%;
                  height: 45px;
                  line-height: 1;
                  font-weight: bold;
                }
              }
            }
          }
        }
        .center-center {
          // position: relative;
          height: 56%;
          padding-bottom: 10px;
          box-sizing: border-box;
          .border-box-content {
            position: relative;
            .dv-border-box-10 {
              width: 100%;
              height: 100%;
              position: absolute;
              top: 0;
              left: 0;
            }
          }
        }
        .center-bottom {
          height: 30%;
          padding-bottom: 10px;
          box-sizing: border-box;
          @dis-flex();
          // padding-top: 10px;
          box-sizing: border-box;
          .center-bottom-left {
            flex: 1;
            padding-right: 5px;
            box-sizing: border-box;
            /deep/ .border-box-content {
              padding: 20px;
              box-sizing: border-box;
              @dis-flex();
              @flex-c();
              bar2 {
                @flex-1();
              }
            }
          }
          .center-bottom-right {
            flex: 1;
            padding-left: 5px;
            box-sizing: border-box;
            /deep/ .border-box-content {
              padding: 20px;
              box-sizing: border-box;
              @dis-flex();
              @flex-c();
              bar2 {
                @flex-1();
              }
            }
          }
        }
      }
      .right {
        width: 30%;
        box-sizing: border-box;
        padding-right: 10px;
        .right-top {
          height: 20%;
          /deep/ .border-box-content {
            @dis-flex();
            @flex-pc();
            @flex-sc();
            padding: 0 10px;
            box-sizing: border-box;
            .single {
              @flex-1();
              height: 140px;
              background: #092137;
              border-radius: 10px;
              @dis-flex();
              @flex-c();
              @flex-pc();
              @flex-sc();
              p:first-child {
                color: #23e1a6;
              }
              p + p {
                font-size: 34px;
                color: yellow;
              }
            }
            .order {
              margin: 0 10px;
            }
          }
        }
        .right-center {
          padding: 10px 0;
          box-sizing: border-box;
          height: 50%;
          @dis-flex();
          .right-center-left {
            padding-right: 5px;
            @flex-1();
            .dv-border-box-10 {
              & /deep/ .border-box-content {
                padding: 20px;
                box-sizing: border-box;
                @dis-flex();
                @flex-c();
                .com {
                  @flex-1();
                }
              }
            }
          }

          .right-center-right {
            padding-left: 5px;
            @flex-1();
            .dv-border-box-10 {
              & /deep/ .border-box-content {
                padding: 20px;
                box-sizing: border-box;
                @dis-flex();
                @flex-c();
                .com {
                  @flex-1();
                  padding-top: 40px;
                  box-sizing: border-box;
                }
              }
            }
          }
        }
        .right-bottom {
          height: 30%;
          .block-layout {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            .dv-border-box-10 {
              & /deep/ .border-box-content {
                padding: 20px;
                box-sizing: border-box;
                @dis-flex();
                @flex-c();
                .com {
                  @flex-1();
                }
              }
            }
          }
        }
      }
    }
    .foot {
      height: 16px;
      background-image: url("../../../static/img/platform-screen/footer.png");
      background-position-x: 0px;
      background-position-y: 0px;
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
  }
}
// 数字滚动
.scroll-1 {
  transform: translateY(-45px);
  transition: all 1s ease 0s;
}
.scroll-2 {
  transform: translateY(-45px * 2);
  transition: all 1s ease 0s;
}
.scroll-3 {
  transform: translateY(-45px * 3);
  transition: all 1s ease 0s;
}
.scroll-4 {
  transform: translateY(-45px * 4);
  transition: all 1s ease 0s;
}
.scroll-5 {
  transform: translateY(-45px * 5);
  transition: all 1s ease 0s;
}
.scroll-6 {
  transform: translateY(-45px * 6);
  transition: all 1s ease 0s;
}
.scroll-7 {
  transform: translateY(-45px * 7);
  transition: all 1s ease 0s;
}
.scroll-8 {
  transform: translateY(-45px * 8);
  transition: all 1s ease 0s;
}
.scroll-9 {
  transform: translateY(-45px * 9);
  transition: all 1s ease 0s;
}

.scroll1 {
  transform: translateY(45px);
  transition: all 1s ease 0s;
}
.scroll2 {
  transform: translateY(45px * 2);
  transition: all 1s ease 0s;
}
.scroll3 {
  transform: translateY(45px * 3);
  transition: all 1s ease 0s;
}
.scroll4 {
  transform: translateY(45px * 4);
  transition: all 1s ease 0s;
}
.scroll5 {
  transform: translateY(45px * 5);
  transition: all 1s ease 0s;
}
.scroll6 {
  transform: translateY(45px * 6);
  transition: all 1s ease 0s;
}
.scroll7 {
  transform: translateY(45px * 7);
  transition: all 1s ease 0s;
}
.scroll8 {
  transform: translateY(45px * 8);
  transition: all 1s ease 0s;
}
.scroll9 {
  transform: translateY(45px * 9);
  transition: all 1s ease 0s;
}
</style>