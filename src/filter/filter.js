/**
 * 根据字符串过滤某个数组对象
 * 获取数组中的某个数组对象值
 * @param 
 * val 需要比对的值
 * array 对比获取值的数组对象
 * attr 比对的对象属性
 * attr2  需要返回的属性       
 * 
 */

// const getVal = (val, array, attr1, attr2) => {
//   // return value
//   console.log(val)
//   console.log(array)
//   console.log(attr1)
//   console.log(attr2)
//   var index = array.findIndex(item => {
//     console.log(item)
//     console.log(item[attr1])
//     console.log(val)
//     return item[attr1] == val
//   })
//   console.log(index)
//   console.log(array[index][attr2])
//   return array[index][attr2]

// }

/**
 * 
 * @param {*} time 
 * 时间转化为常规年夜日时分秒
 * "2019-08-09T02:58:15.000+0000"
 * 例如："2008年8月8日 20:08:08"
 */
const formatTime = function(time)  {
  console.log(time)
  if (time) {
    // console.log(time)
    var year = time.substring(0, 4)
    // console.log(year)
    var month = time.substring(5, 7)
    month = month.substring(0, 1) == '0' ? month.substring(1, 2) : month
    var day = time.substring(8, 10)
    day = day.substring(0, 1) == '0' ? day.substring(1, 2) : day
    var time = time.substring(11, 19)
    var date = year + '年' + month + '月' + day + '日' + " " + time
    return date
  }
}

// 
/**
 * 字符串截取
 * @param {*} index1 
 * @param {*} index2 
 */
// const subTimeString = (data, index1, index2) => {
//   // alert(data)
//   if (index2) {
//     return data.substring(index1, index2)
//   } else {
//     // alert(index1)
//     return data.substring(index1)
//   }
// }

/**
 * 
 * 时间对象转字符串，格式如下
 * 2019-07-01 12:02:03
 */

// const formatTimeStr = (time) => {
//   var year = time.getFullYear();
//   var month =
//     time.getMonth() > 8 ?
//     time.getMonth() + 1 :
//     "0" + (time.getMonth() + 1);
//   var day = time.getDate() > 9 ? time.getDate() : "0" + time.getDate();

//   var hour =
//     time.getHours() > 9 ? time.getHours() : "0" + time.getHours();
//   var minute =
//     time.getMinutes() > 9 ? time.getMinutes() : "0" + time.getMinutes();
//   var second =
//     time.getSeconds() > 9 ? time.getSeconds() : "0" + time.getSeconds();
//   var time1 = year +
//     "-" +
//     month +
//     "-" +
//     day +
//     " " +
//     hour +
//     ":" +
//     minute +
//     ":" +
//     second;
//   return time1
// }


//去除空格  type 1-所有空格  2-前后空格  3-前空格 4-后空格
function trim(value, trim) {
  switch (trim) {
      case 1:
          return value.replace(/\s+/g, "");
      case 2:
          return value.replace(/(^\s*)|(\s*$)/g, "");
      case 3:
          return value.replace(/(^\s*)/g, "");
      case 4:
          return value.replace(/(\s*$)/g, "");
      default:
          return value;
  }
}
// 格式化数字加逗号
function numFormat(num) {
  var c = (num.toString().indexOf ('.') !== -1) ? num.toLocaleString() : num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  return c;
}

export {formatTime,numFormat}