import fetch from '../../constant/fetch.js'

// 获取门店列表
export const getSubbranchApi = (data) => {
  return fetch('post', `/mall/getBranchStoreList`, data)
}
// 获取门店详情
export const getSubbranchInfoApi = (serviceID) => {
  return fetch('post', `/mall/getBranchStoreDetail/${serviceID}`)
}
// 添加门店
export const addSubbranchApi = (data) => {
  return fetch('post', `/mall/addOrUpdateStore`, data)
}
// 删除门店
export const delSubbranchApi = (serviceID) => {
  return fetch('delete', `/mall/deletedBranchStore/${serviceID}`)
}
