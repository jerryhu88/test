import fetch from '../../constant/fetch.js'

// 待审批红娘列表
export const getAuditMatcherApi = (data) => {
  return fetch('post', `/love/listMatchmakerAudit`, data)
}
// 红娘列表
export const getMatcherListApi = (data) => {
  return fetch('post', `/love/listMatchmaker`, data)
}
// 红娘信息
export const getMatcherInfoApi = (serviceID) => {
  return fetch('get', `/love/detail/matchmaker/${serviceID}`)
}
// 待审批红娘信息
export const getAuditMatcherInfoApi = (serviceID) => {
  return fetch('get', `/love/detail/matchmakerAudit/${serviceID}`)
}
// 审批红娘
export const auditMatcherApi = (data) => {
  return fetch('post', `/love/auditMatchmaker`, data)
}
// 注销红娘
export const loginoutMatcherApi = (serviceID) => {
  return fetch('delete', `/love/delete/matchmaker/${serviceID}`)
}
// 恢复撤销
export const unLoginoutMatcherApi = (serviceID) => {
  return fetch('delete', `/love/undelete/matchmaker/${serviceID}`)
}
// 获取红娘数量
export const getMatcherNumApi = () => {
  return fetch('get', `/love/statisticsMatchmakerCount`)
}
// 红娘业绩统计
export const getMatcherStatApi = (data) => {
  return fetch('post', `/love/org/statisticsMatchmakerTask`, data)
}
// 单个红娘业绩
export const getOneMatcherStatApi = (data) => {
  return fetch('post', `/love/matchmaker/statisticsTask`, data)
}
