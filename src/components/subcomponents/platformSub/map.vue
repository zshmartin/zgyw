<template>
<!-- 大屏服务百度地图组件 -->
  <div class="baidumap" id="allmap"></div>
</template>

<script>
import BMap from "BMap";
import BMapSymbolSHAPEPOINT from "BMap_Symbol_SHAPE_POINT";
export default {
  data() {
    return {
      sitePosition: [],
    };
  },
  mounted() {
    // this.getSiteTotal()
    this.getMap()
    console.log(1)
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
      console.log(2)
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

<style lang="less">
@import "../../../assets/css/index.less";
.baidumap {
  width: 100%;
  height: 100%;
}
</style>