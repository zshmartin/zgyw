<template>
  <el-container>
    <!-- 左边 -->
    <el-aside class="bx-size aside" style="width: auto; max-width: 201px;">
      <div
        style="width: 100%; height: 60px; background-color:rgba(42, 68, 95); position: relative;"
      >
        <div
          class="img"
          style="width: 30px; height: 30px; position: absolute; left: 15px; top: 15px;"
        >
          <img :src="imgSrc" alt style="width: 100%; height: 100%;" />
        </div>
        <div
          style="padding-left: 15px; position: absolute; left: 50px; top: 20px; color: white; width: 120px;"
        >
          <p
            style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis; text-align: center;"
          >{{searchCompanyName}}</p>
          <!-- 百度跳转 -->
          <!-- <p
            style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis; text-align: center;"
          ><a href="http://www.baidu.com" target="_blank" >{{searchCompanyName}}</a></p>-->
        </div>
      </div>
      <!-- 导航栏 -->
      <div
        style="height: calc(100% - 60px); background-color: rgb(56, 76, 92); overflow-y: auto; overflow-x: hidden;"
      >
        <el-menu
          v-if="menuShow"
          class="el-menu-vertical-demo"
          unique-opened
          :default-active="$route.path"
          background-color="#384c5c"
          text-color="#fff"
          :collapse="isCollapse"
          active-text-color="#fff"
          @select="selectMenu"
          :key="layoutKey"
        >
          <div v-for="item in menus" :key="item.menuId">
            <template v-if="item.childrenMenu.length > 0">
              <el-submenu :index="item.menuId+''" class="slide-menu">
                <template slot="title">
                  <img
                    :src="getImgUrl(item.name)"
                    style="width: 26px; height: 26px; vertical-align: middle; margin-right: 2px;"
                    alt
                  />
                  <span>&nbsp;&nbsp;{{item.name}}</span>
                </template>

                <el-menu-item
                  v-for="subitem in item.childrenMenu"
                  :key="subitem.menuId"
                  :index="subitem.url"
                >{{subitem.name}}</el-menu-item>
              </el-submenu>
            </template>
            <template v-else>
              <el-menu-item :index="item.url">
                <img
                  :src="getImgUrl(item.name)"
                  style="width: 26px; height: 26px; vertical-align: middle; margin-right: 2px;"
                  alt
                />
                <span slot="title">&nbsp;&nbsp;{{item.name}}</span>
              </el-menu-item>
            </template>
          </div>
          <!-- <el-submenu
          v-for="item in menus"
          :key="item.menuId"
          :index="item.menuId+''"
          class="slide-menu"
        >
          <template slot="title">
            <img :src="getImgUrl(item.name)" style="width: 26px; height: 26px;" alt />
            <span>&nbsp;&nbsp;{{item.name}}</span>
          </template>

          <el-menu-item
            v-for="subitem in item.childrenMenu"
            :key="subitem.menuId"
            :index="subitem.url"
          >{{subitem.name}}</el-menu-item>
          </el-submenu>-->
        </el-menu>
      </div>
    </el-aside>
    <el-container>
      <!-- 顶部 -->
      <el-header style=" position: relative;" class="header">
        <!-- 伸缩菜单按钮 -->
        <div class="icon-box" @click="changeStatus">
          <!-- <i class="el-icon-sort is-collapse" @click="changeStatus"></i> -->
          <i
            :class="{icon: true, 'iconfont': true, 'iconshousuocaidan': isCollapse, 'iconshousuocaidan-copy': !isCollapse,}"
          ></i>
        </div>
        <div style="position: absolute; right: 10px; top: 16px;">
          <div style=" font-size: 14px; display: inline-block; color: #ddd;">
            当前公司&nbsp;&nbsp;
            <el-input
              v-model="companyName"
              readonly
              placeholder="请输入内容"
              size="medium"
              class="readonly"
              style="width: 220px; background-color: rgba(78, 101, 122); margin-right: 20px;"
            ></el-input>
          </div>
          <div style="display: inline-block">
            <SiteSelect></SiteSelect>
          </div>
          <div @click="searchWarn" style="display: inline-block; margin-left: 20px;">
            <el-badge :value="value" class="item" style>
              <i class="el-icon-message-solid" style="top: 12px; color: skyblue;"></i>
            </el-badge>
          </div>
          <el-dropdown placement="bottom" class="dropdown" style="margin-left: 20px;">
            <span class="el-dropdown-link" style="padding: 6px 10px; color: #fff;">
              <i class="el-icon-caret-bottom"></i>
              {{userName}}
            </span>
            <el-dropdown-menu slot="dropdown" style="margin-top: 0">
              <el-dropdown-item @click.native="checkInfo">个人中心</el-dropdown-item>
              <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <!-- <SiteSelect></SiteSelect> -->
      <!-- 主体 -->
      <el-main>
        <!-- <keep-alive include="test-keep-alive">
          <router-view></router-view>
        </keep-alive>-->
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import SiteSelect from "../subcomponents/siteSelect";
import GLOBAL from "../../utils/global_variable";
export default {
  inject: ["reload"], //注入依赖
  components: {
    SiteSelect
  },
  data() {
    return {
      isCollapse: false,
      layoutKey: 1, //菜单栏的key值，用于刷新组件
      menuSelect: "layout/siteDistribute", //当前选中的菜单
      userName: "",
      menus: [],
      value: null,
      imgSrc: "",
      companyId: "", //当前用户登录的公司id
      searchCompanyName: "", //当前公司所属的公司名
      menuShow: true
    };
  },
  computed: {
    // 监听当前站点是否切换
    watchSiteChange() {
      return this.$store.state.site.siteId;
    },
    companyName() {
      return this.$store.state.userInfo.companyName;
    }
  },
  watch: {
    $route(to, from) {
      console.log(to, from);
    },
    watchSiteChange() {
      this.getWarn();
      this.getLogo();
      if (this.$store.state.userInfo.companyId === 0) {
        this.getAllCompany();
      } else {
        this.searchCompanyName = this.$store.state.userInfo.companyName;
      }
    }
  },
  // 路由加载前
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (
        true
      ) {
        vm.getUserInfoBySession();
        // vm.getNav();
        // vm.getSite();
        if (vm.$store.state.userInfo) {
          if (vm.$store.state.userInfo.companyId === 0) {
            // vm.getAllCompany();
          } else {
            vm.searchCompanyName = vm.$store.state.userInfo.companyName;
          }
        } else {
          vm.$router.push("/login");
          return;
        }
      } else {
        vm.$router.push({ path: "/login" });
        return;
      }
    });
  },
  // 在渲染该组件的对应路由被 confirm 前调用
  // 不！能！获取组件实例 `this`
  // 因为当钩子执行前，组件实例还没被创建
  created() {
    this.menuSelect = this.$route.path;
    this.getScreenSize();
    // if (this.$store.state.site.siteId) {
    this.$root.Bus.$on("changeLogo", value => {
      console.log("changeLogo");
      // this.getLogo();
      // this.$forceUpdate();
    });
    // 注册刷新当前告警数量的中央事件
    this.$root.Bus.$on("freshTotalWarn", value => {
      this.getWarn();
    });
    this.$root.Bus.$on("freshUserName", value => {
      this.getUserName();
    });
    this.$root.Bus.$on("freshMenuSelect", value => {
      this.flushMenu();
    });
    // }
    this.$root.Bus.$on("changeCompanyName", value => {
      this.getAllCompany();
    });
  },
  mounted() {
    // 页面重新加载时重新请求部分数据
    window.onload = e => {
      if (this.$store.state.site.siteId) {
        this.getWarn();
      }
      this.getLogo();
      this.getNav();
      if (this.$store.state.userInfo.companyId === 0) {
        // this.getAllCompany();
      } else {
        this.searchCompanyName = this.$store.state.userInfo.companyName;
      }
    };
  },
  beforeDestroy() {
    // 监听中央事件清除
    this.offBusListener();
  },
  methods: {
    // 获取用户信息后获取菜单及站点等
    getUserInfoBySession() {
      this.$http
        .get("/sysmanage/sys/userInfo", {
          params: {}
        })
        .then(res => {
          if (res.data.code === 0) {
            let userInfo = res.data.data;
            // 用户信息存储至vuex
            // if (!this.$store.state.userInfo.name) {
            this.$store.commit("saveUserInfo", userInfo);
            // }
            this.userName = this.$store.state.userInfo.name;
            this.getNav();
            this.getSite();
          }
        });
    },
    getScreenSize() {
      var windowWidth = window.screen.width; //屏幕宽
      var windowHeight = window.screen.height; //屏幕高
      var screenSize = {
        width: windowWidth,
        height: windowHeight
      };
      this.$store.commit("saveScreenSize", screenSize);
    },
    // 恢复选中菜单(无效果)
    flushMenu() {
      // this.$nextTick(() => {
      // this.layoutKey++;

      // this.menuSelect = "layout/board";
      this.$forceUpdate();
      // this.menuShow = false;
      // this.$nextTick( () => {
      //   this.menuShow = true;
      // })

      // });
    },
    changeStatus() {
      this.$nextTick(item => {
        this.isCollapse = !this.isCollapse;
        // 通过中央事件告知监控页面尺寸改变
        this.$root.Bus.$emit("pageResize");
      });
    },
    // 点击菜单
    selectMenu(index, indexPath) {
      var url = this.$route.path;
      this.$router.push(index === "/plat2" ? url : index);
      if (index === "/plat2") {
        this.menuSelect = url;
        this.$router.push(url);
        
        // 跳转新窗口
        let routeUrl = this.$router.resolve({
          path: "/plat2"
        });
        window.open(routeUrl.href, "_blank");
        location.reload();
      } else {
        // this.$router.push(index);
      }
    },
    // 个人中心
    checkInfo() {
      this.$router.push({ path: "/layout/selfInfo" });
    },
    // 动态返回图片地址
    getImgUrl(url) {
      return require("../../assets/img/content/" + url + ".png");
    },
    logout() {
      // 届时可能需要清空session或者vuex
      this.$http
        .post("/sysmanage/sys/logout", {})
        .then(res => {
          if (res.data.code == 0) {
            // 清除所有sessionstorage
            sessionStorage.clear();
            this.$router.push("/login");
          }
        })
        .catch(error => {});
    },
    getNav() {
      this.$http
        .get("/sysmanage/sysmenu/nav", {
          params: {}
        })
        .then(res => {
          this.menus = res.data.data.menus;
          if (res.data.code != 0) {
            this.$router.push("/login");
          } else {
            this.menus = res.data.data.menus;
            this.$forceUpdate();
          }
        })
        .catch(res => {});
    },
    // 第一次获取所有站点，，
    getSite() {
      this.$http
        .get("equipment/roomList", {
          params: {
            page: 0,
            size: GLOBAL.max_page_size,
            companyId: this.$store.state.userInfo.companyId
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.options = res.data.data.roomList;
            let param = {
              companyId: this.$store.state.userInfo.companyId,
              sites: res.data.data.roomList
            };
            // 赋值到vuex
            if (!this.$store.state.site.siteId) {
              this.$store.commit("site_change", param);
            }
            // 查无站点
            console.log(this.$store.state.userInfo.companyId);
            if (this.$store.state.userInfo.companyId === 0) {
              this.getAllCompany();
            } else {
              this.searchCompanyName = this.$store.state.userInfo.companyName;
            }
            // this.getWarn();
            // console.log('getAll')
            // this.getLogo();
            // }
          }
        });
    },
    // 查看当前未确认告警数量
    getWarn() {
      if (this.$store.state.site.siteId) {
        // 当前站点值存在则请求数据，否则不请求
        this.$http
          .get("equipment/alarmEvent/countEvent", {
            params: {
              roomId: this.$store.state.site.siteId
            }
          })
          .then(res => {
            if (res.data.code == 0) {
              this.value =
                res.data.data.total > 99
                  ? "99+"
                  : res.data.data.total > 0
                  ? res.data.data.total
                  : null;
            }
          });
      }
    },
    // 跳转事件告警页面
    searchWarn() {
      // 判断是否已在当前路由
      if (this.$route.path !== "/layout/eventWarn") {
        this.$router.push("/layout/eventWarn");
      }
    },
    // 获取公司图标
    getLogo() {
      // 根据当前站点所属公司或登录用户公司
      let id = this.$store.state.site.siteId
        ? this.$store.state.site.searchCompanyId
        : this.$store.state.site.companyId;
      console.log(id);
      if (id || id === 0) {
        // 重新获取图片
        this.imgSrc = "";
        this.$http
          .get("sysmanage/getLogo", {
            params: {
              companyId: id
            }
          })
          .then(res => {
            this.imgSrc = res.request.responseURL;
            this.$forceUpdate();
          })
          .catch(res => {});
      }
    },
    // 获取所有公司名并赋值当前站点所属的公司名
    getAllCompany() {
      this.$http
        .get("sysmanage/company/findAll", {
          params: {
            name: "",
            page: 0,
            size: GLOBAL.max_page_size
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            sessionStorage.setItem(
              "companyList",
              JSON.stringify(res.data.data.companys)
            );
            // 在获取到值之后才再取值
            if (
              this.$store.state.site.searchCompanyId ||
              this.$store.state.site.searchCompanyId === 0
            ) {
              let index = JSON.parse(
                sessionStorage.getItem("companyList")
              ).findIndex(item => {
                return item.id === this.$store.state.site.searchCompanyId;
              });
              this.searchCompanyName = JSON.parse(
                sessionStorage.getItem("companyList")
              )[index].name;
            } else {
            }
          }
        });
    },
    // 刷新用户信息
    getUserName() {
      this.getUserInfoBySession();
      // this.userName = this.$store.state.userInfo.name;
    },
    // 中央事件取消
    offBusListener() {
      this.$root.Bus.$off("changeLogo");
      // 事件告警页面通知布局页面进行当前告警数量更新
      this.$root.Bus.$off("freshTotalWarn");
      this.$root.Bus.$off("changeCompanyName");
      this.$root.Bus.$off("freshUserName");
      this.$root.Bus.$off("freshMenuSelect");
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/css/index.less";
/* 边栏样式 */
.logo {
  height: 60px;
  width: 200px;
  transition: width 0.3s;
  border-bottom: 1px solid #7d7474;
  box-sizing: border-box;
  background-size: over;
  display: block;
}

.slide-menu /deep/ .el-submenu__title {
  font-size: 16px;
}

.slide-menu .iconfont {
  margin-right: 5px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  background-color: rgb(84, 92, 100);
  /* background-color: white; */
  /* background-color: @slide_color; */
  height: 100%;
  // font-family: FZShuTi-S05S;
  font-family: "黑体";
  overflow: hidden;
}

.el-menu-vertical-demo {
  overflow-x: hidden;
  //  overflow-y: auto;
}

.aside /deep/ .el-menu-vertical-demo.el-menu {
  border-right: 1px solid rgba(60, 141, 221);
}

// 目录选中色
.aside /deep/ .el-menu-vertical-demo .el-menu-item:focus {
  outline: 0;
  // background-color: #269b82 !important;
  background-color: none;
}
.aside /deep/ .el-menu-vertical-demo .el-menu-item.is-active {
  background-color: #269b82 !important;
}

.aside /deep/ .el-menu-vertical-demo li.is-active .el-submenu__title {
  // background-color: rgba(43, 164, 112)!important;
  background-color: #269b82 !important;
  // background-color: rgba(60, 141, 221)!important;
  border-bottom: 1px solid rgba(60, 141, 221);
}
.aside /deep/ .el-menu-vertical-demo li .el-submenu__title {
  border-bottom: 1px solid rgba(60, 141, 221);
  font-size: 18px;
  line-height: 34px;
  height: 42px;
}
.aside /deep/ .el-menu-vertical-demo .el-submenu .el-menu-item {
  border-bottom: 1px solid rgba(60, 141, 221);
  padding-left: 30px !important;
  font-size: 16px;
}

.aside /deep/ .el-submenu .el-menu-item {
  // margin: 4px 0;
  height: 36px;
  line-height: 36px;
}

// 去除上边框
.aside /deep/ .el-menu-item,
.aside /deep/ .el-submenu__title {
  border-top: none !important;
}

// 无子菜单的目录
.aside /deep/ .el-menu-item,
.el-submenu__title {
  height: 42px;
  border-bottom: 1px solid rgba(60, 141, 221);
  border-top: 1px solid rgba(60, 141, 221);
  font-size: 18px;
  line-height: 34px;
}

.aside /deep/ .el-submenu > .el-submenu__title .el-submenu__icon-arrow {
  color: #fff;
  transform: scale(1.5);
}

// 菜单栏收起隐藏下拉图标
.aside
  /deep/
  .el-menu--collapse
  .el-submenu
  > .el-submenu__title
  .el-submenu__icon-arrow {
  display: none;
}

.el-menu-vertical-demo {
  border-right: 0;
  // height: calc(100% - 60px);
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;

  display: inline-block !important;
}

/* .el-menu-vertical-demo /deep/ .el-menu-item.is-active {
  background-color: #3F5363!important;
} */

.el-menu-vertical-demo /deep/ .el-menu-item:focus,
.el-menu-item:hover {
  outline: 0;
  background-color: #3f5363 !important;
}
/* 顶部样式 */
.el-header {
  /* background-color: #eee; */
  height: 60px;
  /* border-bottom: 1px solid #ccc !important; */
  background-image: linear-gradient(
    90deg,
    rgba(42, 68, 95),
    rgba(64, 113, 151),
    rgba(42, 68, 95)
  );
  padding: 0;
}

.readonly {
  border-radius: 4px;
}

.readonly /deep/ .el-input__inner {
  border: none;
}

.el-header > .icon-box {
  height: 100%;
  width: 60px;
  float: left;
  position: relative;
  background-color: @primary-btn;
}

.el-header > .icon-box:hover {
  /* background-color: skyblue; */
  cursor: pointer;
}

.icon-box .iconfont {
  color: #fff;
}

.el-header > .icon-box > i {
  position: absolute;
  left: 22px;
  top: 22px;
  transform: scale(1.5, 1.5);
}

.el-dropdown-menu {
  background: #44627e;
  padding: 10px 0;
}
.el-dropdown-menu li.el-dropdown-menu__item {
  // background: #44627e;
  color: #fff;
  padding: 0 20px;
}
.el-dropdown-menu__item:focus,
.el-dropdown-menu__item:not(.is-disabled):hover {
  background-color: #838992;
  color: skyblue;
}

/* 内容样式 */
.el-main {
  background-color: #4e657a;
  box-sizing: border-box;
  /* background-color: #060941; */
  color: #333;
  height: 100%;
  // min-height: 500px;
  padding: 0;
  /* margin: 8px; */
  overflow: hidden;
  padding: 12px;
  border-top: 1px solid rgba(60, 141, 221);
}

body .el-container {
  // margin-bottom: 40px;
  height: 100%;
}

.manage {
  display: inline-flex;
  margin-right: 10px;
  float: right;
  line-height: 60px;
}

.message-box {
  box-sizing: border-box;
  cursor: pointer;
  color: #fff;
  /* height: 40px; */
  width: 56px;
  padding: 0 10px;
  position: relative;
}

.message-box /deep/ .el-badge__content {
  top: 18px;
}
</style>


<style lang="less" scoped>
@import "../../assets/css/index.less";
</style>