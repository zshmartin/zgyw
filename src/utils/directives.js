

export default (Vue) => {
  // el-input标签 自动聚焦指令
  Vue.directive('focus', {
    inserted: function(el) {
      el.querySelector('input').focus()
    }
  }),
  // 节流0.3秒
  Vue.directive('throttle',{
    inserted: function(el,binding) {
      let timer
      el.addEventListener('keyup', () => {
        if(timer) {
          clearTimeout(timer)
        }
        timer = setTimeout( () => {
          binding.value()
        },300)
      })
    }
  })
}

// 输入框节流自动搜索指令
// export default (Vue) => {
//   Vue.directive('throttle', {
//     inserted: function(el,binding) {
//       let timer
//       el.addEventlistener('keyup', () => {
//         if(timer) {
//           clearTimeout(timer)
//         }
//         timer = setTimeout( () => {
//           binding.value()
//         },300)
//       })
//     }
//   })
// }