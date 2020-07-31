<template>
  <div class="map">
    <div id="header">
      <div
        style
        v-for="(item, index) in titleArr"
        :key="index"
        class="single"
        @click="searchDetail(index)"
      >
        <div style :class="{'single-layout': true,'site': index === 0, 'warn': index === 1}">
          <div class="img" style>
            <img :src="getUrl(index)" style alt />
          </div>
          <div class="data" style>
            <div class="data-layout" v-for="(item1,index) in item" :key="index" style>
              <span>{{item1.text}}</span>
              <b
                style="font-size: 18px;"
                :class="{'total-size-color':item1.text == '总站点数','total-warn-color': item1.text == '未处理告警数','total-warnNone-color': item1.text == '总告警数'}"
              >{{item1.number}}</b>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="baidumap" id="allmap"></div>
  </div>
</template>

<script>
import BMap from "BMap";
import BMapSymbolSHAPEPOINT from "BMap_Symbol_SHAPE_POINT";
export default {
  data() {
    return {
      titleArr: [
        [
          {
            number: 0,
            text: "总站点数"
          }
        ],
        [
          {
            number: 0,
            text: "总告警站点"
          },
          {
            number: 0,
            text: "总告警数"
          }
        ]
      ],
      sitePosition: [],
      map: ""
    };
  },
  computed: {
    getSiteChange() {
      return this.$store.state.site.siteId;
    },
    ids() {
      var arr = [];
      for (var i = 0; i < this.$store.state.site.siteList.length; i++) {
        arr.push(this.$store.state.site.siteList[i].id);
      }
      return arr.join(",");
    }
  },
  watch: {
    getSiteChange() {
      this.getSiteTotal();
    }
  },
  mounted() {
    if (
      this.$store.state.site.searchCompanyId === 0 ||
      this.$store.state.site.searchCompanyId
    ) {
      this.getSiteTotal();
    }
  },
  methods: {
    // 返回
    goback() {
      this.$router.go(-1);
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
            this.titleArr[0][0].number = res.data.data.siteCount;
            this.titleArr[1][0].number = res.data.data.siteAlarmTotal;
            this.titleArr[1][1].number = res.data.data.totalAlarmCount;
            this.getMap();
          }
        });
    },
    getUrl(index) {
      if (index == 0) {
        return require("../../assets/img/概览.png");
      } else if (index === 1) {
        return require("../../assets/img/站点告警.png");
      }
    },
    // 绘图
    getMap() {
      // 获取中心站点定位
      var index = this.sitePosition.findIndex(item => {
        return item.id === this.$store.state.site.siteId;
      });
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
@import "../../assets/css/index.less";

.map {
  width: 100%;
  height: 100%;
  position: relative;
  min-height: 500px;
  #header {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 200;
    background-color: #fff;
    // 单个窗口
    .single {
      width: 210px;
      display: inline-block;
      height: 70px;
      position: relative;
      margin-right: 2px;
      &:hover {
        cursor: pointer;
      }
      .single-layout {
        height: 100%;
        width: 100%;
        border-radius: 4px;
        .img {
          display: inline-block;
          position: absolute;
          top: 20px;
          left: 20px;
          img {
            width: 30px;
            height: 30px;
          }
        }
        .data {
          display: inline-block;
          position: absolute;
          left: 60px;
          top: 10px;
          .data-layout {
            width: 140px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .total-size-color {
              color: rgba(37, 27, 201);
            }
            .total-warn-color {
              color: rgba(5, 250, 148);
            }
            .total-warnNone-color {
              color: rgba(199, 51, 52);
            }
          }
        }
      }
      // 总站点
      .site {
        background-color: rgba(51, 158, 12);
      }
      // 总告警
      .warn {
        background-color: rgba(235, 130, 18);
      }
    }
  }
  #allmap {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
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