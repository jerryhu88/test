<template>
  <div class="ticketDetails">
    <div class="header vux-1px-b">
      <div class="search">
        <input v-model="query" @confirm='firstPage' confirm-type='search' type="search" placeholder="输入福利券名称、支付用户名称">
        <span @click="firstPage">搜索</span>
      </div>
      <div class="picker">
        <picker mode='date' @change="selectStart" :value="startTime" :end='endTime'>
          <span class="selectTime">{{start}}</span>
        </picker>
        <i class="to">至</i>
        <picker mode='date' @change="selectEnd" :value="endTime">
          <span class="selectTime">{{end}}</span>
        </picker>
      </div>
    </div>
    <ul v-if="lists.length">
      <ticket-detail v-for="(item, i) in lists" :item='item' :showTime='!i || (lists[i - 1].time !== lists[i].time)' :key="i" :type='type'/>
    </ul>
    <m-noData v-else-if="showNoData" :msg="`暂无已${type}福利券`"/>
    <m-button v-if="lists.length" @click='exportList'>导出</m-button>
  </div>
</template>

<script>
import TicketDetail from './components/TicketDetail'
import {getTicketListApi, exportTicketListApi} from '../../api/welfareCenter/index'
import {dateFilter} from '../../constant/filters'
import mNoData from '../../components/prompt/mNoData'
import mButton from '../../components/form/mButton'
import { toast, confirm } from '../../constant/popup'
import {mapGetters} from 'vuex'
const year = new Date().getFullYear()
let month = new Date().getMonth() + 1
month = month < 10 ? ('0' + month) : month
let lastDay = new Date(year, month, 0).getDate()
lastDay = lastDay < 10 ? ('0' + lastDay) : lastDay
export default {
  props: {
    url: String
  },
  data () {
    return {
      showNoData: false,
      query: '',
      lists: [],
      pages: {
        page: 1,
        pageSize: 10
      },
      start: '2019年3月',
      end: '',
      startTime: '',
      endTime: '2019-08',
      name: '',
      defaultDate: [],
      type: '',
      api: {
        售出: 'getSaleTotalList',
        核销: 'getVerificationList'
      }
    }
  },
  components: {
    TicketDetail, mNoData, mButton
  },
  watch: {
    query () {
      if (this.query === '') {
        this.firstPage()
      }
    }
  },
  onPullDownRefresh () {
    this.firstPage()
  },
  // 上拉加载，拉到底部触发
  onReachBottom () {
    if (!this.hasNextPage) return
    // 到这底部在这里需要做什么事情
    this.pages.page++
    this.getList()
  },
  onLoad (options) {
    Object.assign(this.$data, this.$options.data())
    this.initDate()
    this.type = options.type
    wx.setNavigationBarTitle({
      title: `已${this.type}福利券`
    })
    wx.startPullDownRefresh()
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    dateFilter,
    initDate () {
      this.start = `${year}年${month}月01日`
      this.startTime = `${year}-${month}-01`
      this.end = `${year}年${month}月${lastDay}日`
      this.endTime = `${year}-${month}-${lastDay}`
    },
    firstPage () {
      this.pages.page = 1
      this.getList()
    },
    selectStart (event) {
      let time = event.target.value.split('-')
      this.start = `${time[0]}年${time[1]}月${time[2]}日`
      this.startTime = event.target.value
      this.firstPage()
    },
    selectEnd (event) {
      let time = event.target.value.split('-')
      this.end = `${time[0]}年${time[1]}月${time[2]}日`
      this.endTime = event.target.value
      this.firstPage()
    },
    exportList () {
      if (!this.userInfo.email) {
        confirm(
          '提示',
          `你还未绑定邮箱，请先绑定邮箱后再操作`,
          '去绑定',
          () => {
            this.$router.push('../serviceIndex/setting?type=safety')
          }
        )
        return
      }
      wx.showLoading({
        title: '导出中…',
        mask: true
      })
      exportTicketListApi(this.type, {...this.pages, page: 0, pageSize: 0}).then(data => {
        toast('none', '文件已发送至您的邮箱')
      })
    },
    // 售出列表
    getList () {
      this.pages.kv = {
        query: this.query,
        startTime: this.startTime,
        endTime: this.endTime
      }
      let api = this.api[this.type]
      if (this.url) {
        api = this.url
      }
      if (this.pages.page === 1) {
        this.lists = []
      }
      getTicketListApi(this.pages, api).then(data => {
        data.list.map(item => {
          item.time = this.dateFilter(item.createTime, 'date')
          item.dateTime = this.dateFilter(item.createTime, 'dateTime')
          this.lists.push(item)
        })
        // 停止下拉刷新
        wx.stopPullDownRefresh()
        this.hasNextPage = data.hasNextPage
        this.showNoData = !data.total
      })
    }
  }
}
</script>

<style lang='less' scoped>
@import "../../assets/style/base.less";
.ticketDetails{
  box-sizing: border-box;
  background: #f8f8f8;
  font-size:@30px;
  min-height: calc(~'100vh - '@88px);
  padding-bottom: @88px;
  /deep/.mpvue-picker-view{
    max-height: 360rpx;
  }
  /deep/.mpvue-picker__hd {
    padding:@22px @30px;
    font-size:@26px;
    .mpvue-picker__action:last-child{
      color: @red;
    }
  }
  // 只选择年月
  /deep/._picker-view-column:last-child{
    display: none;
  }
  .header{
    background: #fff;
    padding: @24px @28px;
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    .search{
      display: flex;
      align-items: center;
      margin-bottom: @24px;
      input{
        background:#f8f8f8;
        border-radius:@10px;
        height:@60px;
        font-size:@26px;
        color:#2a2a2a;
        padding: 0 @24px;
        margin-right: @24px;
        flex: 1;
      }
      span{
        color: #333;
        font-size: @28px;
        &:active{
          background: #f8f8f8;
        }
      }
    }
    .picker{
      .x-center;
      .to{
        font-size: @26px;
        color: #666;
        margin-right: @18px;
      }
      .selectTime{
        font-size:@26px;
        color:#929292;
        position: relative;
        margin-right: @48px;
        &::after{
          position: absolute;
          display: inline-block;
          content: '';
          border: @8px solid transparent;
          border-top-color: #929292;
          top: @16px;
          right: -@24px;
        }
      }
    }
  }
  /deep/.noData{
    min-height: calc(~'100vh - '@188px)!important;
  }
  /deep/button {
    position: fixed;
    bottom: 0;
    width: 100%;
    background: @red;
    border-radius: 0;
    color: #fff;
    font-size: @30px;
    height: @88px;
    line-height: @88px;
  }
}
</style>
