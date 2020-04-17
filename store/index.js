// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue'
import Vuex from 'vuex'
import { getSubbranchApi } from '../api/welfareCenter/subbranch'
import { getAllDeptsApi } from '../api/common/index'
import { getMpUsers } from '../api/index'
import { toast } from '../constant/popup'
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    count: 0,
    userInfo: {},
    subbranchs: [],
    groupType: 1
  },
  actions: {
    getSubbranch ({ commit }) {
      return new Promise((resolve, reject) => {
        getSubbranchApi({page: 0, pageSize: 0}).then(data => {
          resolve(data.list)
        })
      })
    },
    // 获取用户信息
    getMine ({commit}) {
      return new Promise((resolve, reject) => {
        wx.login({
          success (login) {
            if (login.code) {
              // wx.setStorageSync('loginCode', login.code)
              getMpUsers(login.code).then(data => {
                // wx.setStorageSync('mallRoleType', data.mallRoleType)
                // wx.setStorageSync('userInfo', data)
                // wx.setStorageSync('serviceCode', data.serviceCode)
                wx.setStorageSync('JSESSIONID', data.serviceID)
                commit('saveInfo', data)
                resolve(data)
              })
            }
          },
          fail () {
            toast('none', '授权失败，请重试')
          }
        })
      })
    },
    // 获取所有平台
    getAllDepts ({commit}) {
      return new Promise((resolve, reject) => {
        getAllDeptsApi().then(data => {
          resolve(data.map(item => {
            return {
              label: `${item.serviceName}（${item.deptName}）`,
              value: item.deptID
            }
          }))
        })
      })
    }
  },
  mutations: {
    setGroupType (state, type) {
      state.groupType = type
    },
    setSubbranch (state, list) {
      state.subbranchs = list
    },
    saveInfo (state, data) {
      console.log(data, '12123132')
      state.userInfo = {...state.userInfo, ...data}
    }
  },
  getters: {
    subbranchs: (state) => state.subbranchs,
    userInfo: (state) => state.userInfo,
    groupType: (state) => state.groupType
  }
})
export default store
