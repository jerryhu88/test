<template>
  <div class="setPhone">
    <h1>{{title}}</h1>
    <p>{{prompt}}</p>
    <div class="form">
      <!-- 注册 -->
      <div class="input">
        <input @confirm='send' @input="input" :placeholder="placeholder" v-model="phone" type="number" maxlength="11">
      </div>
      <!-- 注册 -->
      <div class="input">
        <input placeholder="请输入验证码" v-model="verifyCode" type="number" maxlength="6">
        <span v-if="!timeFlag" @click="sendCode" :class="{canSend: rightPhone}">发送验证码</span>
        <span v-else>{{(time + '秒后重新发送')}}</span>
      </div>
      <m-button radius='radius' :disabled='disabled' @click="submit">{{updatePhone ? '提交' : '下一步'}}</m-button>
    </div>
  </div>
</template>

<script>
import mButton from '../../components/form/mButton'
import {sendPhoneApi, verifyCodeApi, changeWxPhoneApi} from '../../api/account/index'
import { toast } from '../../constant/popup'
export default {
  data () {
    return {
      time: 60,
      rightPhone: false,
      phone: '',
      verifyCode: '',
      timeFlag: false,
      title: '新用户注册',
      placeholder: '请输入手机号',
      prompt: '请输入常用真实有效的手机号码作为账号',
      resetPwd: false,
      updatePhone: false,
      timer: null,
      disabled: true
    }
  },
  components: {
    mButton
  },
  watch: {
    verifyCode () {
      if (this.rightPhone && this.verifyCode.length === 6) {
        this.disabled = false
      } else {
        this.disabled = true
      }
    }
  },
  onLoad (options) {
    Object.assign(this.$data, this.$options.data())
    // 修改手机号
    if (options.updatePhone === 'true') {
      this.updatePhone = Boolean(options.updatePhone)
      this.placeholder = '请输入新手机号'
      this.prompt = '请输入新手机号'
      this.title = '修改绑定手机'
    }
    // 修改密码
    if (options.resetPwd === 'true') {
      this.resetPwd = true
      this.placeholder = '请输入手机号'
      this.prompt = '请输入注册时填写的手机号'
      this.title = '密码重置'
    }
    wx.setNavigationBarTitle({
      title: this.title
    })
  },
  methods: {
    // 发送验证码
    sendCode (e) {
      sendPhoneApi({phone: this.phone}).then(data => {
        wx.setStorageSync('phone', this.phone)
        if (!this.rightPhone) return
        this.timeFlag = true
        this.time = (data.endTime - data.startTime) / 1000
        this.timer = setInterval(() => {
          this.time--
          if (!this.time) {
            this.timeFlag = false
            clearInterval(this.timer)
          }
        }, 1000)
      })
    },
    input () {
      let rule = /^(1[3|4|5|6|7|8]\d{9}$)|(^09\d{8})$/
      this.rightPhone = rule.test(this.phone)
    },
    submit () {
      // 修改手机号
      if (this.updatePhone) {
        changeWxPhoneApi({phone: this.phone, verifyCode: this.verifyCode}).then(data => {
          toast('none', '修改成功')
          wx.setStorageSync('userInfo', data)
          this.$router.back()
        })
      } else {
        // 注册或修改密码
        verifyCodeApi({phone: this.phone, verifyCode: this.verifyCode}, this).then(data => {
          wx.setStorageSync('phone', this.phone)
          wx.navigateTo({ url: `./setPwd?verifyCode=${this.verifyCode}&resetPwd=${this.resetPwd}` })
        })
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
.setPhone{
  padding: @24px @60px @46px;
  box-sizing: border-box;
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
  }
  .form{
    margin-top: @120px;
    .input{
      margin-bottom: @60px;
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
      span{
        color: #bbb;
        &.canSend{
          color: #222;
        }
      }
      .tips{
        color:@red;
      }
    }
    /deep/button{
      margin-top: @90px;
    }
  }
}
</style>
