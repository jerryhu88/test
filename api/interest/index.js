import fetch from '../../constant/fetch.js'
import store from '../../store/index'
// 获取小组活动列表(type 1个人小组 2机构小组)
export const getActivityListApi = (data) => {
  return fetch('post', `/interest/activity/activityList/${store.getters.userInfo.groupType}`, data)
}
// 获取标签
export const getActivityLabelApi = () => {
  return fetch('get', `/interest/label/list/${store.getters.userInfo.groupType}`)
}
// 修改标签
export const updateLabelApi = (data) => {
  return fetch('post', `/interest/group/addOrUpLabel/${store.getters.userInfo.groupType}`, data)
}
// 发布/修改兴趣小组活动信息(type 1个人小组 2机构小组)
export const sbumitActivityApi = (data) => {
  return fetch('post', `/interest/activity/addOrUpdate/${store.getters.userInfo.groupType}`, data)
}
// 获取小组活动详情（传活动serviceID）
export const getActDetailApi = (serviceID) => {
  return fetch('post', `/interest/activity/detail/${serviceID}`)
}
// 获取指定小组活动统计(type 1个人小组 2机构小组)
export const getGroupStatApi = () => {
  return fetch('get', `/interest/activity/statistics/${store.getters.userInfo.groupType}`)
}
// 添加/修改兴趣小组配图(type 1个人小组 2机构小组)
export const subGroupHeadApi = (data) => {
  return fetch('post', `/interest/group/addOrUpPuture/${store.getters.userInfo.groupType}`, data)
}
// 发布/修改兴趣小组信息(type 1个人小组 2机构小组)
export const subGroupApi = (data) => {
  return fetch('post', `/interest/group/addOrUpdate/${store.getters.userInfo.groupType}`, data)
}
// 分页获取指定小组活动的报名名单列表(传活动serviceID)
export const getNameListApi = (serviceID, data) => {
  return fetch('post', `/interest/activity/applyList/${serviceID}`, data)
}
// 分页获取小组粉丝列表(type 1个人小组 2机构小组)
export const getFansListApi = (data) => {
  return fetch('post', `/interest/group/fansList/${store.getters.userInfo.groupType}`, data)
}
// 导出指定小组活动的报名名单列表(传活动serviceID)
export const exportNameListApi = (serviceID) => {
  return fetch('post', `/interest/activity/exportApplyList/${serviceID}`)
}
// 导出小组粉丝列表(type 1个人小组 2机构小组)
export const expotrFansListApi = () => {
  return fetch('post', `/interest/group/exportFansList/${store.getters.userInfo.groupType}`)
}
// 获取小组详情(type 1个人小组 2机构小组)
export const getGroupDetailApi = () => {
  return fetch('get', `/interest/group/getGroupDetail/${store.getters.userInfo.groupType}`)
}
// 小组注销(type 1个人小组 2机构小组)
export const loginOutGroupApi = () => {
  return fetch('get', `/interest/group/logout/${store.getters.userInfo.groupType}`)
}
// 群发消息-活动报名列表(传活动serviceID)（sendType 1微信客户消息 11系统消息）
export const sendEntryMsgApi = (sendType, serviceID, data) => {
  return fetch('post', `/interest/activity/sendMsgToApply/${store.getters.userInfo.groupType}/${sendType}/${serviceID}`, data)
}
// 群发消息-小组粉丝列表(type 1个人小组 2机构小组)（sendType 1微信客户消息 11系统消息）
export const sendFansMsgApi = (sendType, data) => {
  return fetch('post', `/interest/group/sendMsgToFans/${store.getters.userInfo.groupType}/${sendType}`, data)
}
// 发布小组相册(type 1个人小组 2机构小组)
export const subGroupAlbumApi = (data) => {
  return fetch('post', `/interest/photo/add/${store.getters.userInfo.groupType}`, data)
}
// 删除小组相册(type 1个人小组 2机构小组)
export const delGroupAlbumApi = (serviceID, type) => {
  return fetch('delete', `/interest/photo/delete/${serviceID}/${store.getters.userInfo.groupType}`)
}
// 获取小组相册列表(type 1个人小组 2机构小组)
export const getAlbumListApi = (data) => {
  return fetch('post', `/interest/photo/list/${store.getters.userInfo.groupType}`, data)
}
