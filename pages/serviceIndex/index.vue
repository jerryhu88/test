<template>
  <div class="home-page">
    <nav :style="{'paddingTop':top,'lineHeight': height,height}">南充工会服务</nav>
    <img src="../../assets/images/bg.png" class="bg">
    <div class="personInfo" @click="$router.push('./setting?type=baseinfo')">
      <img mode="aspectFill" v-if="userInfo.avatar" class="head" :src="userInfo.avatar" alt="">
      <img v-else mode="aspectFill" class="head" src=".././../assets/images/default.png" alt="">
      <div class="info" v-show="loadingSuccess">
        <h1 v-if="!isLogin">你好，请登录</h1>
        <h1 v-else>{{userInfo.nickname || userInfo.uname}}</h1>
        <span v-if="isLogin" class="edit">
          <p>{{userInfo.nickname ? '个人资料' : '同步资料'}}</p>
          <i class="iconfont icon-you"></i>
        </span>
      </div>
    </div>
    <div class="work">
      <div @click="$router.push(`./msgCenter`)">
        <!-- 未开发 -->
        <m-badge :number='msgNum.msgCount'/>
        <i class="iconfont icon-icon_msg"></i>
        <span>消息中心</span>
      </div>
      <div @click="$router.push(`./todolist`)">
        <!-- 未开发 -->
        <m-badge :number='msgNum.backLogCount'/>
        <i class="iconfont icon-icon_todolist"></i>
        <span>待办事项</span>
      </div>
    </div>
    <div class="menus">
      <p class="desc">请选择你要管理的普惠模块</p>
      <ul>
        <li v-for="(item, i) in menus" :key="i" @click="toUrl(item.url)">
          <i class="iconfont" :class="item.icon"></i>
          <h1>{{item.text}}</h1>
        </li>
      </ul>
    </div>
    <ul class="lists">
      <m-cell v-for="(item, i) in lists"
      :title='item.title'
      :color='item.color'
      @click="toUrl(item.url)"
      :icon="`/organ/${item.icon}`"
      :prompt='item.prompt'
      :key="i"/>
    </ul>
    <div class="loginMask" v-if="!isLogin" @click="loginMask"></div>
  </div>
</template>

<script>
import mCell from '../../components/form/mCell'
import {confirm} from '../../constant/popup'
import {getLawStatusApi, getOrganStatusApi, getLoveStatusApi, getMsgNumApi, getGroupStatusApi} from '../../api/serviceIndex/index'
import mBadge from '../../components/prompt/mBadge'
import {mapGetters, mapMutations, mapActions} from 'vuex'

export default {
  data () {
    return {
      loadingSuccess: false,
      isLogin: false,
      msgNum: {},
      JSESSIONID: '',
      height: '',
      top: '',
      loading: false,
      menus: [
        {
          text: '商家机构',
          type: 'welfare',
          icon: 'icon-icon-puhui',
          url: 'welfare'
          // url: '../../welfareCenter/index?audit=2'
          // url: '../../welfareCenter/creatOrgan?edit=true'
        },
        {
          text: '兴趣机构',
          icon: 'icon-icon_interest',
          url: 'interest'
        },
        {
          text: '法律机构',
          icon: 'icon-law',
          url: 'law'
        }
        // {
        //   text: '婚恋机构',
        //   icon: 'icon-icon_marriagelove',
        //   url: 'love'
        // },
        // {
        //   text: '婚恋机构',
        //   icon: 'icon-icon_marriagelove',
        //   url: 'love'
        // },
        // {
        //   text: '法律机构',
        //   icon: 'icon-law',
        //   url: 'law'
        // }
        // 未开发
        // {
        //   text: '健身机构',
        //   icon: 'icon-icon_bodybuilding',
        //   url: '../subbranch/list'
        // }
      ],
      lists: [
        // {
        //   title: '商家钱包',
        //   icon: 'icon-icon_wallet',
        //   color: '#ef9d54',
        //   url: './wallet',
        //   prompt: '￥ 5000.00'
        // },
        {
          title: '安全中心',
          icon: 'icon-icon_safetycenter',
          color: '#5cb0ff',
          url: './setting?type=safety'
        },
        // 未开发
        {
          title: '使用手册',
          icon: 'icon-icon_manual',
          color: '#45cab6',
          url: './../common/help?module=机构服务平台-使用手册'
        }
        // {
        //   title: '切换账号',
        //   color: '#ff736c',
        //   icon: 'icon-turn',
        //   url: 'turn'
        // }
      ]
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    phone () {
      let phone = this.userInfo.phone
      if (phone) {
        return phone.slice(0, 3) + '******' + phone.slice(9, 11)
      }
    }
  },
  components: {
    mCell, mBadge
  },
  onShareAppMessage () {
    return {
      title: `${this.userInfo.uname}邀请你使用南充工会服务小程序`, // 转发后 所显示的title
      path: '/pages/serviceIndex/index', // 相对的路径
      imageUrl: '/static/welcome.png'
    }
  },
  onPullDownRefresh () {
    if (!this.isLogin) {
      // 停止下拉刷新
      wx.stopPullDownRefresh()
      return
    }
    this.getMsgNum()
  },
  onLoad (options) {
    Object.assign(this.$data, this.$options.data())
    let bound = wx.getMenuButtonBoundingClientRect()
    this.height = bound.height + 'px'
    this.top = bound.top + 'px'
  },
  onShow () {
    // 初始化时userInfo为空对象，加个弹窗防止用户焦虑
    if (!Object.keys(this.userInfo).length) {
      wx.showLoading({
        title: '正在加载',
        mask: true
      })
    }
    this.$store.dispatch('getMine').then(data => {
      this.isLogin = Boolean(data.serviceID)
      this.loadingSuccess = true
      if (this.isLogin) {
        this.getMsgNum()
      } else {
        wx.hideLoading()
      }
    })
  },
  methods: {
    ...mapMutations(['saveInfo']),
    ...mapActions(['getMine']),
    toUrl (url) {
      function turnUrl (url, data, groupType) {
        // 0 无机构， 1 审批中， 2 创建者有机构， 3 管理员待确认，4 管理员有机构
        if (data === 3) {
          confirm(
            '提示',
            '你有待确认的管理员事项',
            '去查看',
            () => {
              wx.navigateTo({url: `./todolist`})
            }
          )
        } else {
          wx.navigateTo({url: `../${url}/index?audit=${data}${groupType ? `&&groupType=${groupType}` : ''}`})
        }
      }
      if (!this.userInfo.uname) {
        confirm(
          '提示',
          '请先同步个人信息再操作',
          '去同步',
          () => {
            wx.navigateTo({url: `./setting?type=baseinfo`})
          }
        )
        return
      }
      switch (url) {
        // 普惠商城
        case 'welfare':
          getOrganStatusApi().then(data => {
            turnUrl('welfareCenter', data)
          })
          return
        // 兴趣机构
        case 'interest':
          let itemList = ['个人兴趣小组', '机构兴趣小组']
          let that = this
          wx.showActionSheet({
            itemList,
            success (data) {
              let menu = itemList[data.tapIndex]
              switch (menu) {
                case '个人兴趣小组':
                  getGroupStatusApi(1).then(data => {
                    that.saveInfo({groupType: 1})
                    turnUrl('interest', data, 1)
                  })
                  return
                case '机构兴趣小组':
                  getGroupStatusApi(2).then(data => {
                    that.saveInfo({groupType: 2})
                    turnUrl('interest', data, 2)
                  })
              }
            }
          })
          return
        case 'love':
          // 婚恋机构
          getLoveStatusApi().then(data => {
            turnUrl('love', data)
          })
          return
        case 'law':
          // 法律机构
          getLawStatusApi().then(data => {
            turnUrl('law', data)
          })
          return
      }
      wx.navigateTo({ url })
    },
    loginMask () {
      if (!this.loadingSuccess) return
      this.$router.push('../account/login')
    },
    getMsgNum () {
      getMsgNumApi().then(data => {
        this.msgNum = data
      }).finally(() => {
        wx.hideLoading()
        // 停止下拉刷新
        wx.stopPullDownRefresh()
      })
    }
  }
}
</script>

<style lang='less' scoped>
@import "../../assets/style/base.less";
.home-page{
  min-height: 100vh;
  position: relative;
  background: #f8f8f8;
  .bg{
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    height: @418px;
  }
  nav{
    text-align:center;
    color: #fff;
    position:relative;
    font-weight:bold;
    font-size: @35px;
    z-index: 2;
  }
  .personInfo{
    position:relative;
    color:#ffffff;
    padding: @36px @60px;
    .flex-center;
    .head{
      background: #fff;
      border:@4px solid #ffffff;
      width:@128px;
      height:@128px;
      border-radius:100%;
      box-sizing: border-box;
      margin-right: @20px;
    }
    .icon-organ{
      border:@4px solid #ffffff;
      width:@128px;
      height:@128px;
      line-height: @128px;
      text-align: center;
      background: #fff;
      border-radius:100%;
      box-sizing: border-box;
      margin-right: @20px;
      font-size: @82px;
      color: #bbb;
    }
    .info{
      h1{
        font-size:@36px;
        font-weight: bold;
      }
      .edit{
        margin-top: @12px;
        width: fit-content;
        display: flex;
        .icon-you{
          font-size: @24px;
          position: relative;
          top: @8px;
          line-height: @24px;
        }
        &:active{
          background: rgba(0, 0, 0, 0.1);
        }
        >p{
          font-size:@26px;
        }
      }
    }
  }
  .work{
    margin: 0 @30px @20px;
    padding: @32px 0;
    position:relative;
    box-shadow:0 @3px @14px 0 rgba(220,220,220,0.09);
    border-radius:@10px;
    background: #fff;
    .center-around;
    text-align: center;
    >div{
      position: relative;
       /deep/.point{
          position: absolute;
          left: calc(~'50% + '@14px);
          top:  calc(~'20% - '@28px);
        } 
      .iconfont{
        margin-bottom: -@12px;
        font-size: @60px;
        &.icon-icon_msg{
          color: #5bcaa7;
        }
        &.icon-icon_todolist{
          color: #deb742;
        }
      }
      span{
        font-size: @26px;
        color: #333;
      }
    }
  }
  .menus{
    position:relative;
    box-shadow:0 @3px @14px 0 rgba(220,220,220,0.09);
    border-radius:@10px;
    margin: 0 @30px @20px;
    padding: @32px 0;
    background: #fff;
    // 机构福利核销/支付二维码
    .desc{
      font-size:@30px;
      color:#666666;
      margin: 0 @42px @12px;
    }
    ul{
      display: flex;
      align-items: center;
      >li{
        text-align: center;
        position: relative;
        width: 25%;
        /deep/.point{
          position: absolute;
          left: calc(~'50% + '@14px);
          top:  calc(~'20% - '@16px);
        }
        .iconfont{
          font-size: @100px;
          margin-bottom: @10px;
          &.icon-icon-puhui{
            color: #ff9987;
          }
          &.icon-icon_interest{
            color: #ffb15f;
          }
          &.icon-icon_bodybuilding{
            color: #b7aaff;
          }
          &.icon-icon_marriagelove{
            color: #ff7ab5;
          }
          &.icon-law{
            color: #88bdff;
          }
        }
        h1{
          font-size:@26px;
          color:#000;
          line-height:@26px;
        }
      }
    }
  }
  .lists{
    background: #f8f8f8;
    overflow: hidden;
    /deep/li{
      background: #fff;
      &:last-child .text-wrap{
        border-bottom: 0;
      }
      &:nth-child(3),&:last-child{
        // margin-bottom: @20px;
        .text-wrap{
          border-bottom: 0;
        }
      }
      // &:nth-child(2) .img > img{
      //   height: @32px;
      // }
      // &:nth-child(3) .img > img{
      //   width: @34px;
      // }
      // &:nth-child(7) .img > img{
      //   width: @32px;
      // }
    }
  }
  .loginMask{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: @300px;
  }
}
</style>
