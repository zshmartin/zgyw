// import Vue from 'vue'
// import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'

// Vue.use(Router)

// export default new Router({
//   routes: [
//     {
//       path: '/',
//       name: 'HelloWorld',
//       component: HelloWorld
//     }
//   ]
// }) 


import Vue from 'vue'
import VueRouter from 'vue-router'
// 解决重复点击同一菜单element报错的问题
// const VueRouterPush = VueRouter.prototype.push 
// VueRouter.prototype.push = function push (to) {
//     return VueRouterPush.call(this, to).catch(err => err)
// }

// 集成VueRouter中间件
Vue.use(VueRouter)



// 导入组件
import Login from '../components/login/Login'
import Layout from '../components/layout/Layout'
import Welcome from '../components/welcome/Welcome.vue'
import SiteDistribute from '../components/siteDistribute/SiteDistribute.vue';

import Monitor from "../components/monitor/Monitor.vue"
import MonitorFrame from "../components/monitorFrame/MonitorFrame.vue"
import SiteManage from "../components/siteManage/SiteMange.vue"
import Board from '../components/board/Board.vue';

import Variate from '../components/variate/Variate.vue'
import VariateLine from "../components/variateLine/VariateLine.vue"
import Filt from '../components/filt/Filt.vue';

import EFile from '../components/eFile/EFile.vue'
import EquipFile from '../components/equipFile/EquipFile.vue'

import WarnType from "../components/warnType/WarnType.vue"
import Warnconfig from '../components/warnconfig/Warnconfig.vue'
import EventWarn from '../components/eventWarn/EventWarn.vue';

import SelfInfo from '../components/SelfInfo/selfInfo.vue'
import Operation from '../components/operation/Operation.vue'
import UserOrg from '../components/userOrg/UserOrg.vue';

import EnergyConsume from '../components/energyConsume/EnergyConsume.vue'
import EnergyStatistics from '../components/energyStatistics/EnergyStatistics.vue'
import EnergyReport from '../components/energyReport/EnergyReport.vue'
import ComparedAnalysis from '../components/comparedAnalysis/ComparedAnalysis.vue'
import MeterReading from '../components/meterReading/MeterReading.vue'
import EnergyConfig from '../components/energyConfig/EnergyConfig.vue';

import PlatformScreen from '../components/platform-screen/Platform-screen.vue'
import Plat1 from '../components/plat1/plat1.vue'
import Plat2 from '../components/plat2/plat2.vue'
import Plat3 from '../components/plat3/plat3.vue'
import SiteScreen from '../components/siteScreen/SiteScreen.vue'

import Error from '../components/Error/error.vue'

import ProductLibrary from '../components/productLibrary/ProductLibrary.vue'
import RealtimeMonitor from '../components/realtimeMonitor/RealtimeMonitor.vue'
import AssessReport from '../components/assessReport/AssessReport.vue'
import PhaseAnalysis from '../components/phaseAnalysis/PhaseAnalysis.vue'
import ProductComponent from '../components/productComponent/ProductComponent.vue'
import EleAnalysis from '../components/eleAnalysis/EleAnalysis.vue'
import SwitchControl from '../components/switchControl/SwitchControl.vue'


// 创建路由对象
const router = new VueRouter({
  routes: [{
      path: '/',
      redirect: '/layout'
    },
    {
      path: '/login',
      meta: {
        unRequiresAuth: true
      },
      component: Login
    },
    {
      path: '/layout',
      component: Layout,
      redirect: '/layout/siteDistribute',
      children: [
        {
          path: 'welcome',
          component: Welcome
        },
        {
          path: 'eventWarn',
          component: EventWarn
        },
        {
          path: 'selfInfo',
          component: SelfInfo
        },
        {
          path: 'variate',
          component: Variate
        },
        {
          path: 'filt',
          component: Filt,
          meta: {
            keepAlive: false
          },
        },
        {
          path: 'warnType',
          component: WarnType
        },
        {
          path: 'warnconfig',
          component: Warnconfig
        },
        {
          path: 'variateLine',
          component: VariateLine
        },
        {
          path: 'monitor',
          component: Monitor
        },
        {
          path: 'siteManage',
          component: SiteManage
        },
        {
          path: 'operation',
          component: Operation
        },
        {
          path: 'userOrg',
          component: UserOrg
        },
        {
          path: 'board',
          component: Board
        },
        {
          path: 'siteDistribute',
          component: SiteDistribute
        },
        {
          path: 'energyConsume',
          component: EnergyConsume
        },
        {
          path: 'energyStatistics',
          component: EnergyStatistics
        },
        {
          path: 'energyReport',
          component: EnergyReport
        },
        {
          path: 'comparedAnalysis',
          component: ComparedAnalysis
        },
        {
          path: 'meterReading',
          component: MeterReading
        },
        {
          path: 'energyConfig',
          component: EnergyConfig
        },
        {
          path: 'monitorFrame',
          component: MonitorFrame
        },
        {
          path: 'eFile',
          component: EFile
        },
        {
          path: 'equipFile',
          component: EquipFile
        },
        {
          path: 'productLibrary',
          component: ProductLibrary
        },
        {
          path: 'realtimeMonitor',
          component: RealtimeMonitor,
        },
        {
          path: 'assessReport',
          component: AssessReport,
        },
        {
          path: 'phaseAnalysis',
          component: PhaseAnalysis,
        },
        {
          path: 'productComponent',
          component: ProductComponent,
        },
        {
          path: 'eleAnalysis',
          component: EleAnalysis,
        },
        {
          path: 'switchControl',
          component: SwitchControl,
        }
      ]
    },
    {
      path: '/error',
      component: Error
    },
    {
      path: '/platform-screen',
      component: PlatformScreen,
    },
    {
      path: '/plat1',
      component: Plat1,
    },
    {
      path: '/plat2',
      component: Plat2,
    },
    {
      path: '/plat3',
      component: Plat3,
    },
    {
      path: '/siteScreen',
      component: SiteScreen,
    }
  ]
})

router.beforeEach((to, from, next) => {
  // next()
  console.log(to, from, next)
  if (to.matched.length === 0) {
    from.name ? next({
      name: from.name
    }) : next('/layout'); //如果上级也未匹配到路由则转登录页面，如果上级能匹配到则转上级路由
  } else {
    if (to.path !== '/error' && from.path !== '/error') {
      localStorage.setItem('refer', from.path)
    }
    next()
  }
})


//导出路由对象
export default router
