<template>
  <div class="home-page">
    <div v-if="audit === 2 || audit === 4" class="organIndex">
      <div class="head">
        <img mode="aspectFill" v-if="organInfo.logo" :src="organInfo.fileHostName + organInfo.logo" alt="">
        <div>
          <div class="title">
            <h1>{{organInfo.nameSimple}}</h1>
            <i class="iconfont icon-v"></i>
          </div>
          <p class="info">{{organInfo.nameFull}}</p>
        </div>
      </div>
      <ul class="nums">
        <li>
          <span>{{stat.activityCount || 0}}</span>
          <p>已发布婚恋活动 (次)</p>
        </li>
        <li>
          <span>{{stat.matchmakerCount || 0}}</span>
          <p>红娘数量 (人)</p>
        </li>
      </ul>
      <ul class="menus" v-if="menus.length">
        <li v-for="(item, i) in menus" :key="i" @click="toUrl(item.url)">
          <m-badge :number='item.badge' v-if="item.badge"/>
          <i class="iconfont" :class="item.icon"></i>
          <h1>{{item.text}}</h1>
        </li>
      </ul>
      <ul class="lists" :class="audit === 4 ? 'adminList' : 'createrList'" :key="index">
        <m-cell v-for="(item, i) in lists"
        :title='item.title'
        :show='audit === 2 || item.admin === audit'
        @click="toUrl(item.url)"
        :icon="item.icon"
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
    <mNoData v-if="audit === 0" msg='你尚未入驻成为婚恋机构' btnText='申请入驻' @click="$router.replace('./creatOrgan')"></mNoData>
  </div>
</template>

<script>
import mNoData from '../../components/prompt/mNoData'
import mCell from '../../components/form/mCell'
import mBadge from '../../components/prompt/mBadge'
import { confirm } from '../../constant/popup'
import mPopup from '../../components/view/mPopup'
import {getOrganStatApi, getOrganIndexInfoApi, logOutOrganApi} from '../../api/love/index'

export default {
  data () {
    return {
      stat: {},
      audit: 0,
      organInfo: {},
      menus: [
        {
          text: '红娘',
          url: './matcher/list',
          icon: 'icon-yonghu',
          badge: ''
        },
        {
          text: '活动',
          icon: 'icon-fuli',
          url: './activity/list'
        }
      ],
      lists: [
        {
          title: '机构认证信息',
          icon: 'icon-jigou',
          color: '#ffb62f',
          url: './creatOrgan?edit=true',
          admin: 2
        },
        {
          title: '管理员',
          icon: 'icon-guanliyuan',
          color: '#dcac6e',
          url: 'admin',
          admin: 2
        },
        // 未开发
        //   {
        //     title: '机构转让',
        //     icon: 'icon-zhuanrang',
        //     color: '#44caea',
        //     url: './turnOrgan',
        //     prompt: '转让中'
        //   },
        {
          title: '机构注销',
          icon: 'icon-zhuxiao',
          color: '#b08eee',
          url: 'writeOff',
          admin: 2
        },
        {
          title: '使用手册',
          icon: 'icon-icon_manual',
          color: '#45cab6',
          url: '../common/help?module=婚恋机构-使用手册',
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
      wx.setNavigationBarTitle({ title: '婚恋机构 (管理员)' })
    }
  },
  onShow () {
    if (this.audit === 2 || this.audit === 4) {
      this.getOrganStat()
      this.getOrganInfo()
    }
  },
  methods: {
    getOrganStat () {
      getOrganStatApi().then(data => {
        this.stat = data
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
          wx.navigateTo({ url: `../common/admin?type=love` })
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
      align-items: center;
      padding: @25px @30px;
      padding-bottom: 0;
      img {
        width: @80px;
        height: @80px;
        border-radius: 100%;
        margin-right: @20px;
      }
      > div {
        height: @80px;
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
        }
      }
    }
    .nums{
      background: #fff;
      text-align: center;
      padding: @40px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: @20px;
      li{
        width: 50%;
        text-align: center;
        &:first-child{
          border-right: 1px solid #e1e1e1;
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
    .menus {
      background: #fff;
      margin-bottom: @20px;
      padding: 0 @32px;
      display: flex;
      align-items: center;
      > li {
        padding: @32px 0;
        flex: 1;
        text-align: center;
        position: relative;
        /deep/.point {
          position: absolute;
          left: calc(~'50% + ' @18px);
          top: 16%;
        }
        .iconfont {
          font-size: @86px;
          line-height: @86px;
          margin-bottom: @10px;
          &.icon-yonghu {
            color: #fd7359;
          }
          &.icon-fuli {
            color: #88bdff;
          }
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
          &:nth-child(2),&:nth-child(3), &:last-child{
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
