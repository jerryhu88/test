import Config from '../config/index'
const years = []
const months = []
const days = []
const hours = []
const minutes = []
export const entrys = ['所有用户', '认证会员']
let uploadHost = Config.uploadUrl
export const defData = {
  uploadHost,
  dateTime: [years, months, days, hours, minutes],
  uploadUrl (module, width = -1, height = -1) {
    let uploadUrl = `${uploadHost}/file/upload?module=${module}`
    // if (process.env.NODE_ENV === 'development') {
    //   uploadUrl += '&debug=true'
    // }
    return uploadUrl
  },
  page: {
    page: 1,
    pageSize: 10,
    kv: {}
  }
  // share: {
  //   title: '龙泉驿职工之家',
  //   link: '',
  //   desc: '普惠、活动、互动、服务。心贴心、实打实、面对面服务职工群众。',
  //   imgUrl: `http://${location.host}/static/logo/lqzgh-logo.jpg`
  // }
}
// 图片module
export const UPLOAD_MODULE = {
  '普惠机构': 'mall',
  '婚恋机构': 'love',
  '兴趣机构': 'interest',
  '法律机构': 'law'
}
// 待办事项模块类型
export const TODOLIST_MODULE = {
  '普惠机构': 1,
  '兴趣机构': 2,
  '婚恋机构': 3,
  '法律机构': 4
}
// 生成时间日期
for (let i = new Date().getFullYear(); i <= new Date().getFullYear() + 5; i++) {
  years.push({ label: i + '年', value: i + '-', name: i })
}
for (let i = 1; i <= 12; i++) {
  if (i < 10) {
    i = '0' + i
  }
  months.push({ label: i + '月', value: i + '-', name: i })
}
for (let i = 1; i <= 31; i++) {
  if (i < 10) {
    i = '0' + i
  }
  days.push({ label: i + '日 ', value: i + ' ', name: i })
}
for (let i = 0; i <= 23; i++) {
  if (i < 10) {
    i = '0' + i
  }
  hours.push({ label: i + '时', value: i + ':', name: i })
}
for (let i = 1; i <= 59; i++) {
  if (i < 10) {
    i = '0' + i
  }
  minutes.push({ label: i + '分', value: i, name: i })
}
