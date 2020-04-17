<template>
  <div class="nameList">
    <tab v-if="hasTabs" :tabs='tabs' v-model='type' @select="select"/>
    <div class="curr_title">{{titles[type].currTitle}}：{{lists.length}}</div>
    <div class="listTitle vux-1px-b">
      <span>用户昵称</span>
      <span v-if="!hasTabs">核销方式</span>
      <span>{{titles[type].rightTitle}}</span>
    </div>
    <ul v-if="lists.length">
      <li v-for="(item, i) in lists" :key="i" class="list vux-1px-b">
        <p class="list_box list_cont">
          <span :class="{long: hasTabs}">{{item.nickname}}</span>
          <span v-if="!hasTabs">扫码核销</span>
          <span class="time">{{item.time}}</span>
        </p>
      </li>
    </ul>
    <m-noData v-else-if="showNoData" msg="暂无名单"/>
    <div class="btns" v-if="lists.length">
      <m-button @click="exportList">导出名单</m-button>
      <m-button @click="$router.push(`../common/sendMsg?type=${type}`)">群发消息</m-button>
    </div>
  </div>
</template>

<script>
import Tab from '../../components/view/tab'
import mButton from '../../components/form/mButton'
import {getNameListsApi, exportNameListsApi} from '../../api/welfareCenter/index'
import {dateFilter} from '../../constant/filters'
import mNoData from '../../components/prompt/mNoData'
import { toast, confirm } from '../../constant/popup'
import {mapGetters} from 'vuex'

export default {
  data () {
    return {
      showNoData: false,
      pages: {
        page: 1,
        pageSize: 10
      },
      tabs: [
        {text: '已售出名单', type: '1'},
        {text: '已核销名单', type: '2'},
        {text: '未核销名单', type: '3'}
      ],
      titles: {
        total: {
          type: 1,
          currTitle: '交易用户总人数',
          rightTitle: '最近交易时间',
          barTitle: '用户管理'
        },
        fans: {
          type: 0,
          currTitle: '当前粉丝人数',
          rightTitle: '关注时间',
          barTitle: '粉丝管理'
        },
        verified: {
          currTitle: '已核销名单数',
          rightTitle: '售出时间',
          barTitle: '已核销名单'
        },
        notVerify: {
          currTitle: '未核销名单数',
          rightTitle: '售出时间',
          barTitle: '未核销名单'
        },
        saled: {
          currTitle: '已出售名单数',
          rightTitle: '售出时间',
          barTitle: '已出售名单'
        }
      },
      lists: [],
      hasNextPage: false,
      type: 'total',
      currTitle: ''
    }
  },
  computed: {
    hasTabs () {
      if (this.type === 'total' || this.type === 'fans') {
        return true
      } else {
        return false
      }
    },
    ...mapGetters(['userInfo'])
  },
  components: {
    Tab, mButton, mNoData
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
    this.type = options.type
    this.select(this.type)
  },
  methods: {
    dateFilter,
    firstPage () {
      this.pages.page = 1
      this.getList()
    },
    select (type) {
      wx.setNavigationBarTitle({
        title: this.titles[type].barTitle
      })
      this.firstPage()
    },
    exportList () {
      let pages = {
        page: 0,
        pageSize: 0,
        kv: {
          fansType: this.titles[this.type].type ? 0 : 1
        }
      }
      wx.showLoading({
        title: '导出中…',
        mask: true
      })
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
      exportNameListsApi(pages).then(data => {
        toast('none', '文件已发送至您的邮箱')
      })
    },
    getList () {
      this.pages.kv = {
        fansType: this.titles[this.type].type
      }
      if (this.pages.page === 1) {
        this.lists = []
      }
      getNameListsApi(this.pages).then(data => {
        data.list.map(item => {
          let time = ''
          if (this.type === 'total') {
            time = item.updateTime
          } else if (this.type === 'fans') {
            time = item.createTime
          }
          item.time = this.dateFilter(time, 'simpleTime')
        })
        this.lists = [...this.lists, ...data.list]
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
@import "../../assets/style/base.less";
  .nameList{
    /deep/.noData{
      min-height: calc(~'100vh - '@228px);
    }
    background: #f8f8f8;
    box-sizing: border-box;
    min-height: 100vh;
    /deep/.tabs{
      position: sticky;
      width: 100%;
      top: 0;
      background: #fff;
      z-index: 2;
    }
    .center{
      text-align: center;
    }
    .curr_title{
      padding:@24px @28px;
      box-sizing: border-box;
      font-size:@26px;
      color:#929292;
      line-height:@26px;
    }
    .listTitle{
      background: #fff;
      padding: @27px @28px;
      box-sizing: border-box;
      .center-between;
      >span{
        font-size:@26px;
        color:#929292;
        line-height:@26px;
      }
    }
    .list{
      .list_box{
        display:flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: @1px solid @border;
        background-color: #ffff;
        span{
          width: calc(100% / 3);
          &:nth-child(2){
            text-align: center;
          }
          &:last-child{
            text-align: right;
          }
        }
        &:last-child{
          border:none;
        }
      }
      .list_cont{
        padding: @32px @28px;
        box-sizing: border-box;
        >span{
          font-size:@30px;
          color:#222;
          line-height:@30px;
          &:first-child{
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space:nowrap;
          }
        }
        .time{
          color:#aaa;
        }
      }
    }
    .btns{
      position: fixed;
      bottom:0;
      left:0;
      display: flex;
      width:100%;
      background-color: #fff;
      /deep/button{
        flex: 1 1 auto;
        font-size:@30px;
        color:#ff6633;;
        line-height:@30px;
        padding:@29px 0;
        background-color: transparent;
        border:none;
        border-radius:0;
        &:last-child{
          color:#fff;
          background-color: #ff6633;
          border:@1px solid #ff6633;
        }
      }
    }
  }
</style>
