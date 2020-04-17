<template>
  <div class="login">
    <h1>{{resetPwd?'重':'设'}}置密码</h1>
    <p>密码须包含数字、大小写字母、下划线(可选)，长度8-20位</p>
    <div class="form">
      <div class="input">
        <input @blur="blur" placeholder="请输入密码" v-model="pwd" maxlength="20" type="text">
        <span v-if="pwdVerify">密码不符合要求</span>
      </div>
      <div class="input">
        <input @blur="blur" placeholder="请再次输入密码" v-model="repwd" maxlength="20" type="text">
        <span v-if="rePwdVerify">两次密码输入不一致</span>
      </div>
      <m-button radius='radius' openType='getUserInfo' @click="next()" :disabled="disabled">下一步</m-button>
    </div>
  </div>
</template>

<script>
import mButton from '../../components/form/mButton'
import {registerApi, setPwdApi} from '../../api/account/index'
import {getMpUsers} from '../../api/index'
import {alert} from '../../constant/popup'
import {mapGetters} from 'vuex'
export default {
  data () {
    return {
      regex: /^(?!(?:[^a-zA-Z]+|\D+|[a-zA-Z0-9]+)$).{8,20}$/,
      pwdVerify: false,
      rePwdVerify: false,
      pwd: '',
      repwd: '',
      verifyCode: '',
      resetPwd: false,
      disabled: false
    }
  },
  components: { mButton },
  watch: {
    repwd () {
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    blur () {
    },
    next () {
      let getOpenId = new Promise((resolve, reject) => {
        wx.login({
          success (login) {
            if (login.code) {
              wx.getUserInfo({
                withCredentials: true,
                success (info) {
                  getMpUsers(login.code).then(data => {
                    resolve({...info.userInfo, openID: data.openID})
                  })
                }
              })
            }
          }
        })
      })
      getOpenId.then(info => {
        let mess = {
          pwd: this.pwd,
          repwd: this.repwd,
          phone: this.userInfo.phone,
          verifyCode: this.verifyCode,
          ...info,
          sex: info.gender,
          avatar: info.avatarUrl
        }
        if (this.resetPwd) {
          setPwdApi(mess).then(data => {
            alert(
              '重置密码成功！',
              '请妥善保存帐号密码，切勿告诉他人',
              '去登录',
              () => {
                wx.reLaunch({ url: './login.vue' })
              }
            )
          })
        } else {
          registerApi(mess).then(res => {
            alert(
              '恭喜！注册成功',
              '请妥善保存帐号密码，切勿告诉他人',
              '去登录',
              () => {
                wx.reLaunch({ url: './login.vue' })
              }
            )
          })
        }
      })
    }
  },
  onLoad (options) {
    Object.assign(this.$data, this.$options.data())
    this.verifyCode = options.verifyCode
    this.resetPwd = options.resetPwd === 'true'
    if (this.resetPwd) {
      wx.setNavigationBarTitle({
        title: '密码重置'
      })
    }
  }
}
</script>

<style lang='less' scoped>
@import "../../assets/style/base.less";
.login{
  padding: @24px @60px @46px;
  box-sizing: border-box;
  h1{
    font-weight: 600;
    font-size:@52px;
    color:#000000;
    line-height:@52px;
  }
  h1+p{
    margin-top: @26px;
    font-size:@26px;
    color:#666666;
    line-height:@42px;
  }
  .form{
    font-size:@34px;
    color:#222222;
    line-height:@34px;
    margin-top: @80px;
    position: relative;
    .input{
      padding-bottom: @28px;
      border-bottom:@2px solid #dfdfdf;
      display: flex;
      align-items: center;
      justify-content: space-between;
      input{
        flex: 1;
      }
      span{
        color: @red;
        font-size: @32px;
        display: block;
        margin-left: @10px;
      }
      &:last-of-type{
        margin: @60px 0;
      }
    }
  }
}
</style>
