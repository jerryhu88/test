import fetch from '../../constant/fetch.js'

// 创建机构
export const createOrganApi = (data) => {
  return fetch('post', `/law/org/addOrUpdate`, data)
}
// 获取机构信息
export const getOrganIndexInfoApi = () => {
  return fetch('get', `/law/org/homeDetail`)
}
// 获取机构详情
export const getOrganDetailApi = () => {
  return fetch('get', `/law/org/detail`)
}
// 机构统计
export const getAdminStatApi = () => {
  return fetch('get', `/law/org/homeStatistics`)
}
// 维权标签
export const getLawLabelApi = () => {
  return fetch('get', `/law/label/list`)
}
// 律师信息
export const getLawerInfoApi = (serviceID) => {
  return fetch('get', `/law/lawer/detail/${serviceID}`)
}
// 注销律师
export const logOutLawerInfoApi = (serviceID) => {
  return fetch('delete', `/law/lawer/delete/${serviceID}`)
}
// 自己的信息
export const getMyInfoApi = () => {
  return fetch('get', `/law/lawer/detail`)
}
// 修改自己的信息
export const subMyInfoApi = (data) => {
  return fetch('post', `/law/lawer/update`, data)
}
// 别人的的信息
export const getOtherInfoApi = (serviceID) => {
  return fetch('get', `/law/lawer/detail/${serviceID}`)
}
// 活动信息统计
export const getActivityStatApi = () => {
  return fetch('get', `/love/statisticsCount2MP`)
}
// 案件列表
export const getCaseListsApi = (type, data) => {
  return fetch('post', `/law/caseAssign/${type}`, data)
}
// 案件详情
export const getCaseDetailApi = (serviceID) => {
  return fetch('get', `/law/case/detail/${serviceID}`)
}
// 转交案件
export const turnCaseApi = (serviceID, lawerID) => {
  return fetch('post', `/law/caseAssign/transfer/${serviceID}`, lawerID)
}
// 受理案件
export const disposeCaseApi = (data) => {
  return fetch('post', `/law/caseAssign/caseHandling`, data)
}
// 更新进展
export const updateCaseApi = (serviceID, data) => {
  return fetch('post', `/law/caseAssign/caseProgress/${serviceID}`, data)
}
// 律师列表
export const getLawerListApi = (data) => {
  return fetch('post', `/law/lawer/list`, data)
}
// 机构注销
export const logOutOrganApi = () => {
  return fetch('delete', `/law/org/logout`)
}
