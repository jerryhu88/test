<template>
  <div class="inputCode">
    <i class="iconfont icon-daca bg"></i>
    <h1>输入验证码</h1>
    <p>验证码已发送至您的手机号{{phone}}</p>
    <div class="code">
      <div v-for="i in 6" :key="i" class="input">{{code[i]}}</div>
      <input v-model="code" type="number" auto-focus maxlength="6">
    </div>
    <p class="time" :class="{reSend:time}" @click="setTimer">{{time ? (time + '秒后') : ''}}重新发送验证码</p>
    <m-button radius='radius' :disabled='disabled' @click="next">下一步</m-button>
    <dept-popup v-model="show" :depts='depts'/>
  </div>
</template>

<script>
import mButton from '../../components/form/mButton'
import {verifyCodeApi, sendPhoneApi} from '../../api/account/index'
import {mapGetters} from 'vuex'
export default {
  data () {
    return {
      phone: '',
      time: 10,
      code: '',
      disabled: true,
      timer: null,
      reset: false
    }
  },
  watch: {
    code () {
      if (this.code.length < 6) {
        this.disabled = true
      } else {
        this.next()
        this.disabled = false
      }
    }
  },
  components: {
    mButton
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  onLoad (options) {
    clearInterval(this.timer)
    Object.assign(this.$data, this.$options.data())
    this.interval()
    this.phone = options.phone
    this.reset = options.reset === 'true'
    if (this.reset) {
      wx.setNavigationBarTitle({
        title: '密码重置'
      })
    }
  },
  methods: {
    setTimer () {
      if (this.time) return
      let that = this
      wx.login({
        success (login) {
          if (login.code) {
            wx.getUserInfo({
              withCredentials: true,
              success (info) {
                sendPhoneApi({phone: that.phone}).then(data => {
                  that.time = 10
                  that.interval()
                })
              }
            })
          }
        }
      })
    },
    interval () {
      this.timer = setInterval(() => {
        this.time--
        if (!this.time) {
          clearInterval(this.timer)
        }
      }, 1000)
    },
    next () {
      verifyCodeApi({verifyCode: this.code, phone: this.userInfo.phone}).then(res => {
        wx.navigateTo({ url: `../setPwd?reset=${this.reset}` })
      })
    },
    destroyed () {
      clearInterval(this.timer)
    }
  }
}
</script>

<style lang='less' scoped>
@import "../../assets/style/base.less";
.inputCode{
  padding: @67px @60px @46px;
  box-sizing: border-box;
  overflow: hidden;
  .bg{
    position: absolute;
    top: 0;
    right: 0;
    z-index: -1;
  }
  h1{
    font-weight: 600;
    font-size:@52px;
    color:#000000;
    line-height:@52px;
  }
  p{
    margin-top: @26px;
    font-size:@26px;
    color:#666666;
    line-height:@26px;
    &.time{
      padding-top: @30px;
      margin-top: 0;
      margin-bottom: @140px;
    }
    &.reSend{
      color: #bbb;
    }
  }
  .code{
    margin-top: @68px;
    font-size:@40px;
    color:#222222;
    line-height:@40px;
    display: flex;
    justify-content: space-between;
    position: relative;
    // overflow-x: hidden;
    .input{
      text-align: center;
      border-bottom:@2px solid #dfdfdf;
      padding-bottom: @28px;
      width: @80px;
      height: @40px;
    }
    input{
      background: transparent;
      color: transparent;
      position: absolute;
      top: 0;
      padding: @30px;
      left: -@500px;
      right: -@60px;
      height: auto;
      min-height: auto;
      bottom: 0;
    }
  }
}
</style>
