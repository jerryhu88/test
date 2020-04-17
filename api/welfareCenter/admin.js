import fetch from '../../constant/fetch.js'

// 管理员列表
export const getOrgAdminApi = (data) => {
  return fetch('post', `/mall/getBusinesUsersList`, data)
}
// 管理员详情
export const getAdminInfoApi = (serviceID) => {
  return fetch('post', `/mall/getBusinesUsers/${serviceID}`)
}
// 变更店铺
export const turnAdminStoreApi = (data) => {
  return fetch('post', `/mall/changeBusinesUsersStore`, data)
}
// 转让身份
export const turnAdminApi = (serviceID) => {
  return fetch('post', `/mall/transferConfirm/${serviceID}`)
}
// 删除、撤销管理员
export const delAdminInfoApi = (serviceID) => {
  return fetch('delete', `/mall/deletedBusinesUsers/${serviceID}`)
}
// // 新增编辑角色
// export const addEditRoleApi = (data) => {
//   return fetch('post', `/mall/addOrUpdateRole`, data)
// }
// 菜单树
export const getRoleTreeApi = () => {
  return fetch('get', `/mall/tree/all`)
}
// 角色详情
export const getRoleInfoApi = (serviceID) => {
  return fetch('post', `/mall/getOrgRoleDetail/${serviceID}`)
}
// 添加管理员
export const addAdminApi = (data) => {
  return fetch('post', `/mall/addOrgBusinesUsers`, data)
}
// 验证管理员
export const verifyAdminApi = (phone) => {
  return fetch('post', `/mall/havaBusinesUsers/${phone}`)
}
// 发起者信息
export const senderInfoApi = () => {
  return fetch('post', `/mall/orgBusinesUsersInfo`)
}
// 管理员确认
export const adminConfirmApi = () => {
  return fetch('post', `/mall/businesUsersConfirm`)
}
// 管理员拒绝
export const adminRejectApi = () => {
  return fetch('post', `/mall/businesUsersRefusal`)
}
