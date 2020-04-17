import fetch from '../../constant/fetch.js'

// 获取平台
export const getAllDeptsApi = () => {
  return fetch('get', `/dept/listByWechat`)
}
// 帮助列表
export const getHelpListApi = () => {
  return fetch('get', `/help/wxh5HelpList/1`)
}
// 协议
export const getAgreementApi = (protocolName) => {
  return fetch('get', `/protocol/getByProtocolNameMpmct/${protocolName}`)
}
// 评论列表
export const getCommentListApi = (url, data) => {
  return fetch('post', url, data)
}
// 回复评论
export const sendCommentApi = (url, data) => {
  return fetch('post', url, data)
}
// 管理员列表
export const getAdminListApi = (url, data) => {
  return fetch('post', url, data)
}
// 添加管理员
export const addAdminApi = (url, data) => {
  return fetch('post', url, data)
}
// 撤销添加管理员
export const cancelAdminApi = (url, serviceID) => {
  return fetch('delete', `${url}/${serviceID}`)
}
// 删除管理员
export const delAdminApi = (url, serviceID) => {
  return fetch('delete', `${url}/${serviceID}`)
}
// 发起者信息
export const senderInfoApi = (url) => {
  return fetch('post', url)
}
// 管理员确认/拒绝
export const adminConfirmApi = (url) => {
  return fetch('post', url)
}
