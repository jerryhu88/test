import Config from '../config/index'
import { confirm } from '../constant/popup'
// 加载最小时间
// let MINI_TIME = 800
function showLoading () {
  wx.showNavigationBarLoading()
}
// 定时器
let timer = null
// get/post请求
export default (method, url, data = {}, noToast) => {
  url = `${Config.api}/mpmct${url}`
  // 导航处loading
  wx.showNavigationBarLoading()
  // if (process.env.NODE_ENV === 'development') {
  //   url += `?debug=fwh&openid=${Config.openid}`
  // }
  return new Promise((resolve, reject) => {
    showLoading()
    // if (loading === 'normal') {
    //   timer = setTimeout(() => {
    //   }, MINI_TIME)
    // } else if (loading === true) {
    //   showLoading()
    // }
    wx.request({
      url,
      data,
      method,
      header: {
        JSESSIONID: wx.getStorageSync('JSESSIONID'),
        'content-type': 'application/json' // 默认值
      },
      success: function ({data}) {
        switch (data.code) {
          case 200:
            resolve(data.data)
            return
          case 501:
            // 有些接口不需要报未登录的错，如消息数量接口（501表示未登录）
            reject(new Error())
            if (noToast) return
            confirm(
              '提示',
              '你尚未登录，请先登录后再操作',
              '去登录',
              () => {}
            )
            return
          case 600:
            // 有些接口不需要报未登录的错，如消息数量接口（600表示未登录）
            reject(new Error())
            if (noToast) return
            confirm(
              '提示',
              '你尚未登录，请先登录后再操作',
              '去登录',
              () => {}
            )
            return
          default:
            wx.showToast({
              title: data.msg,
              icon: 'none',
              duration: 3000
            })
            reject(new Error())
        }
      },
      fail: function (res) {
        // fail调用接口失败
        reject(new Error({
          error: '网络错误',
          code: 0
        }))
      },
      complete: function () {
        wx.hideNavigationBarLoading()
        clearTimeout(timer)
      }
    })
  })
}
