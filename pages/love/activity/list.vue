<template>
  <div class="welfare">
    <div class="search">
      <input confirm-type='search' v-model="activityName" @confirm='firstPage' type="text" placeholder="请输入活动名称…">
      <i @click.stop="activityName = ''" v-if="activityName" class="iconfont icon-del"></i>
      <span @click="firstPage">搜索</span>
    </div>
    <div class="static">
      <div class="total">
        <span>{{statistics.activityCount || 0}}</span>
        <p>已发布婚恋活动 (次)</p>
      </div>
      <div class="middle">
        <div class="total">
          <span>{{statistics.currentCount || 0}}</span>
          <p>已报名人数 (人)</p>
        </div>
        <i class="line"></i>
        <div class="total">
          <span>{{statistics.signCount || 0}}</span>
          <p>已签到人数 (人)</p>
        </div>
      </div>
      <m-button @click="toUrl('./creatActivity')">发布婚恋活动</m-button>
    </div>
    <tab :tabs='tabs' v-model='queryType' @select="firstPage"/>
    <ul v-if="lists.length" class="lists">
      <li class="activityPanel" @click="selectAct(item, i)" v-for="(item, i) in lists" :key="i">
        <h1>{{item.activityName}}</h1>
        <div class="activityInfo">
          <div class="img">
            <img mode='aspectFill' :src="item.pic"/>
            <p>{{item.status}}</p>
          </div>
          <div class="intro">
            <p>
              <label v-if="item.numCount">人数：<i>100/{{item.numCount}}人</i></label>
              <label v-else>人数：<i>男 {{item.manCurrent}}/{{item.manCount}}人、</i><i>女 {{item.womanCurrent}}/{{item.womanCount}}人</i></label>
            </p>
            <p>
              <label v-if="item.endManAge && item.endWomanAge">年龄：<i>男 {{item.startManAge}}-{{item.endManAge}}岁、</i><i>女 {{item.startWomanAge}}-{{item.endWomanAge}}岁</i></label>
              <label v-else-if="item.endManAge && !item.endWomanAge">年龄：<i>男 {{item.startManAge}}-{{item.endManAge}}岁、</i><i>女 无限制</i></label>
              <label v-else-if="!item.endManAge && item.endWomanAge">年龄：<i>男 无限制、</i><i>女 {{item.startWomanAge}}-{{item.endWomanAge}}岁</i></label>
              <label v-else>年龄：<i>无年龄限制</i></label>
            </p>
            <p class="time">报名时间：<i>{{item.entryStartTime}} 至 {{item.entryEndTime}}</i></p>
            <p class="time">活动时间：<i>{{item.startTime}} 至 {{item.endTime}}</i></p>
          </div>
        </div>
      </li>
    </ul>
    <m-noData v-else-if="showNoData" msg='暂无婚恋活动'/>
    <m-popup v-model="show" showNav title="签到二维码" confirmText='关闭' :radius='false'>
      <div class="qrcode">
        <h1>“{{current.activityName}}” 婚恋活动</h1>
        <p>活动时间：{{current.startTime}} 至 {{current.endTime}}</p>
        <img :src="'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + current.qrcode" alt="">
      </div>
    </m-popup>
  </div>
</template>

<script>
import {toast} from '../../../constant/popup'
import Tab from '../../../components/view/tab'
import mButton from '../../../components/form/mButton'
import {getActivityListsApi, getActivityStatApi} from '../../../api/love/index'
import mNoData from '../../../components/prompt/mNoData'
import {dateFilter} from '../../../constant/filters'
import mPopup from '@/components/view/mPopup'

export default {
  data () {
    return {
      showNoData: false,
      adminMenus: [],
      activityName: '',
      statistics: '',
      pages: {
        page: 1,
        pageSize: 10
      },
      menus: {
        '未开始': ['查看详情', '编辑活动', '评论管理'],
        '报名中': ['查看详情', '签到二维码', '名单管理', '评论管理'],
        '报名截止': ['查看详情', '签到二维码', '名单管理', '评论管理'],
        '活动中': ['查看详情', '签到二维码', '名单管理', '评论管理'],
        '已结束': ['查看详情', '签到二维码', '名单管理', '评论管理'],
        '未通过': ['重新发布']
      },
      top: 0,
      scrollTop: 1,
      code: '',
      tabs: [
        {text: '审批中', type: '审批中'},
        {text: '未开始', type: '未开始'},
        {text: '报名中', type: '报名中'},
        {text: '报名截止', type: '报名截止'},
        {text: '活动中', type: '活动中'},
        {text: '已结束', type: '已结束'},
        {text: '未通过', type: '未通过'}
      ],
      queryType: '审批中',
      lists: [],
      hasNextPage: false,
      timer: null,
      show: false,
      current: {}
    }
  },
  watch: {
    activityName () {
      if (this.activityName === '') {
        this.firstPage()
      }
    }
  },
  components: {
    Tab, mButton, mNoData, mPopup
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
    // 活动统计
  },
  onShow () {
    // 活动列表
    this.firstPage()
  },
  methods: {
    firstPage () {
      this.getStatic()
      this.pages.page = 1
      this.getList()
    },
    getList () {
      this.pages.kv = {
        status: this.queryType,
        activityName: this.activityName
      }
      if (this.pages.page === 1) {
        this.lists = []
      }
      getActivityListsApi(this.pages).then(data => {
        data.list.map(item => {
          item.pic = item.fileHostName + JSON.parse(item.pictures)[0].url
          item.entryStartTime = dateFilter(item.entryStartTime, 'simpleTime')
          item.entryEndTime = dateFilter(item.entryEndTime, 'simpleTime')
          item.startTime = dateFilter(item.startTime, 'simpleTime')
          item.endTime = dateFilter(item.endTime, 'simpleTime')
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
      getActivityStatApi().then(data => {
        this.statistics = data
      })
    },
    confirm ({tapIndex}) {
      let i = tapIndex
      if (i === 0) {
        this.toUrl('../creatTicket?type=edit')
      } else if (i === 1) {
        this.toUrl('../creatTicket?type=copy')
      } else if (i === 2) {
        this.toUrl('../listManage')
      }
    },
    selectAct (item, i) {
      let that = this
      let itemList = that.menus[item.status]
      if (item.status === '审批中') {
        return toast('none', '审批中，请耐心等待审核···')
      }
      if (!that.menus[item.status]) return
      wx.showActionSheet({
        itemList,
        success (data) {
          switch (itemList[data.tapIndex]) {
            case '查看详情':
              wx.navigateTo({
                url: `../../common/h5Page?url=/love/activity/${item.serviceID}&title=婚恋活动`
              })
              return
            case '编辑':
              wx.navigateTo({url: `./creatActivity?serviceID=${item.serviceID}`})
              return
            case '签到二维码':
              that.current = item
              that.show = true
              return
            case '评论管理':
              wx.navigateTo({url: `../../common/comment?type=love&serviceID=${item.serviceID}&title=${item.activityName}`})
              return
            case '名单管理':
              wx.navigateTo({url: `./nameList?type=saled&serviceID=${item.serviceID}`})
              return
            case '重新发布':
              wx.navigateTo({url: `./creatActivity?serviceID=${item.serviceID}`})
          }
        }
      })
    },
    toUrl (url) {
      wx.navigateTo({ url })
    }
  },
  destroyed () {
    clearInterval(this.timer)
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
    border-radius: @24px;
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
    /deep/button{
      margin-top: @40px;
      border:1px solid @red;
      border-radius:@100px;
      width:@400px;
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
          width:@218px;
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
