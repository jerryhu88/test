<template>
  <div class="login">
    <!-- <i class="iconfont icon-organ"></i> -->
    <img class="logo" src="../../assets/images/logo.jpg" alt="">
    <h1>南充工会服务</h1>
    <div class="form">
      <div class="input">
        <input v-model="phone" type="text" placeholder="输入手机号" maxlength="11">
        <button v-if="phone.length === 11" @click="setTimer" class="sendMsg" :disabled='countDown'>{{countDown ? time + 's' : '发送验证码'}}</button>
        <button v-else class="sendMsg" disabled>发送验证码</button>
      </div>
      <div class="input">
        <input v-model="verifyCode" type="text" placeholder="请输入短信验证码" maxlength="6">
      </div>
      <button class="loginBtn" @click="phoneLogin" :disabled='!(phone.length === 11 && verifyCode.length === 6)'>登录</button>
    </div>
    <footer>登录即代表您已阅读并同意<navigator url="../../common/article?type=agreement">《服务条款》</navigator></footer>
    <m-popup ref='popup' position='center' v-model="show">
      <div class="popup-content">
        <p>检测到该账号在新微信号上登录，请选择登录方式：</p>
        <button @click="phoneLogin()">永久授权</button>
        <button @click="phoneLogin()" class="shortTime">临时登录</button>
        <p>提示：永久授权后，此微信号将与该手机号绑定，作为平台登录凭证</p>
      </div>
    </m-popup>
    <dept-popup v-model="showDept" :depts='depts'/>
  </div>
</template>

<script>
import {phoneLoginApi, sendPhoneApi} from '../../api/account/index'
import mPopup from '../../components/view/mPopup'
import deptPopup from './components/deptPopup'
import {mapGetters} from 'vuex'

export default {
  data () {
    return {
      depts: [],
      showDept: false,
      countDown: false,
      time: 10,
      show: false,
      timer: null,
      phone: '',
      verifyCode: ''
    }
  },
  components: {
    mPopup, deptPopup
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    setTimer () {
      sendPhoneApi({phone: this.phone}).then(data => {
        if (!data.endTime) {
          this.depts = data
          this.showDept = true
          return
        }
        if (this.countDown) return
        this.countDown = true
        this.time = (data.endTime - data.startTime) / 1000
        this.timer = setInterval(() => {
          this.time--
          if (!this.time) {
            this.countDown = false
            clearInterval(this.timer)
          }
        }, 1000)
      })
      // if (this.countDown) return
      // this.countDown = true
      // this.timer = setInterval(() => {
      //   this.time--
      //   if (this.time === 0) {
      //     clearInterval(this.timer)
      //     this.time = 10
      //     this.countDown = false
      //   }
      // }, 1000)
    },
    phoneLogin () {
      // this.show = true
      phoneLoginApi({phone: this.phone, verifyCode: this.verifyCode, openID: this.userInfo.openID}).then(data => {
        // wx.setStorageSync('phone', data.phone)
        // wx.setStorageSync('JSESSIONID', data.serviceID)
        // wx.navigateBack({
        //   delta: 1
        // })
        if (data === 1) {
          this.show = true
        } else {
          wx.setStorageSync('JSESSIONID', data.serviceID)
          wx.setStorageSync('userInfo', data)
          wx.setStorageSync('serviceCode', data.serviceCode)
          wx.navigateBack({
            delta: 2
          })
        }
      })
    }
  },
  onLoad () {
    Object.assign(this.$data, this.$options.data())
  }
}
</script>

<style lang='less' scoped>
@import "../../assets/style/base.less";
.login{
  padding: @67px @60px @46px;
  box-sizing: border-box;
  .icon-organ{
    font-size: @132px;
    color: @red;
    text-align: center;
  }
  .logo{
    display: block;
    margin: 0 auto;
    width: @128px;
    height: @128px;
    text-align: center;
    border-radius: 50%;
    margin-bottom: @20px;
  }
  h1{
    font-weight: 600;
    font-size:@40px;
    color:#333;
    line-height:@52px;
    text-align: center;
    margin-bottom: @140px;
  }
  .form{
    .input{
      .flex-center;
      border-bottom: @1px solid @border;
      padding: @28px 0;
      input{
        flex: 1;
        font-size: @34px;
        color: #333;
      }
      .sendMsg{
        width: @150px;
        height: @60px;
        line-height: @60px;
        margin: 0;
        border-radius: @4px;
        font-size: @24px;
        color: @red;
        border: @1px solid @red;
        background: #fff;
        padding: 0;
        &[disabled]{
          color: #666;
          border: @1px solid #ccc;
        }
      }
      &+.input{
        margin-top: @12px;
      }
    }
    .loginBtn{
      color: #fff;
      background: @red;
      margin-top: @80px;
    }
  }
  footer{
    position: fixed;
    width: calc(~'100% - '@120px);
    bottom: @46px;
    font-size:@24px;
    color:#aaaaaa;
    line-height:@24px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    navigator{
      color: @red;
    }
  }
  /deep/.popup{
    border-radius: @20px;
  }
  .popup-content{
    padding: @60px;
    .shortTime{
      margin: @30px 0 @20px;
      background: #fff;
      border: @1px solid #ccc;
      color: #666;
    }
    p{
      text-align: center;
      font-size: @24px;
      color: #999;
      line-height: @36px;
      &:first-of-type{
        color: @red;
        margin-bottom: @24px;
        font-size: @26px;
      }
    }
  }
}
</style>
