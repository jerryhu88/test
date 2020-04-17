<template>
  <div class="msgCenter">
    <div class="top" v-if="lists.length">
      <span>全部消息</span>
      <span @click="clear"><i class="iconfont icon-delete"></i>清空消息</span>
    </div>
    <ul v-if="lists.length">
      <li v-for="(item, i) in lists" :key="i">
        <div>
          <h1>{{item.title}}</h1>
          <span>{{item.time}}</span>
          <m-badge v-if="!item.readed" point/>
        </div>
        <p class="content">{{item.content}}</p>
        <p class="opinion" v-if="item.remark">审核意见：{{item.remark}}</p>
        <p class='read' v-if="item.url" @click="readMsg(item.serviceID, item.url)">点击查看<i class='iconfont icon-you'></i></p>
      </li>
    </ul>
    <m-noData v-else-if="showNoData" msg='暂无消息'/>
  </div>
</template>

<script>
import mBadge from '../../components/prompt/mBadge'
import mNoData from '../../components/prompt/mNoData'
import {getMsgListApi, delMsgListApi, readMsgApi} from '../../api/serviceIndex/index'
import {dateFilter} from '../../constant/filters'
import {confirm} from '../../constant/popup'

export default {
  data () {
    return {
      showNoData: false,
      pages: {
        page: 1,
        pageSize: 10
      },
      hasNextPage: false,
      readonly: true,
      lists: [],
      urls: {
        1: '../welfareCenter/welfareManage',
        2: '../welfareCenter/admin/accept',
        3: '../welfareCenter/admin/list',
        4: '../common/admin?type=interest',
        5: '../common/admin?type=love',
        6: '../common/admin?type=law'
      }
    }
  },
  components: {
    mBadge, mNoData
  },
  onPullDownRefresh () {
    this.firstPage()
  },
  // 上拉加载，拉到底部触发
  onReachBottom () {
    if (!this.hasNextPage) return
    // 到这底部在这里需要做什么事情
    this.pages.page++
    this.getMsgList()
  },
  onLoad (options) {
    Object.assign(this.$data, this.$options.data())
    wx.startPullDownRefresh()
  },
  methods: {
    dateFilter,
    firstPage () {
      this.pages.page = 1
      this.getMsgList()
    },
    getMsgList () {
      if (this.pages.page === 1) {
        this.lists = []
      }
      getMsgListApi(this.pages).then(data => {
        data.list.map(item => {
          item.time = this.dateFilter(item.createTime, 'simpleTime')
        })
        this.lists = [...data.list, ...this.lists]
        this.hasNextPage = data.total > this.lists.length
        this.renderShow = !data.total
        // 停止下拉刷新
        wx.stopPullDownRefresh()
        this.showNoData = !data.total
      })
    },
    readMsg (id, url) {
      readMsgApi(id).then(data => {
        this.$router.push(this.urls[url])
      })
    },
    clear () {
      confirm(
        '提示',
        '确认清空所有消息吗？',
        '确定',
        () => {
          delMsgListApi().then(data => {
            this.firstPage()
          })
        }
      )
    }
  }
}
</script>

<style lang='less' scoped>
@import "../../assets/style/base.less";
.msgCenter{
  background: #f8f8f8;
  box-sizing: border-box;
  min-height: 100vh;
  width: 100%;
  padding: @28px;
  .top{
    font-size:@26px;
    color:#929292;
    line-height:@26px;
    display: flex;
    justify-content: space-between;
    span{
      display: flex;
      i{
        margin-right: @6px;
      }
    }
  }
  ul{
    li{
      margin-top: @28px;
      background: #fff;
      padding: @24px @24px;
      border-radius: @16px;
      >div{
        display: flex;
        align-items: center;
        margin-bottom: @28px;
        h1{
          flex: 1;
          font-size:@30px;
          color:#222222;
          line-height:@30px;
        }
        span{
          font-size:@24px;
          color:#aaaaaa;
          line-height:@24px;
        }
        /deep/.point{
          margin-left: @6px;
        }
      }
      .content{
        font-size:@26px;
        color:#aaaaaa;
        line-height:@38px;
      }
      .opinion, .read{
        font-size:@28px;
        color:#2a2a2a;
        line-height:@38px;
        margin-top: @20px;
        .center-between;
        .iconfont{
          font-size:@28px;
          color:#aaa;
        }
        &.read{
          border-top: @2px dashed #dfdfdf;
          padding-top: @20px;
        }
      }
    }
  }
}
</style>
