<template>
  <div id="app">
    <!-- keep-alive在此处不生效 -->
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
// import 'babel-polyfill';
export default {
  name: "App",

  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      isRouterAlive: true
    };
  },
  computed: {
    // return
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.isRouterAlive = true;
      });
    }
  },
  created() {
    // 用于解决vuex刷新后丢失的问题
    //在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem("store")) {
      this.$store.replaceState(
        Object.assign(
          // {},
          this.$store.state,
          JSON.parse(sessionStorage.getItem("store"))
        )
      );
      // 赋值后清除
      sessionStorage.removeItem("store");
    }
    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem("store", JSON.stringify(this.$store.state));
    });
  }
};
</script>


<style lang="less">
@import "./assets/css/index.less";

</style>
