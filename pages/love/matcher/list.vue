<template>
  <div class="adminList">
    <tab :tabs='tabs' v-model='queryType' @select="firstPage"/>
    <!-- 红娘列表 -->
    <p class="prompt" v-if="queryType == 1 && matcherLists.length">
      <span>正常：{{count.normalCount}}人</span>
      <span>已注销：{{count.delCount}}人</span>
    </p>
    <ul class="lists" v-if="queryType == 1 && matcherLists.length">
      <li class="list vux-1px-b" v-for="(item, i) in matcherLists" :key='i' @click="show(item, i)">
        <div class="uname">
          <img :src="item.avatar" alt="">
        </div>
        <h2>{{item.matchmakerName}}</h2>
        <span class="name">{{item.deleted ? '已注销' : '正常'}}</span>
        <i class="iconfont icon-you"></i>
      </li>
    </ul>
    <!-- 红娘审批 -->
    <ul class="lists" v-else-if="queryType == 2 && auditLists.length">
      <li class="list vux-1px-b" v-for="(item, i) in auditLists" :key='i' @click="$router.push(`./detail?serviceID=${item.serviceID}&audit=true`)">
        <div class="uname">
          <img :src="item.avatar" alt="">
        </div>
        <h2>{{item.matchmakerName}}</h2>
        <span class="name">{{item.uname || item.nickname}}</span>
        <i class="iconfont icon-you"></i>
      </li>
    </ul>
    <!-- 红娘业绩统计 -->
    <div v-else-if="queryType == 3" class="stat">
      <div class="picker vux-1px-b">
        <picker mode='date' @change="selectStart" :value="startTime" :end='endTime'>
          <span class="selectTime">{{start}}</span>
        </picker>
        <i class="to">至</i>
        <picker mode='date' @change="selectEnd" :value="endTime">
          <span class="selectTime">{{end}}</span>
        </picker>
      </div>
      <ul>
        <li class="vux-1px-b">
          <span>任务状态</span>
          <span>数量</span>
          <span>占比</span>
        </li>
        <li class="vux-1px-b" v-for="(item, i) in stat" :key="i">
          <span><i :class="'color' + i"></i>{{item.text}}</span>
          <span>{{item.num}}</span>
          <span>{{item.percent}}</span>
        </li>
      </ul>
    </div>
    <!-- 无数据 -->
    <m-noData v-else-if="showNoData" msg='暂无红娘信息'/>
  </div>
</template>

<script>
import {getMatcherStatApi, getMatcherNumApi, getAuditMatcherApi, getMatcherListApi, loginoutMatcherApi, unLoginoutMatcherApi} from '../../../api/love/matcher'
import Tab from '../../../components/view/tab'
import {confirm, toast} from '../../../constant/popup'
import mNoData from '../../../components/prompt/mNoData'

export default {
  data () {
    return {
      showNoData: false,
      start: '开始时间',
      end: '结束时间',
      startTime: '',
      endTime: '',
      stat: [
        {
          text: '进行中',
          num: 25,
          percent: '45%'
        },
        {
          text: '牵手成功',
          num: 25,
          percent: '45%'
        },
        {
          text: '牵手失败',
          num: 25,
          percent: '45%'
        }
      ],
      tabs: [
        {text: '红娘列表', type: 1},
        {text: '红娘审批', type: 2},
        {text: '红娘业绩统计', type: 3}
      ],
      auditList: ['待审批', '已拒绝', '已同意'],
      queryType: 1,
      matcherPages: {
        page: 1,
        pageSize: 10
      },
      auditPages: {
        page: 1,
        pageSize: 10
      },
      hasNextPage: false,
      matcherLists: [],
      auditLists: [],
      timer: null,
      count: {}
    }
  },
  onLoad () {
    Object.assign(this.$data, this.$options.data())
  },
  onShow (options) {
    this.getMatcherNum()
    this.firstPage()
    this.getMatcherStat()
  },
  onPullDownRefresh () {
    this.timer = setTimeout(() => {
      this.firstPage()
      clearTimeout(this.timer)
    }, 500)
  },
  // 上拉加载，拉到底部触发
  onReachBottom () {
    if (!this.hasNextPage) return
    // 到这底部在这里需要做什么事情
    this.pages.page++
    this.select()
  },
  destroyed () {
    clearTimeout(this.timer)
  },
  components: {
    Tab, mNoData
  },
  methods: {
    getMatcherStat () {
      let kv = {
        serviceID: this.serviceID,
        startTime: this.startTime,
        endTime: this.endTime
      }
      getMatcherStatApi({kv}).then(data => {
        let total = (data.doing + data.success + data.fail) || 1
        this.stat[0].num = data.doing
        this.stat[0].percent = ((data.doing / total) * 100).toFixed(1) + '%'
        this.stat[1].num = data.success
        this.stat[1].percent = ((data.success / total) * 100).toFixed(1) + '%'
        this.stat[2].num = data.fail
        this.stat[2].percent = ((data.fail / total) * 100).toFixed(1) + '%'
      })
    },
    select (type) {
      if (this.queryType === 1) {
        this.getMatcher()
      }
      if (this.queryType === 2) {
        this.getAuditMatcher()
      }
    },
    firstPage () {
      if (this.queryType === 1) {
        this.matcherPages.page = 1
        this.getMatcher()
      }
      if (this.queryType === 2) {
        this.auditPages.page = 1
        this.getAuditMatcher()
      }
    },
    selectStart (event) {
      let time = event.target.value.split('-')
      this.start = `${time[0]}年${time[1]}月${time[2]}日`
      this.startTime = event.target.value
      this.getMatcherStat()
    },
    selectEnd (event) {
      let time = event.target.value.split('-')
      this.end = `${time[0]}年${time[1]}月${time[2]}日`
      this.endTime = event.target.value
      this.getMatcherStat()
    },
    show (item, i) {
      let that = this
      let itemList = ['红娘详情', '拨号', '注销红娘']
      if (item.deleted) {
        itemList = ['红娘详情', '拨号', '恢复注销']
      }
      wx.showActionSheet({
        itemList,
        success (data) {
          switch (itemList[data.tapIndex]) {
            case '红娘详情':
              wx.navigateTo({url: `./detail?serviceID=${item.serviceID}`})
              return
            case '拨号':
              // 拨号
              wx.makePhoneCall({
                phoneNumber: item.phone
              })
              return
            case '注销红娘':
              confirm(
                '提示',
                '确认注销该红娘吗？',
                '确定',
                () => {
                  loginoutMatcherApi(item.serviceID).then(data => {
                    toast('success', '注销成功')
                    that.matcherLists[i].deleted = 1
                    that.getMatcherNum()
                  })
                }
              )
              return
            case '恢复注销':
              unLoginoutMatcherApi(item.serviceID).then(data => {
                toast('success', '已恢复')
                that.matcherLists[i].deleted = 0
                that.getMatcherNum()
              })
          }
        }
      })
    },
    getMatcherNum () {
      getMatcherNumApi().then(data => {
        this.count = data
      })
    },
    getAuditMatcher () {
      getAuditMatcherApi(this.auditPages).then(data => {
        if (this.auditPages.page === 1) {
          this.auditLists = []
        }
        this.auditLists = data.list
        this.hasNextPage = data.hasNextPage
        // 停止下拉刷新
        wx.stopPullDownRefresh()
        this.showNoData = !data.total
      })
    },
    getMatcher () {
      if (this.auditPages.page === 1) {
        this.matcherLists = []
      }
      getMatcherListApi(this.matcherPages).then(data => {
        this.matcherLists = data.list
        this.hasNextPage = data.hasNextPage
        // 停止下拉刷新
        wx.stopPullDownRefresh()
        this.showNoData = !data.total
      })
    }
  }
}
</script>

<style lang='less' scoped>
@import "../../../assets/style/base.less";
  .adminList{
    background: #f8f8f8;
    box-sizing: border-box;
    height: 100vh;
    /deep/.tabs{
      position: sticky;
      width: 100%;
      top: 0;
      background: #fff;
      z-index: 2;
    }
    .prompt{
      padding: @20px @24px;
      font-size: @26px;
      color: #666;
      span{
        margin-right: @24px;
      }
    }
    .lists{
      .list{
        background: #fff;
        padding: @20px @28px;
        font-size:@26px;
        color:#929292;
        &:active{
          background: #f8f8f8;
        }
        .flex-center;
        .uname{
          .flex-center;
          img{
            width: @72px;
            height: @72px;
            border-radius: 50%;
            margin-right: @20px;
          }
        }
        h2{
          color: #2a2a2a;
          font-size: @28px;
          flex: 1;
        }
        .name{
          .one-line;
          max-width: @220px;
          display: inline-block;
        }
        .iconfont{
          font-size: @26px;
          color: #999;
          margin-left: @12px;
        }
      }
    }
    .stat{
      .picker{  
        width: 100%;
        padding: @24px @28px;
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
      ul{
        background: #fff;
        li{
          padding: @24px;
          display: flex;
          align-items: center;
          justify-content: space-around;
          &:last-child{
            border: 0;
          }
          font-size:@26px;
          color:#666666;
          &:first-child{
            font-size: @28px;
            color: #000;
            font-weight: bold;
          }
          span{
            width: calc(100% / 3);
            display: flex;
            align-items: center;
            justify-content: center;
            i{
              width: @10px;
              height: @10px;
              border-radius: 50%;
              display: inline-block;
              margin-right: @8px;
              &.color0{
                background:#f9698e;
              }
              &.color1{
                background:#968bff;
              }
              &.color2{
                background:#fcd100;
              }
              &.color3{
                background:#95d601;
              }
              &.color4{
                background:#3adbcf;
              }
            }
          }
        }
      }
    }
  }
</style>
