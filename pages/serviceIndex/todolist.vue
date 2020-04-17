<template>
  <div>
    <ul class="todolist" v-if="lists.length">
      <li v-for="(item, i) in lists" :key="i" @click="read(item)">
        <div class="title">
          <h1>{{item.title}}</h1>
          <span>{{item.time}}</span>
        </div>
        <p>
          <span class="decs">{{item.content}}</span>
          <span class="get">查看</span>
        </p>
      </li>
    </ul>
    <m-noData v-else-if="showNoData" msg='暂无待办事项'/>
  </div>
</template>

<script>
import mBadge from '../../components/prompt/mBadge'
import mNoData from '../../components/prompt/mNoData'
import {getToDoListApi} from '../../api/serviceIndex/index'
import {dateFilter} from '../../constant/filters'
import bus from '../../constant/bus'
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
      num: ''
    }
  },
  watch: {
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
    this.getToDoList()
  },
  onLoad (options) {
    Object.assign(this.$data, this.$options.data())
    wx.startPullDownRefresh()
    bus.$on('firstPage', data => {
      this.firstPage()
    })
  },
  methods: {
    dateFilter,
    firstPage () {
      this.pages.page = 1
      this.getToDoList()
    },
    read (item) {
      // this.$router.push(item.page)
      wx.navigateTo({ url: item.page })
    },
    getToDoList () {
      if (this.pages.page === 1) {
        this.lists = []
      }
      getToDoListApi(this.pages).then(data => {
        data.list.map(item => {
          item.time = this.dateFilter(item.createTime, 'simpleTime')
        })
        this.lists = [...data.list, ...this.lists]
        this.hasNextPage = data.total > this.lists.length
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
.todolist{
  background: #f8f8f8;
  min-height: 100vh;
  li{
    padding: @24px;
    background: #fff;
    &:not(:last-child){
      border-bottom: @1px solid @border;
    }
    .title{
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: @20px;
      h1{
        font-size: @28px;
        font-weight: bold;
      }
      span{
        font-size:@24px;
        color:#aaaaaa;
      }
    }
    p{
      display: flex;
      font-size: @26px;
      .decs{
        color: #666;
        flex: 1;
      }
      .get{
        color: @red;
        margin-left: @28px;
        height: fit-content;
        &:active{
          background: #f8f8f8;
        }
      }
      // .reject{
      //   color: @red;
      //   &:active{
      //     background: #f8f8f8;
      //   }
      // }
    }
  }
}
</style>
