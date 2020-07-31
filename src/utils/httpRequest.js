import Vue from 'vue'
import axios from 'axios'
import router from "@/router"

import qs from 'qs'
const http = axios.create({
  timeout: 120000, //请求超时
  withCredentials: true,
})
// axios.defaults.withCredentials=true

import {
  Message,
  Notification
} from 'element-ui'

// 环境的切换
// 开发环境
// 47/202/242
if (process.env.NODE_ENV == 'development') {
  axios.defaults.baseURL = 'http://192.168.101.47:9000/';
  // console.log('development')
}
// 测试环境
else if (process.env.NODE_ENV == 'debug') {
  // console.log('debug')
  // axios.defaults.baseURL = 'https://www.ceshi.com';
}
// 生产环境
else if (process.env.NODE_ENV == 'production') {
  // console.log('production')
  // axios.defaults.baseURL = 'https://www.production.com';
}
/**
 * 请求拦截
 */
http.interceptors.request.use(config => {
  // 判断是否文件传输
  if (config.headers['Content-Type'] === 'multipart/form-data') {
    return config
  } else {
    config.data = qs.stringify(config.data)
    return config
  }
}, error => {
  return Promise.reject(error)
})

//用来计数只显示一个弹窗
let count = 0 //报错
let timeout

// 请求超时
let count1 = 0
let timeout1
/**
 * 响应拦截
 */
http.interceptors.response.use(response => {
  // 返回data后，只要code存在并且不为0，弹窗提醒
  // if (response.data.code !== undefined && response.data.code !== 0) {
  //   Notification({
  //     message: response.data.msg,
  //     type: 'warning'
  //   });
  //   return
  // }
  return response
}, error => {
  // console.log(error)
  // 状态码不为200则不能正确返回数据
  if (error.code == 'ECONNABORTED') {

    if (count1 === 0) {
      Message('网络连接超时')
    }
    count1++

    if (timeout) {
      clearTimeout(timeout)
    }
    let timeout = setTimeout(() => {
      count1 = 0
    }, 10000);
    return
  }
  if (error.response.status) {
    let message;
    switch (error.response.status) {

      case 400:
        message = '请求错误'
        break;
        //401 token过期  
      case 401:
        router.replace({
          path: '/login',
        })
        var msg = true
        if (msg) {
          message = '未授权，请登录'
          msg = false
        }
        if (timeout1) {
          clearTimeout(timeout1)
        }
        var timeout1 = setTimeout(() => {
          msg = true
          console.log(msg)
        }, 15000);
        break;
      case 403:
        message = '拒绝访问'
        break;
      case 404:
        router.replace({
          path: '/error',
        })
        message = '找不到页面'
        break;
      case 408:
        message = '请求超时！'
        break;
      case 500:
        message = '服务器开小差'
        break;
      case 501:
        message = '服务未实现'
        break;
      case 502:
        message = '网关错误'
        break;
      case 504:
        message = '网关超时'
        break;
    }
    if (count === 0 && error.response.status !== 401) {
      // 401情况下不弹窗提醒
      Notification({
        message: message,
        type: 'warning'
      });
    }
    count++
    if (timeout) {
      clearTimeout(timeout)
    }
    let timeout = setTimeout(() => {
      count = 0
    }, 5000);
    return Promise.reject(error.response)
  }
})
export default http
