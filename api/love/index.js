import fetch from '../../constant/fetch.js'

// 创建机构
export const createOrganApi = (data) => {
  return fetch('post', `/love/addOrg`, data)
}
// 获取机构信息
export const getOrganIndexInfoApi = () => {
  return fetch('get', `/love/detailOrg`)
}
// 机构统计
export const getOrganStatApi = () => {
  return fetch('get', `/love/statisticsCountMP`)
}
// 活动信息统计
export const getActivityStatApi = () => {
  return fetch('get', `/love/statisticsCount2MP`)
}
// 活动列表
export const getActivityListsApi = (data) => {
  return fetch('post', `/love/listActivity`, data)
}
// 获取活动详情
export const getActivityDetailApi = (serviceID) => {
  return fetch('get', `/love/detail/activity/${serviceID}`)
}
// 创建、编辑活动
export const submitActivityApi = (edit, data) => {
  return fetch('post', `/love/${edit ? 'updateActivity' : 'addActivity'}`, data)
}
// 名单列表
export const getNameListApi = (data) => {
  return fetch('post', `/love/listEntryform`, data)
}
// 名单统计
export const getNameListStatApi = (serviceID) => {
  return fetch('get', `/love/statistics/entryfrom/${serviceID}`)
}
// 机构注销
export const logOutOrganApi = () => {
  return fetch('get', `/love/org/logout`)
}
