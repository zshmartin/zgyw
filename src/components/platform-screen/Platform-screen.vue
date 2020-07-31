<template>
  <div class="platform-screen">
    <!-- <p>平台大屏</p> -->
    <!-- <dv-full-screen-container>content</dv-full-screen-container> -->
    <div class="header">
      <h1 class="header-title">大屏数据可视化</h1>
    </div>
    <div class="content">
      <div class="top">
        <div class="top-left">
          <dv-border-box-11 title="站点列表"></dv-border-box-11>
        </div>
        <div class="top-center">
          <dv-border-box-11 title="实时负荷趋势">
          </dv-border-box-11>
          <div class="map-area">
            <div class="baidumap" id="allmap"></div>
          </div>
        </div>
        <div class="top-right">
          <dv-border-box-11 title="本月工单"></dv-border-box-11>
        </div>
      </div>
      <div class="bottom">
        <div class="bottom-left">
          <dv-border-box-3>
            <div class="padd-content">
              <h4>本月告警</h4>
              <div class="loading">
                <dv-loading></dv-loading>
              </div>
            </div>
          </dv-border-box-3>
        </div>
        <div class="bottom-right">
          <dv-border-box-3>本月工单</dv-border-box-3>
        </div>
      </div>
    </div>

    <div class="foot"></div>
  </div>
</template>


<script>
import BMap from "BMap";
import BMapSymbolSHAPEPOINT from "BMap_Symbol_SHAPE_POINT";
export default {
  data() {
    return {
      sitePosition: []
    };
  },
  computed: {
    ids() {
      var arr = [];
      for (var i = 0; i < this.$store.state.site.siteList.length; i++) {
        arr.push(this.$store.state.site.siteList[i].id);
      }
      return arr.join(",");
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
  },
  methods: {
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
  }
};
</script>

<style lang="less" scoped>
.platform-screen {
  width: 100%;
  min-width: 1400px;
  height: 100%;
  min-height: 800px;
  overflow-y: auto;
  box-sizing: border-box;
  padding: 0 15px;
  position: relative;
  font-family: "Microsoft Yahei", Arial, sans-serif;
  background-image: url("../../../static/img/platform-screen/bg.png");
  background-position-x: 0px;
  background-position-y: 0px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
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
    height: calc(100% - 64px);
    .top {
      height: 50%;
      display: flex;
      justify-content: space-between;
      .top-left {
        width: 30%;
        height: 100%;
      }
      .top-center {
        width: 46%;
        height: 100%;
        box-sizing: border-box;
        // padding: 30px 10px 10px;
        position: relative;
        .map-area {
          position: absolute;
          top: 0;
          left: 0;
          width: calc(100% - 20px);
          height: calc(100% - 60px);
          margin: 50px 10px 10px;
          box-sizing: border-box;
          overflow: hidden;
          .baidumap {
            overflow: hidden;
            width: 100%;
            height: 100%;
            border-radius: 18px;
          }
        }
      }
      .top-right {
        width: 20%;
        height: 100%;
      }
    }
    .bottom {
      margin-top: 15px;
      height: calc(50% - 15px);
      display: flex;
      justify-content: space-between;
      .bottom-left {
        width: 49%;
        height: 100%;
        .padd-content {
          padding: 25px;
          box-sizing: border-box;
          height: 100%;
          .loading {
            width: 100%;
            height: 100%;
            justify-content: center;
            align-items: center;
          }
        }
      }
      .bottom-right {
        width: 49%;
        height: 100%;
      }
    }
  }
  .foot {
    height: 16px;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-image: url("../../../static/img/platform-screen/footer.png");
    background-position-x: 0px;
    background-position-y: 0px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
}
</style>
