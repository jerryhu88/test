import { defData } from '../constant'
// 两个数组对象根据某属性取不同项
export const twoArrFilter = (arr1, arr2, type) => {
  let arr = []
  for (let item1 of arr1) {
    let isExist = false
    for (let item2 of arr2) {
      if (item1[type] === item2[type]) {
        isExist = true
        break
      }
    }
    if (!isExist) {
      arr.push(item1)
    }
  }
  return arr
}
// 年月日转时间戳
export const timeFilter = (time) => {
  return new Date(time.replace(/-/g, '/')).getTime()
}
// 时间戳转事件
export const dateFilter = (time, type) => {
  // time存在就获取传入时间戳，否则获取当前时间的时间戳
  time = time ? new Date(time) : new Date()
  let year = time.getFullYear()
  let month = addZero(time.getMonth() + 1)
  let date = addZero(time.getDate())
  let hour = addZero(time.getHours())
  let minute = addZero(time.getMinutes())
  // 返回时间数组
  if (type === 'Array') {
    return [year, month, date, hour, minute]
  }
  // 返回带有年月日的时间
  if (type === 'date') {
    return `${year}年${month}月${date}日`
  }
  // 返回带有年月日时分的时间
  if (type === 'dateTime') {
    return `${year}-${month}-${date} ${hour}:${minute}`
  }
  if (type === 'simpleTime') {
    return `${month}.${date} ${hour}:${minute}`
  }
  function addZero (data) {
    return data < 10 ? '0' + data : data
  }
}
// 根据时间戳，返回该事件在dateTime中的下标组和标准日期(2018-08-08 10:08)
export const dateTimeEcho = (dateTime) => {
  let timeArr = dateFilter(dateTime, 'Array') // 将时间戳转成时间组[2018, '08', '08', 10, '08']
  let time = { index: [], label: '' } // 要返回的数据
  timeArr.map((item, index) => {
    defData.dateTime[index].map((date, i) => {
      if (Number(date.name) === Number(item)) {
        time.label += date.value
        time.index.push(i)
      }
    })
  })
  return time
}
export default {
  twoArrFilter, timeFilter, dateFilter, dateTimeEcho
}
