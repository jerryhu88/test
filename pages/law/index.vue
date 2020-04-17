<template>
  <div class="home-page">
    <div v-if="audit === 2 || audit === 4" class="organIndex">
      <div class="head">
        <img mode="aspectFill" v-if="organInfo.logo" :src="organInfo.fileHostName + organInfo.logo" alt="">
        <div>
          <div class="title">
            <h1>{{organInfo.simpleName}}</h1>
            <i class="iconfont icon-v"></i>
          </div>
          <p class="info">{{organInfo.fullName}}</p>
        </div>
      </div>
      <ul class="nums">
        <li>
          <span>{{organInfo.lawerCount || 0}}</span>
          <p>律师人数 (人)</p>
        </li>
        <li>
          <span>{{organInfo.caseCount || 0}}</span>
          <p>受理案件数 (件)</p>
        </li>
      </ul>
      <!-- <m-cell title='我的案件' @click="$router.push('./myCase/list')" prompt='全部案件'/> -->
      <ul class="menus" v-if="menus.length">
        <li v-for="(item, i) in menus" :key="i" @click="toUrl(item.url)">
          <m-badge :number='item.badge' v-if="item.badge"/>
          <img :src="item.img" alt="">
          <h1>{{item.text}}</h1>
        </li>
      </ul>
      <ul class="lists" :class="audit === 4 ? 'adminList' : 'createrList'" :key="index">
        <m-cell v-for="(item, i) in lists"
        :title='item.title'
        :show='audit === 2 || item.admin === audit'
        @click="toUrl(item.url)"
        :icon="item.icon"
        :img="item.img"
        :color='item.color'
        :star='item.star'
        :prompt='item.prompt'
        :key="i"/>
      </ul>
    </div>
    <!-- 审批中机构 -->
    <div v-if="audit === 1" class="audit">
      <img class="bg" src="../../assets/images/audit.png">
      <p>机构审批中，请您耐心等待…</p>
    </div>
    <!-- 没有机构 -->
    <mNoData v-if="audit === 0" msg='你尚未入驻法律机构' btnText='申请入驻' @click="$router.replace('./creatOrgan')"></mNoData>
  </div>
</template>

<script>
import mNoData from '../../components/prompt/mNoData'
import mCell from '../../components/form/mCell'
import mBadge from '../../components/prompt/mBadge'
import { confirm } from '../../constant/popup'
import mPopup from '../../components/view/mPopup'
import {getAdminStatApi, getOrganIndexInfoApi, logOutOrganApi} from '../../api/law/index'

export default {
  data () {
    return {
      audit: 0,
      organInfo: {},
      menus: [
        {
          text: '待受理',
          url: './myCase/list?status=1',
          img: require('../../assets/images/tobeing.png'),
          badge: ''
        },
        {
          text: '受理中',
          img: require('../../assets/images/doing.png'),
          url: './myCase/list?status=2'
        },
        {
          text: '已结案',
          img: require('../../assets/images/over.png'),
          url: './myCase/list?status=3'
        },
        {
          text: '已拒绝',
          img: require('../../assets/images/reject.png'),
          url: './myCase/list?status=5'
        }
      ],
      lists: [
        {
          title: '个人简介',
          img: require('../../assets/images/myInfo.png'),
          url: './myInfo',
          admin: 4
        },
        {
          title: '机构签约律师',
          img: require('../../assets/images/lawer.png'),
          url: 'admin',
          admin: 2
        },
        {
          title: '机构全部案件',
          img: require('../../assets/images/allCase.png'),
          url: './myCase/list?all=true',
          admin: 2
        },
        {
          title: '机构认证信息',
          img: require('../../assets/images/organInfo.png'),
          url: './creatOrgan?edit=true',
          admin: 2
        },
        // 未开发
        //   {
        //     title: '机构转让',
        //     icon: 'icon-zhuanrang',
        //     url: './turnOrgan',
        //     prompt: '转让中'
        //   },
        // {
        //   title: '机构注销',
        //   img: require('../../assets/images/logout.png'),
        //   url: 'writeOff',
        //   admin: 2
        // },
        {
          title: '使用手册',
          img: require('../../assets/images/help.png'),
          url: '../common/help?module=法律机构-使用手册',
          admin: 4
        }
      ]
    }
  },
  components: {
    mNoData,
    mCell,
    mBadge,
    mPopup
  },
  onLoad (options) {
    Object.assign(this.$data, this.$options.data())
    this.audit = Number(options.audit)
    if (this.audit === 4) {
      wx.setNavigationBarTitle({ title: '法律机构 (签约律师)' })
    }
  },
  onShow () {
    if (this.audit === 2 || this.audit === 4) {
      this.getAdminStat()
      this.getOrganInfo()
    }
  },
  methods: {
    getAdminStat () {
      getAdminStatApi().then(data => {
        this.menus[0].badge = data.toBeCount
        this.menus[1].badge = data.doingCount
        this.menus[2].badge = data.overCount
        this.menus[3].badge = data.refuseCount
        this.lists[0].prompt = ''
        if (!data.perfect) {
          this.lists[0].prompt = '请先完善个人简介'
        }
      })
    },
    getOrganInfo () {
      getOrganIndexInfoApi().then(data => {
        this.organInfo = data
      })
    },
    toUrl (url) {
      switch (url) {
        case 'turn':
          wx.showShareMenu({
            withShareTicket: true
          })
          return
        case 'admin':
          wx.navigateTo({ url: `../common/admin?type=law` })
          return
        case 'writeOff':
          confirm('提示', '注销机构后无法撤销，确认注销吗？', '确定', () => {
            logOutOrganApi().then(data => {
              wx.reLaunch({ url: '../serviceIndex/index' })
            })
          })
          return
        default:
          wx.navigateTo({ url })
      }
    }
  }
}
</script>

<style lang='less' scoped>
@import '../../../src/assets/style/base.less';
.home-page {
  .audit {
    background: #f8f8f8;
    box-sizing: border-box;
    height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    img {
      margin-top: -@200px;
      width: @272px;
      height: @272px;
    }
    p {
      margin-top: @52px;
      font-size: @30px;
      color: #666666;
      line-height: @30px;
    }
  }
  .organIndex {
    background: #f8f8f8;
    overflow: hidden;
    min-height: 100vh;
    .head {
      background: #fff;
      display: flex;
      padding: @25px @30px;
      padding-bottom: 0;
      img {
        width: @80px;
        height: @80px;
        border-radius: 100%;
        margin-right: @20px;
      }
      > div {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;
        .title {
          font-size: @32px;
          color: #222222;
          .flex-center;
          .iconfont {
            font-size: @36px;
            color: #ffd161;
            margin-left: @8px;
            position: relative;
            top: @2px;
            flex: 1;
          }
          .percent {
            border-radius: @100px;
            border: 1px solid;
            font-size: @22px;
            color: @red;
            padding: @4px @12px @2px;
          }
        }
        p {
          font-size: @26px;
          color: #aaaaaa;
          line-height: 1.3;
        }
      }
    }
    .nums{
      background: #fff;
      text-align: center;
      padding: @40px 0 @26px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      li{
        width: 50%;
        text-align: center;
        background: #fafafa;
        border-radius: @6px;
        margin: 0 @34px;
        padding: @20px 0;
        &:first-child{
          margin-right: @14px;
        }
        &:last-child{
          margin-left: @14px;
        }
        span{
          font-size: @50px;
          color: @red;
          font-weight: bold;
        }
        p{
          font-size: @26px;
          color: #666;
          margin-bottom: @4px;
        }
      }
    }
    /deep/.nums+li{
      background: #fff;
      .text-wrap{
        padding: @16px @34px @16px @34px;
        border-bottom: 0;
      }
    }
    .menus {
      background: #fff;
      margin-bottom: @20px;
      // padding: 0 @32px;
      display: flex;
      align-items: center;
      > li {
        padding: @16px 0 @32px 0;
        flex: 1;
        text-align: center;
        position: relative;
        /deep/.point {
          position: absolute;
          left: calc(~'50% + ' @15px);
          top: 6%;
        }
        img{
          margin-bottom: @10px;
          width: @76px;
          height: @76px;
          border-radius: 50%;
        }
        h1 {
          font-size: @26px;
          color: #666666;
          line-height: @26px;
        }
      }
    }
    .lists {
      background: #f8f8f8;
      &.createrList{
        /deep/.cell {
          background: #fff;
          &:nth-child(4), &:last-child{
            margin-bottom: @20px;
            .text-wrap{
              border-bottom: 0;
            }
          }
        }
      }
      &.adminList{
        /deep/.cell {
          background: #fff;
          &:last-child{
            margin-bottom: @20px;
            .text-wrap{
              border-bottom: 0;
            }
          }
        }
      }
    }
  }
}
</style>
