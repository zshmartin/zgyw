<template>
  <div class="data-view">
    <div class="site-screen" :style="scaleFun">
      <div id="header">
        <dv-border-box-7
          style="box-shadow: rgba(255, 165, 0, 0.3) 0px 0px 20px inset;"
          :color="['rgba(255, 165, 0,0.3)','rgb(255, 165, 0)']"
        >
          <dv-decoration-8 class="header-left-decoration" />
          <dv-decoration-5 dur="8" class="header-center-decoration" />
          <div class="header-right-decoration">
            <dv-decoration-8 class :reverse="true" />
            <h3>电力二期，{{time}}</h3>
          </div>
          <h1 class="center-title">忠信世纪实时监测系统</h1>
        </dv-border-box-7>
      </div>
      <!-- 内容 -->
      <div id="content">
        <div class="top">
          <div class="sin">
            <dv-border-box-7
              style="box-shadow: rgba(255, 165, 0, 0.3) 0px 0px 20px inset;"
              :color="['rgba(255, 165, 0,0.3)','rgb(255, 165, 0)']"
            >
              <div class="sin-layout">
                <div>网关在线数量</div>
                <div>{{siteInfo.gatewayOnlineNum}}</div>
              </div>
            </dv-border-box-7>
          </div>
          <div class="sin">
            <dv-border-box-7
              style="box-shadow: rgba(255, 165, 0, 0.3) 0px 0px 20px inset;"
              :color="['rgba(255, 165, 0,0.3)','rgb(255, 165, 0)']"
            >
              <div class="sin-layout">
                <div>当前在线电表</div>
                <div>{{siteInfo.equipmentOnlineNum}}</div>
              </div>
            </dv-border-box-7>
          </div>
          <div class="sin">
            <dv-border-box-7
              style="box-shadow: rgba(255, 165, 0, 0.3) 0px 0px 20px inset;"
              :color="['rgba(255, 165, 0,0.3)','rgb(255, 165, 0)']"
            >
              <div class="sin-layout">
                <div>当前离线电表</div>
                <div>{{siteInfo.equipmentOfflineNum}}</div>
              </div>
            </dv-border-box-7>
          </div>
          <div class="sin">
            <dv-border-box-7
              style="box-shadow: rgba(255, 165, 0, 0.3) 0px 0px 20px inset;"
              :color="['rgba(255, 165, 0,0.3)','rgb(255, 165, 0)']"
            >
              <div class="sin-layout">
                <div>今天告警数</div>
                <div>{{siteInfo.alarmNum}}</div>
              </div>
            </dv-border-box-7>
          </div>
        </div>
        <div class="center">
          <div class="c-l">
            <!-- 当天告警事件 -->
            <div class="c-l-warn">
              <dv-border-box-7
                style="box-shadow: rgba(255, 165, 0, 0.3) 0px 0px 20px inset;"
                :color="['rgba(255, 165, 0,0.3)','rgb(255, 165, 0)']"
              >
                <!-- <div class="inner"> -->
                <dv-scroll-board :config="siteWarnList" />
                <!-- </div> -->
              </dv-border-box-7>
            </div>
            <div class="c-l-energy">
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
          <div class="c-r">
            <!-- 温度监控 -->
            <div class="c-r-tem">
              <dv-border-box-7
                style="box-shadow: rgba(255, 165, 0, 0.3) 0px 0px 20px inset;"
                :color="['rgba(255, 165, 0,0.3)','rgb(255, 165, 0)']"
              >
                <dv-scroll-board :config="siteTemMonitor" />
              </dv-border-box-7>
            </div>
            <div class="c-r-center">
              <div class="sin">
                <dv-border-box-7
                  style="box-shadow: rgba(255, 165, 0, 0.3) 0px 0px 20px inset;"
                  :color="['rgba(255, 165, 0,0.3)','rgb(255, 165, 0)']"
                >
                  <!-- <dv-scroll-board :config="siteTemMonitor" /> -->
                  {{todayEle[0]}}
                </dv-border-box-7>
              </div>
              <div class="sin">
                <dv-border-box-7
                  style="box-shadow: rgba(255, 165, 0, 0.3) 0px 0px 20px inset;"
                  :color="['rgba(255, 165, 0,0.3)','rgb(255, 165, 0)']"
                >
                  <!-- <dv-scroll-board :config="siteTemMonitor" /> -->
                </dv-border-box-7>
              </div>
            </div>
            <div class="c-r-right">
              <div class="sin">
                <dv-border-box-7
                  style="box-shadow: rgba(255, 165, 0, 0.3) 0px 0px 20px inset;"
                  :color="['rgba(255, 165, 0,0.3)','rgb(255, 165, 0)']"
                >
                  <!-- <dv-scroll-board :config="siteTemMonitor" /> -->
                </dv-border-box-7>
              </div>
              <div class="sin">
                <dv-border-box-7
                  style="box-shadow: rgba(255, 165, 0, 0.3) 0px 0px 20px inset;"
                  :color="['rgba(255, 165, 0,0.3)','rgb(255, 165, 0)']"
                >
                  <!-- <dv-scroll-board :config="siteTemMonitor" /> -->
                </dv-border-box-7>
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="b-l">
            <div class="b-l-l">
              <div class="b-l-l-l">
                <div class="b-top">
                  <dv-border-box-7
                    style="box-shadow: rgba(255, 165, 0, 0.3) 0px 0px 20px inset;"
                    :color="['rgba(255, 165, 0,0.3)','rgb(255, 165, 0)']"
                  ></dv-border-box-7>
                </div>
                <div class="b-bottom">
                  <dv-border-box-7
                    style="box-shadow: rgba(255, 165, 0, 0.3) 0px 0px 20px inset;"
                    :color="['rgba(255, 165, 0,0.3)','rgb(255, 165, 0)']"
                  ></dv-border-box-7>
                </div>
              </div>
              <div class="b-l-l-r">
                <div class="b-top">
                  <dv-border-box-7
                    style="box-shadow: rgba(255, 165, 0, 0.3) 0px 0px 20px inset;"
                    :color="['rgba(255, 165, 0,0.3)','rgb(255, 165, 0)']"
                  ></dv-border-box-7>
                </div>
                <div class="b-bottom">
                  <dv-border-box-7
                    style="box-shadow: rgba(255, 165, 0, 0.3) 0px 0px 20px inset;"
                    :color="['rgba(255, 165, 0,0.3)','rgb(255, 165, 0)']"
                  ></dv-border-box-7>
                </div>
              </div>
            </div>
            <div class="b-l-r">
              <dv-border-box-7
                style="box-shadow: rgba(255, 165, 0, 0.3) 0px 0px 20px inset;"
                :color="['rgba(255, 165, 0,0.3)','rgb(255, 165, 0)']"
              >
                <pie></pie>
              </dv-border-box-7>
            </div>
          </div>
          <div class="b-r">
            <div class="b-r-t">
              <dv-border-box-7
                style="box-shadow: rgba(255, 165, 0, 0.3) 0px 0px 20px inset;"
                :color="['rgba(255, 165, 0,0.3)','rgb(255, 165, 0)']"
              >
                <areaChart></areaChart>
              </dv-border-box-7>
            </div>
            <div class="b-r-b">
              <dv-border-box-7
                style="box-shadow: rgba(255, 165, 0, 0.3) 0px 0px 20px inset;"
                :color="['rgba(255, 165, 0,0.3)','rgb(255, 165, 0)']"
              >
                <areaChart></areaChart>
              </dv-border-box-7>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gradientBar from "../subcomponents/platformSub/bar-gradient";
import pie from "../subcomponents/platformSub/pie";
import areaChart from "../subcomponents/platformSub/area";
export default {
  components: {
    gradientBar,
    pie,
    areaChart
  },
  data() {
    return {
      time: "", //当前时间字符串
      interval: null, //定时获取当前时间
      scale: 1, //屏幕缩放比例
      windowWidth: null, //当前屏幕宽度
      windowHeight: null, //当前屏幕高度
      // 站点告警列表
      siteWarnList: {
        header: ["时间", "设备", "类型", "事件"],
        waitTime: 3000,
        headerBGC: "rgba(100,100,100,0.4)",
        oddRowBGC: "rgba(65, 50, 138,0.4)",
        evenRowBGC: "rgba(57, 14, 65,0.4)",
        data: [
          // ["行1列3", "5", "行1列3", "5"],
          // ["行2列3", "60", "行1列3", "5"],
          // ["行3列3", "41", "行1列3", "5"],
          // ["行3列3", "35", "行1列3", "5"],
          // ["行3列3", "87", "行1列3", "5"],
          // ["行3列3", "412", "行1列3", "5"]
        ],
        index: true,
        columnWidth: [50],
        align: ["center"]
      },
      // 温度监控列表
      siteTemMonitor: {
        header: ["时间", "设备", "类型", "事件"],
        waitTime: 3000,
        rowNum: 11,
        headerBGC: "rgba(100,100,100,0.4)",
        oddRowBGC: "rgba(65, 50, 138,0.4)",
        evenRowBGC: "rgba(57, 14, 65,0.4)",
        data: [
          ["行1列3", "5", "行1列3", "5"],
          ["行2列3", "60", "行1列3", "5"],
          ["行3列3", "41", "行1列3", "5"],
          ["行3列3", "35", "行1列3", "5"],
          ["行3列3", "87", "行1列3", "5"],
          ["行3列3", "412", "行1列3", "5"]
        ],
        index: true,
        columnWidth: [50],
        align: ["center"]
      },
      siteInfo: {
        gatewayOnlineNum: 0,
        equipmentOnlineNum: 0,
        equipmentOfflineNum: 0,
        alarmNum: 0
      },
      todayEle: [],       //当天总用电
    };
  },
  computed: {
    scaleFun() {
      return `transform: scale(${this.scale}); width: ${this.windowWidth}px; height: ${this.windowHeight}px`;
    }
  },
  watch: {},
  mounted() {
    window.addEventListener("resize", this.computedScale);
    this.getTimeStr();
    this.computedScale();
    this.getSiteInfo();
    this.getToDayWarn();
    this.getTempMonitor();
    this.getTodayEle();
  },
  beforeDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  },
  methods: {
    // 获取时间返回实时时间
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
    // 计算当前屏幕下的缩放比例
    computedScale() {
      var windowWidth = window.screen.width; //屏幕宽
      var pageWidth = document.getElementsByClassName("data-view")[0]
        .offsetWidth;
      this.scale = pageWidth / windowWidth;
    },
    // 网关、电表、告警查询
    getSiteInfo() {
      this.$http
        .get("equipment/largeScreen/ZhongXin2Qi/showSiteInfo", {
          params: {}
        })
        .then(res => {
          if (res.data.code === 0) {
            this.siteInfo = res.data.data;
          }
        });
    },
    // 获取当天告警数量
    getToDayWarn() {
      this.$http
        .get("equipment/largeScreen/ZhongXin2Qi/showTodayAlarmEvent", {
          params: {}
        })
        .then(res => {
          if (res.data.code === 0) {
            this.siteWarnList.data = res.data.data;
            // 文档备注
            this.siteWarnList = this.siteWarnList;
          }
        });
    },
    // 获取实时温度监控
    getTempMonitor() {
      this.$http
        .get("equipment/largeScreen/ZhongXin2Qi/showEquipmentTemp", {
          params: {}
        })
        .then(res => {
          if (res.data.code === 0) {
            this.siteTemMonitor.data = res.data.data;
            // 文档说明
            this.siteTemMonitor = this.siteTemMonitor;
          }
        });
    },
    // 获取当前总用电
    getTodayEle() {
      this.$http
        .get("equipment/largeScreen/ZhongXin2Qi/showTodayElectricEnergy", {
          params: {}
        })
        .then(res => {
          if (res.data.code === 0) {
            this.todayEle = res.data.data
          }
        });
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
  .site-screen {
    width: 1920px;
    height: 1080px;
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
    // 头部
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
              left: -16px;
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
      @flex-c();
      padding-bottom: 10px;
      box-sizing: border-box;
      overflow: hidden;
      .top {
        @flex-1();
        @dis-flex();
        .sin {
          @flex-1();
          margin-left: 10px;
          background: rgba(40, 13, 59, 0.5);
          .sin-layout {
            height: 100%;
            @dis-flex();
            display: -webkit-flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 10%;
            font-size: 24px;
          }
        }
        .sin:first-child {
          margin-left: 0;
        }
      }
      .center {
        flex: 6;
        margin-top: 10px;
        @dis-flex();
        .c-l {
          @flex-1();
          @dis-flex();
          @flex-c();
          margin-right: 10px;
          .c-l-warn {
            @flex-1();
            margin-bottom: 10px;
          }
          .c-l-energy {
            @flex-1();
            background: rgba(40, 13, 59, 0.5);
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
        .c-r {
          @flex-1();
          @dis-flex();
          .c-r-tem {
            @flex-1();
            background: rgba(40, 13, 59, 0.5);
          }
          .c-r-center {
            @flex-1();
            margin: 0 10px;
            @dis-flex();
            @flex-c();
            .sin {
              @flex-1();
              background: rgba(40, 13, 59, 0.5);
            }
            .sin:first-child {
              margin-bottom: 10px;
            }
          }
          .c-r-right {
            @flex-1();
            @dis-flex();
            @flex-c();
            .sin {
              @flex-1();
              background: rgba(40, 13, 59, 0.5);
            }
            .sin:first-child {
              margin-bottom: 10px;
            }
          }
        }
      }
      .bottom {
        flex: 4;
        margin-top: 10px;
        @dis-flex();
        // 左下
        .b-l {
          @flex-1();
          @dis-flex();
          margin-right: 10px;
          .b-l-l {
            @flex-1();
            margin-right: 10px;
            @dis-flex();
            .b-l-l-l {
              @flex-1();
              margin-right: 10px;
              @dis-flex();
              @flex-c();
              .b-top {
                @flex-1();
                margin-bottom: 10px;
                background: rgba(40, 13, 59, 0.5);
              }
              .b-bottom {
                @flex-1();
                background: rgba(40, 13, 59, 0.5);
              }
            }
            .b-l-l-r {
              @flex-1();
              @dis-flex();
              @flex-c();
              .b-top {
                @flex-1();
                margin-bottom: 10px;
                background: rgba(40, 13, 59, 0.5);
              }
              .b-bottom {
                @flex-1();
                background: rgba(40, 13, 59, 0.5);
              }
            }
          }
          .b-l-r {
            @flex-1();
            background: rgba(40, 13, 59, 0.5);
          }
        }
        .b-r {
          @flex-1();
          @dis-flex();
          @flex-c();
          .b-r-t {
            @flex-1();
            margin-bottom: 10px;
            background: rgba(40, 13, 59, 0.5);
          }
          .b-r-b {
            @flex-1();
            background: rgba(40, 13, 59, 0.5);
          }
        }
      }
    }
  }
}
</style>