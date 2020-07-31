<template>
<!-- 百度地图 -->
  <div class="map" ref="map">
    <div class="config" v-show="ifEdit">
      <el-button size="mini" @click="editBoard" type="text">配置</el-button>
      <el-button size="mini" @click="delBoard" type="text">删除</el-button>
    </div>
    <div class="title">
      <i class="icon iconfont iconlocation" style="color: #0eceec"></i>
      <span>站点定位</span>
    </div>
    <div class="baidumap" id="allmap" ref="allmap"></div>
  </div>
</template>

<script>
import BMap from "BMap";
import BMapSymbolSHAPEPOINT from "BMap_Symbol_SHAPE_POINT";
// 导入监听元素尺寸变化的js
import watchSize from '../../../utils/watchSize'
export default {
  props: ["i", "item", "ifEdit"],
  data() {
    return {
      titleArr: [
        {
          number: 5,
          text: "总站点数"
        },
        // {
        //   number: 2,
        //   text: "故障站点数"
        // },
        // {
        //   number: 1,
        //   text: "离线站点数"
        // },
        {
          number: 25,
          text: "未处理告警数"
        }
      ],
      siteX: "", //经纬度
      siteY: "",
    };
  },
  computed: {
    getSiteChange() {
      return this.$store.state.site.siteId;
    }
  },
  watch: {
    getSiteChange() {
      this.getSiteTotal();
    },
  },
  created() {
  },
  mounted() {
    this.getSiteTotal();
    // 元素尺寸改变，重新定位中心点
    watchSize.bind(this.$refs.allmap, () => {
      console.log(111);
      if(this.map) {
        this.getMap();
      }
    });
  },
  methods: {
    editBoard() {
      this.$emit("editBoard", this.i, this.item);
    },
    delBoard() {
      this.$emit("delBoard", this.i, this.item);
    },
    // 返回
    goback() {
      this.$router.go(-1);
    },
    // 获取头部信息
    getSiteTotal() {
      this.$http
        .get("equipment/spreadSite", {
          params: {
            companyId: this.$store.state.site.searchCompanyId,
            siteLists: this.$store.state.site.siteId+"",
            roleId: this.$store.state.userInfo.roleId
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            for(var i = 0; i < res.data.data.siteVOList.length;i++) {
              if(res.data.data.siteVOList[i].id == this.$store.state.site.siteId) {
                this.siteX = res.data.data.siteVOList[i].longitude ? res.data.data.siteVOList[i].longitude : 116.397657;
                this.siteY = res.data.data.siteVOList[i].latitude ? res.data.data.siteVOList[i].latitude : 39.91582;
                this.siteName = res.data.data.siteVOList[i].name;
                this.map = new BMap.Map('allmap')
              } else {
                this.siteX = 116.397657;
                this.siteY = 39.91582;
              }
            }
            // this.siteX = res.data.data.longitude;
            // this.siteY = res.data.data.latitude;
            // this.siteName = res.data.data.name;
            // this.map = new BMap.Map("allmap");
            // let map = this.map; //赋值全局变量，供页面所有函数使用
            this.getMap();
          }
        });
    },
    searchDetail(index) {
      if (index === 0) {
        this.$router.push({ path: "/layout/siteManage" });
      } else if (index === 1) {
        this.$router.push({ path: "/layout/eventWarn" });
      }
    },
    getMap() {
      var point = new BMap.Point(this.siteX, this.siteY); //设置中心点
      console.log(this.map)
      this.map.centerAndZoom(point, 9);
      var markers = new BMap.Marker(point); //创建标注
      this.map.addOverlay(markers); //添加到地图上

      var showOpts = {
        position: point,
        offset: new BMap.Size(-20, 5)
      };

      var label = new BMap.Label(this.siteName, showOpts); // 创建文本标注对象]\
      label.setStyle({
        color: "red",
        fontSize: "12px",
        height: "20px",
        lineHeight: "20px",
        fontFamily: "微软雅黑",
        border: "none"
      });
      this.map.addOverlay(label);

      this.map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
      this.map.addControl(
        new BMap.NavigationControl({
          anchor: BMAP_ANCHOR_BOTTOM_RIGHT
          // type: BMAP_NAVIGATION_CONTROL_ZOOM
        })
      ); //平移缩放控件
      this.map.addControl(
        new BMap.ScaleControl({ offset: new BMap.Size(200, 20) })
      ); //比例尺控件,位置移动
      this.map.addControl(new BMap.OverviewMapControl()); //缩略图控件
      // map.addControl(new BMap.MapTypeControl());
      this.map.addControl(
        new BMap.MapTypeControl({
          mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP]
        })
      );
      this.map.setCurrentCity("深圳"); // 仅当设置城市信息时，MapTypeControl的切换功能才能可用
    }
  }
};
</script>

<style scoped>
.map {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: white;
}

.title {
  padding: 5px;
  color: #fff;
  background-color: #54657D;
  font-weight: bold;
  border-bottom: 1px solid #ccc;
}

.config {
  float: right;
}
#allmap {
  width: 100%;
  height: calc(100% - 31px);
  /* height:100%; */
  margin: 0;
  padding: 0;
}
</style>