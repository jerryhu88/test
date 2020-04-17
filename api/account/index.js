import fetch from '../../constant/fetch.js'

// 获取验证码
export const sendPhoneApi = (data) => {
  return fetch('post', `/businesUsers/sendVerifyCode`, data, false)
}
// 验证验证码
export const verifyCodeApi = (data) => {
  return fetch('post', `/businesUsers/verifyCodeCheck`, data, true)
}
// 设置密码
export const setPwdApi = (data) => {
  return fetch('post', `/businesUsers/setPwd`, data, true)
}
// 注册密码
export const registerApi = (data) => {
  return fetch('post', `/businesUsers/register`, data, true)
}
// 登陆
export const loginApi = (data) => {
  return fetch('post', `/org/userinfo/login`, data, true)
}
// 手机号登录
export const phoneLoginApi = (data) => {
  return fetch('post', `/businesUsers/phoneLogin`, data, true)
}
// 永久还是临时
export const loginWayApi = (type) => {
  return fetch('post', `/businesUsers/changOpenIDLogin/${type}`)
}
// 修改绑定手机号
export const changeWxPhoneApi = (data) => {
  return fetch('post', `/businesUsers/changWxPhone`, data)
}
