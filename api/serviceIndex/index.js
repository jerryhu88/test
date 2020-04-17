import fetch from '../../constant/fetch.js'
import { TODOLIST_MODULE } from '../../constant'

// 获取普惠机构审批状态
export const getOrganStatusApi = () => {
  return fetch('get', `/mall/getOrgState`)
}
// 小组状态获取(type 1个人小组 2机构小组)（return 0暂无小组 1申请审核中 2正常通过，有机构 3管理员未确认）
export const getGroupStatusApi = (type) => {
  return fetch('get', `/interest/group/getGroupState/${type}`)
}
// 获取婚恋机构审批状态
export const getLoveStatusApi = () => {
  return fetch('get', `/love/orgState`)
}
// 获取婚恋机构审批状态
export const getLawStatusApi = () => {
  return fetch('get', `/law/org/orgState`)
}
// 修改姓名
export const updateNameApi = (data) => {
  return fetch('post', `/businesUsers/setUname`, data)
}
// 修改邮箱
export const updateEmailApi = (data) => {
  return fetch('post', `/businesUsers/setEmail`, data)
}
// 设置基础信息
export const updateInfoApi = (data) => {
  return fetch('post', `/businesUsers/updateInfo`, data)
}
// 获取消息
export const getMsgListApi = (data) => {
  return fetch('post', `/businesUsers/getMsglog`, data)
}
// 清空消息
export const delMsgListApi = () => {
  return fetch('delete', `/businesUsers/deleteSysMsg`)
}
// 待办事项
export const getToDoListApi = (data) => {
  return fetch('post', `/businesUsers/getBacklog`, data)
}
// 获未读取待办事项和消息数量
export const getMsgNumApi = () => {
  return fetch('get', `/businesUsers/unreadMsgCount`, {}, true)
}
// 读消息
export const readMsgApi = (serviceID) => {
  return fetch('get', `/common/readedMsg/${serviceID}`)
}
// 读待办事项
export const readToDoListApi = (serviceID) => {
  return fetch('get', `/common/readedBackLog/${serviceID}`)
}
// 删除待办事项
export const delToDoListApi = (logType, serviceID) => {
  return fetch('delete', `/common/deleteBackLog/${TODOLIST_MODULE[logType]}/${serviceID}`)
}
