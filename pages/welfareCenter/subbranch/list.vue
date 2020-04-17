<template>
  <div class="subbranch" :class="{noCreater: !userInfo.mallRoleType}">
    <ul class="lists">
      <li v-for="(item, i) in lists" :key="i" @click="show(item)" class="list">
        <span class="name">{{item.orgSimpleName}} ({{item.simpleName}})</span>
        <span v-if="!item.openEndTime" class="complete">待完善</span>
        <span class="head" v-else-if="item.storeType === 1">总店</span>
        <i class="iconfont icon-you"></i>
      </li>
    </ul>
    <div class="btns" v-if="userInfo.mallRoleType">
      <p>注：本机构已有{{subbTotal}}个门店</p>
      <button radius='radius' @click="addStore">添加门店</button>
    </div>
  </div>
</template>

<script>
import bus from '../../../constant/bus'
import mButton from '../../../components/form/mButton'
import {confirm, toast} from '../../../constant/popup'
import {delSubbranchApi, getSubbranchApi} from '../../../api/welfareCenter/subbranch'
import {mapActions, mapGetters} from 'vuex'
export default {
  data () {
    return {
      lists: [],
      orgSimpleName: '',
      pages: {
        page: 1,
        pageSize: 10
      },
      hasNextPage: false,
      timer: null,
      creater: true,
      subbTotal: 0
    }
  },
  components: {
    mButton
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
  onLoad () {
    Object.assign(this.$data, this.$options.data())
    wx.startPullDownRefresh()
    bus.$on('firstPage', data => {
      this.firstPage()
    })
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    ...mapActions(['getSubbranch']),
    firstPage () {
      this.pages.page = 1
      this.getList()
    },
    addStore () {
      let firstItem = this.lists[0]
      if (!firstItem.openEndTime) {
        confirm(
          '提示',
          '请先完善总店信息再添加门店哦',
          '去完善',
          () => {
            this.$router.push(`./add?serviceID=${firstItem.serviceID}&orgSimpleName=${firstItem.orgSimpleName}`)
          }
        )
        return
      }
      this.$router.push(`./add?orgSimpleName=${firstItem.orgSimpleName}`)
    },
    getList () {
      getSubbranchApi(this.pages).then(data => {
        if (this.pages.page === 1) {
          this.lists = []
        }
        this.lists = [...this.lists, ...data.list]
        this.subbTotal = data.total
        this.hasNextPage = data.hasNextPage
        // 停止下拉刷新
        wx.stopPullDownRefresh()
      })
    },
    show (item) {
      let that = this
      let itemList = ['查看编辑', '删除']
      let editUrl = `./add?serviceID=${item.serviceID}&orgSimpleName=${item.orgSimpleName}`
      if (!this.userInfo.mallRoleType || item.storeType) {
        wx.navigateTo({url: editUrl})
        return
      }
      wx.showActionSheet({
        itemList,
        success (data) {
          if (!data.tapIndex) {
            wx.navigateTo({url: editUrl})
          } else {
            confirm(
              '提示',
              '删除该门店无法撤回，确认删除吗？(若该门店存在管理员，将同步删除)',
              '确定',
              () => {
                delSubbranchApi(item.serviceID).then(data => {
                  toast('success', '删除成功')
                  that.getSubbranch()
                })
              }
            )
          }
        }
      })
    }
  }
}
</script>

<style lang='less' scoped>
@import "../../../assets/style/base.less";
  .subbranch{
    background: #f8f8f8;
    box-sizing: border-box;
    height: 100vh;
    padding-bottom: @170px;
    &.noCreater{
      padding-bottom: 0;
    }
    .lists{
      .list{
        background: #fff;
        .flex-center;
        padding: @32px @26px;
        font-size:@30px;
        color:#222222;
        &:not(:last-child){
          border-bottom: @1px solid #e1e1e1;
        }
        &:active{
          background: #f8f8f8;
        }
        .name{
          flex: 1;
        }
        .complete{
          color: @red;
          font-size: @26px;
        }
        .iconfont,.head{
          margin-left: @6px;
          font-size: @24px;
          color: #bbb;
        }
        .head{
          color: #666;
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
      p{
        color: #929292;
        font-size: @26px;
        margin-bottom: @18px;
      }
    }
  }
</style>
