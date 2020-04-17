<template>
  <div class="adminList">
    <ul class="lists">
      <li class="list vux-1px-b" v-for="(item, i) in lists" :key='i' @click="toUrl(item)">
        <div class="uname">
          <img :src="item.avatar" alt="">
        </div>
        <div class="info">
          <h1 class="top">
            <span class="name">{{item.uname || item.nickname}}</span>
            <span class="phone">{{item.phone}}</span>
          </h1>
          <span v-if="item.roleType == 1" class="subbranch">创建者</span>
          <span v-else class="subbranch">{{item.simpleName}}管理员</span>
        </div>
        <h2><span v-if="!item.audit">(确认中)</span></h2>
        <i class="iconfont icon-you"></i>
      </li>
    </ul>
    <div class="btns">
      <button @click="$router.push(`./add?type=${type}`)">添加管理员</button>
    </div>
  </div>
</template>

<script>
import bus from '../../../constant/bus'
import {getOrgAdminApi} from '../../../api/welfareCenter/admin'
export default {
  data () {
    return {
      pages: {
        page: 1,
        pageSize: 10
      },
      hasNextPage: false,
      lists: [],
      serviceID: ''
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
  methods: {
    select (type) {
      this.firstPage()
    },
    firstPage () {
      this.pages.page = 1
      this.getList()
    },
    toUrl (item) {
      let url = `./detail?serviceID=${item.serviceID}`
      if (item.roleType) {
        url = '../../serviceIndex/setting?type=safety'
      }
      wx.navigateTo({url})
    },
    getList () {
      if (this.pages.page === 1) {
        this.lists = []
      }
      getOrgAdminApi(this.pages).then(data => {
        this.lists = [...this.lists, ...data.list]
        this.hasNextPage = data.hasNextPage
        // 停止下拉刷新
        wx.stopPullDownRefresh()
      })
    }
  },
  onLoad (options) {
    Object.assign(this.$data, this.$options.data())
    this.serviceID = options.serviceID
    wx.startPullDownRefresh()
    bus.$on('firstPage', data => {
      this.firstPage()
    })
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
    .lists{
      padding-bottom: @128px;
      .list{
        background: #fff;
        padding: @28px;
        font-size:@26px;
        color:#929292;
        line-height:@26px;
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
        .info{
          flex: 1;
          margin-right: @24px;
          .top{
            margin-bottom: @14px;
            font-size: @28px;
            color: #333;
            .name{
              .one-line;
              max-width: @220px;
            }
            .phone{
              margin-left: @24px;
            }
          }
          .bottom{
            .center-between;
          }
          .subbranch{
            .one-line;
            max-width: @420px;
            display: inline-block;
          }
        }
        h2{
          color: #2a2a2a;
          font-size: @28px;
          span{
            margin-right: @6px;
            font-size: @26px;
            color: @red;
          }
        }
        .icon-you{
          font-size: @24px;
          color: #999;
          margin-left: @6px;
        }
      }
    }
    .btns{
      position: fixed;
      bottom:0;
      left:0;
      width:100%;
      background-color: #fff;
      text-align: center;
      padding: @20px @30px;
      box-sizing: border-box;
    }
  }
</style>
