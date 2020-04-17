<template>
  <div class="nameList">
    <p class="tips" v-if="lists.length && serviedID">当前报名人员统计：{{total || 0}}</p>
    <p class="tips" v-if="lists.length">小组当前粉丝数量：{{total || 0}}</p>
    <ul class="lists" v-if="lists.length">
      <li @click="phone(item.phone)" class="list vux-1px-b" v-for="(item, i) in lists" :key='i'>
        <div class="head">
          <img mode="aspectFill" :src="item.avatar" alt="">
        </div>
        <div class="info">
          <div class="name">
            <h1>{{item.nickname}}</h1>
            <span class="sex">({{item.sex === 1 ? '男' : '女'}})</span>
            <span v-if="serviceID" class="status">{{item.sign ? '已签到' : '未签到'}}</span>
          </div>
          <div class="dept">
            <p>{{item.deptName}}</p>
            <span class="position">{{item.position}}</span>
          </div>
        </div>
        <i class="iconfont icon-boda"></i>
      </li>
    </ul>
    <m-noData v-else-if="showNoData" msg="暂无数据"/>
    <div class="btns" v-if="lists.length">
      <button @click="exportList">导出名单</button>
      <button @click="$router.push(`../common/sendMsg?module=兴趣机构&serviceID=${serviceID}`)">群发消息</button>
    </div>
  </div>
</template>

<script>
import {getFansListApi, getNameListApi, exportNameListApi, expotrFansListApi} from '../../api/interest/index'
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
      lists: [],
      hasNextPage: false,
      serviceID: '',
      total: ''
    }
  },
  components: {
    mNoData
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
    this.serviceID = options.serviceID
    if (this.serviceID) {
      wx.setNavigationBarTitle({
        title: '活动名单列表'
      })
    }
    wx.startPullDownRefresh()
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    phone (phoneNumber) {
      wx.makePhoneCall({
        phoneNumber
      })
    },
    firstPage () {
      this.pages.page = 1
      this.getList()
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
      // 用户、粉丝列表
      if (this.serviceID) {
        exportNameListApi(this.serviceID).then(data => {
          toast('none', '文件已发送至您的邮箱')
        })
      } else {
        expotrFansListApi().then(data => {
          toast('none', '文件已发送至您的邮箱')
        })
      }
    },
    getList () {
      if (this.serviceID) {
        // 活动名单列表
        if (this.pages.page === 1) {
          this.lists = []
        }
        getNameListApi(this.serviceID, this.pages).then(data => {
          this.total = data.total
          this.lists = [...this.lists, ...data.list]
          this.hasNextPage = data.hasNextPage
          // 停止下拉刷新
          wx.stopPullDownRefresh()
          this.showNoData = !data.total
        })
      } else {
        // 粉丝列表
        if (this.pages.page === 1) {
          this.lists = []
        }
        getFansListApi(this.pages).then(data => {
          this.total = data.total
          this.lists = [...this.lists, ...data.list]
          this.hasNextPage = data.hasNextPage
          this.showNoData = !data.total
          // 停止下拉刷新
          wx.stopPullDownRefresh()
        })
      }
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
        .head{
          .flex-center;
          img{
            width: @80px;
            height: @80px;
            border-radius: @6px;
            margin-right: @20px;
          }
        }
        .info{
          height: @80px;
          flex: 1;
          .name, .dept{
            display: flex;
            align-items: center;
            &.dept{
              margin-top: @6px;
            }
            .sex{
              flex: 1;
            }
            h1{
              color: #000;
              font-size: @28px;
              margin-right: @10px;
            }
            p{
              color: #333;
              font-size: @26px;
              margin-right: @12px;
              .one-line;
              max-width: @400px;
            }
            span{
              font-size: @26px;
              color: #666;
              margin-left: @6px;
              &.position{
                padding-left: @12px;
                border-left: 1px solid @border;
                line-height: @26px;
              }
            }
          }
        }
        .iconfont{
          margin-left: @24px;
          color: #ff6633;
          font-size: @38px;
          border-left: 1px solid @border;
          padding-left: @24px;
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
      button{
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
