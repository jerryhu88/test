import fetch from '../../constant/fetch.js'

// 创建机构
export const createOrganApi = (data) => {
  return fetch('post', `/mall/putOutOrg`, data)
}
// 获取机构信息
export const getOrganIndexInfoApi = () => {
  return fetch('get', `/mall/getOrgDetail`)
}
// 机构注销
export const logOutOrganApi = () => {
  return fetch('get', `/mall/logout`)
}
// 获取机构详情信息
export const getOrganDetailApi = () => {
  return fetch('get', `/mall/orgDetail`)
}
// 获取福利标签
export const getWelfareTabsApi = () => {
  return fetch('get', `/mall/getMallLabelTree`)
}
// 创建编辑福利券
export const creatTicketApi = (data) => {
  return fetch('post', `/mall/putOutBoon`, data)
}
// 福利列表
export const getWelfareListsApi = (data) => {
  return fetch('post', `/mall/getBoonList`, data)
}
// 删除福利
export const delWelfareApi = (serviceID) => {
  return fetch('delete', `/mall/deletedBoon/${serviceID}`)
}
// 福利统计
export const getWelfareStaticApi = () => {
  return fetch('get', `/mall/getBoonStatistics`)
}
// 查询已出售、已核销福利券
export const getTicketListApi = (data, api) => {
  return fetch('post', `/mall/${api}`, data)
}
// 导出已出售/核销福利券
export const exportTicketListApi = (type, data) => {
  return fetch('post', `/mall/${type === '售出' ? 'exportSaleTotalList' : 'exportVerificationList'}`, data)
}
// 福利详情
export const getTicketDetailApi = (serviceID, putaway) => {
  return fetch('post', `/mall/getBoonDetail/${serviceID}/${putaway}`)
}
// 用户列表、粉丝列表
export const getNameListsApi = (data) => {
  return fetch('post', `/mall/getOrgFansList`, data)
}
// 售出列表
export const getSaleListsApi = (data) => {
  return fetch('post', `/mall/getBoonRosterList`, data)
}
// 导出用户列表、粉丝列表
export const exportNameListsApi = (data) => {
  return fetch('post', `/mall/exportFansList`, data)
}
// 导出售出列表
export const exportSaleNameListsApi = (data) => {
  return fetch('post', `/mall/exportBoonRosterList`, data)
}
// 机构信誉
export const getOrganGradeApi = (serviceID) => {
  return fetch('get', `/mall/getOrgCredit`)
}
// 获取评价
export const getCommentApi = (data) => {
  return fetch('post', `/mall/getEvaluateList`, data)
}
// 删除评价
export const delCommentApi = (serviceID) => {
  return fetch('delete', `/mall/deleteEvaluate/${serviceID}`)
}
// 核销
export const verifyTicketApi = (data) => {
  return fetch('post', `/mall/verificationBoon`, data)
}
// 根据码获取信息
export const getTicketInfoApi = (verificationCode) => {
  return fetch('post', `/mall/getBoonByCode/${verificationCode}`)
}
// 用户群发消息
export const sendUserMsgApi = (type, sendType, data) => {
  return fetch('post', `/mall/sendFansMsgGroup/${type}/${sendType}`, data)
}
// 名单群发消息
export const sendListMsgApi = (type, sendType, serviceID, data) => {
  return fetch('post', `/mall/sendRosterMsgGroup/${type}/${sendType}/${serviceID}`, data)
}
// 上架
export const upWeflareApi = (serviceID) => {
  return fetch('post', `/mall/putaway/${serviceID}`)
}
// 群发消息
export const downWelfareApi = (serviceID) => {
  return fetch('post', `/mall/obtained/${serviceID}`)
}
