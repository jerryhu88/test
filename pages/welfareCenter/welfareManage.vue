<template>
  <div class="welfare">
    <div class="search">
      <input confirm-type='search' v-model="boonName" @confirm='firstPage' type="text" placeholder="请输入福利名称…">
      <i @click.stop="boonName = ''" v-if="boonName" class="iconfont icon-del"></i>
      <span @click="firstPage">搜索</span>
    </div>
    <div class="static">
      <div class="total">
        <span>{{statistics.pushBoonTotal || 0}}</span>
        <p>已发布福利券(张)</p>
      </div>
      <div class="middle">
        <div class="total" @click="toUrl('./ticketData?type=售出')">
          <span>{{statistics.saleBoonTotal || 0}}</span>
          <p>已售出福利券 (张)</p>
        </div>
        <i class="line"></i>
        <div class="total" @click="toUrl('./ticketData?type=核销')">
          <span>{{statistics.verificationBoonNum || 0}}</span>
          <p>已核销福利券 (张)</p>
        </div>
      </div>
      <button @click="toUrl('./creatTicket')">发布福利券</button>
    </div>
    <tab :tabs='tabs' v-model='queryType' @select="firstPage"/>
    <ul v-if="lists.length" class="lists">
      <ticket-panel @click="selectTic(item, i)" v-for="(item, i) in lists" :item='item' :key="i"/>
    </ul>
    <m-noData v-else-if="showNoData" msg='暂无福利券'/>
  </div>
</template>

<script>
import bus from '../../constant/bus'
import {confirm, toast} from '../../constant/popup'
import Tab from '../../components/view/tab'
import mButton from '../../components/form/mButton'
import TicketPanel from './components/TicketPanel'
import {getWelfareListsApi, getWelfareStaticApi, upWeflareApi, downWelfareApi, delWelfareApi} from '../../api/welfareCenter/index'
import mNoData from '../../components/prompt/mNoData'
import {mapGetters} from 'vuex'

export default {
  data () {
    return {
      showNoData: false,
      boonName: '',
      statistics: '',
      pages: {
        page: 1,
        pageSize: 10
      },
      // 状态（0未上架、1上架、2下架（3 未开始、4 抢购中、5已售罄、6 已过期、7审批中、8未通过
      menus: {
        0: ['查看编辑', '复制并发布', '上架', '名单管理'],
        2: ['查看详情', '查看编辑', '复制并发布', '上架', '名单管理'],
        3: ['查看详情', '查看编辑', '复制并发布', '名单管理'],
        4: ['查看详情', '查看编辑', '复制并发布', '名单管理', '下架'],
        6: ['查看详情', '查看编辑', '复制并发布', '名单管理', '删除'],
        8: ['重新编辑', '删除']
      },
      top: 0,
      code: '',
      tabs: [
        // {text: '全部', type: 0},
        {text: '在售', type: 1},
        {text: '审批中', type: 2},
        {text: '未通过', type: 3},
        {text: '已过期', type: 4},
        {text: '已下架', type: 5}
      ],
      queryType: 1,
      lists: [],
      hasNextPage: false
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    disabled () {
      return !(this.code !== '')
    }
  },
  watch: {
    boonName () {
      if (this.boonName === '') {
        this.firstPage()
      }
    }
  },
  components: {
    Tab, TicketPanel, mButton, mNoData
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
    wx.startPullDownRefresh()
    bus.$on('firstPage', data => {
      this.firstPage()
    })
  },
  methods: {
    firstPage () {
      this.pages.page = 1
      this.getStatic()
      this.getList()
    },
    getList () {
      this.pages.kv = {
        queryType: this.queryType,
        boonName: this.boonName
      }
      if (this.pages.page === 1) {
        this.lists = []
      }
      getWelfareListsApi(this.pages).then(data => {
        this.lists = [...this.lists, ...data.list]
        this.hasNextPage = data.hasNextPage
        // 停止下拉刷新
        wx.stopPullDownRefresh()
        this.showNoData = !data.total
      })
    },
    // 福利统计
    getStatic () {
      getWelfareStaticApi().then(data => {
        this.statistics = data
      })
    },
    selectTic (item, i) {
      if (item.putaway === 7) {
        return toast('none', '审批中，请耐心等待审核…')
      }
      let itemList = this.menus[item.putaway]
      // 管理员查看不是自己发布的券，只允许查看详情
      if (!this.userInfo.mallRoleType && item.createBy !== this.userInfo.businessUsersID) {
        itemList = ['查看详情', '名单管理']
      }
      let that = this
      wx.showActionSheet({
        itemList,
        success (data) {
          let menu = itemList[data.tapIndex]
          switch (menu) {
            case '查看详情':
              wx.navigateTo({
                url: `../common/h5Page?url=/welfareHome/welfare/list/${item.serviceID}&title=福利详情`
              })
              return
            case '查看编辑':
              wx.navigateTo({url: `./creatTicket?handelType=edit&serviceID=${item.serviceID}&putaway=${item.putaway}`})
              return
            case '复制并发布':
              wx.navigateTo({url: `./creatTicket?handelType=copy&serviceID=${item.serviceID}&putaway=${item.putaway}`})
              return
            case '名单管理':
              wx.navigateTo({url: `./nameList?type=saled&serviceID=${item.serviceID}`})
              return
            case '上架':
              upWeflareApi(item.serviceID).then(data => {
                that.firstPage()
                toast('success', '已上架')
              })
              return
            case '下架':
              downWelfareApi(item.serviceID).then(data => {
                that.firstPage()
                toast('success', '已下架')
              })
              return
            case '重新编辑':
              wx.navigateTo({url: `./creatTicket?handelType=copy&serviceID=${item.serviceID}&putaway=${item.putaway}`})
              return
            case '删除':
              confirm(
                '提示',
                '删除该福利无法撤回，确认删除吗？',
                '确定',
                () => {
                  delWelfareApi(item.serviceID).then(data => {
                    that.firstPage()
                    toast('none', '删除成功')
                  })
                }
              )
          }
        }
      })
    },
    toUrl (url) {
      wx.navigateTo({ url })
    }
  }
}
</script>

<style lang='less' scoped>
@import "../../assets/style/base.less";
.welfare{
  /deep/.noData{
    min-height: 50vh;
    image{
      margin-top: 0;
    }
  }
  background: #f8f8f8;
  min-height: 100vh;
  box-sizing: border-box;
  position: relative;
  .search{
    position: sticky;
    top: 0;
    width: 100%;
    background: #fff;
    padding: @24px;
    .flex-center;
    box-sizing: border-box;
    z-index: 10;
    input{
      flex: 1;
      margin-right: @24px;
      background: #f0f0f0;
      border-radius: @10px;
      padding: 0 @20px;
      box-sizing: border-box;
      font-size: @28px;
      height: @70px;
      line-height: @70px;
    }
    span{
      font-size: @28px;
      color: #333;
      &:active{
        background: #f8f8f8;
      }
    }
    .icon-del{
      position: absolute;
      right: @116px;
      font-size: @42px;
      color: #cdcdcd;
      z-index: 11;
    }
  }
  .static{
    background:#ffffff;
    padding: @32px 0 @42px;
    margin: @24px;
    border-radius: @12px;
    position:relative;
    .total{
      margin: 0 @48px;
      text-align: center;
      span{
        font-size:@50px;
        color:#222222;
        line-height:@72px;
        font-weight: bold;
        color: @red;
        margin-bottom: @20px;
      }
      p{
        font-size:@26px;
        color:#666;
        line-height:@24px;
      }
    }
    .middle{
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: @32px;
      .line{
        display: inline-block;
        background:#d8d8d8;
        width:@2px;
        height:@60px;
        position: relative;
        top: @8px;
      }
    }
    button{
      margin-top: @40px;
      border:1px solid @red;
      width:@360px;
      height:@72px;
      font-size:@28px;
      color:@red;
      line-height:@72px;
      background: #fff;
    }
  }
  /deep/.tabs{
    top: @100px;
    color: #666;
  }
  .lists{
    padding: @24px;
  }
}
</style>
