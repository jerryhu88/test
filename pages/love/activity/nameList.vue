<template>
  <div class="nameList">
    <p v-if="stat.totalCount" class="tips">报名人员：单身男{{stat.manCount}}人、女{{stat.womanCount}}人，合计：{{stat.totalCount}}人</p>
    <ul class="lists" v-if="lists.length">
      <li class="list vux-1px-b" v-for="(item, i) in lists" :key='i' @click="show(item)">
        <div class="uname">
          <img :src="item.avatar" alt="">
        </div>
        <h2>{{item.singleName}}<span>({{item.sex === 1 ? '男' : '女'}})</span></h2>
        <span class="age">{{item.age}}岁</span>
        <i class="iconfont icon-you"></i>
      </li>
    </ul>
    <m-noData v-else-if="showNoData" msg="暂无名单"/>
    <!-- <div class="btns" v-if="lists.length">
      <m-button @click="exportList">导出名单</m-button>
      <m-button @click="$router.push(`../../common/sendMsg?type=${type}&serviceID=${serviceID}`)">群发消息</m-button>
    </div> -->
  </div>
</template>

<script>
import Tab from '../../../components/view/tab'
import mButton from '../../../components/form/mButton'
import {exportSaleNameListsApi} from '../../../api/welfareCenter/index'
import {getNameListApi, getNameListStatApi} from '../../../api/love/index'
import {dateFilter} from '../../../constant/filters'
import mNoData from '../../../components/prompt/mNoData'
import { toast, confirm } from '../../../constant/popup'
import {mapGetters} from 'vuex'

export default {
  data () {
    return {
      showNoData: false,
      stat: {},
      pages: {
        page: 1,
        pageSize: 10
      },
      lists: [],
      hasNextPage: false,
      currTitle: '',
      type: 'fans',
      serviceID: ''
    }
  },
  components: {
    Tab, mButton, mNoData
  },
  computed: {
    ...mapGetters(['userInfo'])
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
    this.serviceID = options.serviceID
    this.getNameListStat()
    this.getList()
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
    show (item) {
      wx.showActionSheet({
        itemList: ['查看详情', '拨号'],
        success (data) {
          let i = data.tapIndex
          if (i === 0) {
            wx.navigateTo({
              url: `../../common/h5Page?url=/love/findLuck/${item.serviceID}&title=${item.singleName}&hiddenBtns=true`
            })
          } else {
            wx.makePhoneCall({
              phoneNumber: item.phone
            })
          }
        }
      })
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
      let pages = {
        page: 0,
        pageSize: 0,
        kv: {}
      }
      pages.kv.type = this.titles[this.type].type
      pages.kv.serviceID = this.serviceID
      exportSaleNameListsApi(pages).then(data => {
        toast('none', '文件已发送至您的邮箱')
      })
    },
    getNameListStat () {
      getNameListStatApi(this.serviceID).then(data => {
        this.stat = data
      })
    },
    getList () {
      this.pages.kv = {
        activityServiceID: this.serviceID
      }
      // 用户、粉丝列表
      if (this.pages.page === 1) {
        this.lists = []
      }
      getNameListApi(this.pages).then(data => {
        data.list.map(item => {
          item.avatar = item.fileHostName + JSON.parse(item.pictures)[0].url
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
@import "../../../assets/style/base.less";
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
    .tips{
      padding:@24px @28px;
      box-sizing: border-box;
      font-size:@26px;
      color:#929292;
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
          span{
            font-size: @26px;
            color: #666;
            margin-left: @6px;
          }
        }
        .age{
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
