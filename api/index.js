import fetch from '../constant/fetch.js'
// 获取个人信息
export const getMine = () => {
  return fetch('get', `/user/mine`)
}
// 所有工会列表树
export const getDepTreeApi = (type, loading) => {
  return fetch('get', `/dept/tree/${type}`, {}, loading)
}
// 搜索工会
export const searchDepApi = (data, type, loading) => {
  return fetch('post', `/dept/list/${type}`, data, loading)
}
// 所有列表
export const getDepListApi = () => {
  return fetch('get', `/dept/findDeptTree`)
}
// 获取小程序用户
export const getMpUsers = (code) => {
  return fetch('post', `/businesUsers/getMpUsers/${code}`)
}
// 小程序登录
export const wxMpLogin = (data) => {
  return fetch('post', `/businesUsers/mpLogin`, data)
}
