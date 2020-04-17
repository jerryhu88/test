<template>
  <div class="welfare">
    <div class="search">
      <input confirm-type='search' v-model="title" @confirm='firstPage' type="text" placeholder="请输入活动名称…">
      <i @click.stop="title = ''" v-if="title" class="iconfont icon-del"></i>
      <span @click="firstPage">搜索</span>
    </div>
    <div class="static">
      <div class="total">
        <span>{{statistics.activityTotal || 0}}</span>
        <p>已发布兴趣活动 (次)</p>
      </div>
      <div class="middle">
        <div class="total">
          <span>{{statistics.applyCount || 0}}</span>
          <p>已报名人数 (人)</p>
        </div>
        <i class="line"></i>
        <div class="total">
          <span>{{statistics.signCount || 0}}</span>
          <p>已签到人数 (人)</p>
        </div>
      </div>
      <button @click="toUrl('./creatActivity')">发布兴趣活动</button>
    </div>
    <tab :tabs='tabs' v-model='queryType' @select="firstPage"/>
    <ul v-if="lists.length" class="lists">
      <li class="activityPanel" @click="selectAct(item, i)" v-for="(item, i) in lists" :key="i">
        <h1>{{item.title}}</h1>
        <div class="activityInfo">
          <div class="img">
            <img mode='aspectFill' lazy-load	:src="item.pictures[0].fileHostName + item.pictures[0].url"/>
            <p>{{tabs[queryType - 1].text}}</p>
          </div>
          <div class="intro">
            <p>
              <label>报名人数：<i>{{item.applyCount || 0}}/{{item.applyTotal}}人</i></label>
            </p>
            <p class="time">报名时间：<i>{{item.applyStartTime}} 至 {{item.applyEndTime}}</i></p>
            <p class="time">活动时间：<i>{{item.activityStartTime}} 至 {{item.activityEndTime}}</i></p>
          </div>
        </div>
      </li>
    </ul>
    <m-noData v-else-if="showNoData" msg='暂无兴趣活动'/>
    <m-popup v-model="show" showNav title="签到二维码" confirmText='关闭' :radius='false'>
      <div class="qrcode">
        <h1>“{{current.title}}” 兴趣活动</h1>
        <p>活动时间：{{current.activityStartTime}} 至 {{current.activityEndTime}}</p>
        <img :src="'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + current.qrcode" alt="">
      </div>
    </m-popup>
  </div>
</template>

<script>
import {toast} from '../../../constant/popup'
import Tab from '../../../components/view/tab'
import mButton from '../../../components/form/mButton'
import {getActivityListApi, getGroupStatApi} from '../../../api/interest/index'
import mNoData from '../../../components/prompt/mNoData'
import {dateFilter} from '../../../constant/filters'
import mPopup from '@/components/view/mPopup'

export default {
  data () {
    return {
      showNoData: false,
      adminMenus: [],
      title: '',
      statistics: '',
      pages: {
        page: 1,
        pageSize: 10
      },
      menus: {
        2: ['查看详情', '编辑活动', '评论管理'],
        3: ['查看详情', '签到二维码', '名单管理', '评论管理'],
        4: ['查看详情', '签到二维码', '名单管理', '评论管理'],
        5: ['查看详情', '签到二维码', '名单管理', '评论管理'],
        6: ['查看详情', '签到二维码', '名单管理', '评论管理'],
        7: ['重新发布']
      },
      top: 0,
      scrollTop: 1,
      code: '',
      tabs: [
        {text: '审批中', type: 1},
        {text: '未开始', type: 2},
        {text: '报名中', type: 3},
        {text: '报名截止', type: 4},
        {text: '活动中', type: 5},
        {text: '已结束', type: 6},
        {text: '未通过', type: 7}
      ],
      queryType: 1,
      lists: [],
      hasNextPage: false,
      show: false,
      current: {}
    }
  },
  watch: {
    title () {
      if (this.title === '') {
        this.firstPage()
      }
    }
  },
  components: {
    Tab, mButton, mNoData, mPopup
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
  },
  methods: {
    firstPage () {
      this.getStatic()
      this.pages.page = 1
      this.getList()
    },
    getList () {
      this.pages.kv = {
        queryType: this.queryType,
        title: this.title
      }
      if (this.pages.page === 1) {
        this.lists = []
      }
      getActivityListApi(this.pages).then(data => {
        data.list.map(item => {
          item.applyStartTime = dateFilter(item.applyStartTime, 'simpleTime')
          item.applyEndTime = dateFilter(item.applyEndTime, 'simpleTime')
          item.activityStartTime = dateFilter(item.activityStartTime, 'simpleTime')
          item.activityEndTime = dateFilter(item.activityEndTime, 'simpleTime')
        })
        this.lists = [...this.lists, ...data.list]
        this.hasNextPage = data.hasNextPage
        // 停止下拉刷新
        wx.stopPullDownRefresh()
        this.showNoData = !data.total
      })
    },
    // 活动统计
    getStatic () {
      getGroupStatApi().then(data => {
        this.statistics = data
      })
    },
    selectAct (item, i) {
      let that = this
      let itemList = that.menus[this.queryType]
      if (this.queryType === 1) {
        return toast('none', '审批中，请耐心等待审核···')
      }
      if (!that.menus[this.queryType]) return
      wx.showActionSheet({
        itemList,
        success (data) {
          switch (itemList[data.tapIndex]) {
            case '查看详情':
              wx.navigateTo({
                url: `../../common/h5Page?url=/interest/activity/detail/${item.serviceID}&title=兴趣活动`
              })
              return
            case '编辑活动':
              wx.navigateTo({url: `./creatActivity?serviceID=${item.serviceID}&edit=true`})
              return
            case '签到二维码':
              that.current = item
              that.show = true
              return
            case '评论管理':
              wx.navigateTo({url: `../../common/comment?type=love&serviceID=${item.serviceID}&title=${item.title}&type=interest`})
              return
            case '名单管理':
              wx.navigateTo({url: `../nameList?serviceID=${item.serviceID}`})
              return
            case '重新发布':
              wx.navigateTo({url: `./creatActivity?serviceID=${item.serviceID}&copy=true`})
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
@import "../../../assets/style/base.less";
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
      border-radius: @100px;
      padding: 0 @20px;
      box-sizing: border-box;
      font-size: @28px;
      height: @70px;
      line-height: @70px;
      border-radius: @10px;
    }
    span{
      font-size: @28px;
      color: #333;
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
    padding: @32px 0 @36px;
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
    li{
      font-size: @26px;
      padding: 0 @10px;
    }
  }
  .lists{
    .activityPanel{
      &:not(:last-child){
        border-bottom: 1px solid #e1e1e1;
      }
      padding: @28px @24px;
      background: #fff;
      i{
        display: inline;
      }
      h1{
        font-size:@30px;
        color:#333;
        line-height:@36px;
        width: 100%;
        font-weight: bold;
        .one-line;
        margin-bottom: @20px;
      }
      .activityInfo{
        display: flex;
        .img{
          &.grayImg{
            -webkit-filter: grayscale(1); /* Webkit */
            filter: gray; /* IE6-9 */
            filter: grayscale(1); /* W3C */
          }
          p{
            width: 100%;
            position: absolute;
            bottom: 0;
            background: rgba(0,0,0,0.6);
            text-align: center;
            font-size:@20px;
            color:#ffffff;
            line-height:@18px;
            padding: @8px 0;
            border-bottom-left-radius: @6px;
            border-bottom-right-radius: @6px;
          }
          margin-right: @22px;
          position: relative;
        }
        .img, .img>img{
          border-radius:@6px;
          width:@210px;
          height:@152px;
        }
        .intro{
          width: 100%;
          font-size:@26px;
          color:#aaaaaa;
          line-height:@26px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: @8px 0;
          p{
            display: flex;
            align-items: center;
            label{
              flex: 1;
            }
            i{
              color: #333;
            }
            .state{
              width: @130px;
              height: @34px;
              line-height: @36px;
              color: #fff;
              text-align: center;
              border-radius: @100px;
              font-size: @22px;
              background: #ccc;
            }
          }
        }
      }
    }
  }
  .qrcode{
    text-align: center;
    background: #fff;
    width: 100%;
    padding: @40px 0 @100px 0;
    h1{
      font-size: @30px;
      color: #000;
    }
    p{
      font-size: @26px;
      color: #999;
      margin: @20px 0 @30px 0;
    }
    img{
      width: @400px;
      height: @400px;
      border: 1px solid #e1e1e1;
      border-radius: @10px;
    }
  }
}
</style>
