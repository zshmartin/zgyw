// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

// 引入babel-polyfill
import 'babel-polyfill'

import Vue from 'vue'
Vue.config.devtools = true
import App from './App'
import router from './router'
import qs from 'qs'
// body = qs.stringify(body)
import store from './store/index'
//导入自定义指令文件
import directives from "./utils/directives.js"
Vue.use(directives)

// 导入Font Awesome
// import {
//   library
// } from '@fortawesome/fontawesome-svg-core'
// import {
//   fas
// } from '@fortawesome/free-solid-svg-icons'
// import {
//   far
// } from '@fortawesome/free-regular-svg-icons'
// import {
//   fab
// } from '@fortawesome/free-brands-svg-icons'
// import {
//   FontAwesomeIcon,
//   FontAwesomeLayers,
//   FontAwesomeLayersText
// } from '@fortawesome/vue-fontawesome'

// 栅格拖拽插件
import VueGridLayout from 'vue-grid-layout';

// 将自动注册所有组件为全局组件(dataV)(引入此库会导致trident内核的浏览器完全空白)
import dataV from '@jiaminghi/data-view'
Vue.use(dataV)

// library.add(fas, far, fab)

// Vue.component('font-awesome-icon', FontAwesomeIcon)
// Vue.component('font-awesome-layers', FontAwesomeLayers)
// Vue.component('font-awesome-layers-text', FontAwesomeLayersText)

// 导入全局过滤器
import * as filters from './filter/filter.js'
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
})

// 引入字体图标
import "../static/icon/iconfont.css"
// import '../static/icon/icon/iconfont'

import httpRequest from './utils/httpRequest'
Vue.prototype.$http = httpRequest


Vue.config.productionTip = false

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)


// import JsonExcel from 'vue-json-excel'
// Vue.component('downloadExcel', JsonExcel)


// 让IE11支持Vue-router跳转功能
if (
  '-ms-scroll-limit' in document.documentElement.style && 
  '-ms-ime-align' in document.documentElement.style
) { // detect it's IE11
  window.addEventListener("hashchange", function(event) {
    var currentPath = window.location.hash.slice(1);
    if (store.state.route.path !== currentPath) {
      router.push(currentPath)
    }
  }, false)
}

new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  // 使用一个空的vue实例作为中央事件总线-----------
  data: {
    Bus: new Vue()
  },
  template: '<App/>'
})


