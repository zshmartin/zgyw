import Vue from 'vue'
import router from '@/router'
import {
  read
} from 'fs';
// import store from '@/store'


/**
 * 正则验证正整数
 * @param {string} val 需要验证的字符串
 * @return {boolean} 值
 */
export function isPositiveInteger(val) {
  let re = /^[0-9]+$/;
  return re.test(val)
}

/**
 * 获取uuid
 * @return {string} 值
 */
export function getUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
  })
  // var tmp = Date.parse(new Date()).toString().substr(0, 10);
  // var num = '';
  // for (var i = 0; i < 3; i++) {
  //   num += Math.floor(Math.random() * 10);
  // }
  // console.log(tmp + num)
  // return +(tmp + num)
}

/**
 * 获取uuid INt类型 13位时间撮+3位随机数
 * @return {string} 值 
 */
export function getUUIDInt() {
  var tmp = Date.parse(new Date()).toString();
  var num = '';
  for (var i = 0; i < 3; i++) {
    num += Math.floor(Math.random() * 10);
  }
  return +(tmp + num)
}

/**
 * 判断手机号码是否合理
 * @param {string} phone 手机号码字符串
 * @return {boolean} 值
 */
export function checkPhone(phone) {
  if (!(/^1[34578]\d{9}$/.test(phone))) {
    // alert("手机号码格式有误，请重填");
    return false;
  } else {
    return true
  }
}

/**
 * 判断邮箱是否合理
 * @param {string} email 邮箱字符串
 * @param {boolean} 值
 */
export function checkEmail(email) {
  //对电子邮件的验证
  var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
  if (email != "") {
    if (!myreg.test(email)) {
      // alert('提示:请输入有效的email！');
      return false
    } else {
      return true
    }
  }
}

/**
 * 根据站点id判定所属公司详情
 * @param {string} val 站点id
 * @param {array} arr 所有公司数组选项
 * @return {object} 值
 */
export function selectCompany(val, arr) {
  let index = arr.findIndex(item => item.id == val)
  return [arr[index]]
}


/**
 * 防抖
 */
// export function debounce(fn, delay) {
//   var delay = delay || 200;
//   var timer;
//   return function () {
//     var th = this;
//     var args = arguments;
//     if (timer) {
//       clearTimeout(timer);
//     }
//     timer = setTimeout(function () {
//       timer = null;
//       fn.apply(th, args);
//     }, delay);
//   };
// }


/**
 * 节流 
 */
export function throttle(fn, interval) {
  var last;
  var timer;
  var interval = interval || 200;
  return function () {
    var th = this;
    var args = arguments;
    var now = +new Date();
    if (last && now - last < interval) {
      clearTimeout(timer);
      timer = setTimeout(function () {
        last = now;
        fn.apply(th, args);
      }, interval);
    } else {
      last = now;
      fn.apply(th, args);
    }
  }
}

/**
 * 
 * 获取当前时间返回一个数据，包括上个月的当天，当前不存在则往前移
 * @param {date} date 时间
 * @return {date}  pre, next  上个月的当天和这个月当天数组格式
 * 
 * 
 */
export function getFullDate(date) {
  var date = date; // 获取当前的时间对象
  var year = date.getFullYear();
  var month = date.getMonth();
  var day = date.getDate(); // 获取到当前天
  var hour = date.getHours();
  var min = date.getMinutes()
  var s = date.getSeconds()
  var ss = '135'
  // 上个月
  var preYear = year;
  var preMon = parseInt(month) - 1;
  // 如果preMon等于0，让年份减去1，月份等于12
  if (preMon < 0) {
    preYear = parseInt(preYear) - 1;
    preMon = 11;
  }
  var preDay = day;
  var preDays = new Date(preYear, preMon + 1, 0); // 获取到一个月的所有天数
  if (preDay > preDays) {
    preDay = preDays;
  }
  // 下个月
  var nextYear = year;
  var nextMon = parseInt(month);
  // if (nextMon === 13) {
  //   nextMon = 1;
  //   nextYear = parseInt(nextYear) + 1;
  // }
  var nextDay = day;
  var nextDays = new Date(nextYear, nextMon, 0).getDate();
  if (nextDay > nextDays) {
    nextDay = nextDays;
  }
  // 下个月的前一天
  // 处理nextDay为0的情况
  if (nextDay === 0) {
    // 如果nextDay为0；那么取上个月的最后一天,也就是上个月的所有的天数
    nextMon = parseInt(nextMon) - 1;
    nextDay = new Date(nextYear, nextMon, 0).getDate();
  }
  if (nextMon === 0) {
    nextMon = 12;
    nextYear = parseInt(nextYear) - 1;
  }
  if (preMon < 10) {
    preMon = "0" + preMon;
  }
  if (preDay < 10) {
    preDay = "0" + preDay;
  }
  if (nextMon < 10) {
    nextMon = "0" + nextMon;
  }
  if (nextDay < 10) {
    nextDay = "0" + nextDay;
  }

  // nextDay += 1

  // var pre = preYear + "-" + preMon + "-" + preDay + ' ' + hour + ":" + min + ':' + s + ':' + ss;
  // var next = nextYear + "-" + nextMon + "-" + nextDay + ' ' + hour + ":" + min + ':' + s + ':' + ss;
  var pre = new Date(preYear, preMon, preDay, hour, min, s)
  var next = new Date(nextYear, nextMon, nextDay, hour, min, s)
  return [pre, next];
}


/**
 * 通过标记找数组索引
 * @param {array}  arr 数组
 * @param {string}  attr 数组对象的属性
 * @param {string, int}  value 比较的值
 * @return {index} 索引值
 */
export function findArrIndex(arr, attr, value) {
  var index = arr.findIndex(item => {
    return item[attr] == value
  })
  return index
}


/**
 * @param {date} time 当前时间
 * @param {string} type 时间类型
 * @return {arr} data 返回数据直接适配页面数据结构
 * 根据时间类型获取年、月、日坐标数组
 * 用于variateLine页面
 */

export function getLineData(time, type, line_Data) {
  // 获取横坐标数组和缩放比例
  let obj = {}
  let data = []
  let xData = (function getXDateArr(time, type) {
    let arr = []
    let trans //缩放比例
    if (type == 'day') {
      trans = 30
      for (var i = 0; i < 288; i++) {
        let hour = parseInt(i / 12)
        let min = i % 12 * 5
        hour = hour < 10 ? ('0' + hour) : hour.toString()
        min = min < 10 ? ('0' + min) : min.toString()
        arr.push(hour + ':' + min)
      }
    } else if (type == 'month') {
      trans = 3
      let year = time.getFullYear()
      let month = time.getMonth()
      let days = new Date(year, month + 1, 0).getDate()
      for (var i = 1; i <= days; i++) {
        arr.push(i)
      }
    } else {
      trans = 1
      for (var i = 1; i <= 12; i++) {
        arr.push(i)
      }
    }
    obj = {
      trans: trans,
      xData: arr
    }
    return obj
  })(time, type)
  // 十种随机色
  var colorArr = ['#DB9C3F', '#9D66CC', '#ADA0FF', '#12E0E8', '#FFA0DB', '#91E0FF', '#FFF991', '#FF9500', '#9B8043', '#86B1D0']; //默认随机颜色
  data = JSON.parse(JSON.stringify(line_Data))

  for (var i = 0; i < line_Data.length; i++) {
    var a = line_Data[i].variableName.split(',')
    data[i].color = [];
    data[i].code = a
    data[i].trans = obj.trans
    data[i].xData = obj.xData
    var index = 0; //用于标记随机赋值下标
    for (var j = 0; j < line_Data[i].data.length; j++) {
      (data[i].data)[j] = {
        data: [],
        type: 'line',
        name: (line_Data[i].data)[j].name
      };
      // 加默认颜色
      // var tem = Math.floor(Math.random() * 3);

      // 返回数据不存在
      if (!line_Data[i].data[j].color) {
      // if (true) {
        // 按顺序给加十种随机色
        if (index > 9) {
          // 超过十种则随机生成颜色
          data[i].color.push(color16())
        } else {
          data[i].color.push(colorArr[index]);
          index++
        }
      } else {
        // 返回数据存在
        data[i].color.push(line_Data[i].data[j].color)
      }
      // data[i].color.push(line_Data[i].data[j].color || colorArr[tem]);

      // 循环总的数组
      for (var l = 0; l < obj.xData.length; l++) {
        var ifHave = false
        for (var k = 0; k < (line_Data[i].data)[j].data.length; k++) {
          var a = (line_Data[i].data)[j].data[k]
          if (a[0] == obj.xData[l]) {
            (data[i].data)[j].data.push(+a[1])
            ifHave = true;
            // 优化代码算法-----
            (line_Data[i].data)[j].data.splice(k, 1)
            break;
          }
        }
        if (!ifHave) {
          (data[i].data)[j].data.push(null)
        }
      }
    }
  }
  return data
}

/**
 * 
 * @param {当前时间} time 
 * @param {年月日类型} type 
 */
export function getcurrentTimeArr(time, type) {
  let trans //缩放比例
  let arr = []
  if (type == 'day') {
    for (var i = 0; i < 288; i++) {
      let hour = parseInt(i / 12)
      let min = i % 12 * 5
      hour = hour < 10 ? ('0' + hour) : hour.toString()
      min = min < 10 ? ('0' + min) : min.toString()
      arr.push(hour + ':' + min)
    }
    arr.push('00:00')
    trans = 23
  } else if (type == 'month') {
    let date = time
    let current_month = date.getMonth() + 1
    let current_month_lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    let days = current_month_lastDay.getDate()
    let first = current_month + '-1'
    arr.push(first)
    for (var i = 2; i <= days; i++) {
      arr.push(i + '')
    }
    trans = 3
  } else {
    let date = time
    let year = date.getFullYear()
    arr.push(year + '-1')
    for (var i = 2; i <= 12; i++) {
      arr.push(i + '')
    }
    trans = 1
  }
  return [arr, trans]
}

/**
 * 获取年月日各个数组
 * 其中每月按31日
 * @param {string} type 时间类型
 * @param {string} witch 根据witch是否存在返回不同数据结构
 * hour   1-24
 */
export function getTimeArr(type, witch) {
  let arr = []
  let obj = {}
  if (witch && witch === 'monitor') {
    if (type == 'day') {
      for (var i = 0; i < 24; i++) {
        arr.push(i < 10 ? '0' + i : i)
      }
    } else if (type == 'month') {
      for (var i = 1; i <= 31; i++) {
        arr.push(i)
      }
    } else {
      for (var i = 1; i <= 12; i++) {
        arr.push(i)
      }
    }
  } else {
    if (type === 'day') {
      for (var i = 0; i < 24; i++) {
        obj = {
          index: i,
          value: (i < 10 ? '0' + (i) : i)
        }
        arr.push(obj)
      }
    } else if (type === 'month') {
      for (var i = 0; i < 31; i++) {
        obj = {
          index: i,
          value: (i + 1)
        }
        arr.push(obj)
      }
    } else {
      for (var i = 0; i < 12; i++) {
        obj = {
          index: i,
          value: (i + 1)
        }
        arr.push(obj)
      }
    }
  }
  return arr
}

/**
 * 历史报表格式修改
 * @param {string} type  时间类型
 * @param {array} data 需要格式化的数组数据
 * @param {array} arr1 返回固定的数组数据格式
 */
export function formatFilt(type, data) {
  let arr = []
  if (type == 'day') {
    for (var i = 0; i < 24; i++) {
      arr.push(i)
    }
  } else if (type == 'month') {
    for (var i = 1; i < 32; i++) {
      arr.push(i)
    }
  } else if (type == 'year') {
    for (var i = 1; i < 13; i++) {
      arr.push(i)
    }
  }
  let arr1 = JSON.parse(JSON.stringify(data))
  let calc = 0
  for (var j = 0; j < data.length; j++) {
    arr1[j].data = []
    for (var m = 0; m < arr.length; m++) {
      var ifTrue = false;
      var val
      for (var k = 0; k < data[j].data.length; k++) {
        calc++
        for (var l in (data[j].data)[k]) {
          var b = (data[j].data[k])[l]
          if (arr[m] == b.slice(0, 2)) {
            val = +l
            ifTrue = true
            break;
          }
        }
        // 判定空对象的话就清除
        if (JSON.stringify((data[j].data)[k]) === '{}') {
          data[j].data.splice(k, 1)
          k--
        }
        if (ifTrue) {
          break;
        }
      }
      if (!ifTrue) {
        arr1[j].data.push(null)
      } else {
        arr1[j].data.push(val)
        data[j].data.splice(k, 1)
      }
    }
  }
  return arr1
}

/**
 * 
 * @param {array} data 
 * @return {array} arr 返回数据修改过后的新数据
 */
export function formatPoint(data) {
  console.log(data)
  let arr = []
  for (var i = 0; i < data.length; i++) {
    arr[i] = data[i]
    for (var j = 0; j < data[i].data.length; j++) {
      arr[i].data[j] = data[i].data[j]
      for (var k = 0; k < data[i].data[j].data.length; k++) {
        var a = data[i].data[j].data[k]
        var b = arr[i].data[j].data
        for (var key in a) {
          arr[i].data[j].data[k] = []
          arr[i].data[j].data[k][0] = a[key]
          arr[i].data[j].data[k][1] = +key
        }
      }
    }
  }
  return arr
}

export function formatMonitorPoint(point) {
  // console.log(point)
  let arr = []
  for (var i = 0; i < point.length; i++) {
    arr[i] = point[i]
    for (var k = 0; k < point[i].data.length; k++) {
      var a = point[i].data[k]
      var b = arr[i].data
      for (var key in a) {
        arr[i].data[k] = []
        arr[i].data[k][0] = a[key]
        arr[i].data[k][1] = +key
      }
    }
  }
  return arr
}

// 用于设备监控、设备档案曲线数据格式化
export function formatMonitorData(time, type, line_Data) {
  // 获取横坐标数组和缩放比例
  let obj = {}
  let data = []
  let code = []
  let xData = (function getXDateArr(time, type) {
    let arr = []
    let trans //缩放比例
    if (type == 'day') {
      trans = 30
      for (var i = 0; i < 288; i++) {
        let hour = parseInt(i / 12)
        let min = i % 12 * 5
        // console.log(hour, min)
        hour = hour < 10 ? ('0' + hour) : hour.toString()
        min = min < 10 ? ('0' + min) : min.toString()
        // console.log(hour,min)
        arr.push(hour + ':' + min)
      }
      // for(var i =  0; i < 24; i++) {
      //   arr.push(i > 9 ? i : '0' + i)
      // }
    } else if (type == 'month') {
      trans = 3
      let year = time.getFullYear()
      let month = time.getMonth()
      let days = new Date(year, month + 1, 0).getDate()
      for (var i = 1; i <= days; i++) {
        arr.push(i)
      }
    } else {
      trans = 1
      for (var i = 1; i <= 12; i++) {
        arr.push(i)
      }
    }
    obj = {
      trans: trans,
      xData: arr
    }
    return obj
  })(time, type)
  var colorArr = ['#ff0000', '00ff00', '0000ff'] //默认颜色数组
  var color = []
  // 加默认颜色

  // obj1.color.push(obj1.data[j].color || colorArr[tem]);
  for (let i = 0; i < line_Data.length; i++) {
    code.push(line_Data[i].name)
    var tem = Math.floor(Math.random() * 3);
    color.push(line_Data[i].color || colorArr[tem])
  }
  obj.color = color
  obj.code = code
  obj.data = line_Data
  // return 

  let obj1 = JSON.parse(JSON.stringify(obj))
  for (let j = 0; j < obj1.data.length; j++) {
    obj1.data[j] = {
      data: [],
      type: 'line',
      name: (obj.code)[j],
      showAllSymbol: true,
    }

    for (let k = 0; k < obj.xData.length; k++) {
      var ifHave = false
      for (var l = 0; l < (obj.data)[j].data.length; l++) {
        var a = (obj.data)[j].data[l]

        if (a[0] == obj.xData[k]) {
          (obj1.data)[j].data.push(+a[1])
          ifHave = true
          break;
        }
      }
      if (!ifHave) {
        (obj1.data)[j].data.push(null)
      }
    }
  }
  return obj1
}

// 用于设备监控、设备档案表格数据格式化
export function formatEquipMonitorrData(time, type, line_Data) {
  // 获取横坐标数组和缩放比例
  let obj = {}
  let data = []
  let code = []
  let xData = (function getXDateArr(time, type) {
    let arr = []
    let trans //缩放比例
    if (type == 'day') {
      trans = 30
      for (var i = 0; i < 24; i++) {
        arr.push(i > 9 ? i : '0' + i)
      }
    } else if (type == 'month') {
      trans = 3
      let year = time.getFullYear()
      let month = time.getMonth()
      let days = new Date(year, month + 1, 0).getDate()
      for (var i = 1; i <= days; i++) {
        arr.push(i)
      }
    } else {
      trans = 1
      for (var i = 1; i <= 12; i++) {
        arr.push(i)
      }
    }
    obj = {
      trans: trans,
      xData: arr
    }
    return obj
  })(time, type)

  for (let i = 0; i < line_Data.length; i++) {
    code.push(line_Data[i].name)
  }
  obj.code = code
  obj.data = line_Data
  let obj1 = JSON.parse(JSON.stringify(obj))
  for (let j = 0; j < obj1.data.length; j++) {
    obj1.data[j] = {
      data: [],
      type: 'line',
      name: (obj.code)[j]
    }
    for (let k = 0; k < obj.xData.length; k++) {
      var ifHave = false
      for (var l = 0; l < (obj.data)[j].data.length; l++) {
        var a = (obj.data)[j].data[l]

        if (a[0] == obj.xData[k]) {
          (obj1.data)[j].data.push(+a[1])
          ifHave = true
          break;
        }
      }
      if (!ifHave) {
        (obj1.data)[j].data.push(null)
      }
    }
  }
  return obj1
}


/**
 * 数组去重
 * @param {array} arr 
 * @return {array} 
 */
export function distinct(arr) {
  return arr.filter((item, index) => {
    return arr.indexOf(item) === index
  })
}


/**
 * 随机生成十六进制颜色
 * @return {string} color 
 */
export function color16() { //十六进制颜色随机
  var r = (Math.floor(Math.random() * 256)).toString(16);
  var g = (Math.floor(Math.random() * 256)).toString(16);
  var b = (Math.floor(Math.random() * 256)).toString(16);
  r = r.length > 1 ? r : '0' + r
  g = g.length > 1 ? g : '0' + g
  b = b.length > 1 ? b : '0' + b
  var color = '#' + r + g + b
  return color;
}

/**
 * 总能耗数据格式化
 * 最终数据格式
 * data: {
 * arrX: [1,2,3],
 * arrY: [2,3,4],
 * trans: 2,
 * }
 * 
 */
export function formatEnergyData(time, type, data) {
  var arrX = []
  var trans
  if (type == 'day') {
    // trans = 30
    // for (var i = 0; i < 288; i++) {
    //   let hour = parseInt(i / 12)
    //   let min = i % 12 * 5
    //   hour = hour < 10 ? ('0' + hour) : hour.toString()
    //   min = min < 10 ? ('0' + min) : min.toString()
    //   arrX.push(hour + ':' + min)
    // }

    trans = 3
    for (var i = 0; i < 24; i++) {
      arrX.push(i > 9 ? i.toString() : ('0' + i))
    }

  } else if (type == 'month') {
    trans = 3
    let year = time.getFullYear()
    let month = time.getMonth()
    let days = new Date(year, month + 1, 0).getDate()
    for (var i = 1; i <= days; i++) {
      arrX.push(i)
    }
  } else if (type == 'year') {
    trans = 1
    for (var i = 1; i <= 12; i++) {
      arrX.push(i)
    }
  }
  var obj = {
    arrX: arrX,
    trans: trans,
    arr: []
  }

  for (var i = 0; i < obj.arrX.length; i++) {
    var ifHave = false
    for (var j = 0; j < data.length; j++) {
      // for (var k in data[j]) {
      //   console.log(k)
      //   // console.log(k, data[j][k])
      //   if(data[j][k] === obj.arrX[i]) {
      //     obj.arr.push(k)
      //     ifHave = true
      //     data.splice(j,1)
      //     j--
      //   }
      // }
      if (data[j].time == obj.arrX[i]) {
        obj.arr.push(data[j].value)
        ifHave = true
        data.splice(j, 1)
        j--
        break;
      }
    }
    if (!ifHave) {
      obj.arr.push(null)
    }

  }
  return obj
}


/**
 * 能源报表数据格式化
 * 最终数据格式
 * data: {
 *  xNum: [],
 *  yNum: [],
 *  trans: '',
 *  series: [
 *    {
 *      name: '',
 *      type: 'line',
 *      data: [
 *        {
 *          name: '',
 *          type: 'line',
 *          data: []
 *        }  
 *      ]
 *    }
 *   ]
 * }
 * 
 */
export function formatEnergyDataMore(time, type, data) {
  var arrX = []
  var trans
  if (type == 'day') {
    // trans = 30
    // for (var i = 0; i < 288; i++) {
    //   let hour = parseInt(i / 12)
    //   let min = i % 12 * 5
    //   hour = hour < 10 ? ('0' + hour) : hour.toString()
    //   min = min < 10 ? ('0' + min) : min.toString()
    //   arrX.push(hour + ':' + min)
    // }

    trans = 3
    for (var i = 0; i < 24; i++) {
      arrX.push(i > 9 ? i.toString() : ('0' + i))
    }

  } else if (type == 'month') {
    trans = 3
    let year = time.getFullYear()
    let month = time.getMonth()
    let days = new Date(year, month + 1, 0).getDate()
    for (var i = 1; i <= days; i++) {
      arrX.push(i > 9 ? i.toString() : '0' + i)
    }
  } else if (type == 'year') {
    trans = 1
    for (var i = 1; i <= 12; i++) {
      arrX.push(i > 9 ? i.toString() : '0' + i)
    }
  }
  var obj = {
    xNum: arrX,
    trans: trans,
    yNum: [],
    series: [],
  }
  obj.yNum = []
  for (var i = 0; i < data.length; i++) {
    if (data[i].branch) {
      obj.yNum.push(data[i].branch)
    } else {
      obj.yNum = []
      obj.series = []
      break;
    }
    var obj1 = {}
    obj1.name = data[i].branch
    obj1.type = 'line'
    obj1.data = []
    for (var j = 0; j < obj.xNum.length; j++) {
      var ifHave = false
      for (var k = 0; k < data[i].data.length; k++) {
        if (data[i].data[k].time === obj.xNum[j]) {
          obj1.data.push(data[i].data[k].value)
          ifHave = true
          data[i].data.splice(k, 1)
          k--
          break
        }
      }
      if (!ifHave) {
        obj1.data.push(null)
      }
    }
    obj.series.push(obj1)
  }
  return obj
}

// 格式化同比分析数据格式
/**
 * 
 */

export function formatPoleData(time, type, data) {
  var arrX = []
  var trans
  if (type == 'day') {

    trans = 3
    for (var i = 0; i < 24; i++) {
      arrX.push(i > 9 ? i.toString() : ('0' + i))
    }

  } else if (type == 'month') {
    trans = 3
    let year = time.getFullYear()
    let month = time.getMonth()
    let days = new Date(year, month + 1, 0).getDate()
    for (var i = 1; i <= days; i++) {
      arrX.push(i > 9 ? i.toString() : '0' + i)
    }
  } else if (type == 'year') {
    trans = 1
    for (var i = 1; i <= 12; i++) {
      arrX.push(i > 9 ? i.toString() : '0' + i)
    }
  }
  // return 
  var obj = {
    trans: trans,
    xNum: arrX,
    series: [{
      data: [],
    }]
  }
  for (var i = 0; i < obj.xNum.length; i++) {
    var ifTrue = false
    for (var j = 0; j < data.length; j++) {
      if (data[j].time === obj.xNum[i]) {
        // alert(1)
        obj.series[0].data.push(data[j].value)
        ifTrue = true
        data.splice(j, 1)
        j--
        break;
      }
    }
    if (!ifTrue) {
      obj.series[0].data.push(null)
    }
  }
  return obj
}

// 格式化数字用,分隔
export function numFormat(num) {
  var c = (num.toString().indexOf('.') !== -1) ? num.toLocaleString() : num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  return c;
}


// 定义一个深拷贝函数  接收目标target参数
/**
 * 
 * @param {*} target 需要被拷贝的数据
 */
export function deepClone(target) {
  // 定义一个变量
  let result;
  // 如果当前需要深拷贝的是一个对象的话
  if (typeof target === 'object') {
    // 如果是一个数组的话
    if (Array.isArray(target)) {
      result = []; // 将result赋值为一个数组，并且执行遍历
      for (let i in target) {
        // 递归克隆数组中的每一项
        result.push(deepClone(target[i]))
      }
      // 判断如果当前的值是null的话；直接赋值为null
    } else if (target === null) {
      result = null;
      // 判断如果当前的值是一个RegExp对象的话，直接赋值    
    } else if (target.constructor === RegExp) {
      result = target;
    } else {
      // 否则是普通对象，直接for in循环，递归赋值对象的所有值
      result = {};
      for (let i in target) {
        result[i] = deepClone(target[i]);
      }
    }
    // 如果不是对象的话，就是基本数据类型，那么直接赋值
  } else {
    result = target;
  }
  // 返回最终结果
  return result;
}


// 格式化三相不平衡分析数据
export function formatPhaseData(data, type) {
  // type 用来识别电压或者电流
  let arr = []
  let trans = 30
  for (var i = 0; i < 288; i++) {
    let hour = parseInt(i / 12)
    let min = i % 12 * 5
    // console.log(hour, min)
    hour = hour < 10 ? ('0' + hour) : hour.toString()
    min = min < 10 ? ('0' + min) : min.toString()
    // console.log(hour,min)
    arr.push(hour + ':' + min)
  }
  let ObjArr

  if (type === 'i') {
    ObjArr = [{
        // var tem = Math.floor(Math.random()*3);
        // color.push(line_Data[i].color || colorArr[tem])

        name: ['A相电流', 'B相电流', 'C相电流'],
        xData: arr,
        data: [{
            name: 'A相电流',
            data: [],
            type: 'line',
          },
          {
            name: 'B相电流',
            data: [],
            type: 'line',
          },
          {
            name: 'C相电流',
            data: [],
            type: 'line',
          },
        ]
      },

      {
        name: ['三相不平衡度'],
        xData: arr,
        data: [{
          name: '三相不平衡度',
          data: [],
          type: 'line',
          markLine: {
            data: [{
                name: 'Y 轴值为 30 的水平线',
                yAxis: 30,
                lineStye: {
                  color: 'orange'
                }
              },
              {
                name: 'Y 轴值为 15 的水平线',
                yAxis: 15,
                lineStyle: {
                  color: 'yellow'
                }
              },
            ]
          },

        }],

      }
    ]
  } else {
    ObjArr = [{
        name: ['A相电压', 'B相电压', 'C相电压'],
        xData: arr,
        data: [{
            name: 'A相电压',
            data: [],
            type: 'line',
          },
          {
            name: 'B相电压',
            data: [],
            type: 'line',
          },
          {
            name: 'C相电压',
            data: [],
            type: 'line',
          },
        ]
      },

      {
        name: ['三相不平衡度'],
        xData: arr,
        data: [{
          name: '三相不平衡度',
          data: [],
          type: 'line',

          markLine: {
            data: [{
                name: 'Y 轴值为 30 的水平线',
                yAxis: 30,
                lineStye: {
                  color: 'orange'
                }
              },
              {
                name: 'Y 轴值为 15 的水平线',
                yAxis: 15,
                lineStyle: {
                  color: 'yellow'
                }
              },
            ]
          },

        }],

      }
    ]
  }

  for (var i = 0; i < arr.length; i++) {
    var ifCheck = false
    for (var j = 0; j < data.length; j++) {
      // ObjArr[0].data
      if (arr[i] === data[j].time) {
        ifCheck = true
        ObjArr[0].data[0].data.push(data[j].powerQualityVO.avalue)
        ObjArr[0].data[1].data.push(data[j].powerQualityVO.bvalue)
        ObjArr[0].data[2].data.push(data[j].powerQualityVO.cvalue)
        ObjArr[1].data[0].data.push(data[j].powerQualityVO.unbalancedness)
        // 优化算法
        data.splice(j, 1)
        j--
      }
    }
    if (!ifCheck) {
      ObjArr[0].data[0].data.push(null)
      ObjArr[0].data[1].data.push(null)
      ObjArr[0].data[2].data.push(null)
      ObjArr[1].data[0].data.push(null)
      // 临时值
      // ObjArr[0].data[0].data.push(Math.random()*100)
      // ObjArr[0].data[1].data.push(Math.random()*100)
      // ObjArr[0].data[2].data.push(Math.random()*100)
      // ObjArr[1].data[0].data.push((Math.random()*60).toFixed(1))
    }
  }
  return ObjArr
}



/**
 * 看板过滤重复变量及重复名称
 */
export function filterSame(data) {
  let arr = [],
    arr1 = [],
    firArr = [],
    secArr = []
  // 通过变量值过滤
  for (let i = 0; i < data.length; i++) {
    var bool = firArr.some(item => {
      return item === data[i].data
    })
    if (!bool) {
      arr.push(data[i])
      // 赋值变量值至名称属性
      arr[i].name = arr[i].name || data[i].chName || data[i].variableName
      firArr.push(data[i].data)
    }
  }

  // 通过名称过滤
  for (let i = 0; i < arr.length; i++) {
    var bool = secArr.some(item => {
      return item === arr[i].name
    })
    if (!bool) {
      arr1.push(arr[i])
      secArr.push(arr[i].name)
    }
  }
  console.log(arr1)
  return arr1
}
