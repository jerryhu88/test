<template>
  <div class="payPwd">
    <i class="iconfont icon-daca bg"></i>
    <h1>{{title[step]}}</h1>
    <p>{{prompt[step]}}</p>
    <div class="form">
      <!-- 重置支付密码，忘记原密码，发送验证码 -->
      <div v-if="step === 0 && !remember" class="code-input">
        <input auto-focus class="code" placeholder="请输入验证码" v-model="code" type="number" maxlength="6">
        <span :class="{reSend:timeFlag}" @click="setTimer">{{timeFlag ? (time + '秒后重新发送') : '发送验证码'}}</span>
      </div>
      <!-- 重置支付密码，输入原密码 -->
      <div v-if="step === 0 && remember" class="pwd-input" :class="{focus: focusPoint}">
        <i v-for="i in 6" :key="i" class="box">{{originalPwd[i] ? '•' : ''}}</i>
        <input auto-focus @focus="focus" @blur="blur" v-model="originalPwd" maxlength="6" type="number">
      </div>
      <!-- 第一次输入密码 -->
      <div v-if="step === 1" class="pwd-input" :class="{focus: focusPoint}">
        <i v-for="i in 6" :key="i" class="box">{{payPassword[i] ? '•' : ''}}</i>
        <input auto-focus @focus="focus" @blur="blur" v-model="payPassword" maxlength="6" type="number">
      </div>
      <!-- 第二次输入密码 -->
      <div v-if="step === 2" class="pwd-input" :class="{focus: focusPoint}">
        <i v-for="i in 6" :key="i" class="box">{{rePayPassword[i] ? '•' : ''}}</i>
        <input auto-focus @focus="focus"  @blur="blur" v-model="rePayPassword" maxlength="6" type="number">
      </div>
      <!-- 点击忘记密码 -->
      <p v-if="step === 0 && remember" class="forget" hover-class="hover" @click="forget">忘记支付密码？</p>
      <!-- 按钮 -->
      <m-button radius='radius' @click="submit()" :disabled="disabled">{{step === 2 ? '提交' : '下一步'}}</m-button>
    </div>
  </div>
</template>

<script>
import mButton from '../../components/form/mButton'
// import {} from '../../../api/account/index'
import {toast, alert} from '../../constant/popup'
export default {
  data () {
    return {
      time: 60,
      timeFlag: false,
      title: ['输入原支付密码', '输入支付密码', '再次输入支付密码'],
      prompt: ['请输入6位数字原支付密码', '请设置6位数支付密码', '请再次输入6位数支付密码'],
      disabled: true,
      step: 0,
      remember: true,
      code: '',
      originalPwd: '',
      payPassword: '',
      rePayPassword: '',
      focusPoint: false,
      timer: null
    }
  },
  watch: {
    // 验证码
    code () {
      if (this.step === 0 && this.code.length === 6) {
        this.disabled = false
      } else {
        this.disabled = true
      }
    },
    // 原始密码
    originalPwd () {
      if (this.step === 0 && this.originalPwd.length === 6) {
        this.timer = setTimeout(() => {
          this.submit()
          clearTimeout(this.timer)
        }, 200)
      } else {
        this.disabled = true
      }
    },
    // 第一次是输入的支付密码
    payPassword () {
      if (this.step === 1 && this.payPassword.length === 6) {
        this.timer = setTimeout(() => {
          this.submit()
          clearTimeout(this.timer)
        }, 200)
      } else {
        this.disabled = true
      }
    },
    // 第二次输入的支付密码
    rePayPassword () {
      if (this.step === 2 && this.rePayPassword.length === 6) {
        if (this.rePayPassword === this.payPassword) {
          this.disabled = false
        } else {
          this.timer = setTimeout(() => {
            toast('none', '密码不一致，请重新输入')
            this.disabled = true
            this.step = 1
            this.payPassword = ''
            this.rePayPassword = ''
            clearTimeout(this.timer)
          }, 200)
        }
      }
    }
  },
  components: { mButton },
  onLoad (options) {
    Object.assign(this.$data, this.$options.data())
    this.step = Number(options.step)
    this.phone = options.phone
    if (this.step === 0) {
      wx.setNavigationBarTitle({
        title: '支付密码修改'
      })
    }
  },
  methods: {
    // 忘记密码
    forget () {
      this.remember = !this.remember
      this.title[0] = '输入验证码'
      this.prompt[0] = `我们已经向你的手机号${this.phone}发送了一个6位数验证码`
      this.setTimer()
    },
    // 聚焦
    focus () {
      this.focusPoint = true
    },
    // 失焦
    blur () {
      this.focusPoint = false
    },
    // 倒计时
    setTimer () {
      this.timeFlag = true
      this.time = 10
      this.timer = setInterval(() => {
        this.time--
        if (!this.time) {
          this.timeFlag = false
          clearInterval(this.timer)
        }
      }, 1000)
    },
    // 提交
    submit () {
      // 输入原密码后
      if (this.step === 0) {
        this.step++
        this.disabled = true
        return
      }
      // 第一次输入支付密码
      if (this.step === 1) {
        this.step++
        this.disabled = true
        return
      }
      // 第二次输入支付密码
      if (this.step === 2) {
        alert(
          '设置成功！',
          '请妥善保管支付密码，切勿告诉他人！',
          '我知道了',
          () => {
            wx.navigateBack({
              delta: 1
            })
          }
        )
      }
    },
    destroyed () {
      clearInterval(this.timer)
    }
  }
}
</script>

<style lang='less' scoped>
@import "../../assets/style/base.less";
.payPwd{
  padding: @67px @60px @46px;
  box-sizing: border-box;
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
    line-height:@36px;
    &.forget{
      display: inline-block;
    }
    &.hover{
      background: #f8f8f8;
    }
  }
  .form{
    font-size:@34px;
    color:#222222;
    line-height:@34px;
    margin-top: @80px;
    .code-input{
      margin-bottom: @26px;
      font-size:@34px;
      color:#222222;
      line-height:@34px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom:@2px solid #dfdfdf;
      padding-bottom: @28px;
      input{
        flex: 1;
      }
      .reSend{
        color: #bbb;
      }
    }
    .pwd-input{
      .center-between;
      position: relative;
      border: @2px solid #d1d1d1;
      border-radius: @6px;
      &.focus{
        border-color: rgba(249,86,68,0.6);
        box-shadow:@red 0px 0px 2px;
      }
      .box{
        flex: 1;
        height: @88px;
        line-height: @88px;
        text-align: center;
        font-size: @60px;
        border-right: @2px solid #d1d1d1;
        &:last-of-type{
          border: 0;
        }
      }
      input{
        position: absolute;
        left: -50%;
        right: -@60px;
        top: 0;
        height: @88px;
        background: transparent;
        color: transparent;
      }
    }
    /deep/button{
      margin-top: @60px;
    }
  }
}
</style>
