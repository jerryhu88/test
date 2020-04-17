<template>
  <div class="myCase">
    <tab :tabs='tabs' v-model='status' @select="firstPage"/>
    <ul v-if="lists.length" class="lists">
      <li class="caseList" @click="$router.push(`./detail?serviceID=${item.serviceID}&status=${item.status}&all=${all}`)" v-for="(item, i) in lists" :key="i">
        <h1>{{item.overview}}</h1>
        <p>{{item.description}}</p>
        <div>
          <i class="iconfont icon-label"></i>
          <label>{{item.labelName}}</label>
          <span>{{item.createTime}}</span>
        </div>
      </li>
    </ul>
    <m-noData v-else-if="showNoData" msg='暂无案件'/>
  </div>
</template>

<script>
import Tab from '../../../components/view/tab'
import {getCaseListsApi} from '../../../api/law/index'
import mNoData from '../../../components/prompt/mNoData'
import {dateFilter} from '../../../constant/filters'

export default {
  data () {
    return {
      showNoData: false,
      pages: {
        page: 1,
        pageSize: 10
      },
      tabs: [
        {text: '待受理', type: '1'},
        {text: '受理中', type: '2'},
        {text: '转交中', type: '4'},
        {text: '已结案', type: '3'},
        {text: '已拒绝', type: '5'}
      ],
      status: '1',
      lists: [],
      hasNextPage: false,
      timer: null,
      type: 'list',
      all: false
    }
  },
  components: {
    Tab, mNoData
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
    this.getList()
  },
  onLoad (options) {
    Object.assign(this.$data, this.$options.data())
    this.status = options.status || '1'
    if (options.all === 'true') {
      this.all = true // 是否是从全部案件进入
      this.type = 'orgCase'
      wx.setNavigationBarTitle({ title: '全部案件' })
    }
  },
  onShow () {
    // 案件列表
    this.firstPage()
  },
  methods: {
    firstPage () {
      this.pages.page = 1
      this.getList()
    },
    getList () {
      this.pages.kv = {
        status: this.status
      }
      if (this.pages.page === 1) {
        this.lists = []
      }
      getCaseListsApi(this.type, this.pages).then(data => {
        data.list.map(item => {
          item.createTime = dateFilter(item.createTime, 'dateTime')
        })
        this.lists = [...this.lists, ...data.list]
        this.hasNextPage = data.hasNextPage
        // 停止下拉刷新
        wx.stopPullDownRefresh()
        this.showNoData = !data.total
      })
    }
  },
  destroyed () {
    clearInterval(this.timer)
  }
}
</script>

<style lang='less' scoped>
@import "../../../assets/style/base.less";
.myCase{
  background: #f8f8f8;
  min-height: 100vh;
  box-sizing: border-box;
  position: relative;
  /deep/.tabs{
    top: 0;
    color: #666;
    li{
      font-size: @26px;
      padding: 0 @10px;
    }
  }
  .lists{
    .caseList{
      &:not(:last-child){
        margin-bottom: @20px;
      }
      padding: @28px @24px;
      background: #fff;
      i{
        display: inline;
      }
      h1{
        font-size:@32px;
        color:#000;
        line-height:1.3;
        width: 100%;
        margin-bottom: @16px;
      }
      p{
        font-size: @26px;
        color: #999;
        line-height: 1.3;
        margin-bottom: @18px;
        .line(2);
      }
      div{
        border-top: 1px solid @border;
        padding-top: @18px;
        display: flex;
        align-items: center;
        color: #999;
        font-size: @24px;
        .iconfont{
          font-size: @26px;
          margin-right: @6px;
        }
        label{
          margin-right: @60px;
        }
      }
    }
  }
}
</style>
