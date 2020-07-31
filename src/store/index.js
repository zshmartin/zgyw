import 'babel-polyfill';
import Vue from 'vue';
import Vuex from 'vuex';

// import * as getters from './getters' // 导入响应的模块，*相当于引入了这个组件下所有导出的事例
// import * as actions from './actions'
// import * as mutations from './mutations'

Vue.use(Vuex)


// // 注册上面引入的各大模块
const store = new Vuex.Store({
  // 共享数据
  state: {
    site: {
      siteId: '', //当前站点
      siteName: '', //站点名称
      siteList: [], //右上角展示的站点数组
      companyId: '', //登录用户的公司id
      searchCompanyId: '', //当前站点所属的公司id
    },
    // 用户存储用户个人信息
    userInfo: {},
    // 屏幕尺寸
    screenSize: {}

  }, // 共同维护的一个状态，state里面可以是很多个全局状态
  getters: {
    // 返回站点列表
    getStateSiteList: function (state) {
      return state.site
    },
    // 返回当前站点Id
    getSiteId: function(state) {
      return state.site.siteId
    },
    // 返回当前站点名称
    getSiteName: function(state) {
      return state.site.siteName
    }

  },
  // 获取数据并渲染
  // 处理数据的唯一途径，state的改变或赋值只能在这里
  mutations: {
    // changeCompanyList(state, companyListS) {
    //   state.company.companyList = companyListS
    //   state.company.companyName = companyListS[0].name
    //   state.company.companyId = companyListS[0].id
    // },
    selectChange(state, company) {
      state.company.companyId = company[0].id
      state.company.companyName = company[0].name
    },
    site_change(state, param) {
      if (param.sites.length > 0) {
        state.site.siteId = param.sites[0].id
        state.site.siteName = param.sites[0].name
        state.site.siteList = param.sites
        state.site.searchCompanyId = param.sites[0].companyId
        state.site.companyId = param.companyId
      } else {
        state.site = {
          siteId: null,
          companyId: param.companyId,
          searchCompanyId: param.companyId,
          siteList: []
        }
      }
    },
    siteChange(state, siteObj) {
      state.site.siteId = siteObj.id
      state.site.siteName = siteObj.name
      state.site.searchCompanyId = siteObj.searchCompanyId
    },
    // 下拉刷新当前站点
    siteUpdate(state, param) {
      
      state.site.siteList = param.sites
      if (param.sites.length > 0) {
        let index = state.site.siteList.findIndex(item => {
          return item.id === state.site.siteId
        })
        // 若当前站点被删除时，默认选择第一个站点
        if (index < 0) {
          // 当前站点被删除
          if (state.site.siteList.length > 0) {
            state.site.siteId = state.site.siteList[0].id
            state.site.siteName = state.site.siteList[0].name
            state.site.siteList = state.site.siteList
          } else {
            state.site = {
              siteId: null,
              companyId: param.companyId
            }
          }
          
        } else {
          // 当前站点不被删除
          state.site.siteList = state.site.siteList
          // 更前当前站点名称
          let index = state.site.siteList.findIndex(item => {
            return item.id === state.site.siteId
          })
          state.site.siteName = state.site.siteList[index].name
        }
        // 站点从无到有,当前站点的所属公司可能改变
        if (state.site.siteList.length === 1) {
          state.site.searchCompanyId = state.site.siteList[0].companyId
        }
      } else {
        state.site = {
          siteId: null,
          companyId: param.companyId,
          searchCompanyId: param.companyId,
          siteList: []
        }
      }
    },
    // 存储用户信息
    saveUserInfo(state, userInfo) {
      state.userInfo = userInfo
    },
    // 存储当前屏幕尺寸
    saveScreenSize(state, screenSize) {
      state.screenSize = screenSize
    },
    // 重置state
    clearState(state) {
      state.site.siteId = ''
      state.site.siteName = ''
      state.site.siteList = []
      state.site.companyId = ''
      state.site.searchCompanyId = ''
      state.userInfo = {}
      state.screenSize = {}
    }
  },
  
  actions: {
    // 异步处理
  },
})
export default store
